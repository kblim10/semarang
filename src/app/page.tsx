"use client";

import { useEffect } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { Letter } from "@/components/Letter";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";

export default function Home() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative">
      <AmbientBackground />

      <div className="relative z-10">
        <Hero />
        <Timeline />
        <Gallery />
        <Letter />
        <Footer />
      </div>

      <AudioPlayer />
    </main>
  );
}
