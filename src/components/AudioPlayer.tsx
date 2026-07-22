"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useThemeSong } from "@/lib/ThemeSongProvider";

/**
 * A persistent circular button that mutes/unmutes the theme song.
 * Lives in the bottom-right corner, always visible on all screen sizes,
 * providing mobile users with essential audio control.
 */
export function AudioPlayer() {
  const { isPlaying, toggle } = useThemeSong();

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        right: "max(1.25rem, env(safe-area-inset-right))",
      }}
    >
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.92 }}
        aria-label={isPlaying ? "Mute theme song" : "Play theme song"}
        className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-navy-elevated/80 text-ice shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        {isPlaying && (
          <motion.span
            className="absolute inset-0 rounded-full border border-ice/40"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>
    </div>
  );
}
