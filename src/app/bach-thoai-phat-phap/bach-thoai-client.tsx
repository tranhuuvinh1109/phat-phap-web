"use client";

import {
  BookOpen,
  Clock,
  Home,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";

import { useGetPosts } from "@/api/post";
import type { PostItemType } from "@/api/post/post.type";
import { Header, Sidebar } from "@/components/layout";
import { ContentType } from "@/enums";
import { formatTime } from "@/lib/utils";
import { useAudioPlayerStore } from "@/stores";

// Mock fallback items matching the provided design image
const DEFAULT_BACH_THOAI_ITEMS = [
  {
    id: "bt-1",
    title: "Sống an lạc trong hiện tại",
    slug: "song-an-lac-trong-hien-tai",
    authorName: "TT. Thích Minh Niệm",
    durationText: "28:16",
    thumbnailUrl: "/images/lotus-thumb.jpg",
    type: ContentType.AUDIO,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    categoryName: "Pháp thoại",
  },
  {
    id: "bt-2",
    title: "Ý nghĩa của lòng từ bi",
    slug: "y-nghia-cua-long-tu-bi",
    authorName: "TT. Thích Pháp Hòa",
    durationText: "24:32",
    thumbnailUrl: "/images/buddha-thumb.jpg",
    type: ContentType.AUDIO,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    categoryName: "Bài giảng",
  },
  {
    id: "bt-3",
    title: "Phật pháp trong đời sống",
    slug: "phat-phap-trong-doi-song",
    authorName: "TT. Thích Chân Quang",
    durationText: "31:45",
    thumbnailUrl: "/images/home-hero-banner.jpg",
    type: ContentType.AUDIO,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    categoryName: "Pháp thoại",
  },
  {
    id: "bt-4",
    title: "Nuôi dưỡng tâm thiện",
    slug: "nuoi-duong-tam-thien",
    authorName: "TT. Thích Minh Niệm",
    durationText: "26:20",
    thumbnailUrl: "/images/auth-banner.jpg",
    type: ContentType.AUDIO,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    categoryName: "Bài giảng",
  },
];

type FilterTab = "ALL" | "PHAP_THOAI" | "BAI_GIANG" | "AUDIO" | "VAN_BAN";

export const BachThoaiClient: React.FC = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Audio Store
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const isAudioPlaying = useAudioPlayerStore((s) => s.isPlaying);
  const playTrack = useAudioPlayerStore((s) => s.playTrack);
  const togglePlay = useAudioPlayerStore((s) => s.togglePlay);

  const { data: postsData } = useGetPosts();

  // Extract Bach Thoai posts from API
  const apiBachThoaiPosts = useMemo(() => {
    if (!postsData?.data || postsData.data.length === 0) return [];

    return postsData.data.filter((post) => {
      const catName = (post.category?.name || "").toLowerCase().trim();
      const catSlug = (post.category?.slug || "").toLowerCase().trim();
      return (
        catName.includes("bạch thoại") ||
        catName.includes("bach thoai") ||
        catSlug.includes("bach-thoai")
      );
    });
  }, [postsData]);

  // Combined display list: Use API posts if available, otherwise use default design items
  const displayItems = useMemo(() => {
    if (apiBachThoaiPosts.length > 0) {
      return apiBachThoaiPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug || post.id,
        authorName: post.author?.name || "TT. Thích Minh Niệm",
        durationText: post.audio?.duration
          ? formatTime(post.audio.duration)
          : "--:--",
        thumbnailUrl: post.thumbnailUrl || "/images/lotus-thumb.jpg",
        type: post.type || (post.audio?.audioUrl ? ContentType.AUDIO : ContentType.NORMAL),
        audioUrl: post.audio?.audioUrl || null,
        categoryName: post.category?.name || "Bạch thoại Phật pháp",
      }));
    }

    return DEFAULT_BACH_THOAI_ITEMS;
  }, [apiBachThoaiPosts]);

  // Filter items by active tab
  const filteredItems = useMemo(() => {
    return displayItems.filter((item) => {
      if (activeFilter === "ALL") return true;
      if (activeFilter === "AUDIO") return item.type === ContentType.AUDIO || !!item.audioUrl;
      if (activeFilter === "VAN_BAN") return item.type === ContentType.NORMAL;
      if (activeFilter === "PHAP_THOAI") {
        return (
          item.categoryName.toLowerCase().includes("pháp thoại") ||
          item.title.toLowerCase().includes("pháp thoại") ||
          item.id === "bt-1" ||
          item.id === "bt-3"
        );
      }
      if (activeFilter === "BAI_GIANG") {
        return (
          item.categoryName.toLowerCase().includes("bài giảng") ||
          item.title.toLowerCase().includes("bài giảng") ||
          item.id === "bt-2" ||
          item.id === "bt-4"
        );
      }
      return true;
    });
  }, [displayItems, activeFilter]);

  // Play / Pause Audio Handler with Persistent Player
  const handleTogglePlay = (item: (typeof displayItems)[0], e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!item.audioUrl) {
      router.push(`/post/${encodeURIComponent(item.slug)}`);
      return;
    }

    if (currentTrack?.id === item.id) {
      togglePlay();
    } else {
      playTrack({
        id: item.id,
        title: item.title,
        slug: item.slug,
        authorName: item.authorName,
        categoryName: item.categoryName,
        thumbnailUrl: item.thumbnailUrl,
        audioUrl: item.audioUrl,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FAF7F0] text-neutral-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeId="bach-thoai"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Sticky Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          userName="Vinh"
          onSearch={(query) => console.log("Searching for:", query)}
        />

        {/* Content Area */}
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:px-6 sm:py-7 space-y-5">
          {/* Header Title & Breadcrumb */}
          <div className="space-y-1">
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Bạch thoại Phật pháp
            </h1>
            <nav className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Link href="/" className="hover:text-amber-800 flex items-center gap-1 transition">
                <Home className="h-3 w-3" />
                <span>Trang chủ</span>
              </Link>
              <span>›</span>
              <span className="text-neutral-600 font-medium">Bạch thoại Phật pháp</span>
            </nav>
          </div>

          {/* Hero Banner Card matching design */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-900/10 shadow-sm">
            {/* Background Image */}
            <div className="relative h-44 sm:h-56 w-full">
              <Image
                src="/images/home-hero-banner.jpg"
                alt="Bạch thoại Phật pháp"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            </div>

            {/* Banner Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Bạch thoại Phật pháp
              </h2>
              <p className="mt-2 max-w-lg text-xs sm:text-sm font-medium text-amber-100/90 drop-shadow-sm">
                Dành cho những người mới bắt đầu tu tập và tìm hiểu chánh pháp nhiệm mầu
              </p>
            </div>
          </div>

          {/* Filter Tabs / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={`rounded-xl px-4 py-2 font-semibold transition shrink-0 ${
                activeFilter === "ALL"
                  ? "bg-[#B86E0E] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-[#EDE5D8]"
              }`}
            >
              Tất cả
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("PHAP_THOAI")}
              className={`rounded-xl px-4 py-2 font-semibold transition shrink-0 ${
                activeFilter === "PHAP_THOAI"
                  ? "bg-[#B86E0E] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-[#EDE5D8]"
              }`}
            >
              Pháp thoại
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("BAI_GIANG")}
              className={`rounded-xl px-4 py-2 font-semibold transition shrink-0 ${
                activeFilter === "BAI_GIANG"
                  ? "bg-[#B86E0E] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-[#EDE5D8]"
              }`}
            >
              Bài giảng
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("AUDIO")}
              className={`rounded-xl px-4 py-2 font-semibold transition shrink-0 ${
                activeFilter === "AUDIO"
                  ? "bg-[#B86E0E] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-[#EDE5D8]"
              }`}
            >
              Audio
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("VAN_BAN")}
              className={`rounded-xl px-4 py-2 font-semibold transition shrink-0 ${
                activeFilter === "VAN_BAN"
                  ? "bg-[#B86E0E] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-[#EDE5D8]"
              }`}
            >
              Văn bản
            </button>
          </div>

          {/* Cards List matching UI in screenshot */}
          <div className="space-y-3 pt-1">
            {filteredItems.map((item) => {
              const isCurrentPlaying = currentTrack?.id === item.id && isAudioPlaying;
              const postUrl = `/post/${encodeURIComponent(item.slug)}`;
              const isNormal = item.type === ContentType.NORMAL;

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(postUrl)}
                  className={`group flex items-center justify-between gap-4 rounded-2xl border border-[#EDE5D8]/90 bg-white/95 p-3 sm:p-4 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-xs cursor-pointer ${
                    isCurrentPlaying ? "bg-[#FAF2E6] ring-1 ring-amber-300" : ""
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
                    {/* Square Rounded Thumbnail */}
                    <div className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/lotus-thumb.jpg";
                        }}
                      />
                    </div>

                    {/* Middle Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="truncate text-sm sm:text-base font-bold text-neutral-900 transition-colors group-hover:text-amber-900">
                        {item.title}
                      </h3>
                      <p className="truncate text-xs font-medium text-neutral-500">
                        {item.authorName}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        {isNormal ? (
                          <>
                            <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                            <span className="text-amber-800 font-medium">Bài đọc</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5 text-neutral-400" />
                            <span>{item.durationText}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Golden Circular Play Button */}
                  <button
                    type="button"
                    onClick={(e) => handleTogglePlay(item, e)}
                    aria-label={
                      isNormal
                        ? `Đọc ${item.title}`
                        : isCurrentPlaying
                        ? `Tạm dừng ${item.title}`
                        : `Nghe ${item.title}`
                    }
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#B86E0E] text-white shadow-xs transition-all hover:bg-[#A05C08] active:scale-95 cursor-pointer"
                  >
                    {isNormal ? (
                      <BookOpen className="h-4 w-4" />
                    ) : isCurrentPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
