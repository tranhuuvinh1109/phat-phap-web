---
name: chakra-tailwind-ui
description: >-
  Use this skill when building or styling UI components with Tailwind CSS v4 and Chakra UI, configuring ChakraProvider in Next.js App Router, or resolving CSS precedence/conflicts.
---

# Tailwind CSS v4 + Chakra UI Integration Patterns

## 1. Role Division

- **Tailwind CSS v4**: Primary tool for layouts, page structures, typography, gradients, glassmorphism, responsive utilities, and animations (`globals.css` with `@import "tailwindcss"`).
- **Chakra UI**: Accessible interactive primitives (Modal, Drawer, Menu, Popover, Tooltip, Slider, Toast).
- **Lucide Icons**: Standard icon set (`lucide-react`).

## 2. Chakra Provider Setup in App Router

Chakra UI uses client-side context. Wrap it inside a dedicated `"use client"` provider in `src/components/providers/chakra-provider.tsx`:

```tsx
"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode } from "react";

export function ChakraUIProvider({ children }: { children: ReactNode }) {
  // If Chakra UI v3:
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
  // If Chakra UI v2:
  // return <ChakraProvider resetCSS={false}>{children}</ChakraProvider>;
}
```

> **Note**: If using Chakra UI v2 with Tailwind, set `resetCSS={false}` on `ChakraProvider` to prevent Chakra's CSS reset (Preflight) from overriding Tailwind's base styles.

## 3. Composing Tailwind with Chakra Components

Combine Chakra's accessibility and keyboard navigation with Tailwind's utility styling via `className`:

```tsx
"use client";

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ConfirmDialog({ isOpen, onClose, title, children }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay className="bg-slate-950/80 backdrop-blur-sm" />
      <ModalContent className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-4 shadow-2xl">
        <ModalHeader className="text-lg font-semibold text-slate-100">{title}</ModalHeader>
        <ModalCloseButton className="text-slate-400 hover:text-slate-200" />
        <ModalBody className="text-sm text-slate-300">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
```

## 4. Class Merging Utility

Always use `cn` from `src/lib/utils` (or `clsx` + `tailwind-merge`) when conditionally toggling classes:

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
