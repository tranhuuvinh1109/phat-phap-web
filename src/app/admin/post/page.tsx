import { FileText, Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

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
            Quản lý và đăng tải các bài giảng, bài viết, ấn phẩm Phật Pháp.
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

      {/* Placeholder container for future post list/table UI */}
      <section
        aria-label="Danh sách bài viết"
        className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#EDE5D8] bg-white/60 p-8 text-center"
      >
        <div className="rounded-full bg-amber-50 p-4 text-amber-700">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-neutral-800">
          Chưa có bài viết nào được hiển thị
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-neutral-500 leading-relaxed">
          Giao diện danh sách bài viết sẽ được thiết kế sau. Bấm vào nút bên dưới để tạo bài viết mới.
        </p>
        <div className="mt-5">
          <Link href="/admin/post/create-post">
            <Button
              variant="golden"
              size="sm"
              className="rounded-xl px-4 py-2 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              <span>Tạo bài viết mới</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
