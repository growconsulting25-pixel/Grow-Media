import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import type { PropertyImageKey } from "@/config/media";
import type { Locale } from "@/i18n/config";
import type { Dictionary, HeadlineLine } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";

/**
 * Top of an inner page: a photo banner with the breadcrumb, the page's only
 * H1 and a direct, answer-style intro.
 */
export function PageHero({
  dict,
  locale,
  eyebrow,
  lines,
  intro,
  crumb,
  image,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  eyebrow: string;
  lines: HeadlineLine[];
  intro: string;
  crumb: string;
  image: PropertyImageKey;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden">
      <Photo name={image} width={1920} sizes="100vw" priority decorative className="absolute inset-0 -z-20" imgClassName="size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,41,45,0.94)_0%,rgba(22,41,45,0.78)_50%,rgba(22,41,45,0.4)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink-900 to-transparent" />
      <Container className="flex min-h-[30rem] flex-col justify-end pt-32 pb-16 sm:min-h-[34rem] sm:pt-36 sm:pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-subtle">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={href("home", locale)} className="transition-colors hover:text-fg">{dict.pages.breadcrumbHome}</Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg-muted">{crumb}</li>
          </ol>
        </nav>
        <Reveal className="flex max-w-3xl flex-col items-start gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline as="h1" id="page-title" lines={lines} className="text-[2.5rem] sm:text-6xl lg:text-[4rem]" />
          <p className="max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{intro}</p>
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
