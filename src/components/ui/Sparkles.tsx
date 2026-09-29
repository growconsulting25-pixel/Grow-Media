import { cn } from "@/lib/cn";

/**
 * A handful of static "stars" like the reference design. Positions are fixed
 * (deterministic SSR) and they only twinkle subtly.
 */
const points = [
  [8, 18, 1], [16, 62, 0], [23, 34, 1], [31, 80, 0], [42, 12, 0], [55, 70, 1],
  [63, 26, 0], [71, 58, 1], [79, 14, 0], [86, 44, 1], [92, 76, 0], [48, 88, 0],
] as const;

export function Sparkles({ className, density = 12 }: { className?: string; density?: number }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {points.slice(0, density).map(([x, y, big], i) =>
        big ? (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="absolute size-3 animate-pulse-soft text-violet-300/70"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.37}s` }}
          >
            <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1" />
          </svg>
        ) : (
          <span
            key={i}
            className="absolute size-[3px] animate-pulse-soft rounded-full bg-white/40"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.41}s` }}
          />
        ),
      )}
    </div>
  );
}
