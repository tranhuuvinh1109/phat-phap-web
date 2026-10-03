# Project Rules & Architecture Guidelines

Project: **Next.js App Router (PhatPhap Web)**
Stack: **Next.js (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4 + TanStack Query v5 + Zustand + Chakra UI**

---

## 1. State Management Boundary (CRITICAL - Token & Performance Saver)

Never mix server state and client state:
- **Server Cache & Async Data** ➔ **TanStack Query (`@tanstack/react-query`)**:
  - Always use query key factories: `export const transcriptKeys = { all: ['transcript'] as const, detail: (id: string) => [...transcriptKeys.all, id] as const }`.
  - Encapsulate queries and mutations inside custom hooks in `src/hooks/queries/` or `src/hooks/mutations/`.
  - **NEVER** duplicate TanStack Query data into Zustand stores.
- **Global Client UI State** ➔ **Zustand (`zustand`)**:
  - Only for UI state: modal open/close, active theme, video playback progress/sync, current active segment, user preferences.
  - Always use atomic selectors: `const isPlaying = usePlayerStore((s) => s.isPlaying)` to prevent re-rendering entire trees.
- **Local Component State** ➔ React `useState` / `useReducer`:
  - Ephemeral form inputs, hover states, accordion toggles.

---

## 2. Next.js App Router & React 19 Patterns

- **Server Components by default**: Keep components server-rendered unless they need hooks (`useState`, `useEffect`), browser APIs, or event handlers.
- **Client Components**: Add `"use client"` directive at the top of the file. Keep client boundaries as low in the tree as possible.
- **Data Fetching**: Prefer Server Components or TanStack Query. In Route Handlers (`src/app/api/...`), use standard Web API `NextRequest` and `NextResponse`.
- **Imports**: Always use path alias `@/...` (maps to `src/...`).

---

## 3. Styling: Tailwind CSS v4 + Chakra UI

- **Tailwind CSS v4**: Uses `@import "tailwindcss";` in `src/styles/globals.css`. Configuration is CSS-first using `@theme`.
- **Chakra UI**: Ensure any Chakra UI component is rendered inside a Client Component (`"use client"`) and wrapped with the appropriate `Provider`.
- **Class Merging**: Use `cn(...)` utility (combines `clsx` and `tailwind-merge`) when applying dynamic class names.
- **Theme Consistency**: Maintain dark-mode first, glassmorphism, clean contrast, Lucide icons.

---

## 4. Vibe Coding Efficiency Directives

To minimize token usage and latency during coding:
- **Concise & Direct**: Do not output conversational filler. Provide only clean explanations and precise code diffs.
- **Targeted Edits**: Never rewrite an entire 300-line file when only modifying 5 lines. Use precise block replacements.
- **TypeScript Strictness**: Always supply explicit interfaces/types; avoid `any`.
- **Validation**: Ensure imports match existing project files before finishing code changes.
