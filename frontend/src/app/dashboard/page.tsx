"use client";

import Image from "next/image";
import Link from "next/link";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{user?.email}</p>

          {user?.avatar?.url && (
            <Image
              src={user.avatar.url}
              alt={user.name}
              width={64}
              height={64}
              className="mt-6 rounded-full"
            />
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Log out
            </button>
            <Link
              href="/"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
