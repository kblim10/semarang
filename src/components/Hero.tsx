"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users } from "lucide-react";
import { badges } from "@/data/content";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <section
      ref={ref}
      className="relative flex h-dvh snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <motion.div
        style={{ scale, opacity, y, filter }}
        className="relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-md"
        >
          <Users size={16} className="text-ice" />
          <span className="text-[clamp(0.65rem,2vw,0.8rem)] uppercase tracking-[0.25em] text-silver">
            Kawan, bukan sekadar kenalan
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="gradient-shimmer text-glow font-serif text-[clamp(2.2rem,8.5vw,6rem)] font-semibold leading-[1.08] tracking-tight"
        >
          Jejak yang membeku,
          <br />
          di antara kita semua
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-[clamp(0.95rem,2.4vw,1.15rem)] leading-[1.8] text-silver"
        >
          Kami datang berempat untuk magang di kota asing, dan diam-diam
          berharap menemukan kawan yang bikin waktu terasa lebih cepat. Ini
          ruang kecil untuk merayakan pertemuan tak terduga, tawa lepas, dan
          cerita yang akan terus kita bawa, ke mana pun jalan masing-masing
          berikutnya.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-navy-elevated/60 px-4 py-1.5 text-[clamp(0.7rem,1.8vw,0.8rem)] tracking-wide text-silver"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute bottom-10 flex flex-col items-center gap-3 text-silver-dim"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.3em]">
          gulir untuk mengenang
        </span>
        <div className="h-9 w-[1px] bg-gradient-to-b from-ice/60 to-transparent" />
      </motion.div>
    </section>
  );
}
