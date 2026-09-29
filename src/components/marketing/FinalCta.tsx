import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Sparkles } from "@/components/ui/Sparkles";
import type { Dictionary } from "@/i18n/dictionaries";

export function FinalCta({ dict }: { dict: Dictionary }) {
  const t = dict.finalCta;
  return (
    <section aria-labelledby="final-title" className="pb-20 sm:pb-28">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] px-6 py-20 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:rounded-[2.5rem] sm:px-12 sm:py-28">
          <Photo name="pool" width={1400} sizes="(min-width: 1216px) 1152px, 96vw" decorative className="absolute inset-0 -z-20" imgClassName="animate-kenburns" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,18,0.78),rgba(10,10,18,0.9))]" />
          <div aria-hidden className="absolute -bottom-1/3 -left-[10%] -z-10 h-[80%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(115,54,236,0.55),transparent)] blur-2xl" />
          <div aria-hidden className="absolute -top-1/3 -right-[10%] -z-10 h-[80%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(209,125,242,0.35),transparent)] blur-2xl" />
          <Sparkles />
          <Headline id="final-title" lines={t.headline} className="mx-auto max-w-4xl text-[2.3rem] sm:text-5xl lg:text-[4rem]" />
          <p className="mx-auto mt-5 max-w-xl text-base text-fg-muted sm:text-lg">{t.supporting}</p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <FreeVideoButton source="final_cta" size="lg" />
            <p className="text-sm text-fg-subtle">{dict.common.noCard}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
