"use client";

import { useEffect, useRef, useState } from "react";
import { useThemeSong } from "@/lib/ThemeSongProvider";

/**
 * Full-screen ambient video background that syncs with the theme song.
 * The video plays when the music plays, creating an immersive atmosphere.
 * 
 * Optimized for portrait videos with responsive scaling for both mobile
 * and desktop screens.
 */
export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying } = useThemeSong();
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync video playback with audio state
    if (isPlaying && !videoError) {
      video.play().catch(() => {
        // Autoplay might be blocked, silently handle
        console.log("Video autoplay was prevented");
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoError]);

  // Don't render if video failed to load
  if (videoError) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Video container with responsive scaling */}
      <div className="absolute inset-0 flex items-center justify-center bg-navy-deep">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          className="min-h-full min-w-full object-cover opacity-30"
          style={{
            // For portrait videos on desktop: center and cover
            // For portrait videos on mobile: full cover
            width: "100%",
            height: "100%",
          }}
        >
          <source src="/video/background.mp4" type="video/mp4" />
          <source src="/video/background.webm" type="video/webm" />
        </video>
      </div>

      {/* Dark overlay to keep video subtle and not overpower content */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/60 to-navy-deep/80" />
      
      {/* Additional vignette for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,transparent_40%,rgba(4,6,10,0.7)_100%)]" />
    </div>
  );
}
