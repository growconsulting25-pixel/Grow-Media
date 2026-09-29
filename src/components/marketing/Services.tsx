import Link from "next/link";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/navigation";
import { services, type ServiceId } from "@/config/services";
import type { PropertyImageKey } from "@/config/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

const visuals: Record<ServiceId, { icon: IconName; image: PropertyImageKey }> = {
  listing: { icon: "play", image: "exterior" },
  walkthrough: { icon: "cube", image: "interior" },
  ugc: { icon: "user", image: "agentWoman" },
  ads: { icon: "megaphone", image: "agentPhone" },
};

export function Services({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.services;
  return (
    <section id={sectionIds.services} aria-labelledby="services-title" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t.eyebrow} lines={t.headline} description={t.description} titleId="services-title" />

        <div className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-2 lg:gap-5">
          {services.map((service, idx) => {
            const item = t.items[service.id];
            const v = visuals[service.id];
            const primary = service.id === "listing";
            return (
              <Reveal
                key={service.id}
                delay={(idx % 2) * 100}
                className={cn("surface hover-glow group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)]", primary && "edge-glow")}
              >
                <div className="relative h-44 overflow-hidden sm:h-52">
                  <Photo name={v.image} width={720} sizes="(min-width: 768px) 45vw, 92vw" decorative className="size-full" imgClassName={cn("transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105", (service.id === "ugc" || service.id === "ads") && "object-[center_22%]")} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/40 to-transparent" />
                  <span className={cn("absolute top-4 left-4 grid size-10 place-items-center rounded-xl", primary ? "btn-primary" : "glass text-brand-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]")}>
                    <Icon name={v.icon} className="size-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-2 sm:p-7 sm:pt-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="text-sm text-fg-muted">
                      {service.startingPrice !== null ? (
                        <>
                          {dict.common.startingAt} <span className="font-semibold text-fg">{formatPrice(service.startingPrice, locale)}</span>
                        </>
                      ) : (
                        t.quote
                      )}
                    </p>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.points.map((p) => (
                      <li key={p} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    {service.cta === "create" ? (
                      <FreeVideoButton source={`service_${service.id}`} label={item.cta} size="md" />
                    ) : (
                      <Link href={service.href} className={buttonClasses({ variant: "secondary", size: "md" })}>
                        {item.cta}
                        <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
