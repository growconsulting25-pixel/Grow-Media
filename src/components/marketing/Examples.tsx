import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { exampleVideos } from "@/config/media";
import type { Dictionary } from "@/i18n/dictionaries";
import { sectionIds } from "@/config/navigation";

/** Real produced videos. Players are facades — nothing loads until play. */
export function Examples({ dict }: { dict: Dictionary }) {
  const t = dict.examples;
  return (
    <section id={sectionIds.examples} aria-labelledby="examples-title" className="relative pb-24 sm:pb-32">
      <Container>
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="examples-title" />
        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {exampleVideos.map((video, i) => (
            <Reveal key={video.id} delay={i * 100} className={`surface hover-glow overflow-hidden rounded-[var(--radius-panel)] p-2.5 ${i === 0 ? "edge-glow sm:col-span-2 lg:col-span-1" : ""}`}>
              <VideoPlayer video={video} title={t.items[video.key].title} location="examples" className="rounded-[1.25rem]" />
              <Caption title={t.items[video.key].title} meta={t.items[video.key].meta} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Caption({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2.5 pt-3.5 pb-2">
      <h3 className="text-[0.95rem] font-medium tracking-tight">{title}</h3>
      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.7rem] text-fg-muted">{meta}</span>
    </div>
  );
}
