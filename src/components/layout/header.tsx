"use client";

import { ChevronDown, Menu, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { LotusLogo } from "@/components/shared/lotus-logo";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
  userName?: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  userName = "Vinh",
  avatarUrl = "/images/lotus-thumb.jpg",
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#EDE5D8]/80 bg-[#FAF7F0]/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile Menu Button & Mobile Brand */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-[#F2EADB]"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <LotusLogo size={28} />
          <span
            className="text-base font-bold text-amber-950 sm:hidden"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Phật Pháp
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex max-w-xl flex-1 items-center">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8C8274]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm kinh, bài giảng, khai thị..."
            className="w-full rounded-full border border-[#E5DCBE]/80 bg-white/75 py-2 pr-4 pl-10 text-sm text-neutral-800 shadow-2xs transition-all placeholder:text-[#9B9182] focus:border-[#C6892A] focus:bg-white focus:ring-2 focus:ring-[#C6892A]/20 focus:outline-none"
          />
        </div>
      </form>

      {/* User Profile Info on Right */}
      <div className="flex cursor-pointer items-center gap-2.5 rounded-full py-1 pr-2 pl-1 transition-colors select-none hover:bg-[#F0E8D9] sm:gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-amber-600/30 ring-1 ring-amber-600/10 sm:h-9 sm:w-9">
          <Image src={avatarUrl} alt={userName} fill className="object-cover" />
        </div>
        <div className="hidden items-center gap-1 text-sm sm:flex">
          <span className="text-neutral-500">Xin chào,</span>
          <span className="font-semibold text-neutral-800">{userName}</span>
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </div>
      </div>
    </header>
  );
};
