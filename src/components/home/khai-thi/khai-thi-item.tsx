"use client";

import { ArrowRight, Calendar, Sparkles, User } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

import type { PostItemType } from "@/api/post/post.type";
import { stripHtml } from "@/lib/utils";

const DEFAULT_FALLBACK_IMAGE = "/images/buddha-thumb.jpg";

export interface KhaiThiItemProps {
  post: PostItemType;
}

export const KhaiThiItem: React.FC<KhaiThiItemProps> = ({ post }) => {
  const postUrl = `/khai-thi/${encodeURIComponent(post.slug || post.id || "")}`;

  // Fallback image if post has no thumbnail
  const imageSrc = post.thumbnailUrl?.trim() || DEFAULT_FALLBACK_IMAGE;

  // Extract clean plain text snippet from editor HTML/JSON content
  const snippet = useMemo(() => {
    if (!post.content) return "";
    const plain = stripHtml(post.content);
    return plain.length > 130 ? `${plain.slice(0, 130)}...` : plain;
  }, [post.content]);

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={postUrl}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#EDE5D8]/90 bg-white/90 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md hover:bg-white cursor-pointer"
    >
      {/* 1. Header Image with Fallback and Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-amber-50/60 sm:h-48">
        <img
          src={imageSrc}
          alt={post.title || "Khai thị Phật pháp"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback image when image load errors
            (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
        />

        {/* Soft bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur-md border border-white/15">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>Khai thị</span>
        </div>

        {/* Date Tag */}
        {formattedDate && (
          <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 drop-shadow-sm flex items-center gap-1">
            <Calendar className="h-3 w-3 text-amber-200" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* 2. Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
        <div className="space-y-2">
          {/* Title */}
          <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug line-clamp-2 transition-colors group-hover:text-amber-800">
            {post.title}
          </h4>

          {/* Snippet from Text Editor HTML / JSON */}
          {snippet && (
            <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed font-normal">
              {snippet}
            </p>
          )}
        </div>

        {/* Card Footer: Author and Read Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="truncate font-medium text-amber-900/80 flex items-center gap-1">
            <User className="h-3 w-3 text-amber-700/80" />
            <span>{post.author?.name || "Khai thị Phật pháp"}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 transition group-hover:translate-x-0.5">
            <span>Đọc bài</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const KhaiThiItemCard = KhaiThiItem;
