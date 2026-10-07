import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { sectionIds } from "@/config/navigation";
import { exampleVideos } from "@/config/media";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Real produced videos as large editorial cards: full-bleed poster, title and
 * line of copy over a soft gradient. Players are facades; nothing loads until play.
 */
export function Examples({ dict }: { dict: Dictionary }) {
  const t = dict.examples;
  return (
    <section id={sectionIds.examples} aria-labelledby="examples-title" className="relative py-24 sm:py-32">
      <Container className="max-w-[86rem]">
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="examples-title" />
        <div className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-3 lg:gap-6">
          {exampleVideos.map((video, i) => {
            const item = t.items[video.key];
            return (
              <Reveal key={video.id} delay={i * 100} className="overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                <VideoPlayer
                  video={video}
                  title={item.title}
                  location="examples"
                  aspectClass="aspect-[4/5]"
                  className="rounded-[1.75rem]"
                  overlay={
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent px-6 pt-24 pb-6 text-left sm:px-7 sm:pb-7">
                      <span className="block text-[0.7rem] font-semibold tracking-wide text-brand-300 uppercase">{item.meta}</span>
                      <span className="display mt-1.5 block text-[2rem] leading-none text-fg">{item.title}</span>
                      <span className="mt-2.5 block text-[0.95rem] leading-relaxed text-fg-muted">{item.description}</span>
                    </span>
                  }
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
