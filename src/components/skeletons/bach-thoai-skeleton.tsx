import React from "react";

interface BachThoaiSkeletonProps {
  className?: string;
  count?: number;
}

export const BachThoaiSkeleton: React.FC<BachThoaiSkeletonProps> = ({
  className = "",
  count = 4,
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-[#EDE5D8]/90 bg-white/80 p-3 sm:p-4 shadow-2xs animate-pulse"
        >
          <div className="h-18 w-18 sm:h-20 sm:w-20 md:h-22 md:w-22 shrink-0 rounded-xl sm:rounded-2xl bg-neutral-200/70" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3.5 w-24 rounded bg-neutral-200/60" />
            <div className="h-4 w-3/4 rounded bg-neutral-200/80" />
            <div className="h-3 w-28 rounded bg-neutral-200/50" />
          </div>
          <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-neutral-200/70" />
        </div>
      ))}
    </div>
  );
};
