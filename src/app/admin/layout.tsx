"use client";

import {
  ArrowLeft,
  ChevronRight,
  FileText,
  FolderTree,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { LotusLogo } from "@/components/shared/lotus-logo";
import { AdminUserProfile } from "./components/admin-user-profile";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "dashboard", label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { id: "post", label: "Bài viết", href: "/admin/post", icon: FileText },
  { id: "category", label: "Danh mục", href: "/admin/category", icon: FolderTree },
  { id: "users", label: "Người dùng", href: "/admin/users", icon: Users },
  { id: "settings", label: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`group flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-[#F3E8D8] text-[#9C5812] font-semibold shadow-xs"
                : "text-[#6C6356] hover:bg-[#F8F2E8] hover:text-[#9C5812]"
            }`}
          >
            <Icon
              className={`h-4.5 w-4.5 shrink-0 ${
                isActive ? "text-[#9C5812]" : "text-[#7D7364] group-hover:text-[#9C5812]"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#FAF7F0] text-neutral-800">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-[#EDE5D8] bg-[#FBF9F4] p-5 sticky top-0 h-screen select-none">
        <div>
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3 px-2 pb-6 border-b border-[#EDE5D8]/80">
            <LotusLogo size={36} />
            <div>
              <h2
                className="text-base font-bold text-amber-950 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Phật Pháp
              </h2>
              <span className="text-[11px] font-medium text-amber-700 tracking-wider uppercase">
                Quản trị hệ thống
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-6">{renderNavLinks()}</div>
        </div>

        {/* Back to Home Link */}
        <div className="pt-4 border-t border-[#EDE5D8]/80">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Trở về Trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-[#FBF9F4] p-5 shadow-2xl z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EDE5D8]">
                <div className="flex items-center gap-2.5">
                  <LotusLogo size={32} />
                  <span className="font-bold text-amber-950">Quản trị</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="pt-6">{renderNavLinks()}</div>
            </div>

            <div className="pt-4 border-t border-[#EDE5D8]">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold text-neutral-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Trở về Trang chủ</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Admin Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EDE5D8]/80 bg-[#FAF7F0]/90 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-2 text-neutral-600 hover:bg-[#F2EADB] lg:hidden"
              aria-label="Mở menu quản trị"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Link href="/admin" className="hover:text-amber-800 transition-colors">
                Quản trị
              </Link>
              {pathname.startsWith("/admin/post") && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  <Link href="/admin/post" className="hover:text-amber-800 transition-colors">
                    Bài viết
                  </Link>
                  {pathname === "/admin/post/create-post" && (
                    <>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="text-amber-900 font-semibold">Tạo mới</span>
                    </>
                  )}
                </>
              )}
              {pathname.startsWith("/admin/category") && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  <Link href="/admin/category" className="hover:text-amber-800 transition-colors">
                    Danh mục
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-amber-900 font-semibold">Tạo mới</span>
                </>
              )}
            </div>
          </div>

          {/* User Profile Info on Right */}
          <AdminUserProfile />
        </header>

        {/* Child Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
