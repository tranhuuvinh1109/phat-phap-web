import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserProfileResponseType } from "@/api/auth/auth.type";
import { clearTokens, getAuthToken, setAuthToken, setRefreshToken } from "@/lib/axios";

export interface AuthState {
  user: UserProfileResponseType | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

export interface AuthActions {
  setUser: (user: UserProfileResponseType | null) => void;
  setAuth: (
    user: UserProfileResponseType,
    tokens: { accessToken: string; refreshToken?: string }
  ) => void;
  logout: () => void;
  setHydrated: (isHydrated: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),

      setAuth: (user, { accessToken, refreshToken }) => {
        setAuthToken(accessToken);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "auth-storage",
      skipHydration: true, // Prevents SSR hydration mismatch in Next.js App Router
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Atomic selector hooks for optimal render performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthHydrated = () => useAuthStore((state) => state.isHydrated);
