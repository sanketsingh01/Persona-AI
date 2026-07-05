"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CartoonLoader } from "@/components/cartoon/CartoonDecor";
import { CartoonShell } from "@/components/cartoon/CartoonShell";
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
      <CartoonShell showNav={false}>
        <div className="flex flex-1 items-center justify-center py-32">
          <CartoonLoader label="Getting things ready..." />
        </div>
      </CartoonShell>
    );
  }

  return (
    <CartoonShell showNav={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="cartoon-card cartoon-shadow-lg w-full max-w-md p-8 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-ink bg-bubble-pink text-3xl cartoon-shadow-sm">
            👋
          </div>

          <h1 className="mt-6 text-center font-heading text-3xl font-bold">
            Welcome back!
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Sign in to chat with your favorite AI mentors
          </p>

          <a
            href={getGoogleLoginUrl()}
            className="cartoon-btn mt-8 flex h-14 w-full items-center gap-3 bg-white text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="font-semibold text-bubble-sky underline-offset-4 hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to have fun while learning 🎉
        </p>
      </div>
    </CartoonShell>
  );
}
