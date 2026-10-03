"use client";

import { AlertCircle, Loader2, Music, Pause, Play, RefreshCw, Volume2 } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

import { useGetPosts } from "@/api/post";
import type { PostItemType } from "@/api/post/post.type";
import { formatTime } from "@/lib/utils/format-time";

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  isBachThoai: boolean;
  posts: PostItemType[];
}

interface CategorizedPostsProps {
  className?: string;
  titleOverride?: string;
}

export const CategorizedPosts: React.FC<CategorizedPostsProps> = ({
  className = "",
}) => {
  const { data, isLoading, isError, error, refetch } = useGetPosts();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const posts: PostItemType[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // Group posts by Category
  const groupedCategories = useMemo<CategoryGroup[]>(() => {
    if (!posts || posts.length === 0) return [];

    const groupMap = new Map<string, CategoryGroup>();

    posts.forEach((post) => {
      const cat = post.category;
      const catId = cat?.id || "uncategorized";
      const catName = cat?.name || "Danh mục khác";
      const catSlug = cat?.slug || "uncategorized";

      const normalizedName = catName.toLowerCase().trim();
      const normalizedSlug = catSlug.toLowerCase().trim();
      const isBachThoai =
        normalizedName.includes("bạch thoại") ||
        normalizedName.includes("bach thoai") ||
        normalizedSlug.includes("bach-thoai");

      if (!groupMap.has(catId)) {
        groupMap.set(catId, {
          id: catId,
          name: catName,
          slug: catSlug,
          isBachThoai,
          posts: [],
        });
      }

      groupMap.get(catId)!.posts.push(post);
    });

    // Sort to place "Bạch thoại Phật pháp" at the top
    return Array.from(groupMap.values()).sort((a, b) => {
      if (a.isBachThoai && !b.isBachThoai) return -1;
      if (!a.isBachThoai && b.isBachThoai) return 1;
      return a.name.localeCompare(b.name, "vi");
    });
  }, [posts]);

  // Play / Pause Audio Handler
  const handleTogglePlay = (post: PostItemType) => {
    const audioUrl = post.audio?.audioUrl;
    if (!audioUrl) return;

    if (playingId === post.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current
          .play()
          .then(() => setPlayingId(post.id))
          .catch((err) => {
            console.warn("Audio playback error:", err);
            setPlayingId(null);
          });
      }
    }
  };

  // Helper to format duration string
  const getDurationText = (post: PostItemType): string => {
    if (post.audio?.duration && post.audio.duration > 0) {
      return formatTime(post.audio.duration);
    }
    if (post.video?.duration && post.video.duration > 0) {
      return formatTime(post.video.duration);
    }
    return "--:--";
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="rounded-2xl border border-[#EDE5D8]/90 bg-white/90 p-4 shadow-xs">
          <div className="mb-4 h-6 w-44 animate-pulse rounded-lg bg-neutral-200/80" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-2">
                <div className="flex items-center gap-3">
                  <div className="h-13 w-13 shrink-0 animate-pulse rounded-xl bg-neutral-200/80" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded-md bg-neutral-200/80" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-neutral-200/60" />
                  </div>
                </div>
                <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-neutral-200/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className={`rounded-2xl border border-red-200 bg-red-50/70 p-5 text-center ${className}`}>
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <h4 className="mt-2 text-sm font-semibold text-red-900">Không thể tải danh sách bài viết</h4>
        <p className="mt-1 text-xs text-red-600">
          {(error as any)?.message || "Vui lòng thử lại sau giây lát."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 transition hover:bg-red-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Thử lại
        </button>
      </div>
    );
  }

  // Empty State
  if (groupedCategories.length === 0) {
    return (
      <div className={`rounded-2xl border border-dashed border-[#EDE5D8] bg-white/70 p-8 text-center ${className}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <Music className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-neutral-800">Chưa có bài viết nào</h4>
        <p className="mt-1 text-xs text-neutral-500">
          Các bài viết mới đăng tải sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden Audio Player instance */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
        onError={() => setPlayingId(null)}
        className="hidden"
      />

      {groupedCategories.map((group) => {
        // --- 1. Nhóm Bạch thoại Phật Pháp: Hiển thị đầy đủ Thumbnail, Title, Duration (Volume Icon), Play Button ---
        if (group.isBachThoai) {
          return (
            <section
              key={group.id}
              className="rounded-2xl border border-[#EDE5D8]/90 bg-white/90 p-3.5 shadow-2xs backdrop-blur-xs sm:rounded-3xl sm:p-4"
            >
              {/* Header */}
              <h3 className="px-1 pb-3 text-base font-bold text-neutral-900 sm:text-lg">
                {group.name}
              </h3>

              {/* Items List */}
              <div className="space-y-2.5">
                {group.posts.map((post) => {
                  const isCurrentPlaying = playingId === post.id;
                  const hasAudio = !!post.audio?.audioUrl;

                  return (
                    <div
                      key={post.id}
                      className={`group flex items-center justify-between gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-[#FAF4EB] ${
                        isCurrentPlaying ? "bg-[#FAF2E6] ring-1 ring-amber-300/80" : ""
                      }`}
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-amber-900/10 bg-amber-50/50">
                          <img
                            src={post.thumbnailUrl || "/images/lotus-thumb.jpg"}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/lotus-thumb.jpg";
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h4
                            title={post.title}
                            className="truncate text-xs font-semibold text-neutral-800 transition-colors group-hover:text-amber-900 sm:text-sm"
                          >
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                            <Volume2 className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>{getDurationText(post)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Circular Play/Pause Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(post)}
                        disabled={!hasAudio}
                        aria-label={isCurrentPlaying ? `Tạm dừng ${post.title}` : `Phát ${post.title}`}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isCurrentPlaying
                            ? "border-amber-700 bg-amber-600 text-white shadow-xs"
                            : hasAudio
                            ? "border-neutral-300/80 text-neutral-500 hover:border-amber-700 hover:bg-amber-600 hover:text-white"
                            : "cursor-not-allowed border-neutral-200 text-neutral-300"
                        }`}
                      >
                        {isCurrentPlaying ? (
                          <Pause className="h-3 w-3 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // --- 2. Các danh mục khác: Chỉ hiển thị Thumbnail và Title (chưa cần hiển thị details) ---
        return (
          <section
            key={group.id}
            className="rounded-2xl border border-[#EDE5D8]/90 bg-white/90 p-3.5 shadow-2xs backdrop-blur-xs sm:rounded-3xl sm:p-4"
          >
            {/* Header */}
            <h3 className="px-1 pb-3 text-base font-bold text-neutral-900 sm:text-lg">
              {group.name}
            </h3>

            {/* Items List (Only Thumbnail & Title) */}
            <div className="space-y-2.5">
              {group.posts.map((post) => (
                <div
                  key={post.id}
                  className="group flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-[#FAF4EB]"
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-amber-900/10 bg-amber-50/50">
                    <img
                      src={post.thumbnailUrl || "/images/buddha-thumb.jpg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/buddha-thumb.jpg";
                      }}
                    />
                  </div>

                  {/* Title Only */}
                  <div className="min-w-0 flex-1">
                    <h4
                      title={post.title}
                      className="truncate text-xs font-semibold text-neutral-800 transition-colors group-hover:text-amber-900 sm:text-sm"
                    >
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
