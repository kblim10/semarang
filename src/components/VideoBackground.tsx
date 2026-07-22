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
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Log untuk debugging
    console.log("VideoBackground mounted, video element:", video);
    console.log("Video src:", video.src);

    const handleLoadedData = () => {
      console.log("Video loaded successfully!");
      setVideoLoaded(true);
    };

    const handleError = (e: Event) => {
      console.error("Video failed to load:", e);
      console.error("Video error code:", video.error?.code);
      console.error("Video error message:", video.error?.message);
      setVideoError(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    console.log("isPlaying changed:", isPlaying);

    // Sync video playback with audio state
    if (isPlaying && !videoError) {
      video.play().catch((err) => {
        console.log("Video autoplay was prevented:", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoError, videoLoaded]);

  // Always render the component, even if error (for debugging)
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
          {/* Fallback text for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Debug overlay - remove after testing */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 left-4 z-50 rounded bg-black/80 p-2 text-xs text-white">
            <div>Video Error: {videoError ? "YES" : "NO"}</div>
            <div>Video Loaded: {videoLoaded ? "YES" : "NO"}</div>
            <div>Is Playing: {isPlaying ? "YES" : "NO"}</div>
          </div>
        )}
      </div>

      {/* Dark overlay to keep video subtle and not overpower content */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/60 to-navy-deep/80" />
      
      {/* Additional vignette for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,transparent_40%,rgba(4,6,10,0.7)_100%)]" />
    </div>
  );
}
