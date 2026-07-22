"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useThemeSong } from "@/lib/ThemeSongProvider";

const DISPLAY_DURATION = 4500;
const VIDEO_VOLUME = 0.45;

type MediaItem = { type: "video" | "image"; src: string };

const ALL_MEDIA_ITEMS: MediaItem[] = [
  { type: "video", src: "/images/1 (1).mp4" },
  { type: "video", src: "/images/1 (2).mp4" },
  { type: "image", src: "/images/1 (1).jpeg" },
  { type: "image", src: "/images/1 (2).jpeg" },
  { type: "image", src: "/images/1 (3).jpeg" },
  { type: "image", src: "/images/1 (4).jpeg" },
  { type: "image", src: "/images/1 (5).jpeg" },
  { type: "image", src: "/images/1 (6).jpeg" },
  { type: "image", src: "/images/1 (7).jpeg" },
  { type: "image", src: "/images/1 (8).jpeg" },
  { type: "image", src: "/images/1 (9).jpeg" },
  { type: "image", src: "/images/1 (10).jpeg" },
  { type: "image", src: "/images/1 (11).jpeg" },
  { type: "image", src: "/images/1 (12).jpeg" },
  { type: "image", src: "/images/1 (13).jpeg" },
  { type: "image", src: "/images/1 (14).jpeg" },
  { type: "image", src: "/images/1 (15).jpeg" },
  { type: "image", src: "/images/1 (16).jpeg" },
];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * A gentle, low-opacity memory slideshow behind the whole page. Only one
 * media element is ever mounted at a time (no hidden decode pool), which
 * keeps GPU/CPU load low - videos are skipped entirely on small screens
 * since decoding video is the single most expensive part of this effect.
 */
export function VideoBackground() {
  const { isPlaying } = useThemeSong();
  const [order, setOrder] = useState<MediaItem[]>([]);
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // one-time read of an external system (viewport size) to decide whether
    // video slides should even be in the rotation on this device.
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    const pool = isSmallScreen
      ? ALL_MEDIA_ITEMS.filter((item) => item.type === "image")
      : ALL_MEDIA_ITEMS;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffle(pool));
  }, []);

  useEffect(() => {
    if (!isPlaying || order.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= order.length) {
          setOrder(shuffle(order));
          return 0;
        }
        return next;
      });
    }, DISPLAY_DURATION);
    return () => window.clearInterval(id);
  }, [isPlaying, order]);

  const current = order[index];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !current || current.type !== "video") return;
    video.volume = VIDEO_VOLUME;
    video.currentTime = 0;
    if (isPlaying) {
      video.play().catch(() => {
        /* autoplay with sound can be blocked - the slideshow still works visually */
      });
    }
  }, [current, isPlaying]);

  const dimClass = useMemo(
    () => (isPlaying ? "opacity-100" : "opacity-0"),
    [isPlaying],
  );

  if (!current) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[1] overflow-hidden transition-opacity duration-1000 ${dimClass}`}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={`${current.src}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.type === "video" ? (
            // Videos: never cropped (object-contain). The dark navy behind
            // it reads as intentional letterboxing rather than empty bars.
            <video
              ref={videoRef}
              muted={false}
              playsInline
              loop
              className="absolute inset-0 h-full w-full object-contain"
            >
              <source src={current.src} type="video/mp4" />
            </video>
          ) : (
            <>
              {/* soft blurred fill so the frame never shows bare edges */}
              <Image
                src={current.src}
                alt=""
                fill
                sizes="100vw"
                className="scale-110 object-cover blur-2xl"
              />
              {/* sharp, uncropped photo on top */}
              <Image
                src={current.src}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* dark overlay to keep the slideshow subtle behind the content */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/65 via-navy/55 to-navy-deep/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,transparent_40%,rgba(4,6,10,0.7)_100%)]" />
    </div>
  );
}
