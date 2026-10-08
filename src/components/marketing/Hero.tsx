import Link from "next/link";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroWalkthrough } from "./HeroWalkthrough";
import { PaperBand } from "./PaperBand";
import { WatchExampleButton } from "./WatchExampleButton";
import { HeroVisual } from "./visuals/HeroVisual";

/**
 * Hero: a pinned, scroll-driven 3D walkthrough (façade → interior → terrace)
 * with the headline and CTAs on top, then the "photos → video" demo below.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.hero;
  const w = dict.walkthrough;
  return (
    <>
      <HeroWalkthrough
        label={w.label}
        hint={w.hint}
        demo={w.demo}
        chapters={w.chapters}
        ctas={{
          3: (
            <Link href={href("services", locale)} className={buttonClasses({ variant: "secondary", size: "md", className: "pointer-events-auto bg-ink-900/40 backdrop-blur-sm" })}>
              {w.midCta}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          ),
          [w.chapters.length - 1]: <FreeVideoButton source="hero_walkthrough" size="lg" className="pointer-events-auto" />,
        }}
      >
        <Container className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink-900/50 py-1.5 pr-3.5 pl-1.5 text-[0.8rem] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-sm">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[0.7rem] font-semibold text-on-brand">{dict.common.new}</span>
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

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] text-fg-muted">
            {dict.common.trustLine.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Icon name="check" className="size-3.5 text-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </HeroWalkthrough>

      <PaperBand className="mt-3 sm:mt-4">
        <section aria-labelledby="visual-title" className="relative py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow={t.visual.eyebrow} lines={t.visual.headline} description={t.visual.description} titleId="visual-title" />
            <div className="mt-14 sm:mt-16">
              <HeroVisual />
            </div>
          </Container>
        </section>
      </PaperBand>
    </>
  );
}
