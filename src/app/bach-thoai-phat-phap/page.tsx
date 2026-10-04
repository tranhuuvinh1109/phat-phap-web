import type { Metadata } from "next";
import React from "react";

import { BachThoaiClient } from "./bach-thoai-client";

export const metadata: Metadata = {
  title: "Bạch thoại Phật pháp | Phật Pháp",
  description:
    "Danh sách các bài giảng, pháp thoại và bài viết Bạch thoại Phật pháp dành cho người mới bắt đầu.",
};

export default function BachThoaiPage() {
  return <BachThoaiClient />;
}
