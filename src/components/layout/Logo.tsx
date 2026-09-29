import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Grow's cyan arrow mark. Rounded corners come from the matching stroke. */
export function GrowMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 105 104" aria-hidden className={className}>
      <path d="M5 5 100 43 58 60 41 99Z" fill="#00abff" stroke="#00abff" strokeWidth="9" strokeLinejoin="round" />
    </svg>
  );
}

/** Grow Media wordmark: the Grow arrow + "Grow Media". */
export function Logo({ href, className }: { href: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-2 whitespace-nowrap", className)} aria-label={siteConfig.name}>
      <GrowMark className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="text-[1.1rem] leading-none font-semibold tracking-tight text-white">
        Grow <span className="font-medium text-brand-500">Media</span>
      </span>
    </Link>
  );
}
