import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary, HeadlineLine } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { priceVars } from "@/lib/marketing/prices";

type Item = { q: string; a: string };

const fill = (items: Item[], locale: Locale) => {
  const vars = priceVars(locale);
  return items.map((item) => ({ q: item.q, a: interpolate(item.a, vars) }));
};

/** General FAQ (Services page), with prices filled in. */
export function faqItems(dict: Dictionary, locale: Locale) {
  return fill(dict.faq.items, locale);
}

/** Pricing questions (Pricing page). */
export function pricingFaqItems(dict: Dictionary, locale: Locale) {
  return fill(dict.pricing.faq, locale);
}

export function Faq({
  dict,
  locale,
  items = faqItems(dict, locale),
  lines = dict.faq.headline,
  initialCount = 8,
}: {
  dict: Dictionary;
  locale: Locale;
  items?: Item[];
  lines?: HeadlineLine[];
  initialCount?: number;
}) {
  const t = dict.faq;
  return (
    <section id={sectionIds.faq} aria-labelledby="faq-title" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow={t.eyebrow} lines={lines} titleId="faq-title" />
          <Reveal delay={100} className="mt-8">
            <p className="text-sm text-fg-muted">{t.stillQuestions}</p>
            <Link href={href("contact", locale)} className="mt-1 inline-flex text-sm font-medium text-brand-300 underline-offset-4 hover:underline">
              {t.contact} →
            </Link>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <Accordion items={items} initialCount={initialCount} moreLabel={t.showMore} lessLabel={t.showLess} />
        </Reveal>
      </Container>
    </section>
  );
}
