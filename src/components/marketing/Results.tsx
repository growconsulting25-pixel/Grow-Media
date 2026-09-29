import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { demoResults, testimonials } from "@/data/testimonials";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LightSection } from "./LightSection";
import { TestimonialCard } from "./TestimonialCard";

/**
 * Social proof. Real stories render when they exist; otherwise either
 * clearly-labelled demo cards (only if explicitly enabled) or an honest
 * invitation. Nothing fabricated is ever presented as genuine.
 */
export function Results({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.results;
  const hasReal = testimonials.length > 0;
  const showDemo = !hasReal && siteConfig.showDemoSocialProof;

  return (
    <LightSection labelledBy="results-title" tone="lavender">
      <Container>
        <SectionHeading tone="light" eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="results-title" />

        <div className="mt-14 sm:mt-16">
          {hasReal && (
            <div className="grid gap-4 lg:grid-cols-2">
              {testimonials.map((r, i) => (
                <Reveal key={r.id} delay={i * 100}>
                  <TestimonialCard dict={dict} locale={locale} quote={r.quote[locale]} name={r.name} role={r.role} propertyLabel={r.propertyLabel} propertyImage={r.propertyImage} photos={r.photos} videoSeconds={r.videoSeconds} deliveredHours={r.deliveredHours} metrics={r.metrics} />
                </Reveal>
              ))}
            </div>
          )}

          {showDemo && (
            <>
              <p className="mb-5 flex items-center justify-center gap-2 text-center text-sm text-amber-800">
                <Icon name="eye" className="size-4" /> {t.demoNotice}
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                {demoResults.map((r, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <TestimonialCard dict={dict} locale={locale} demo quote={t.demo[i].quote} name={t.demo[i].name} role={t.demo[i].role} propertyLabel={t.demo[i].property} {...r} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {!hasReal && !showDemo && (
            <Reveal className="mx-auto flex max-w-3xl flex-col items-center rounded-[1.75rem] bg-white px-6 py-12 text-center shadow-[0_0_0_1px_rgba(18,17,25,0.06),0_24px_48px_-32px_rgba(40,20,90,0.3)] sm:px-12">
              <ol className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-on-paper" aria-label={dict.how.eyebrow}>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5"><Icon name="image" className="size-4" /> {dict.how.steps.upload.label}</li>
                <li aria-hidden><Icon name="arrowRight" className="size-4" /></li>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5"><Icon name="sparkle" className="size-4" /> {dict.how.steps.customize.label}</li>
                <li aria-hidden><Icon name="arrowRight" className="size-4" /></li>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-3 py-1.5 text-violet-700"><Icon name="check" className="size-4" /> {dict.how.steps.receive.label}</li>
              </ol>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">{t.empty.title}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-on-paper">{t.empty.description}</p>
              <FreeVideoButton source="results" className="mt-8" />
            </Reveal>
          )}
        </div>
      </Container>
    </LightSection>
  );
}
