import {
  BookOpen,
  Flame,
  HeartHandshake,
  Home as House,
  Sparkles,
  Twitter as Bird,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { LotusLogo } from "@/components/shared/lotus-logo";
import { QUICK_PRACTICE_ITEMS, QuickPracticeItem } from "@/constants/home.constants";

interface QuickPracticeProps {
  items?: QuickPracticeItem[];
}

export const QuickPractice: React.FC<QuickPracticeProps> = ({ items = QUICK_PRACTICE_ITEMS }) => {
  const renderIcon = (type: QuickPracticeItem["iconType"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-7 w-7 text-[#B46A10]" />;
      case "house":
        return <House className="h-7 w-7 text-[#A85816]" />;
      case "bird":
        return <Bird className="h-7 w-7 text-[#168378]" />;
      case "prayer":
        return <HeartHandshake className="h-7 w-7 text-[#B84E38]" />;
      case "lotus":
        return <LotusLogo size={28} />;
      default:
        return <Sparkles className="h-7 w-7 text-[#B46A10]" />;
    }
  };

  return (
    <section className="space-y-3">
      {/* Section Title */}
      <h3 className="text-base font-bold text-neutral-900 sm:text-lg">Hướng dẫn tu tập</h3>

      {/* Grid of 5 Category Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`group flex flex-col items-center justify-center rounded-2xl border ${item.borderClass} ${item.bgClass} p-4 text-center shadow-2xs transition-all duration-200 select-none hover:-translate-y-1 hover:shadow-md`}
          >
            {/* Icon Container */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110">
              {renderIcon(item.iconType)}
            </div>

            {/* Title */}
            <h4 className={`mt-2.5 text-xs font-bold tracking-tight sm:text-sm ${item.textClass}`}>
              {item.title}
            </h4>

            {/* Subtitle Description */}
            <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-neutral-500/90">
              {item.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
