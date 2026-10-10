import { create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

import { UserProfileResponseType } from "@/api/auth/auth.type";
import { clearTokens, setAuthToken, setRefreshToken } from "@/lib/axios";
import { getAppStorage, setAppStorage } from "@/lib/storage";

export interface AuthState {
  user: UserProfileResponseType | null;
  accessToken: string | null;
  refreshToken: string | null;
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

const authStorage: StateStorage = {
  getItem: (): string | null => {
    const data = getAppStorage();
    const accessToken = data["access-token"] || null;
    const refreshToken = data["refresh-token"] || null;
    const user = data.user || null;
    return JSON.stringify({
      state: {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(accessToken),
      },
      version: 0,
    });
  },
  setItem: (_name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      setAppStorage({
        "access-token": parsed?.state?.accessToken ?? null,
        "refresh-token": parsed?.state?.refreshToken ?? null,
        user: parsed?.state?.user ?? null,
      });
    } catch {
      // ignore
    }
  },
  removeItem: (): void => {
    setAppStorage({
      "access-token": null,
      "refresh-token": null,
      user: null,
    });
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
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
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => authStorage),
      skipHydration: true, // Prevents SSR hydration mismatch in Next.js App Router
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Atomic selector hooks for optimal render performance
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthHydrated = () => useAuthStore((state) => state.isHydrated);
