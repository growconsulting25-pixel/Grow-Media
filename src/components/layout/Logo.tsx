import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Wordmark + mark (a play-frame). Replace with final brand assets when ready. */
export function Logo({ href, className }: { href: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap", className)} aria-label={siteConfig.name}>
      <span aria-hidden className="btn-primary grid size-8 place-items-center rounded-[0.65rem]">
        <svg viewBox="0 0 20 20" className="size-4">
          <rect x="2.5" y="4" width="15" height="12" rx="3" fill="none" stroke="white" strokeWidth="1.6" />
          <path d="M8.5 7.6v4.8l4-2.4z" fill="white" />
        </svg>
      </span>
      <span className="text-[1.05rem]">{siteConfig.name}</span>
    </Link>
  );
}
