"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioTrackCard } from "./AudioTrackCard";
import { useThemeSong } from "@/lib/ThemeSongProvider";

type Stage = "loading" | "song";

const SESSION_KEY = "semarang-intro-seen";

interface IntroGateProps {
  onDone: () => void;
}

/**
 * Gates the heavy part of the page behind a small ritual: a dark loading
 * beat, then the theme song, then "Lanjut". Nothing in `page.tsx` mounts
 * the particle background / timeline / gallery until this fully exits, so
 * the very first paint stays cheap and the site never feels like it's
 * fighting the browser on open.
 */
export function IntroGate({ onDone }: IntroGateProps) {
  const [stage, setStage] = useState<Stage>("loading");
  const [visible, setVisible] = useState(true);
  const { play } = useThemeSong();

  useEffect(() => {
    // one-time read of an external system (sessionStorage) to decide whether
    // a returning visitor should skip the intro ritual entirely.
    if (sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    let cancelled = false;
    const fontsReady =
      "fonts" in document ? document.fonts.ready : Promise.resolve();
    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1200));

    Promise.all([fontsReady, minimumDelay]).then(() => {
      if (!cancelled) setStage("song");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleContinue() {
    sessionStorage.setItem(SESSION_KEY, "1");
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-deep px-6 text-center"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
