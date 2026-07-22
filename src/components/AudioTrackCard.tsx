"use client";

import { Music2, Pause, Play } from "lucide-react";
import { themeSong } from "@/data/content";
import { cn } from "@/lib/cn";
import { useThemeSong } from "@/lib/ThemeSongProvider";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface AudioTrackCardProps {
  variant?: "mini" | "large";
}

export function AudioTrackCard({ variant = "mini" }: AudioTrackCardProps) {
  const { isPlaying, progress, currentTime, duration, errored, toggle, seek } =
    useThemeSong();
  const isLarge = variant === "large";

  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    seek((event.clientX - rect.left) / rect.width);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_25px_55px_rgba(0,0,0,0.5)] backdrop-blur-md",
        isLarge ? "w-full max-w-sm p-6" : "w-64 p-3",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-xl bg-navy-card text-ice",
            isLarge ? "h-14 w-14" : "h-10 w-10",
          )}
        >
          <Music2 size={isLarge ? 26 : 18} strokeWidth={1.4} />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p
            className={cn(
              "truncate font-medium text-offwhite",
              isLarge ? "text-base" : "text-sm",
            )}
          >
            {themeSong.title}
          </p>
          <p className="truncate text-xs text-silver-dim">
            {themeSong.artist}
          </p>
        </div>

        <button
          onClick={toggle}
          disabled={errored}
          aria-label={isPlaying ? "Pause lagu" : "Putar lagu"}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ice/10 text-ice transition-colors hover:bg-ice/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      <div
        onClick={handleSeek}
        role="slider"
        aria-label="Posisi lagu"
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        className="mt-4 h-1.5 w-full cursor-pointer rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-ice"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-[0.65rem] text-silver-dim">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {errored && (
        <p className="mt-3 text-[0.65rem] leading-relaxed text-silver-dim">
          Berkas lagu belum ditemukan. Tambahkan file audio di{" "}
          <code className="text-silver">public/audio/theme-song.mp3</code>.
        </p>
      )}
    </div>
  );
}
