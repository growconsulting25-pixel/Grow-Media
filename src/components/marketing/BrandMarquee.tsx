import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Brokerages our agents work with and the platforms their videos are posted to.
 * Plain text wordmarks — no third-party logos, and no claim of partnership.
 */
const names = [
  "RE/MAX",
  "Via Capitale",
  "Royal LePage",
  "Sutton",
  "Engel & Völkers",
  "Keller Williams",
  "eXp Realty",
  "Proprio Direct",
  "Centris",
  "REALTOR.ca",
  "DuProprio",
];

export function BrandMarquee({ dict }: { dict: Dictionary }) {
  return (
    <section aria-label={dict.trust.label} className="border-y border-white/5 bg-ink-950 py-10">
      <p className="mx-auto max-w-3xl px-4 text-center text-sm text-fg-muted">{dict.trust.label}</p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {[...names, ...names].map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= names.length || undefined}
              className="px-7 text-xl font-semibold tracking-tight whitespace-nowrap text-fg-subtle transition-colors hover:text-fg sm:px-10 sm:text-2xl motion-reduce:[&:nth-child(n+12)]:hidden"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
