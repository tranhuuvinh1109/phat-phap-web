import type { Metadata } from "next";
import React from "react";

import { KhaiThiClient } from "./khai-thi-client";

export const metadata: Metadata = {
  title: "Khai thị | Phật Pháp",
  description:
    "Danh sách các bài viết Khai thị Phật pháp, lời vàng soi sáng tâm thức và mở lối tu tập.",
};

export default function KhaiThiPage() {
  return <KhaiThiClient />;
}
