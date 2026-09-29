"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { Photo } from "@/components/ui/Photo";
import type { PropertyImageKey } from "@/config/media";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { ReelScreen } from "./ReelScreen";

const inputs: { name: PropertyImageKey; className: string; rotate: number; delay: number }[] = [
  { name: "exterior", className: "left-[2%] top-[6%] w-[46%]", rotate: -5, delay: 0 },
  { name: "kitchen", className: "left-[44%] top-[0%] w-[42%]", rotate: 4, delay: 0.8 },
  { name: "living", className: "left-[8%] top-[48%] w-[42%]", rotate: 3, delay: 1.6 },
  { name: "agentWoman", className: "left-[48%] top-[44%] w-[40%]", rotate: -3, delay: 2.4 },
];

const reelShots: PropertyImageKey[] = ["exterior", "kitchen", "living", "pool", "bedroom"];

/**
 * Photos → production → phone. The whole product story in one composition.
 */
export function HeroVisual() {
  const { dict } = useI18n();
  const v = dict.hero.visual;
  // Labels overlap the phone edge so they never collide with the production core.
  const tagPositions = [
    "right-[calc(100%-1.75rem)] top-[16%]",
    "left-[calc(100%-1.75rem)] top-[26%]",
    "right-[calc(100%-1.75rem)] top-[70%]",
    "left-[calc(100%-1.75rem)] top-[54%]",
    "left-[calc(100%-1.75rem)] top-[80%]",
  ];

  return (
    <div role="img" aria-label={v.label} className="relative mx-auto w-full max-w-[64rem]">
      <div className="relative grid grid-cols-1 items-center md:grid-cols-[1fr_auto_1fr] md:gap-2">
        {/* 1 — Listing photos */}
        <div className="relative hidden aspect-[1.05] md:block">
          <p className="absolute -top-2 left-[4%] flex items-center gap-2 text-xs font-medium text-fg-subtle">
            <Icon name="image" className="size-3.5" /> {v.inputLabel}
            <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.65rem] text-fg-muted">14</span>
          </p>
          {inputs.map((p) => (
            <div
              key={p.name}
              className={cn("absolute animate-drift", p.className)}
              style={{ "--drift-rotate": `${p.rotate}deg`, "--drift-x": "8px", animationDelay: `${p.delay}s` } as CSSProperties}
            >
              <div className="relative rounded-xl bg-white/[0.06] p-1 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.08)]" style={{ transform: `rotate(${p.rotate}deg)` }}>
                <Photo name={p.name} width={320} sizes="(min-width: 768px) 14vw, 0px" priority={p.name === "exterior"} decorative className={cn("rounded-[0.6rem]", p.name === "agentWoman" ? "aspect-[4/5]" : "aspect-[4/3]")} />
                {p.name === "agentWoman" && (
                  <span className="absolute bottom-2 left-2 rounded-md bg-ink-900/80 px-1.5 py-0.5 text-[0.62rem] font-medium text-fg">{dict.how.steps.upload.items[1]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 2 — Production core (desktop) */}
        <div aria-hidden className="relative hidden h-full w-40 items-center justify-center md:flex lg:w-52">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-brand-500/40" />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden">
            <span className="absolute h-px w-16 animate-[beam_2.6s_linear_infinite] bg-white/80" />
          </div>
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative grid size-20 place-items-center rounded-full bg-ink-800 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_60px_-10px_rgba(0,171,255,0.7)]">
              <svg viewBox="0 0 80 80" className="absolute inset-0 size-full animate-[spin_6s_linear_infinite]">
                <circle cx="40" cy="40" r="37" fill="none" stroke="url(#arc)" strokeWidth="1.5" strokeDasharray="60 180" strokeLinecap="round" />
                <defs>
                  <linearGradient id="arc" x1="0" x2="1">
                    <stop offset="0" stopColor="#66ccff" stopOpacity="0" />
                    <stop offset="1" stopColor="#66ccff" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="btn-primary grid size-12 place-items-center rounded-full">
                <Icon name="sparkle" className="size-5" fill="currentColor" />
              </span>
            </div>
            <p className="text-[0.7rem] font-medium tracking-wide text-brand-300 uppercase">{v.processing}</p>
            <div className="h-1 w-20 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full w-full origin-left animate-progress rounded-full bg-brand-500 text-on-brand" />
            </div>
          </div>
        </div>

        {/* 3 — Phone output */}
        <div className="relative flex justify-center md:justify-start">
          {/* mobile-only mini photo strip behind the phone */}
          <div aria-hidden className="absolute inset-x-0 top-[18%] flex justify-between px-0 md:hidden">
            {(["kitchen", "pool"] as const).map((n, i) => (
              <div key={n} className="w-[34%] rounded-lg bg-white/[0.06] p-0.5 opacity-70" style={{ transform: `rotate(${i ? 6 : -6}deg)` }}>
                <Photo name={n} width={240} sizes="34vw" decorative className="aspect-[4/3] rounded-md" />
              </div>
            ))}
          </div>

          <div className="relative w-[min(62vw,15.5rem)] animate-float sm:w-[16.5rem]">
            <PhoneMockup className="relative">
              <ReelScreen
                images={reelShots}
                priority
                sizes="(min-width: 640px) 264px, 62vw"
                content={{
                  badge: dict.content.formats.reel.overlay,
                  price: v.reel.price,
                  caption: v.reel.caption,
                  cta: v.reel.cta,
                  agent: v.reel.agent,
                  audio: v.reel.audio,
                }}
              />
            </PhoneMockup>

            {v.tags.map((tag, i) => (
              <span
                key={tag}
                aria-hidden
                className={cn(
                  "glass absolute hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(0,0,0,0.8)] sm:inline-flex",
                  tagPositions[i],
                                  )}
                style={{ animation: `float 6s ease-in-out ${i * 0.7}s infinite` }}
              >
                <Icon name={["sparkle", "user", "comment", "music", "phone"][i] as "sparkle"} className="size-3.5 text-brand-300" />
                {tag}
              </span>
            ))}

            <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-medium whitespace-nowrap text-success backdrop-blur">
              <Icon name="check" className="size-3.5" /> {v.output}
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes beam { from { left: -4rem } to { left: 100% } }`}</style>
    </div>
  );
}
