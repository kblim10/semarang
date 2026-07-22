"use client";

import { motion } from "framer-motion";
import { AudioTrackCard } from "./AudioTrackCard";

/**
 * The same theme song, kept alive from the intro, now resting as a tilted
 * glass card in the otherwise-empty left gutter on wide screens. Hidden on
 * smaller screens since there's no spare space and the song was already
 * introduced during the intro gate.
 */
export function FloatingSongMini() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      className="fixed left-5 top-1/2 z-30 hidden w-64 -translate-y-1/2 xl:block"
    >
      <div className="-rotate-6 transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02]">
        <AudioTrackCard variant="mini" />
      </div>
    </motion.div>
  );
}
