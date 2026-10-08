import Link from "next/link";
import { plans } from "@/config/pricing";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

/** Shown after a free video is delivered: "Loved your video? Let's do this for every listing." */
export function Upsell({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.app.upsell;
  return (
    <section aria-labelledby="upsell-title" className="edge-glow relative overflow-hidden rounded-[var(--radius-panel)] bg-navy-800 p-6 shadow-[inset_0_0_0_1px_rgba(245,166,35,0.35)] sm:p-8">
      <h2 id="upsell-title" className="display text-2xl sm:text-3xl">{t.title}</h2>
      <p className="mt-1 text-fg-muted">{t.subtitle}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {plans.map((p) => (
          <li key={p.id} className={cn("rounded-2xl p-4", p.highlighted ? "bg-brand-500/15 shadow-[inset_0_0_0_1px_rgba(245,166,35,0.5)]" : "bg-white/[0.04]")}>
            <p className="text-sm text-fg-muted">{t[p.id]}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatPrice(p.price, locale)} <span className="text-sm font-normal text-fg-muted">{p.interval === "month" ? t.perMonth : t.perVideo}</span>
            </p>
            {p.interval === "month" && <p className="mt-1 text-xs text-brand-300">{interpolate(t.videos, { count: p.videosIncluded })}</p>}
          </li>
        ))}
      </ul>
      <Link href={href("appSubscription", locale)} className="btn-primary mt-6 inline-flex h-11 items-center rounded-full px-6 font-medium">{t.cta}</Link>
    </section>
  );
}
