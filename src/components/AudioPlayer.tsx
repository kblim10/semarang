"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { audioEngine, type AmbientPreset } from "@/lib/audioEngine";

const PRESETS: { id: AmbientPreset; label: string; hint: string }[] = [
  {
    id: "cinematic",
    label: "Cinematic Echo",
    hint: "pad tebal, ruang yang dalam",
  },
  {
    id: "rain",
    label: "Nostalgic Rain",
    hint: "pad & rintik hujan lembut",
  },
  {
    id: "midnight",
    label: "Midnight Memory",
    hint: "melodi lofi, delay panjang",
  },
];

export function AudioPlayer() {
  const [isOn, setIsOn] = useState(false);
  const [preset, setPreset] = useState<AmbientPreset>("cinematic");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        // fades out smoothly past 60% of page scroll, restores when scrolling back up
        const fadeThreshold = 0.6;
        let volume = 1;
        if (progress > fadeThreshold) {
          const t = Math.min(
            1,
            (progress - fadeThreshold) / (1 - fadeThreshold),
          );
          volume = 1 - t;
        }
        audioEngine.setScrollFade(volume);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function toggleAudio() {
    if (isOn) {
      audioEngine.stop();
      setIsOn(false);
      setMenuOpen(false);
    } else {
      await audioEngine.play(preset);
      setIsOn(true);
    }
  }

  async function choosePreset(next: AmbientPreset) {
    setPreset(next);
    if (isOn) {
      await audioEngine.play(next);
    }
    setMenuOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-56 rounded-2xl border border-white/10 bg-navy-elevated/95 p-2 shadow-[0_20px_45px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => choosePreset(p.id)}
                className={`flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  preset === p.id
                    ? "bg-ice/10 text-ice"
                    : "text-silver hover:bg-white/5"
                }`}
              >
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-[0.7rem] text-silver-dim">
                  {p.hint}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {isOn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="h-11 rounded-full border border-white/10 bg-navy-elevated/80 px-4 text-[0.7rem] uppercase tracking-[0.15em] text-silver backdrop-blur-md transition-colors hover:text-ice"
          >
            {PRESETS.find((p) => p.id === preset)?.label}
          </motion.button>
        )}

        <motion.button
          onClick={toggleAudio}
          whileTap={{ scale: 0.92 }}
          aria-label={isOn ? "Matikan ambient sound" : "Nyalakan ambient sound"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-navy-elevated/80 text-ice shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
        >
          {isOn && (
            <motion.span
              className="absolute inset-0 rounded-full border border-ice/40"
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {isOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
      </div>
    </div>
  );
}
