"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TRACK_ID = "4B3DEANIvod8552CbwftCG";

function buildEmbedSrc(autoplay: boolean) {
  const params = new URLSearchParams({ utm_source: "generator", theme: "0" });
  if (autoplay) params.set("autoplay", "1");
  return `https://open.spotify.com/embed/track/${TRACK_ID}?${params.toString()}`;
}

/**
 * Browsers only allow unmuted autoplay after the visitor has interacted with
 * the page at least once. We wait for that first interaction, then swap the
 * iframe `src` to include `autoplay=1` so the track starts right away
 * without requiring a click directly on the embed itself.
 */
function useFirstInteraction() {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) return;
    const mark = () => setInteracted(true);
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ];
    events.forEach((event) =>
      window.addEventListener(event, mark, { once: true, passive: true }),
    );
    return () => {
      events.forEach((event) => window.removeEventListener(event, mark));
    };
  }, [interacted]);

  return interacted;
}

function EmbedFrame({ autoplay }: { autoplay: boolean }) {
  return (
    <iframe
      title="Lagu tema kenangan kita"
      style={{ borderRadius: "12px" }}
      src={buildEmbedSrc(autoplay)}
      width="100%"
      height="152"
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_25px_55px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <p className="mb-2 px-1 text-[0.65rem] uppercase tracking-[0.25em] text-silver-dim">
        Lagu Tema Kita
      </p>
      {children}
    </div>
  );
}

export function SpotifyCard() {
  const interacted = useFirstInteraction();

  return (
    <>
      {/* Desktop / wide screens: floats in the empty side gutter, gently
          tilted like a photo taped onto the page, straightens on hover. */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.7 }}
        className="fixed left-5 top-1/2 z-30 hidden w-64 -translate-y-1/2 xl:block"
      >
        <div className="-rotate-6 transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02]">
          <CardShell>
            <EmbedFrame autoplay={interacted} />
          </CardShell>
        </div>
      </motion.div>

      {/* Mobile / tablet: sits inline in the page flow instead. */}
      <div className="mx-auto mb-4 w-full max-w-sm px-6 xl:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CardShell>
            <EmbedFrame autoplay={interacted} />
          </CardShell>
        </motion.div>
      </div>
    </>
  );
}
