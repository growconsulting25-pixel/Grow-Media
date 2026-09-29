import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A warm "paper" slab floating on the dark page. Used for the two light
 * sections so the transition reads as intentional, not a hard color swap.
 */
export function LightSection({ children, id, labelledBy, tone = "paper", className }: { children: ReactNode; id?: string; labelledBy: string; tone?: "paper" | "lavender"; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="px-2 sm:px-3">
      <div
        className={cn(
          "on-paper relative overflow-hidden rounded-[2rem] py-20 text-ink-on-paper sm:rounded-[2.75rem] sm:py-28",
          tone === "paper" ? "bg-paper" : "bg-paper-2",
          className,
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
