"use client";

import { useEffect, useState } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { Letter } from "@/components/Letter";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { IntroGate } from "@/components/IntroGate";
import { FloatingSongMini } from "@/components/FloatingSongMini";
import { ThemeSongProvider } from "@/lib/ThemeSongProvider";

export default function Home() {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeSongProvider>
      <main className="relative">
        {!contentReady && (
          <IntroGate onDone={() => setContentReady(true)} />
        )}

        {contentReady && (
          <>
            <AmbientBackground />

            <div className="relative z-10">
              <Hero />
              <Timeline />
              <Gallery />
              <Letter />
              <Footer />
            </div>

            <FloatingSongMini />
            <AudioPlayer />
          </>
        )}
      </main>
    </ThemeSongProvider>
  );
}
