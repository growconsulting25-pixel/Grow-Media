"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSignup } from "@/components/onboarding/SignupProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sparkles } from "@/components/ui/Sparkles";
import { sectionIds } from "@/config/navigation";
import { addOns, launchOffer, plans, type Plan } from "@/config/pricing";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";

/** `flush`: sits right under a page hero, so less space on top. */
export function Pricing({ flush = false }: { flush?: boolean }) {
  const { dict, locale } = useI18n();
  const t = dict.pricing;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("pricing_view");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id={sectionIds.pricing} aria-labelledby="pricing-title" className={cn("relative overflow-hidden", flush ? "pt-8 pb-24 sm:pt-10 sm:pb-32" : "py-24 sm:py-32")}>
      <Container className="relative">
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="pricing-title" />

        {launchOffer.active && (
          <Reveal className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[1.5rem] bg-brand-500/40 p-px">
            <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[calc(1.5rem-1px)] bg-navy-800 px-6 py-6 text-center sm:flex-row sm:text-left">
              <Sparkles density={6} />
              <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl btn-primary">
                <Icon name="sparkle" className="size-5" fill="currentColor" />
              </span>
              <div className="relative flex-1">
                <p className="text-xs font-semibold tracking-wide text-brand-300 uppercase">{t.offer.badge}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{t.offer.title}</p>
                <p className="mt-0.5 text-sm text-fg-muted">{t.offer.note}</p>
              </div>
              <FreeVideoButton source="pricing_offer" className="relative" />
            </div>
          </Reveal>
        )}

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} delay={i * 90} />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-fg-subtle">{t.billedMonthly} · {t.limitsNote}</p>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <p className="mb-3 text-center text-sm font-medium text-fg-muted">{t.addOnsTitle}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {addOns.map((a) => (
              <li key={a.id} className="surface flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <span className="grid size-8 place-items-center rounded-lg bg-brand-500/12 text-brand-300">
                    <Icon name={a.id === "walkthrough" ? "cube" : "megaphone"} className="size-4" />
                  </span>
                  {t.addOns[a.id].name}
                </span>
                {a.price !== null ? (
                  <span className="font-semibold">{interpolate(t.addOns[a.id].price, { price: formatPrice(a.price, locale) })}</span>
                ) : (
                  <Link href={`${href("contact", locale)}?topic=ads`} className="text-sm font-medium text-brand-300 underline-offset-4 hover:underline">
                    {t.addOns[a.id].price}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

function PricingCard({ plan, delay }: { plan: Plan; delay: number }) {
  const { dict, locale } = useI18n();
  const { openSignup } = useSignup();
  const t = dict.pricing;
  const copy = t.plans[plan.id];
  const featured = !!plan.highlighted;

  return (
    <Reveal
      delay={delay}
      className={cn(
        "relative flex flex-col rounded-[var(--radius-panel)] p-7 sm:p-8",
        featured
          ? "edge-glow bg-navy-800 shadow-[inset_0_0_0_1px_rgba(245,166,35,0.5),0_30px_60px_-30px_rgba(0,0,0,0.8)] lg:-my-3 lg:py-11"
          : "surface",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{copy.name}</h3>
        {featured && <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[0.7rem] font-semibold text-on-brand">{t.mostPopular}</span>}
      </div>
      <p className="mt-1.5 text-sm text-fg-muted">{copy.tagline}</p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-[2.75rem] leading-none font-semibold tracking-tight">{formatPrice(plan.price, locale)}</span>
        <span className="text-sm text-fg-muted">{plan.interval === "month" ? dict.common.perMonth : dict.common.perVideo}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-brand-300">
        {plan.interval === "month" ? interpolate(t.videosPerMonth, { count: plan.videosIncluded }) : t.oneVideo}
      </p>

      <Button
        variant={featured ? "primary" : "secondary"}
        arrow
        className="mt-7 w-full"
        onClick={() => {
          track("plan_selected", { plan: plan.id, price: plan.price });
          openSignup(`plan_${plan.id}`);
        }}
      >
        {copy.cta}
      </Button>

      <ul className="mt-7 space-y-3 border-t border-white/[0.07] pt-6">
        {copy.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <Icon name="check" className={cn("mt-0.5 size-4 shrink-0", featured ? "text-brand-300" : "text-fg-subtle")} />
            {f}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
