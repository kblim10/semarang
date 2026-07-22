"use client";

import { useEffect, useRef, useState } from "react";
import { useThemeSong } from "@/lib/ThemeSongProvider";

// Configuration
const DISPLAY_DURATION = 4000; // 4 seconds per item
const VIDEO_CLIP_DURATION = 4; // Play 4 seconds of video per show

// Define your media items here
const MEDIA_ITEMS = [
  { type: "video" as const, src: "/video/background.mp4" },
  { type: "image" as const, src: "/images/memory-1.jpg" },
  { type: "image" as const, src: "/images/memory-2.jpg" },
  { type: "image" as const, src: "/images/memory-3.jpg" },
  // Add more media items here
];

/**
 * Dynamic slideshow background that syncs with the theme song.
 * Randomly switches between videos and images every few seconds.
 * Videos remember their playback position and continue from where they left off.
 */
export function VideoBackground() {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const videoPositions = useRef<Map<string, number>>(new Map());
  const { isPlaying } = useThemeSong();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle array helper
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled order
  useEffect(() => {
    const indices = Array.from({ length: MEDIA_ITEMS.length }, (_, i) => i);
    setShuffledIndices(shuffleArray(indices));
  }, []);

  // Handle slideshow transitions
  useEffect(() => {
    if (!isPlaying || shuffledIndices.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start interval for switching media
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % shuffledIndices.length;
        
        // If we've gone through all items, reshuffle for next round
        if (next === 0) {
          const indices = Array.from({ length: MEDIA_ITEMS.length }, (_, i) => i);
          setShuffledIndices(shuffleArray(indices));
        }
        
        return next;
      });
    }, DISPLAY_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, shuffledIndices.length]);

  // Handle video playback
  useEffect(() => {
    if (shuffledIndices.length === 0) return;
    
    const mediaIndex = shuffledIndices[currentIndex];
    const currentMedia = MEDIA_ITEMS[mediaIndex];

    if (currentMedia.type === "video" && isPlaying) {
      const video = videoRefs.current.get(currentMedia.src);
      if (!video) return;

      // Get or initialize position
      const lastPosition = videoPositions.current.get(currentMedia.src) || 0;
      
      // Set video to last position
      video.currentTime = lastPosition;
      
      // Play video
      video.play().catch((err) => {
        console.log("Video play prevented:", err);
      });

      // After VIDEO_CLIP_DURATION seconds, pause and save position
      const playTimeout = setTimeout(() => {
        video.pause();
        const newPosition = video.currentTime;
        
        // If video ended, reset to beginning
        if (newPosition >= video.duration - 0.5) {
          videoPositions.current.set(currentMedia.src, 0);
        } else {
          videoPositions.current.set(currentMedia.src, newPosition);
        }
      }, VIDEO_CLIP_DURATION * 1000);

      return () => clearTimeout(playTimeout);
    }
  }, [currentIndex, isPlaying, shuffledIndices]);

  if (shuffledIndices.length === 0) return null;

  const currentMediaIndex = shuffledIndices[currentIndex];
  const currentMedia = MEDIA_ITEMS[currentMediaIndex];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Render all videos (hidden) for preloading */}
      <div className="hidden">
        {MEDIA_ITEMS.filter((item) => item.type === "video").map((item) => (
          <video
            key={item.src}
            ref={(el) => {
              if (el) videoRefs.current.set(item.src, el);
            }}
            loop={false}
            muted
            playsInline
            preload="auto"
            onError={(e) => {
              console.error("Video failed to load:", item.src, e);
            }}
            onLoadedData={() => {
              console.log("Video loaded:", item.src);
            }}
          >
            <source src={item.src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Display current media */}
      <div className="absolute inset-0 flex items-center justify-center bg-navy-deep">
        {currentMedia.type === "video" ? (
          <video
            key={`display-${currentMedia.src}`}
            loop={false}
            muted
            playsInline
            className="min-h-full min-w-full object-cover opacity-50 transition-opacity duration-700"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <source src={currentMedia.src} type="video/mp4" />
          </video>
        ) : (
          <img
            key={`display-${currentMedia.src}`}
            src={currentMedia.src}
            alt=""
            className="min-h-full min-w-full object-cover opacity-50 transition-opacity duration-700"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>

      {/* Dark overlay to keep media subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy/50 to-navy-deep/70" />
      
      {/* Vignette for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,transparent_40%,rgba(4,6,10,0.7)_100%)]" />
    </div>
  );
}
