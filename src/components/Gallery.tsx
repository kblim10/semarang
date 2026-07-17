"use client";

import { motion } from "framer-motion";
import { galleryItems } from "@/data/content";
import { useHoverCapable } from "@/lib/useHoverCapable";
import { PolaroidCard } from "./PolaroidCard";

export function Gallery() {
  const tiltEnabled = useHoverCapable();

  return (
    <section className="relative mx-auto max-w-6xl px-0 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14 px-5 text-center sm:px-8 md:mb-20"
      >
        <span className="text-[clamp(0.65rem,2vw,0.8rem)] uppercase tracking-[0.3em] text-ice-dim">
          Galeri Kenangan
        </span>
        <h2 className="mt-4 text-[clamp(1.9rem,5.5vw,3.2rem)] font-semibold text-offwhite">
          Bingkai Sunyi
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[clamp(0.9rem,2.2vw,1.05rem)] text-silver">
          Sisa-sisa memori yang sempat terekam lensa, sekarang mengambang
          diam-diam di sini.
        </p>
      </motion.div>

      <div
        className="no-scrollbar flex gap-6 overflow-x-auto px-5 pb-6 [perspective:1400px] sm:px-8 md:flex-wrap md:justify-center md:overflow-visible md:px-8"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {galleryItems.map((item, index) => (
          <PolaroidCard
            key={item.caption}
            caption={item.caption}
            index={index}
            tiltEnabled={tiltEnabled}
          />
        ))}
      </div>
    </section>
  );
}
