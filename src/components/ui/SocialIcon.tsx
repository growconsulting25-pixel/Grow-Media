import type { SocialId } from "@/config/site";

/** Monochrome platform glyphs (simplified, brand-neutral). */
export function SocialIcon({ id, className = "size-4" }: { id: SocialId; className?: string }) {
  switch (id) {
    case "instagram":
      return (
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.7-.3-3.9-1v6.2c0 4.3-4.7 6.9-8.2 4.5-2.3-1.6-3-4.8-1.4-7.2 1.2-1.8 3.3-2.6 5.4-2.2v2.7c-.3-.1-.7-.2-1-.2-1.6 0-2.7 1.5-2.2 3 .4 1.4 2.1 2.2 3.4 1.4.8-.4 1.2-1.3 1.2-2.2V3h2.8z" />
        </svg>
      );
    case "youtube":
      return (
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
        </svg>
      );
  }
}
