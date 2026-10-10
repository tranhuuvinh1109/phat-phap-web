import { Play, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { PlaylistItem } from "@/constants/home.constants";

interface SidePlaylistPanelProps {
  title: string;
  items: PlaylistItem[];
  className?: string;
}

export const SidePlaylistPanel: React.FC<SidePlaylistPanelProps> = ({
  title,
  items,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#EDE5D8]/90 bg-white/85 p-3.5 shadow-2xs backdrop-blur-xs sm:rounded-3xl sm:p-4 ${className}`}
    >
      {/* Panel Header */}
      <h3 className="px-1 pb-3 text-base font-bold text-neutral-900 sm:text-lg">{title}</h3>

      {/* Playlist Items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-[#FAF4EB]"
          >
            {/* Left Thumbnail & Info */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-amber-900/10">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h4 className="truncate text-xs font-semibold text-neutral-800 transition-colors group-hover:text-amber-900 sm:text-sm">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Volume2 className="h-3 w-3 shrink-0 text-neutral-400" />
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>

            {/* Right Play Button Icon */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300/80 text-neutral-500 transition-colors group-hover:border-amber-700 group-hover:bg-amber-600 group-hover:text-white">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
