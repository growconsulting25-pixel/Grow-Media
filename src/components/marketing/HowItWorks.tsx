import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { sectionIds } from "@/config/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { StyleChips } from "./StyleChips";
import { UploadPreview } from "./visuals/UploadPreview";
import { DeliveryPreview } from "./visuals/DeliveryPreview";

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const t = dict.how;
  const s = t.steps;

  return (
    <section id={sectionIds.howItWorks} aria-labelledby="how-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Container>
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="how-title" />

        <ol className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-3 lg:gap-5">
          <Step number={s.upload.number} label={s.upload.label} title={s.upload.title} description={s.upload.description} delay={0}>
            <UploadPreview
              address={s.upload.address}
              uploaded={interpolate(s.upload.uploaded, { count: 14 })}
              hint={s.upload.dropHint}
              items={s.upload.items}
            />
          </Step>

          <Step number={s.customize.number} label={s.customize.label} title={s.customize.title} description={s.customize.description} delay={120}>
            <div className="flex h-full flex-col gap-4 p-5">
              <StyleChips styles={s.customize.styles} label={s.customize.label} />
              <div>
                <p className="mb-2 text-xs text-fg-subtle">{s.customize.briefLabel}</p>
                <div className="rounded-xl bg-ink-950/60 px-3.5 py-3 text-sm text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                  “{s.customize.briefExample}”
                  <span aria-hidden className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse-soft bg-violet-300" />
                </div>
              </div>
            </div>
          </Step>

          <Step number={s.receive.number} label={s.receive.label} title={s.receive.title} description={s.receive.description} delay={240}>
            <DeliveryPreview checklist={s.receive.checklist} actions={s.receive.actions} />
          </Step>
        </ol>

        <Reveal className="mt-12 flex flex-col items-center gap-5">
          <FreeVideoButton source="how_it_works" size="lg" />
          <div className="flex items-center gap-4 text-fg-subtle" aria-hidden>
            {(["instagram", "facebook", "tiktok", "youtube"] as const).map((id) => (
              <SocialIcon key={id} id={id} className="size-[1.1rem]" />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Step({ number, label, title, description, delay, children }: { number: string; label: string; title: string; description: string; delay: number; children: React.ReactNode }) {
  return (
    <Reveal as="li" delay={delay} className="surface hover-glow flex flex-col overflow-hidden rounded-[var(--radius-panel)]">
      <div className="m-2 min-h-[16.5rem] flex-1 overflow-hidden rounded-[1.2rem] bg-ink-850/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">{children}</div>
      <div className="px-6 pt-4 pb-7">
        <p className="flex items-center gap-2 text-xs font-medium text-violet-300">
          <span className="font-mono">{number}</span>
          <span className="h-px w-5 bg-violet-400/40" />
          {label}
        </p>
        <h3 className="mt-2.5 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
      </div>
    </Reveal>
  );
}
