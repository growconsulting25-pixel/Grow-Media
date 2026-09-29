import fs from "node:fs";
import path from "node:path";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Brokerages and platforms we work with. A brand appears once its logo is in
 * public/brands/<slug>.png (white on transparent). Logos are sized by area, not
 * height, so wide wordmarks and square marks carry the same visual weight.
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
/** Target logo area in CSS px², and the height/width caps. */
const AREA = 4600;
const MAX_H = 46;
const MAX_W = 170;

/** Reads width/height from a PNG header (bytes 16–23). */
function pngSize(file: string) {
  const buf = fs.readFileSync(file);
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function logos() {
  return brands.flatMap((b) => {
    const file = path.join(brandsDir, `${b.slug}.png`);
    if (!fs.existsSync(file)) return [];
    const { w, h } = pngSize(file);
    const aspect = w / h;
    let height = Math.min(MAX_H, Math.sqrt(AREA / aspect));
    if (height * aspect > MAX_W) height = MAX_W / aspect;
    return [{ ...b, src: `/brands/${b.slug}.png`, width: Math.round(height * aspect), height: Math.round(height) }];
  });
}

export function BrandMarquee({ dict }: { dict: Dictionary }) {
  const items = logos();
  if (!items.length) return null;
  return (
    <section aria-label={dict.trust.label} className="border-y border-white/5 bg-ink-950 py-10">
      <p className="mx-auto max-w-3xl px-4 text-center text-sm text-fg-muted">{dict.trust.label}</p>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:[&>[data-dup]]:hidden">
          {[...items, ...items].map((b, i) => (
            <li
              key={i}
              aria-hidden={i >= items.length || undefined}
              data-dup={i >= items.length || undefined}
              className="flex h-12 shrink-0 items-center px-8 opacity-75 transition-opacity hover:opacity-100 sm:px-11"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.name} width={b.width} height={b.height} loading="lazy" className="block max-w-none" style={{ width: b.width, height: b.height }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
