"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PersonaAI
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Chat with AI personas tailored to your needs.
          </p>
        </div>

        {isLoading ? (
          <p className="text-zinc-500">Checking authentication...</p>
        ) : isAuthenticated ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Signed in as <span className="font-medium">{user?.name}</span>
            </p>
            <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sign in
          </Link>
        )}
      </main>
    </div>
  );
}
