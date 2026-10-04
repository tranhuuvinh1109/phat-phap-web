import type { Metadata } from "next";
import React from "react";

import { FavoritesClient } from "./favorites-client";

export const metadata: Metadata = {
  title: "Bài viết đã lưu | Yêu thích | Phật Pháp Web",
  description:
    "Danh sách các bài viết, bài giảng và pháp thoại bạn đã lưu lại để chiêm nghiệm và tu tập.",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
