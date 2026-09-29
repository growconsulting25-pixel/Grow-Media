import fs from "node:fs";
import path from "node:path";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Brokerages and platforms we work with. Drop a logo in public/brands/<slug>.svg
 * (or .png / .webp) and it replaces the text name automatically. Logos are shown
 * in white so every brand sits evenly on the dark band.
 */
const brands = [
  { slug: "remax", name: "RE/MAX" },
  { slug: "via-capitale", name: "Via Capitale" },
  { slug: "royal-lepage", name: "Royal LePage" },
  { slug: "sutton", name: "Sutton" },
  { slug: "engel-volkers", name: "Engel & Völkers" },
  { slug: "keller-williams", name: "Keller Williams" },
  { slug: "exp-realty", name: "eXp Realty" },
  { slug: "proprio-direct", name: "Proprio Direct" },
  { slug: "centris", name: "Centris" },
  { slug: "realtor", name: "REALTOR.ca" },
  { slug: "duproprio", name: "DuProprio" },
];

const brandsDir = path.join(process.cwd(), "public", "brands");

function logoFor(slug: string) {
  for (const ext of ["svg", "png", "webp"]) {
    if (fs.existsSync(path.join(brandsDir, `${slug}.${ext}`))) return `/brands/${slug}.${ext}`;
  }
  return null;
}

export function BrandMarquee({ dict }: { dict: Dictionary }) {
  const items = brands.map((b) => ({ ...b, logo: logoFor(b.slug) }));
  return (
    <section aria-label={dict.trust.label} className="border-y border-white/5 bg-ink-950 py-10">
      <p className="mx-auto max-w-3xl px-4 text-center text-sm text-fg-muted">{dict.trust.label}</p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {[...items, ...items].map((b, i) => (
            <li
              key={i}
              aria-hidden={i >= items.length || undefined}
              className="flex h-10 items-center px-7 whitespace-nowrap text-fg-subtle opacity-70 transition-opacity hover:opacity-100 sm:px-10 motion-reduce:[&:nth-child(n+12)]:hidden"
            >
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo} alt={b.name} loading="lazy" className="h-8 w-auto max-w-44 object-contain brightness-0 invert sm:h-10" />
              ) : (
                <span className="text-xl font-semibold tracking-tight sm:text-2xl">{b.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
