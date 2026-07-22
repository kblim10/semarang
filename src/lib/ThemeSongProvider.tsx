"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { themeSong } from "@/data/content";

interface ThemeSongState {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  errored: boolean;
  audioReady: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (ratio: number) => void;
}

const ThemeSongContext = createContext<ThemeSongState | null>(null);

// The <audio> element's own volume stays near max; loudness is actually
// shaped by the Web Audio graph below (compressor + gain boost) so the
// track still feels full and "deep" even when the device's hardware
// volume is turned down low.
const ELEMENT_VOLUME = 1;
const LOUDNESS_BOOST = 1.7;

export function ThemeSongProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fadeGainRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errored, setErrored] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(themeSong.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = ELEMENT_VOLUME;
    audio.crossOrigin = "anonymous";
    
    // Add timestamp to force fresh load, bypass any browser cache
    const freshSrc = `${themeSong.src}?t=${Date.now()}`;
    audio.src = freshSrc;
    
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setErrored(true);
      setAudioReady(true);
    };
    const onReady = () => setAudioReady(true);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplaythrough", onReady);

    // safety net: never let a slow network hold the intro hostage
    const readyTimeout = window.setTimeout(onReady, 6000);

    // Handle page visibility changes - pause when hidden, prepare to resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.pause();
      audio.src = ""; // Release the audio resource
      window.clearTimeout(readyTimeout);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplaythrough", onReady);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audioContextRef.current?.close();
    };
  }, []);

  /** Lazily wires the <audio> element through a small mastering chain
   * (compressor -> loudness boost -> fade gain) the first time playback
   * is requested - Web Audio requires a user gesture to start anyway. */
  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioContextRef.current) return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createMediaElementSource(audio);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 16;
    compressor.ratio.value = 3.5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.25;

    const boost = ctx.createGain();
    boost.gain.value = LOUDNESS_BOOST;

    const fadeGain = ctx.createGain();
    fadeGain.gain.value = 1;

    source.connect(compressor);
    compressor.connect(boost);
    boost.connect(fadeGain);
    fadeGain.connect(ctx.destination);

    audioContextRef.current = ctx;
    fadeGainRef.current = fadeGain;
  }, []);

  const play = useCallback(() => {
    ensureAudioGraph();
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    audioRef.current?.play().catch(() => setErrored(true));
  }, [ensureAudioGraph]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else pause();
  }, [play, pause]);

  const seek = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = Math.min(1, Math.max(0, ratio)) * duration;
    },
    [duration],
  );

  // Fade the (post-mastering) output as the visitor scrolls past 60% of
  // the page, and bring it back if they scroll back up.
  useEffect(() => {
    let ticking = false;

    const applyFade = (ratio: number) => {
      const ctx = audioContextRef.current;
      const gain = fadeGainRef.current;
      if (!ctx || !gain) return;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(ratio, now + 0.8);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        const fadeThreshold = 0.6;
        let ratio = 1;
        if (progress > fadeThreshold) {
          ratio = 1 - Math.min(1, (progress - fadeThreshold) / (1 - fadeThreshold));
        }
        applyFade(ratio);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <ThemeSongContext.Provider
      value={{
        isPlaying,
        progress,
        currentTime,
        duration,
        errored,
        audioReady,
        play,
        pause,
        toggle,
        seek,
      }}
    >
      {children}
    </ThemeSongContext.Provider>
  );
}

export function useThemeSong() {
  const ctx = useContext(ThemeSongContext);
  if (!ctx) {
    throw new Error("useThemeSong must be used within a ThemeSongProvider");
  }
  return ctx;
}
