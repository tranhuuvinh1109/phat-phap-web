import type { Metadata } from "next";
import React from "react";

import { DashboardOverview } from "./components/dashboard-overview";

export const metadata: Metadata = {
  title: "Tổng quan Quản trị | Phật Pháp",
  description: "Trang bảng điều khiển thống kê tổng quan hệ thống Phật Pháp.",
};

export default function AdminDashboardPage() {
  return (
    <main>
      <DashboardOverview />
    </main>
  );
}
