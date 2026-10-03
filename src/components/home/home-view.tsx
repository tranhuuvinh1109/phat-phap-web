"use client";

import React, { useState } from "react";

import {
  ContinueListening,
  HeroBanner,
  LatestContent,
  QuickPractice,
} from "@/components/home";
import { Header, Sidebar } from "@/components/layout";
import { CategorizedPosts } from "@/components/post";
import {
  CONTINUE_LISTENING_DATA,
  HERO_BANNER_DATA,
  LATEST_CONTENT_ITEMS,
  QUICK_PRACTICE_ITEMS,
} from "@/constants/home.constants";

export function HomeView() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState("home");

  return (
    <div className="flex min-h-screen w-full bg-[#FAF7F0] text-neutral-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeId={activeNavId}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Sticky Header with Search and Profile */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          userName="Vinh"
          onSearch={(query) => console.log("Searching for:", query)}
        />

        {/* Dashboard Main Grid Area */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col items-start gap-6 xl:flex-row">
            {/* Left & Center Main Stream (Hero, Audio, Categories, Recent) */}
            <div className="w-full min-w-0 flex-1 space-y-6">
              {/* 1. Hero Quote Banner */}
              <HeroBanner
                quote={HERO_BANNER_DATA.quote}
                author={HERO_BANNER_DATA.author}
                bannerImage={HERO_BANNER_DATA.bannerImage}
              />

              {/* 2. Continue Listening Player Card */}
              <ContinueListening
                title={CONTINUE_LISTENING_DATA.title}
                subtitle={CONTINUE_LISTENING_DATA.subtitle}
                thumbnail={CONTINUE_LISTENING_DATA.thumbnail}
                currentTime={CONTINUE_LISTENING_DATA.currentTime}
                totalDuration={CONTINUE_LISTENING_DATA.totalDuration}
                currentProgressPercent={CONTINUE_LISTENING_DATA.currentProgressPercent}
              />

              {/* 3. Quick Practice 5 Pastel Category Cards */}
              <QuickPractice items={QUICK_PRACTICE_ITEMS} />

              {/* 4. Latest Content 4-Grid Cards */}
              <LatestContent items={LATEST_CONTENT_ITEMS} />
            </div>

            {/* Right Column Panels (Bạch thoại Phật pháp & Các danh mục khác) */}
            <aside className="w-full shrink-0 space-y-6 xl:w-76 2xl:w-88">
              <CategorizedPosts />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
