"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { AudioTrackCard } from "./AudioTrackCard";
import { useThemeSong } from "@/lib/ThemeSongProvider";

type Stage = "loading" | "song";

interface IntroGateProps {
  onDone: () => void;
}

const IMAGES_TO_PRELOAD = Array.from(
  { length: 16 },
  (_, i) => `/images/1 (${i + 1}).jpeg`,
).concat("/audio/bg music.png");

const VIDEOS_TO_PRELOAD = [
  "/video/background.mp4",
  "/images/1 (1).mp4",
  "/images/1 (2).mp4",
];

const MAX_WAIT_MS = 10000;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

/** "loadeddata" (first frame ready) is a much lighter bar than
 * "canplaythrough" (whole file estimated bufferable) - good enough for a
 * blurred, low-opacity background clip, and far friendlier to slow
 * connections while still guaranteeing the file has started streaming in. */
function preloadVideo(src: string) {
  return new Promise<void>((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.oncanplay = () => resolve();
    video.onloadeddata = () => resolve();
    video.onerror = () => resolve();
    video.src = src;
  });
}

function withTimeout(promise: Promise<void>, ms: number) {
  return Promise.race([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]);
}

export function IntroGate({ onDone }: IntroGateProps) {
  const [stage, setStage] = useState<Stage>("loading");
  const [visible, setVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { play, audioReady } = useThemeSong();

  useEffect(() => {
    let cancelled = false;
    const assets = [...IMAGES_TO_PRELOAD, ...VIDEOS_TO_PRELOAD];
    let loaded = 0;

    const bump = () => {
      loaded += 1;
      if (!cancelled) {
        setLoadingProgress(Math.round((loaded / (assets.length + 1)) * 100));
      }
    };

    const jobs = [
      ...IMAGES_TO_PRELOAD.map((src) => preloadImage(src).then(bump)),
      ...VIDEOS_TO_PRELOAD.map((src) => preloadVideo(src).then(bump)),
      ("fonts" in document ? document.fonts.ready : Promise.resolve()).then(
        bump,
      ),
    ];

    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1400));

    withTimeout(
      Promise.all(jobs).then(() => {}),
      MAX_WAIT_MS,
    ).then(() => {
      minimumDelay.then(() => {
        if (cancelled) return;
        if (audioReady) {
          setStage("song");
          return;
        }
        // audio is the last thing we might still be waiting on
        const poll = window.setInterval(() => {
          if (audioReady || cancelled) {
            window.clearInterval(poll);
            if (!cancelled) setStage("song");
          }
        }, 100);
        window.setTimeout(() => window.clearInterval(poll), MAX_WAIT_MS);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [audioReady]);

  function handleContinue() {
    play();
    setVisible(false);
  }

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center"
        >
          {stage === "song" ? (
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover opacity-75"
              >
                <source src="/video/background.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/45 to-navy-deep/65" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-navy-deep" />
          )}

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {stage === "loading" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-6"
                >
                  <span className="text-[0.7rem] uppercase tracking-[0.35em] text-silver-dim">
                    memuat kenangan
                  </span>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-ice"
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-ice/60">
                      {loadingProgress}%
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="song"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center gap-8"
                >
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-[0.35em] text-ice-dim">
                      sebelum masuk
                    </span>
                    <h2 className="mt-3 font-serif text-[clamp(1.5rem,4vw,2.2rem)] text-offwhite">
                      Putar dulu lagu ini
                    </h2>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2.5 text-silver-dim"
                  >
                    <Headphones size={18} className="text-ice/60" />
                    <span className="text-xs tracking-wide">
                      Lebih terasa dalamnya kalau pakai headphone
                    </span>
                  </motion.div>

                  <AudioTrackCard variant="large" />

                  <button
                    onClick={handleContinue}
                    className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm uppercase tracking-[0.2em] text-silver transition-colors hover:bg-white/10 hover:text-ice"
                  >
                    Lanjut
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
