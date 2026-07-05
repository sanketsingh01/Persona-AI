import Link from "next/link";

import { FloatingBlobs } from "./CartoonDecor";

interface CartoonShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function CartoonShell({ children, showNav = true }: CartoonShellProps) {
  return (
    <div className="dot-bg relative flex min-h-screen flex-col">
      <FloatingBlobs />
      {showNav && (
        <nav className="relative z-10 border-b-[3px] border-ink bg-card/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-ink bg-bubble-pink text-lg font-bold text-ink cartoon-shadow-sm transition-transform group-hover:-rotate-6">
                P
              </span>
              <span className="font-heading text-xl font-bold tracking-tight">
                Persona<span className="text-bubble-sky">AI</span>
              </span>
            </Link>
          </div>
        </nav>
      )}
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}
