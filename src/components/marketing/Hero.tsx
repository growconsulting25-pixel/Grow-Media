import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { Icon } from "@/components/ui/Icon";
import { Sparkles } from "@/components/ui/Sparkles";
import type { Dictionary } from "@/i18n/dictionaries";
import { WatchExampleButton } from "./WatchExampleButton";
import { HeroVisual } from "./visuals/HeroVisual";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-8 sm:pt-36 sm:pb-12">
      {/* Atmosphere: a single restrained violet light from the top-left, plus a faint grid */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-[30%] -left-[15%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(143,92,247,0.38),rgba(209,125,242,0.12)_55%,transparent)] blur-2xl" />
        <div className="absolute top-[40%] -right-[20%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(91,34,201,0.22),transparent)] blur-2xl" />
        <div className="grid-lines absolute inset-0 opacity-60" />
        <Sparkles />
      </div>

      <Container className="flex flex-col items-center text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] py-1.5 pr-3.5 pl-1.5 text-[0.8rem] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[0.7rem] font-semibold text-white">{dict.common.new}</span>
          {t.offerPill}
        </p>

        <Headline
          as="h1"
          id="hero-title"
          lines={t.headline}
          className="mt-6 max-w-5xl text-[2.6rem] min-[400px]:text-[2.9rem] sm:text-6xl lg:text-[4.6rem]"
        />

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{t.description}</p>

        <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <FreeVideoButton source="hero" size="lg" className="w-full sm:w-auto" />
          <WatchExampleButton className="w-full sm:w-auto" />
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] text-fg-subtle">
          {dict.common.trustLine.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Icon name="check" className="size-3.5 text-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-16 sm:mt-20">
        <HeroVisual />
      </Container>
    </section>
  );
}
