"use client";

import { useEffect, useRef, useState } from "react";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { startingPrice } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { ReelScreen } from "./visuals/ReelScreen";

export function Transformation() {
  const { dict, locale } = useI18n();
  const t = dict.transform;
  const [value, setValue] = useState(38);
  const frame = useRef<number | null>(null);

  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current); }, []);

  /** Smoothly animates the divider to a target position. */
  const animateTo = (target: number) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setValue(target);
    const from = value;
    const start = performance.now();
    const duration = 1100;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(from + (target - from) * eased);
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  const transformed = value >= 99;

  return (
    <section aria-labelledby="transform-title" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="transform-title" />

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-16">
          {/* Before / after frame */}
          <Reveal className="relative mx-auto w-full max-w-[27rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] bg-ink-800 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              {/* AFTER (full) */}
              <div className="absolute inset-0">
                <ReelScreen
                  images={["facade", "dining", "kitchen", "bedroom"]}
                  sizes="(min-width: 1024px) 432px, 92vw"
                  content={{
                    badge: dict.content.formats.reel.overlay,
                    price: t.listing.price,
                    caption: dict.hero.visual.reel.caption,
                    cta: dict.hero.visual.reel.cta,
                    agent: dict.hero.visual.reel.agent,
                    audio: dict.hero.visual.reel.audio,
                  }}
                />
                <span className="absolute top-3 right-3 z-10 rounded-full bg-brand-500 px-2.5 py-1 text-[0.7rem] font-semibold text-on-brand">{t.after}</span>
              </div>

              {/* BEFORE (clipped) */}
              <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} aria-hidden={value < 2}>
                <div className="absolute inset-0 bg-[#f3f2ef]">
                  <Photo name="facade" width={520} sizes="(min-width: 1024px) 432px, 92vw" className="h-[62%] w-full" imgClassName="saturate-[0.85]" />
                  <div className="p-4 text-ink-on-paper">
                    <span className="inline-block rounded bg-emerald-600 px-1.5 py-0.5 text-[0.62rem] font-semibold tracking-wide text-white uppercase">{t.listing.status}</span>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{t.listing.price}</p>
                    <p className="mt-0.5 text-sm text-muted-on-paper">{t.listing.address}</p>
                    <p className="mt-2 text-xs text-muted-on-paper">{t.listing.specs}</p>
                    <div className="mt-3 flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => <span key={i} className="h-8 flex-1 rounded bg-paper-3" />)}
                    </div>
                  </div>
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">{t.before}</span>
              </div>

              {/* Divider handle */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/90 shadow-[0_0_20px_rgba(0,171,255,0.9)]" style={{ left: `${value}%` }}>
                <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-900 shadow-lg">
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7.5 5.5 3 10l4.5 4.5M12.5 5.5 17 10l-4.5 4.5" /></svg>
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(value)}
                onChange={(e) => setValue(Number(e.target.value))}
                aria-label={t.sliderLabel}
                aria-valuetext={`${t.before} ${100 - Math.round(value)}% / ${t.after} ${Math.round(value)}%`}
                className="absolute inset-0 z-30 size-full cursor-ew-resize opacity-0"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 items-center gap-3 text-xs text-fg-subtle sm:flex sm:justify-between">
              <span>{t.beforeCaption}</span>
              <Button size="sm" variant={transformed ? "secondary" : "primary"} className="order-last col-span-2 justify-self-center sm:order-none" onClick={() => animateTo(transformed ? 0 : 100)}>
                <Icon name={transformed ? "revise" : "sparkle"} className="size-3.5" />
                {transformed ? t.resetButton : t.transformButton}
              </Button>
              <span className="text-right">{t.afterCaption}</span>
            </div>
          </Reveal>

          {/* What we add + cost comparison */}
          <Reveal delay={120} className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-medium text-fg-muted">{t.added}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {t.addedItems.map((item, i) => {
                  const on = value >= ((i + 1) / t.addedItems.length) * 96;
                  return (
                    <li
                      key={item}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm transition-all duration-500",
                        on ? "bg-brand-500/12 text-fg shadow-[inset_0_0_0_1px_rgba(0,171,255,0.45)]" : "bg-white/[0.03] text-fg-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                      )}
                    >
                      <span className={cn("grid size-5 place-items-center rounded-full transition-colors duration-500", on ? "bg-brand-500 text-on-brand" : "bg-white/[0.06]")}>
                        <Icon name="check" className="size-3" />
                      </span>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="surface rounded-[var(--radius-card)] p-5 sm:p-6">
              <p className="text-sm font-medium text-fg-muted">{t.compare.title}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.025] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                  <p className="text-xs text-fg-subtle">{t.compare.traditionalLabel}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-fg-muted line-through decoration-white/25 decoration-1">{t.compare.traditionalValue}<sup className="ml-0.5 text-xs">*</sup></p>
                  <p className="mt-2 text-xs leading-relaxed text-fg-subtle">{t.compare.traditionalNote}</p>
                </div>
                <div className="edge-glow rounded-2xl bg-brand-500/[0.08] p-4 shadow-[inset_0_0_0_1px_rgba(0,171,255,0.35)]">
                  <p className="text-xs text-brand-300">{interpolate(t.compare.oursLabel, { brand: siteConfig.name })}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{interpolate(t.compare.oursValue, { price: formatPrice(startingPrice, locale) })}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs leading-relaxed text-fg-muted">
                    <Icon name="clock" className="size-3.5 shrink-0 text-brand-300" /> {t.compare.oursNote}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[0.72rem] leading-relaxed text-fg-subtle">* {t.compare.footnote}</p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <FreeVideoButton source="transform" label={dict.common.tryFree} />
              <p className="text-sm text-fg-subtle">{dict.common.noCard}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
