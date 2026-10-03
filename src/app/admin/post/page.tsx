import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { CategorizedPosts } from "@/components/post";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Quản lý Bài viết | Quản trị Phật Pháp",
  description: "Trang quản lý danh sách bài viết Phật Pháp.",
};

export default function AdminPostPage() {
  return (
    <main className="space-y-6">
      {/* Page Header: Title and Create Post Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDE5D8]/80 pb-5">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Posts
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Quản lý và hiển thị các bài viết, ấn phẩm Phật Pháp theo danh mục.
          </p>
        </div>

        {/* Create Post Action Button */}
        <div>
          <Link href="/admin/post/create-post">
            <Button
              variant="golden"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Categorized Posts Display */}
      <div className="max-w-xl">
        <CategorizedPosts />
      </div>
    </main>
  );
}
