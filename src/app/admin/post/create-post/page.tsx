import { Metadata } from "next";
import React from "react";

import { CreatePostForm } from "./components/create-post-form";

export const metadata: Metadata = {
  title: "Tạo bài viết mới | Quản trị Phật Pháp",
  description: "Trang tạo bài viết mới theo quy trình nhiều bước (Danh mục, Audio, Nội dung).",
};

export default function CreatePostPage() {
  return (
    <main className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Tạo bài viết mới
        </h1>
        <p className="text-sm text-neutral-500">
          Quy trình tạo bài viết theo danh mục. Chọn danh mục để hệ thống tự động gán loại nội dung (Audio hoặc Bài viết thường).
        </p>
      </div>

      {/* Main Multi-step Form */}
      <section aria-labelledby="create-post-heading">
        <CreatePostForm />
      </section>
    </main>
  );
}
