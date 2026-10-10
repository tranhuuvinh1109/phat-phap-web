import type { Metadata } from "next";
import React from "react";

import { AdminUsersView } from "./components/admin-users-view";

export const metadata: Metadata = {
  title: "Quản lý Người dùng & Phân quyền | Quản trị Phật Pháp",
  description:
    "Trang quản lý danh sách người dùng, vai trò và phân quyền quản trị hệ thống Phật Pháp.",
};

export default function AdminUsersPage() {
  return (
    <main>
      <AdminUsersView />
    </main>
  );
}
