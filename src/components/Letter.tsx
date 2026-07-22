"use client";

import { motion, type Variants } from "framer-motion";
import { letterParagraphs } from "@/data/content";

const paragraphVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0.08, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function AnimatedParagraph({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.p
      variants={paragraphVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
      className="flex flex-wrap justify-center gap-x-[0.4em] text-[clamp(1rem,2.6vw,1.35rem)] leading-[1.9] text-silver"
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={wordVariants}>
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function Letter() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-28 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 text-center"
      >
        <span className="text-[clamp(0.65rem,2vw,0.8rem)] uppercase tracking-[0.3em] text-ice-dim">
          Sepucuk Surat
        </span>
        <h2 className="gradient-shimmer mt-4 font-serif text-[clamp(1.9rem,5.5vw,3rem)] font-semibold">
          Surat untuk Kawan Seperjalanan
        </h2>
      </motion.div>

      <div className="relative flex flex-col gap-8 rounded-[2rem] border border-white/[0.06] bg-navy-elevated/75 p-8 sm:p-12">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 left-6 select-none font-serif text-[8rem] leading-none text-white/[0.04] sm:text-[10rem]"
        >
          &ldquo;
        </span>

        {letterParagraphs.map((paragraph, index) => (
          <AnimatedParagraph key={index} text={paragraph} />
        ))}
      </div>
    </section>
  );
}
