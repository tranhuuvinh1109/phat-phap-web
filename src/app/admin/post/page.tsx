import { Metadata } from "next";
import React from "react";

import { AdminPostView } from "./components/admin-post-view";

export const metadata: Metadata = {
  title: "Quản lý Bài viết | Quản trị Phật Pháp",
  description: "Trang quản lý danh sách bài viết Phật Pháp.",
};

export default function AdminPostPage() {
  return (
    <main>
      <AdminPostView />
    </main>
  );
}

