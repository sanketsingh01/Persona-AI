"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { getGoogleLoginUrl } from "@/lib/auth";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Sign in to PersonaAI
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Continue with your Google account to access your personas and chats.
        </p>

        <a
          href={getGoogleLoginUrl()}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Continue with Google
        </a>

        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/" className="underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
