"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, purely decorative backdrop: slow ambient glow orbs, a faint drifting
 * grid and a canvas-based particle field. Kept in a single component and
 * rendered once so it never re-renders with page content and stays 60fps.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isSmall = window.matchMedia("(max-width: 640px)").matches;
    const count = isSmall ? 26 : 55;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.12 + 0.03),
      vx: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.35 + 0.15,
      hue: Math.random() > 0.5 ? "125, 211, 252" : "157, 140, 245",
    }));

    let raf = 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.y += p.vy;
          p.x += p.vx;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-navy"
    >
      {/* deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(122,139,250,0.14),transparent),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(125,211,252,0.08),transparent)]" />

      {/* drifting ambient orbs */}
      <div className="animate-drift-slow absolute -left-[10%] top-[-15%] h-[55vw] w-[55vw] rounded-full bg-indigo/10 blur-[110px]" />
      <div className="animate-drift absolute -right-[15%] top-[35%] h-[45vw] w-[45vw] rounded-full bg-ice/10 blur-[100px]" />
      <div className="animate-drift-slow absolute bottom-[-20%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-violet/8 blur-[120px]" />

      {/* faint floating grid, like a frozen frame of memory */}
      <div
        className="animate-drift-slow absolute inset-[-10%] opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* film grain */}
      <div className="grain-layer" />

      {/* vignette to keep focus centered */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_45%,rgba(4,6,10,0.55)_100%)]" />
    </div>
  );
}
