"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { refreshTokens } from "@/lib/api";
import { getMe, logout as logoutRequest } from "@/lib/auth";
import type { User } from "@/types/user";

const REFRESH_INTERVAL_MS =
  Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL_MS) || 14 * 60 * 1000;

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const currentUser = await getMe();
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);

      let currentUser = await getMe();

      if (!currentUser) {
        const refreshed = await refreshTokens();
        if (refreshed) {
          currentUser = await getMe();
        }
      }

      if (!cancelled) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => {
      void refreshTokens();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      logout,
      refreshUser,
    }),
    [user, isLoading, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
