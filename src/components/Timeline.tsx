"use client";

import { motion } from "framer-motion";
import { timelineItems } from "@/data/content";

export function Timeline() {
  return (
    <section className="relative mx-auto max-w-5xl px-5 py-28 sm:px-8 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-20 text-center md:mb-28"
      >
        <span className="text-[clamp(0.65rem,2vw,0.8rem)] uppercase tracking-[0.3em] text-ice-dim">
          Linimasa Memori
        </span>
        <h2 className="mt-4 text-[clamp(1.9rem,5.5vw,3.2rem)] font-semibold text-offwhite">
          Awal, Tengah, Puncak
        </h2>
      </motion.div>

      <div className="relative">
        {/* the connecting line: left rail on mobile, centered on desktop */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ice/40 to-transparent md:left-1/2" />

        <div className="flex flex-col gap-16 md:gap-6">
          {timelineItems.map((item, index) => {
            const isRight = index % 2 === 1;
            return (
              <div
                key={item.title}
                className={`relative flex items-start md:justify-between md:py-10 ${
                  isRight ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* touch-friendly dot: 44x44 invisible hit area, small visible marker */}
                <span
                  aria-hidden
                  className="absolute left-6 top-1 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:left-1/2"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="h-3 w-3 rounded-full bg-ice shadow-[0_0_0_5px_rgba(8,12,20,1),0_0_16px_rgba(125,211,252,0.65)]"
                  />
                </span>

                <motion.div
                  initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className={`w-full pl-16 md:w-[45%] md:pl-0 ${
                    isRight ? "md:pl-14 md:text-left" : "md:pr-14 md:text-right"
                  }`}
                >
                  <span className="text-[clamp(0.65rem,1.8vw,0.78rem)] font-medium uppercase tracking-[0.25em] text-ice">
                    {item.tag}
                  </span>
                  <h3 className="mt-3 text-[clamp(1.3rem,3.5vw,2rem)] font-semibold text-offwhite">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[clamp(0.9rem,2.2vw,1.05rem)] leading-[1.85] text-silver">
                    {item.body}
                  </p>
                </motion.div>

                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
