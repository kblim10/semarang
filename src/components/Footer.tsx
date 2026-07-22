"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative snap-start border-t border-white/[0.06] px-6 py-20 text-center md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-xl flex-col items-center gap-6"
      >
        <Users size={26} strokeWidth={1.4} className="text-ice/70" />

        <h3 className="text-[clamp(1.6rem,4.5vw,2.4rem)] font-semibold text-offwhite">
          Bukan Selamat Tinggal
        </h3>

        <p className="text-[clamp(0.9rem,2.2vw,1.05rem)] leading-[1.8] text-silver">
          ...tapi sampai jumpa lagi di lain waktu, di tempat nongkrong yang
          mungkin berbeda, dengan obrolan yang sama serunya.
        </p>

        <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-ice/40 to-transparent" />

        <p className="text-[0.8rem] tracking-[0.08em] text-silver-dim">
          2026 Semarang &middot; create by kblim
        </p>
      </motion.div>
    </footer>
  );
}
