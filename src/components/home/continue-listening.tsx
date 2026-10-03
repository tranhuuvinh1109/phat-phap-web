"use client";

import { ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface ContinueListeningProps {
  title?: string;
  subtitle?: string;
  thumbnail?: string;
  currentTime?: string;
  totalDuration?: string;
  currentProgressPercent?: number;
  moreHref?: string;
}

export const ContinueListening: React.FC<ContinueListeningProps> = ({
  title = "Kinh A Di Đà",
  subtitle = "Kinh tụng và niệm Phật",
  thumbnail = "/images/lotus-thumb.jpg",
  currentTime = "12:35",
  totalDuration = "32:45",
  currentProgressPercent = 42,
  moreHref = "#",
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-neutral-900 sm:text-lg">Tiếp tục nghe</h3>
        <Link
          href={moreHref}
          className="flex items-center gap-0.5 text-xs font-medium text-neutral-500 transition-colors hover:text-amber-800 sm:text-sm"
        >
          <span>Xem thêm</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Player Card Container */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EDE5D8]/90 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs transition-all hover:shadow-xs sm:flex-row sm:items-center sm:p-4">
        {/* Left Track Info & Thumbnail */}
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-amber-900/10 sm:h-16 sm:w-16">
            <Image src={thumbnail} alt={title} fill className="object-cover" />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="truncate text-sm font-bold text-neutral-900 sm:text-base">{title}</h4>
            <p className="truncate text-xs text-neutral-500">{subtitle}</p>

            {/* Audio Progress Bar & Timestamp */}
            <div className="flex items-center gap-3 pt-0.5">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#EFE8DC]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300"
                  style={{ width: `${currentProgressPercent}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-xs text-neutral-400">
                {currentTime} / {totalDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Right Play/Pause Circular Action */}
        <div className="flex shrink-0 items-center justify-end sm:pl-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Tạm dừng" : "Tiếp tục phát"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#C27803] to-[#B36B00] text-white shadow-md shadow-amber-900/20 transition-all hover:scale-105 hover:from-[#B36B00] hover:to-[#A35E00] active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-white" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
