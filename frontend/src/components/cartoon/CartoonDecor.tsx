export function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="blob absolute -top-16 -left-16 h-48 w-48 bg-bubble-pink/30 float" />
      <div className="blob absolute top-1/4 -right-12 h-36 w-36 bg-bubble-sky/25 float-delayed" />
      <div className="blob absolute bottom-20 left-1/4 h-28 w-28 bg-bubble-yellow/35 float" />
      <div className="blob absolute -bottom-10 right-1/3 h-40 w-40 bg-bubble-mint/20 float-delayed" />
    </div>
  );
}

export function StarBurst({
  className = "",
  color = "text-bubble-yellow",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={`${color} ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function WavyDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`relative h-12 w-full overflow-hidden ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="absolute bottom-0 h-full w-full"
      >
        <path
          d="M0,30 C150,60 350,0 600,30 C850,60 1050,0 1200,30 L1200,60 L0,60 Z"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

export function CartoonLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <span className="typing-dot inline-block h-3 w-3 rounded-full bg-bubble-pink" />
        <span className="typing-dot inline-block h-3 w-3 rounded-full bg-bubble-sky" />
        <span className="typing-dot inline-block h-3 w-3 rounded-full bg-bubble-mint" />
      </div>
      <p className="font-heading text-sm font-semibold text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
