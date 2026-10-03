import { Metadata } from "next";
import React from "react";

import { CategoryForm } from "./components/category-form";

export const metadata: Metadata = {
  title: "Tạo danh mục | Quản trị Phật Pháp",
  description: "Trang tạo mới danh mục nội dung và bài viết Phật Pháp.",
};

export default function AdminCategoryPage() {
  return (
    <main className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Tạo danh mục
        </h1>
        <p className="text-sm text-neutral-500">
          Thêm danh mục mới cho các bài viết, bài giảng và ấn phẩm Phật Pháp. Đường dẫn tĩnh (Slug) sẽ tự động tạo từ tên danh mục.
        </p>
      </div>

      {/* Main Form Component */}
      <section aria-labelledby="create-category-heading">
        <CategoryForm />
      </section>
    </main>
  );
}
