---
name: nextjs-app-router
description: >-
  Use this skill when developing Next.js App Router features, creating API Route Handlers, optimizing Server vs Client Components, or configuring metadata and dynamic routes.
---

# Next.js App Router & React 19 Patterns

## 1. Server vs Client Component Boundary

- Keep pages (`page.tsx`) and layouts (`layout.tsx`) as Server Components whenever possible.
- Push `"use client"` as far down the component leaf tree as possible (e.g., interactive player controls, sliders, buttons).
- Pass Server Components as `children` into Client Components to avoid making entire subtrees client-rendered.

```tsx
// Server Component
import { VideoTranscriptLayout } from "@/components/video/video-transcript-layout";

export default function Page() {
  return (
    <main>
      <VideoTranscriptLayout />
    </main>
  );
}
```

## 2. API Route Handlers (`src/app/api/.../route.ts`)

Always use standard `NextRequest` and typed `NextResponse`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  try {
    // Process logic...
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 3. Dynamic Route Parameters (Next.js 15+ / React 19)

In Next.js 15+, `params` and `searchParams` are Promises:

```tsx
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VideoDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lang } = await searchParams;

  return <div>Video ID: {id}</div>;
}
```

## 4. Metadata Definition

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Title | Brand",
  description: "Description",
  openGraph: {
    title: "Title",
    description: "Description",
  },
};
```
