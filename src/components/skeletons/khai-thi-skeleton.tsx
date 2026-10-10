import React from "react";

interface KhaiThiSkeletonProps {
  className?: string;
  count?: number;
}

export const KhaiThiSkeleton: React.FC<KhaiThiSkeletonProps> = ({
  className = "",
  count = 3,
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-[#EDE5D8]/90 bg-white/80 shadow-2xs animate-pulse"
        >
          {/* Top thumbnail skeleton */}
          <div className="h-44 w-full bg-neutral-200/70 sm:h-48" />

          {/* Card body skeleton */}
          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="h-4 w-3/4 rounded-md bg-neutral-200/80" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-neutral-200/60" />
                <div className="h-3 w-4/5 rounded bg-neutral-200/50" />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div className="h-3.5 w-28 rounded bg-neutral-200/60" />
              <div className="h-3.5 w-16 rounded bg-neutral-200/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
