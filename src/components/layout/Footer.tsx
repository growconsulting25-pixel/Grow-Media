import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { sectionIds } from "@/config/navigation";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const home = href("home", locale);
  const t = dict.footer;
  const columns = [
    {
      title: t.product,
      links: [
        { label: dict.nav.howItWorks, href: `${home}#${sectionIds.howItWorks}` },
        { label: dict.nav.examples, href: `${home}#${sectionIds.examples}` },
        { label: dict.nav.services, href: href("services", locale) },
        { label: dict.nav.pricing, href: href("pricing", locale) },
        { label: dict.nav.faq, href: href("services", locale, sectionIds.faq) },
      ],
    },
    {
      title: t.company,
      links: [
        { label: t.about, href: `${home}#${sectionIds.howItWorks}` },
        { label: t.contact, href: href("contact", locale) },
      ],
    },
    {
      title: t.account,
      links: [
        { label: dict.nav.login, href: href("login", locale) },
        { label: t.createAccount, href: href("signup", locale) },
      ],
    },
    {
      title: t.legal,
      links: [
        { label: t.privacy, href: href("privacy", locale) },
        { label: t.terms, href: href("terms", locale) },
        { label: t.cookies, href: href("cookies", locale) },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-ink-950 pt-14 pb-8">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-xs">
            <Logo href={home} />
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">{t.tagline}</p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-3 inline-block text-sm text-fg-muted transition-colors hover:text-fg">
              {siteConfig.contactEmail}
            </a>
            <ul aria-label={t.social} className="mt-5 flex gap-2">
              {siteConfig.social.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.id} className="grid size-9 place-items-center rounded-full bg-white/[0.04] text-fg-muted transition-colors hover:bg-white/[0.08] hover:text-fg">
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-fg-subtle">{interpolate(t.rights, { year: new Date().getFullYear(), brand: siteConfig.name })}</p>
          <LanguageSwitcher />
        </div>
      </Container>
    </footer>
  );
}
