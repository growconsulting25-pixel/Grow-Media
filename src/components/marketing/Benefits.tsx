import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { PropertyImageKey } from "@/config/media";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { cn } from "@/lib/cn";
import { LightSection } from "./LightSection";

type Key = keyof Dictionary["benefits"]["items"];

export function Benefits({ dict }: { dict: Dictionary }) {
  const t = dict.benefits;
  const i = t.items;

  return (
    <LightSection labelledBy="benefits-title">
      <Container>
        <SectionHeading tone="light" eyebrow={t.eyebrow} lines={t.headline} titleId="benefits-title" />

        <div className="mt-14 grid grid-cols-1 auto-rows-[minmax(13rem,auto)] gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {/* MORE CONTENT — hero tile */}
          <Tile k="more" icon="layers" dict={dict} className="sm:col-span-2 lg:row-span-2" delay={0}>
            <MoreContentVisual labels={[dict.content.formats.reel.label, dict.content.formats.story.label, dict.content.formats.facebookAd.label, dict.content.formats.teaser.label]} />
          </Tile>

          <Tile k="fast" icon="clock" dict={dict} className="sm:col-span-2" delay={60}>
            <div className="mt-auto flex items-center gap-2 pt-6">
              {i.fast.timeline.map((step, idx) => (
                <div key={step} className="flex flex-1 items-center gap-2">
                  <div className="flex-1">
                    <div className={cn("h-1.5 rounded-full", idx < 2 ? "bg-brand-600 text-on-brand" : "bg-paper-3")} />
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-on-paper">
                      {idx === 2 && <Icon name="check" className="size-3 text-emerald-600" />}
                      {step}
                    </p>
                  </div>
                </div>
              ))}
              <span className="ml-1 rounded-full bg-ink-on-paper px-2.5 py-1 font-mono text-xs text-white">~24h</span>
            </div>
          </Tile>

          <Tile k="ready" icon="check" dict={dict} delay={120}>
            <div className="mt-auto space-y-1.5 pt-5" aria-hidden>
              <div className="h-2 w-[85%] rounded-full bg-paper-3" />
              <div className="h-2 w-[60%] rounded-full bg-paper-3" />
              <p className="pt-1 text-xs font-medium text-brand-700">#justlisted #realestate</p>
            </div>
          </Tile>

          <Tile k="cost" icon="coins" dict={dict} delay={180}>
            <div className="mt-auto flex items-end gap-2 pt-5" aria-hidden>
              <div className="h-16 w-7 rounded-md bg-paper-3" />
              <div className="h-5 w-7 rounded-md bg-brand-600 text-on-brand" />
            </div>
          </Tile>

          <Tile k="consistent" icon="calendar" dict={dict} className="sm:col-span-2" delay={0}>
            <div className="mt-auto grid grid-cols-7 gap-1.5 pt-6" aria-hidden>
              {i.consistent.days.map((d, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-[0.68rem] text-muted-on-paper">{d}</p>
                  <div className={cn("mt-1.5 aspect-[3/4] rounded-md", [0, 2, 4, 5].includes(idx) ? "bg-brand-600 text-on-brand" : "bg-paper-3")} />
                </div>
              ))}
            </div>
          </Tile>

          <Tile k="brand" icon="palette" dict={dict} delay={60}>
            <div className="mt-auto flex items-center gap-2 pt-5" aria-hidden>
              <Photo name="agentMan" width={96} sizes="36px" decorative className="size-9 rounded-full ring-2 ring-white" />
              {["#0b1622", "#00abff", "#dce4ec"].map((c) => (
                <span key={c} className="size-7 rounded-full ring-2 ring-white" style={{ background: c }} />
              ))}
              <span className="ml-auto rounded-md bg-ink-on-paper px-2 py-1 text-[0.62rem] font-bold tracking-wide text-white">LOGO</span>
            </div>
          </Tile>

          <Tile k="social" icon="phone" dict={dict} delay={120}>
            <div className="mt-auto flex items-end gap-2 pt-5" aria-hidden>
              {[["9:16", "h-12 w-7"], ["4:5", "h-10 w-8"], ["1:1", "size-8"], ["16:9", "h-6 w-10"]].map(([r, size]) => (
                <div key={r} className="text-center">
                  <div className={cn("rounded border border-brand-600/40 bg-brand-600/10", size)} />
                  <p className="mt-1 font-mono text-[0.6rem] text-muted-on-paper">{r}</p>
                </div>
              ))}
              <div className="ml-auto flex gap-1.5 text-muted-on-paper">
                <SocialIcon id="instagram" className="size-3.5" />
                <SocialIcon id="tiktok" className="size-3.5" />
              </div>
            </div>
          </Tile>

          <Tile k="scale" icon="scale" dict={dict} className="sm:col-span-2 lg:col-span-4 lg:auto-rows-auto" horizontal delay={0}>
            <ScaleVisual label={interpolate(i.scale.listings, { count: 12 })} />
          </Tile>
        </div>
      </Container>
    </LightSection>
  );
}

function Tile({ k, icon, dict, className, children, delay, horizontal }: { k: Key; icon: IconName; dict: Dictionary; className?: string; children?: React.ReactNode; delay: number; horizontal?: boolean }) {
  const item = dict.benefits.items[k];
  return (
    <Reveal
      delay={delay}
      className={cn(
        "flex min-w-0 rounded-[1.5rem] bg-white p-6 shadow-[0_1px_0_rgba(11,22,34,0.04),0_0_0_1px_rgba(11,22,34,0.06),0_24px_48px_-32px_rgba(11,34,57,0.25)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(0,171,255,0.25),0_30px_60px_-30px_rgba(0,171,255,0.35)]",
        horizontal ? "flex-col gap-6 lg:flex-row lg:items-center" : "flex-col",
        className,
      )}
    >
      <div className={cn(horizontal && "lg:w-80 lg:shrink-0")}>
        <span className="grid size-10 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
          <Icon name={icon} className="size-5" />
        </span>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-on-paper">{item.description}</p>
      </div>
      {children}
    </Reveal>
  );
}

function MoreContentVisual({ labels }: { labels: string[] }) {
  const tiles: { name: PropertyImageKey; cls: string }[] = [
    { name: "exterior", cls: "aspect-[9/16] w-[26%]" },
    { name: "kitchen", cls: "aspect-[9/16] w-[26%] translate-y-4" },
    { name: "living", cls: "aspect-[4/5] w-[28%]" },
    { name: "frontYard", cls: "aspect-square w-[24%] translate-y-6" },
  ];
  return (
    <div className="relative mt-auto pt-8">
      <div className="flex items-start justify-center gap-2.5">
        {tiles.map((tile, i) => (
          <figure key={tile.name} className={cn("relative overflow-hidden rounded-xl shadow-[0_20px_40px_-20px_rgba(11,22,34,0.5)]", tile.cls)}>
            <Photo name={tile.name} width={240} sizes="(min-width: 1024px) 140px, 25vw" decorative className="size-full" />
            <figcaption className="absolute inset-x-1.5 bottom-1.5 truncate rounded-md bg-black/55 px-1.5 py-0.5 text-[0.6rem] font-medium text-white backdrop-blur">
              {labels[i]}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ScaleVisual({ label }: { label: string }) {
  const names: PropertyImageKey[] = ["exterior", "townhouse", "frontYard", "twoStory", "facade", "street"];
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-hidden">
        {names.map((n, i) => (
          <div key={n} className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-paper-2 p-1 lg:flex-1">
            <Photo name={n} width={220} sizes="160px" decorative className="aspect-[4/3] rounded-lg" />
            <span className={cn("absolute top-2 right-2 size-2 rounded-full ring-2 ring-white", i < 4 ? "bg-emerald-500" : "bg-brand-600 text-on-brand")} />
          </div>
        ))}
      </div>
      <span className="hidden shrink-0 rounded-full bg-ink-on-paper px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white sm:inline">{label}</span>
    </div>
  );
}
