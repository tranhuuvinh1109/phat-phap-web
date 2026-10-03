import type { Metadata } from "next";

import { HomeView } from "@/components/home";

export const metadata: Metadata = {
  title: "Trang chủ | Phật Pháp - Nghe, Đọc, Tu Tập",
  description:
    "Trang chủ ứng dụng Phật Pháp - Hướng dẫn tu tập, nghe kinh tụng, bài giảng và khai thị Phật pháp",
};

export default function HomePage() {
  return <HomeView />;
}
