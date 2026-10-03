"use client";

import { type ReactNode, useEffect } from "react";

import { getMe } from "@/api/auth/auth.api";
import { getAuthToken } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    // 1. Manually rehydrate Zustand store from localStorage
    useAuthStore.persist.rehydrate();
    setHydrated(true);

    // 2. If token exists in localStorage, sync fresh user info from api me
    const token = getAuthToken();
    if (token) {
      getMe()
        .then((userData) => {
          if (userData) {
            setUser(userData);
          }
        })
        .catch((error: unknown) => {
          // If 401 Unauthorized (token invalid/expired and refresh failed), clear session
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 401) {
            logout();
          }
        });
    }

    // 3. Listen for global unauthorized event dispatched by axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [setUser, logout, setHydrated]);

  return <>{children}</>;
}
