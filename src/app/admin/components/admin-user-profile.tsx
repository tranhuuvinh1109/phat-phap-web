"use client";

import {
  ChevronDown,
  ExternalLink,
  Home,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useAuthStore, useUser } from "@/stores/auth-store";

export const AdminUserProfile: React.FC = () => {
  const router = useRouter();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const displayName =
    user?.name ||
    user?.fullName ||
    (user?.email ? user.email.split("@")[0] : "Admin");

  const email = user?.email || "";
  const role = user?.role || "ADMIN";
  const avatarUrl = user?.avatarUrl;
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - User Profile Info */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-[#EDE5D8]/90 bg-white/90 py-1 pl-1.5 pr-3 shadow-2xs transition-all select-none hover:bg-[#F0E8D9] focus:outline-none focus:ring-2 focus:ring-amber-500/20 sm:gap-3"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-amber-600/30 ring-1 ring-amber-600/10 sm:h-8.5 sm:w-8.5">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-white shadow-inner">
              {initialLetter}
            </div>
          )}
        </div>

        {/* Display Text & Role */}
        <div className="hidden items-center gap-1.5 text-xs sm:flex">
          <span className="text-neutral-500">Xin chào,</span>
          <span className="max-w-[120px] truncate font-semibold text-neutral-800">
            {displayName}
          </span>
          <span className="rounded bg-amber-100/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase border border-amber-300/60">
            {role}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Mobile Minimalist Chevron */}
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition-transform duration-200 sm:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-[#EDE5D8] bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-0 zoom-in-95">
          {/* User Details Header */}
          <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#EDE5D8]/70">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-amber-600/30">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white">
                    {initialLetter}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">
                  {displayName}
                </p>
                {email && (
                  <p className="truncate text-xs text-neutral-500">{email}</p>
                )}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[#EDE5D8]/80 pt-2 text-xs">
              <span className="text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                Vai trò
              </span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 border border-amber-300">
                {role}
              </span>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="mt-1 space-y-0.5">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF7F0] hover:text-amber-900 transition-colors"
            >
              <Home className="h-4 w-4 text-neutral-500" />
              <span>Xem Trang chủ</span>
              <ExternalLink className="ml-auto h-3 w-3 text-neutral-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
