"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  Headphones,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

// Types for Dashboard Fake Data
export type TimePeriod = "week" | "month";

interface StatCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

interface TopViewedPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  views: number;
  audioPlays?: number;
  author: string;
  thumbnailUrl: string;
  publishedAt: string;
}

interface TrafficDataPoint {
  label: string;
  visitors: number;
  views: number;
  heightPercent: number;
}

// 1. Mock Statistics Data
const STATS_DATA: StatCardData[] = [
  {
    id: "posts",
    title: "Tổng số bài viết",
    value: "148",
    change: "+12 bài",
    isPositive: true,
    subtitle: "so với tháng trước",
    icon: FileText,
    iconColor: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    id: "views",
    title: "Tổng lượt xem",
    value: "284.5K",
    change: "+18.4%",
    isPositive: true,
    subtitle: "so với kỳ trước",
    icon: Eye,
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    id: "audio",
    title: "Lượt nghe Pháp âm",
    value: "96.2K",
    change: "+24.1%",
    isPositive: true,
    subtitle: "tăng trưởng mạnh",
    icon: Headphones,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    id: "visitors",
    title: "Người truy cập",
    value: "64.8K",
    change: "+15.6%",
    isPositive: true,
    subtitle: "trong tháng này",
    icon: Users,
    iconColor: "text-purple-700",
    iconBg: "bg-purple-100",
  },
];

// 2. Mock Top Viewed Posts
const TOP_VIEWED_POSTS: TopViewedPostItem[] = [
  {
    id: "p-1",
    title: "Buông bỏ muộn phiền để tìm lại sự an lạc và tự tại trong tâm hồn",
    slug: "buong-bo-muon-phien-an-lac",
    category: "Khai thị",
    views: 42850,
    audioPlays: 12400,
    author: "TT. Thích Minh Niệm",
    thumbnailUrl: "/images/lotus-thumb.jpg",
    publishedAt: "08/10/2026",
  },
  {
    id: "p-2",
    title: "Ý nghĩa của lòng từ bi, hạnh nhẫn nhục và phương pháp nuôi dưỡng tâm bồ đề",
    slug: "y-nghia-long-tu-bi-hanh-nhan-nhuc",
    category: "Bạch thoại Phật pháp",
    views: 38200,
    audioPlays: 15800,
    author: "TT. Thích Pháp Hòa",
    thumbnailUrl: "/images/buddha-thumb.jpg",
    publishedAt: "05/10/2026",
  },
  {
    id: "p-3",
    title: "Kinh Kim Cang: Bát Nhã Ba La Mật Đa và ánh sáng trí tuệ giải thoát",
    slug: "kinh-kim-cang-tri-tue-giai-thoat",
    category: "Kinh",
    views: 29400,
    audioPlays: 8900,
    author: "TT. Thích Chân Quang",
    thumbnailUrl: "/images/home-hero-banner.jpg",
    publishedAt: "01/10/2026",
  },
  {
    id: "p-4",
    title: "Chánh niệm trong từng bước chân và hơi thở giữa nhịp sống bận rộn",
    slug: "chanh-niem-tung-buoc-chan",
    category: "Khai thị",
    views: 24150,
    audioPlays: 6200,
    author: "Thiền sư Thích Nhất Hạnh",
    thumbnailUrl: "/images/auth-banner.jpg",
    publishedAt: "28/09/2026",
  },
  {
    id: "p-5",
    title: "Nhân quả ba đời và bài học thức tỉnh lương tri của người con Phật",
    slug: "nhan-qua-ba-doi-bai-hoc-thuc-tinh",
    category: "Bạch thoại Phật pháp",
    views: 19800,
    audioPlays: 7450,
    author: "TT. Thích Minh Niệm",
    thumbnailUrl: "/images/lotus-thumb.jpg",
    publishedAt: "24/09/2026",
  },
];

// 3. Mock Traffic Data for Week & Month
const WEEK_TRAFFIC: TrafficDataPoint[] = [
  { label: "Thứ 2", visitors: 2150, views: 6800, heightPercent: 55 },
  { label: "Thứ 3", visitors: 2840, views: 8900, heightPercent: 70 },
  { label: "Thứ 4", visitors: 3200, views: 10400, heightPercent: 82 },
  { label: "Thứ 5", visitors: 2950, views: 9200, heightPercent: 74 },
  { label: "Thứ 6", visitors: 3820, views: 12100, heightPercent: 92 },
  { label: "Thứ 7", visitors: 4500, views: 14800, heightPercent: 100 },
  { label: "Chủ nhật", visitors: 4120, views: 13500, heightPercent: 95 },
];

const MONTH_TRAFFIC: TrafficDataPoint[] = [
  { label: "Tuần 1", visitors: 14200, views: 58000, heightPercent: 72 },
  { label: "Tuần 2", visitors: 15850, views: 64200, heightPercent: 80 },
  { label: "Tuần 3", visitors: 16900, views: 72100, heightPercent: 88 },
  { label: "Tuần 4", visitors: 17870, views: 80220, heightPercent: 100 },
];

export const DashboardOverview: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>("week");

  const trafficData = useMemo(() => {
    return period === "week" ? WEEK_TRAFFIC : MONTH_TRAFFIC;
  }, [period]);

  const currentVisitorsCount = useMemo(() => {
    return period === "week" ? "23,580" : "64,820";
  }, [period]);

  const currentViewsCount = useMemo(() => {
    return period === "week" ? "75,700" : "274,520";
  }, [period]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EDE5D8]/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-100/70 px-2.5 py-0.5 text-xs font-semibold text-amber-900 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Trung tâm điều khiển</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tổng quan Hệ thống
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Theo dõi lưu lượng truy cập, tương tác bài viết và chỉ số phát triển Phật Pháp.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/post/create-post"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-amber-900 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo bài viết mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_DATA.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="rounded-2xl border border-[#EDE5D8]/90 bg-white/95 p-4 sm:p-5 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">
                  {stat.title}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-neutral-900">
                  {stat.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    stat.isPositive ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {stat.change}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-neutral-400">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Traffic Overview Chart with Week / Month Toggle */}
      <div className="rounded-2xl border border-[#EDE5D8]/90 bg-white/95 p-5 sm:p-6 shadow-2xs">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-700" />
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                Lưu lượng Người truy cập & Lượt xem
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Thống kê lượng Phật tử viếng thăm và nghe đọc trong {period === "week" ? "tuần này" : "tháng này"}
            </p>
          </div>

          {/* Period Toggle Controls */}
          <div className="inline-flex items-center rounded-xl border border-[#EDE5D8] bg-[#FAF7F0] p-1 text-xs">
            <button
              type="button"
              onClick={() => setPeriod("week")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition cursor-pointer ${
                period === "week"
                  ? "bg-amber-800 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-amber-900"
              }`}
            >
              Trong tuần
            </button>
            <button
              type="button"
              onClick={() => setPeriod("month")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition cursor-pointer ${
                period === "month"
                  ? "bg-amber-800 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-amber-900"
              }`}
            >
              Trong tháng
            </button>
          </div>
        </div>

        {/* Aggregate Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 pb-6 border-b border-neutral-100/80">
          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              {period === "week" ? "Tổng người truy cập tuần" : "Tổng người truy cập tháng"}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              {currentVisitorsCount}
            </p>
            <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3 w-3" />
              +14.8% so với kỳ trước
            </span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              {period === "week" ? "Tổng lượt xem tuần" : "Tổng lượt xem tháng"}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              {currentViewsCount}
            </p>
            <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3 w-3" />
              +22.3% thời gian đọc
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Thời gian lưu lại trung bình
            </p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              8 phút 42 giây
            </p>
            <span className="text-[11px] font-medium text-neutral-500 mt-0.5 block">
              Tập trung ở mục Pháp thoại Audio
            </span>
          </div>
        </div>

        {/* Visual Bar Chart Presentation */}
        <div className="pt-6">
          <div className="h-48 sm:h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
            {trafficData.map((pt, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white rounded-lg px-2 py-1 text-[10px] sm:text-[11px] font-medium shadow-md pointer-events-none whitespace-nowrap mb-1">
                  <div>{pt.visitors.toLocaleString()} người</div>
                  <div className="text-amber-300 font-bold">{pt.views.toLocaleString()} lượt xem</div>
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[42px] bg-amber-100/70 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${pt.heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                  />
                </div>

                {/* Day / Week Label */}
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-600 mt-1 group-hover:text-amber-900">
                  {pt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top Most Viewed Posts Section */}
      <div className="rounded-2xl border border-[#EDE5D8]/90 bg-white/95 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Bài viết được xem nhiều nhất
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Xếp hạng theo tổng lượt xem và số lượt phát âm thanh trực tuyến
            </p>
          </div>

          <Link
            href="/admin/post"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 transition"
          >
            <span>Quản lý tất cả</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Posts Table / Responsive List */}
        <div className="divide-y divide-neutral-100">
          {TOP_VIEWED_POSTS.map((post, index) => (
            <div
              key={post.id}
              className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#FAF7F0]/60 -mx-2 px-2 rounded-xl transition"
            >
              {/* Left: Rank, Image & Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Rank Number Badge */}
                <span
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-amber-600 text-white shadow-2xs"
                      : index === 1
                      ? "bg-amber-500/80 text-white"
                      : index === 2
                      ? "bg-amber-400/80 text-neutral-900"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border border-[#EDE5D8] bg-amber-50">
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-amber-100/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900 border border-amber-200">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {post.publishedAt}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug truncate group-hover:text-amber-800 transition">
                    {post.title}
                  </h4>

                  <p className="text-[11px] text-neutral-500 truncate">
                    Tác giả: <span className="font-medium text-neutral-700">{post.author}</span>
                  </p>
                </div>
              </div>

              {/* Right: Metrics Stats */}
              <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center shrink-0 pl-10 sm:pl-0">
                {/* Views Count */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-bold text-neutral-900">
                    <Eye className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">lượt xem</span>
                </div>

                {/* Audio Plays Count */}
                {post.audioPlays ? (
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-bold text-emerald-800">
                      <Headphones className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{post.audioPlays.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">lượt nghe</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
