import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Minimal modern phone frame. Children fill the 9:19.5 screen. */
export function PhoneMockup({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "relative aspect-[9/19.2] rounded-[2.6rem] bg-[#1a2330] p-[7px]",
        "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-white)_8%,transparent),0_50px_100px_-30px_rgba(0,0,0,0.9),0_30px_80px_-40px_rgba(0,171,255,0.55)]",
        className,
      )}
    >
      <div className="relative size-full overflow-hidden rounded-[2.15rem] bg-black">
        {children}
        <div aria-hidden className="absolute top-2.5 left-1/2 z-20 h-[1.35rem] w-[34%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
