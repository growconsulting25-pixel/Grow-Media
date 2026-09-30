import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href, type RouteKey } from "@/i18n/routing";
import { priceVars } from "@/lib/marketing/prices";

const cards: { key: "services" | "pricing" | "contact"; route: RouteKey; icon: IconName }[] = [
  { key: "services", route: "services", icon: "layers" },
  { key: "pricing", route: "pricing", icon: "coins" },
  { key: "contact", route: "contact", icon: "comment" },
];

/** Homepage hand-off to the inner pages (internal links for people and crawlers). */
export function HomeTeaser({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.pages.homeTeaser;
  const vars = priceVars(locale);
  return (
    <section aria-labelledby="teaser-title" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} titleId="teaser-title" />
        <ul className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.key} delay={i * 90}>
              <Link
                href={href(c.route, locale)}
                className="surface hover-glow group flex h-full flex-col rounded-[var(--radius-panel)] p-7 transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand-500/12 text-brand-300">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{t[c.key].title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{interpolate(t[c.key].text, vars)}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
                  {t[c.key].cta}
                  <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
