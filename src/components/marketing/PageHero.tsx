import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary, HeadlineLine } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";

/** Top of an inner page: breadcrumb, the page's only H1 and a direct answer-style intro. */
export function PageHero({
  dict,
  locale,
  eyebrow,
  lines,
  intro,
  crumb,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  eyebrow: string;
  lines: HeadlineLine[];
  intro: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_16%,transparent),transparent)]" />
      <Container className="flex flex-col items-center text-center">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-subtle">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={href("home", locale)} className="transition-colors hover:text-fg">{dict.pages.breadcrumbHome}</Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg-muted">{crumb}</li>
          </ol>
        </nav>
        <Reveal className="flex flex-col items-center gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline as="h1" id="page-title" lines={lines} className="mx-auto max-w-4xl text-[2.6rem] sm:text-6xl lg:text-[4.25rem]" />
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{intro}</p>
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
