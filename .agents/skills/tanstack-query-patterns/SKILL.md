---
name: tanstack-query-patterns
description: >-
  Use this skill when fetching, caching, or mutating server data, setting up TanStack Query v5 hooks, QueryClientProvider, query key factories, or optimistic updates.
---

# TanStack Query v5 Patterns

Follow these conventions when implementing server state, data fetching, caching, and mutations:

## 1. Provider Setup (App Router)

Create a dedicated client wrapper in `src/components/providers/query-provider.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## 2. Query Key Factory Pattern

Always define structured query keys in `src/hooks/queries/keys.ts` to avoid typo bugs and ease cache invalidation:

```typescript
export const queryKeys = {
  transcript: {
    all: ["transcript"] as const,
    byUrl: (url: string, lang?: string) => ["transcript", "byUrl", url, lang] as const,
    detail: (videoId: string) => ["transcript", "detail", videoId] as const,
  },
  aiSummary: {
    all: ["aiSummary"] as const,
    byVideoId: (videoId: string) => ["aiSummary", videoId] as const,
  },
};
```

## 3. Query Hook Convention

Store query hooks in `src/hooks/queries/use-[name]-query.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export function useTranscriptQuery(url: string | null, lang?: string) {
  return useQuery({
    queryKey: queryKeys.transcript.byUrl(url ?? "", lang),
    queryFn: async () => {
      if (!url) throw new Error("URL is required");
      const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : "";
      const res = await fetch(`/api/transcript?url=${encodeURIComponent(url)}${langParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch transcript");
      }
      return res.json();
    },
    enabled: Boolean(url),
  });
}
```

## 4. Mutation & Invalidation Pattern

Store mutations in `src/hooks/mutations/use-[name]-mutation.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queries/keys";

export function useGenerateSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { videoId: string; prompt?: string }) => {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to generate summary");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.aiSummary.byVideoId(variables.videoId), data);
    },
  });
}
```

## Rules for Token & Perf Optimization
- **Never sync TanStack Query state into a Zustand store or local useState** via `useEffect`. Derive state directly or use `select`.
- Use `select` option in `useQuery` for data transformation to prevent unnecessary component re-renders.
