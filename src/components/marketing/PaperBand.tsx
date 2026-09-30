import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A white slab on the dark page. It switches the design tokens to the light
 * theme, so any section inside (FAQ, form…) renders light without changes.
 */
export function PaperBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-2 sm:px-3", className)}>
      <div data-theme="light" className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),transparent)]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
