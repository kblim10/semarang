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
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (ratio: number) => void;
}

const ThemeSongContext = createContext<ThemeSongState | null>(null);

export function ThemeSongProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const audio = new Audio(themeSong.src);
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = 0.55;
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setErrored(true);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setErrored(true));
  }, []);

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

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <ThemeSongContext.Provider
      value={{
        isPlaying,
        progress,
        currentTime,
        duration,
        errored,
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
