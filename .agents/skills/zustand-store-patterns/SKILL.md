---
name: zustand-store-patterns
description: >-
  Use this skill when managing client UI state, video playback state, user settings, modal state, or creating/updating Zustand stores in TypeScript.
---

# Zustand Store Patterns

Conventions for clean, performant global client state using Zustand:

## 1. File Structure

Store stores in `src/stores/`:
- `src/stores/player-store.ts` (Video playback, timestamp sync, volume, active segment)
- `src/stores/ui-store.ts` (Modals, drawers, layout split ratio, active tab)
- `src/stores/settings-store.ts` (Persisted user preferences)

## 2. Store Implementation Pattern

Use TypeScript interfaces with typed actions:

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  activeSegmentIndex: number;
  selectedLanguage: string;
}

interface PlayerActions {
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setActiveSegmentIndex: (index: number) => void;
  setSelectedLanguage: (lang: string) => void;
  reset: () => void;
}

const initialState: PlayerState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  activeSegmentIndex: -1,
  selectedLanguage: "vi",
};

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  devtools((set) => ({
    ...initialState,
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setActiveSegmentIndex: (activeSegmentIndex) => set({ activeSegmentIndex }),
    setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
    reset: () => set(initialState),
  }))
);
```

## 3. Persistent Store Pattern (SSR Safe)

When persisting to `localStorage`, guard against hydration mismatch:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  autoScroll: boolean;
  fontSize: "sm" | "base" | "lg";
  setAutoScroll: (val: boolean) => void;
  setFontSize: (size: "sm" | "base" | "lg") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoScroll: true,
      fontSize: "base",
      setAutoScroll: (autoScroll) => set({ autoScroll }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "app-settings",
      skipHydration: true, // Prevents SSR mismatch in Next.js App Router
    }
  )
);
```

## 4. Atomic Selector Rule (Critical for Performance)

**DO NOT** do this:
```typescript
// ❌ BAD: Re-renders on ANY state change in the store
const { isPlaying, currentTime } = usePlayerStore();
```

**ALWAYS** do this:
```typescript
// ✅ GOOD: Re-renders only when this specific property changes
const isPlaying = usePlayerStore((s) => s.isPlaying);
const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
```
