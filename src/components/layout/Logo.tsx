import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Rings + cyan cursor, drawn in a 180×180 box. Shared with the favicons. */
export const markViewBox = "10 10 180 180";
export const markRings = ["M102.2 158.9A70 70 0 1 1 158.9 102.2", "M90 125A35 35 0 1 1 125 90"];
export const markArrow = { transform: "translate(97 95) scale(0.9)", d: "M5 5 100 43 58 60 41 99Z" };

/** Grow's mark. Rings follow the text color (white on dark, ink in the light theme); pass ringColor to force one. */
export function GrowMark({ className, ringColor = "currentColor" }: { className?: string; ringColor?: string }) {
  return (
    <svg viewBox={markViewBox} aria-hidden className={cn("text-white", className)}>
      <g fill="none" stroke={ringColor} strokeWidth="15" strokeLinecap="round">
        {markRings.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path transform={markArrow.transform} d={markArrow.d} fill="#00abff" stroke="#00abff" strokeWidth="9" strokeLinejoin="round" />
    </svg>
  );
}

/** Grow Media wordmark: the Grow mark + "Media". */
export function Logo({ href, className }: { href: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-2 whitespace-nowrap", className)} aria-label={siteConfig.name}>
      <GrowMark className="size-8 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="text-[1.15rem] leading-none font-semibold tracking-tight text-white">Media</span>
    </Link>
  );
}
