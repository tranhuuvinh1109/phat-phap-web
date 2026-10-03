import { QueryKeyEnum } from "@/enums";

/**
 * Global Query Key Factory for TanStack Query
 * Uses QueryKeyEnum for standardized key identifiers.
 */
export const queryKeys = {
  auth: {
    all: [QueryKeyEnum.AUTH] as const,
    user: () => [...queryKeys.auth.all, QueryKeyEnum.USER] as const,
  },
  // Add domain-specific query keys here as the project grows
};
