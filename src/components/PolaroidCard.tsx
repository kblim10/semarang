"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

interface PolaroidCardProps {
  caption: string;
  index: number;
  tiltEnabled: boolean;
}

export function PolaroidCard({
  caption,
  index,
  tiltEnabled,
}: PolaroidCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${useTransform(
    px,
    [0, 1],
    ["0%", "100%"],
  )} ${useTransform(py, [0, 1], ["0%", "100%"])}, rgba(255,255,255,0.28), transparent 55%)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    if (!tiltEnabled) return;
    px.set(0.5);
    py.set(0.5);
  }

  const rotateBase = index % 3 === 0 ? -3 : index % 3 === 1 ? 2 : -1;

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 36, rotate: rotateBase * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotateBase }}
      whileHover={tiltEnabled ? { y: -10, scale: 1.03 } : undefined}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.09,
        ease: "easeOut",
      }}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative w-[240px] flex-shrink-0 snap-center rounded-[6px] border border-white/10 bg-navy-elevated p-4 pb-14 shadow-[0_20px_45px_rgba(0,0,0,0.45)] sm:w-[260px]",
      )}
    >
      <div className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />

      <div
        className="relative flex h-[210px] w-full items-center justify-center overflow-hidden rounded-[3px] border border-white/5 bg-gradient-to-br from-navy-card to-navy"
        style={{ transform: "translateZ(20px)" }}
      >
        <Camera size={38} className="text-silver-dim/50" strokeWidth={1.25} />

        {tiltEnabled && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: glareBackground }}
          />
        )}
      </div>

      <p className="font-hand absolute bottom-3 left-0 w-full text-center text-[1.15rem] text-silver">
        {caption}
      </p>
    </motion.div>
  );
}
