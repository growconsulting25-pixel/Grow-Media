"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { exampleVideos, type PropertyImageKey } from "@/config/media";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { ReelScreen } from "./visuals/ReelScreen";

type FormatId = "reel" | "cinematic" | "ugc" | "facebookAd" | "story" | "teaser" | "walkthrough" | "shortAd";

const formats: { id: FormatId; icon: IconName }[] = [
  { id: "reel", icon: "phone" },
  { id: "cinematic", icon: "play" },
  { id: "ugc", icon: "user" },
  { id: "facebookAd", icon: "megaphone" },
  { id: "story", icon: "layers" },
  { id: "teaser", icon: "sparkle" },
  { id: "walkthrough", icon: "cube" },
  { id: "shortAd", icon: "clock" },
];

const cinematicVideo = exampleVideos[1] ?? exampleVideos[0];

export function ContentEngine() {
  const { dict } = useI18n();
  const t = dict.content;
  const [active, setActive] = useState<FormatId>("reel");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (index + keys[e.key] + formats.length) % formats.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = formats.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(formats[next].id);
    tabs.current[next]?.focus();
  };

  const tab = (f: (typeof formats)[number], i: number, side: "left" | "right") => {
    const selected = f.id === active;
    return (
      <button
        key={f.id}
        ref={(el) => { tabs.current[i] = el; }}
        id={`tab-${f.id}`}
        role="tab"
        type="button"
        aria-selected={selected}
        aria-controls="content-panel"
        tabIndex={selected ? 0 : -1}
        onClick={() => setActive(f.id)}
        onKeyDown={(e) => onKeyDown(e, i)}
        className={cn(
          "group relative flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-300 lg:w-60",
          side === "right" && "lg:flex-row-reverse lg:text-right",
          selected
            ? "bg-brand-500/12 text-fg shadow-[inset_0_0_0_1px_rgba(0,171,255,0.5)]"
            : "bg-white/[0.025] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-white/[0.05] hover:text-fg",
        )}
      >
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl transition-colors", selected ? "btn-primary" : "bg-white/[0.05]")}>
          <Icon name={f.icon} className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium whitespace-nowrap">{t.formats[f.id].label}</span>
          <span className="block font-mono text-[0.68rem] text-fg-subtle">{t.formats[f.id].format}</span>
        </span>
        {/* connector toward the stage (desktop) */}
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 hidden h-px w-10 transition-opacity lg:block",
            side === "left" ? "left-full" : "right-full",
            selected ? "bg-brand-500 text-on-brand" : "bg-white/10",
          )}
        />
      </button>
    );
  };

  return (
    <section aria-labelledby="content-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
      <Container className="relative">
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="content-title" />

        <Reveal className="relative mt-12 sm:mt-16">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <div role="tablist" aria-label={t.tablistLabel} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:contents">
              <div className="flex gap-2 lg:flex-col lg:items-end lg:gap-3">
                {formats.slice(0, 4).map((f, i) => tab(f, i, "left"))}
              </div>
              <div className="flex gap-2 lg:order-last lg:flex-col lg:items-start lg:gap-3">
                {formats.slice(4).map((f, i) => tab(f, i + 4, "right"))}
              </div>
            </div>

            <div
              id="content-panel"
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              className="order-first flex flex-col items-center lg:order-none"
            >
              <div className="flex h-[27rem] w-full items-center justify-center sm:h-[30rem] lg:w-[25rem] xl:w-[28rem]">
                <div key={active} className="flex size-full animate-[stage-in_0.6s_var(--ease-out-expo)] items-center justify-center">
                  <Stage id={active} />
                </div>
              </div>
              <p aria-live="polite" className="mt-5 max-w-sm text-center text-sm leading-relaxed text-fg-muted">
                {t.formats[active].description}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
      <style>{`@keyframes stage-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}

function Stage({ id }: { id: FormatId }) {
  const { dict } = useI18n();
  const f = dict.content.formats[id];
  const reel = dict.hero.visual.reel;

  const phone = (images: PropertyImageKey[], extra?: React.ReactNode, content?: Parameters<typeof ReelScreen>[0]["content"]) => (
    <div className="relative h-full max-h-[27rem] sm:max-h-[30rem]">
      <PhoneMockup className="h-full">
        <ReelScreen images={images} sizes="240px" content={content ?? { badge: f.overlay, price: reel.price, caption: reel.caption, agent: reel.agent, audio: reel.audio }} />
        {extra}
      </PhoneMockup>
    </div>
  );

  switch (id) {
    case "reel":
      return phone(["exterior", "living", "kitchen", "bedroom"]);
    case "story":
      return phone(["kitchen", "dining", "living"], null, { badge: f.overlay, caption: reel.handle, cta: reel.cta });
    case "shortAd":
      return phone(["pool", "facade"], null, { badge: f.overlay, price: reel.price, cta: reel.cta });
    case "ugc":
      return phone(
        ["agentWoman", "living", "kitchen"],
        <div className="absolute inset-x-3 top-[46%] z-10">
          <span className="inline-block rounded-2xl rounded-bl-sm bg-white/90 px-3 py-2 text-[0.72rem] font-medium text-ink-900 shadow-lg">{f.overlay}</span>
        </div>,
        { caption: reel.caption, agent: reel.agent, audio: reel.audio },
      );
    case "cinematic":
      return (
        <div className="w-full overflow-hidden rounded-2xl bg-black p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          <VideoPlayer video={cinematicVideo} title={f.label} location="content_engine" className="rounded-xl" />
          <p className="px-2 pt-2.5 pb-1 text-xs text-fg-muted">{f.overlay}</p>
        </div>
      );
    case "walkthrough":
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          <Photo name="living" width={640} sizes="(min-width: 1024px) 448px, 92vw" decorative className="size-full" imgClassName="animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {[["28%", "44%"], ["62%", "58%"], ["76%", "32%"]].map(([x, y], i) => (
            <span key={i} className="absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 backdrop-blur" style={{ left: x, top: y }}>
              <span className="size-2.5 animate-pulse-soft rounded-full bg-white" />
            </span>
          ))}
          <div className="absolute top-3 right-3 rounded-lg bg-black/55 p-1.5 backdrop-blur">
            <svg viewBox="0 0 60 44" className="h-11 w-15 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="1" width="58" height="42" rx="2" />
              <path d="M24 1v18H1M24 19h12v24M36 27h23" />
              <circle cx="14" cy="30" r="2.5" fill="#66ccff" stroke="none" />
            </svg>
          </div>
          <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-900">
            <Icon name="cube" className="size-3.5" /> {f.overlay}
          </p>
        </div>
      );
    case "facebookAd":
      return (
        <div className="w-[82%] max-w-[20rem] overflow-hidden rounded-2xl bg-white text-ink-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Photo name="agentMan" width={80} sizes="28px" decorative className="size-7 rounded-full" />
            <div className="text-[0.68rem] leading-tight">
              <p className="font-semibold">{reel.agent}</p>
              <p className="text-muted-on-paper">{dict.content.sponsored}</p>
            </div>
          </div>
          <div className="relative aspect-[4/5]">
            <Photo name="exterior" width={400} sizes="320px" decorative className="size-full" imgClassName="animate-kenburns" />
            <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur">{f.overlay}</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-paper px-3 py-2.5">
            <p className="truncate text-[0.72rem] font-semibold">{reel.price} · {reel.caption}</p>
            <span className="shrink-0 rounded-md bg-paper-3 px-2 py-1 text-[0.65rem] font-semibold">{reel.cta}</span>
          </div>
        </div>
      );
    case "teaser":
      return (
        <div className="relative aspect-square w-[88%] max-w-[22rem] overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          <Photo name="pool" width={480} sizes="352px" decorative className="size-full" imgClassName="scale-110 blur-[3px] animate-kenburns" />
          <div className="absolute inset-0 grid place-items-center bg-black/35 text-center">
            <div>
              <p className="text-[0.7rem] font-medium tracking-[0.3em] text-white/80 uppercase">{reel.handle}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{f.overlay}</p>
              <p className="mx-auto mt-3 h-px w-12 bg-brand-300" />
            </div>
          </div>
        </div>
      );
  }
}
