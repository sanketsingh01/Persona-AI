"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CartoonLoader } from "@/components/cartoon/CartoonDecor";
import { CartoonShell } from "@/components/cartoon/CartoonShell";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <CartoonShell>
        <div className="flex flex-1 items-center justify-center py-32">
          <CartoonLoader label="Checking your session..." />
        </div>
      </CartoonShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
