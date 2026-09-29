import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/navigation";
import { addOns } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { formatPrice } from "@/lib/format";

export function faqItems(dict: Dictionary, locale: Locale) {
  const walkthrough = addOns.find((a) => a.id === "walkthrough")?.price ?? 0;
  return dict.faq.items.map((item) => ({ q: item.q, a: interpolate(item.a, { walkthroughPrice: formatPrice(walkthrough, locale) }) }));
}

export function Faq({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.faq;
  return (
    <section id={sectionIds.faq} aria-labelledby="faq-title" className="relative py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow={t.eyebrow} lines={t.headline} titleId="faq-title" />
          <Reveal delay={100} className="mt-8">
            <p className="text-sm text-fg-muted">{t.stillQuestions}</p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-1 inline-flex text-sm font-medium text-violet-300 underline-offset-4 hover:underline">
              {t.contact} → {siteConfig.contactEmail}
            </a>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <Accordion items={faqItems(dict, locale)} />
        </Reveal>
      </Container>
    </section>
  );
}
