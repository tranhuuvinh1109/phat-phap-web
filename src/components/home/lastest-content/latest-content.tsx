import Image from "next/image";
import Link from "next/link";
import React from "react";

import { LATEST_CONTENT_ITEMS, LatestContentItem } from "@/constants/home.constants";

interface LatestContentProps {
  items?: LatestContentItem[];
}

export const LatestContent: React.FC<LatestContentProps> = ({ items = LATEST_CONTENT_ITEMS }) => {
  return (
    <section className="space-y-3">
      {/* Section Title */}
      <h3 className="text-base font-bold text-neutral-900 sm:text-lg">Nội dung mới nhất</h3>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl border border-[#EDE5D8]/90 bg-white/80 p-2.5 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DECDB5] hover:shadow-xs"
          >
            {/* Square Thumbnail */}
            <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-amber-900/10">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title & Category Badge */}
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="truncate text-xs font-bold text-neutral-900 transition-colors group-hover:text-amber-900 sm:text-sm">
                {item.title}
              </h4>
              <span className="inline-block rounded-full border border-[#F0DFBF] bg-[#FFF7E8] px-2 py-0.5 text-[10px] font-medium text-[#9E5D10]">
                {item.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
