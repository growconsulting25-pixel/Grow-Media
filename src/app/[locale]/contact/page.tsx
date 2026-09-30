import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/marketing/PageHero";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { breadcrumbLd, orgId, webPageLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "contact", dict.meta.pages.contact);
}

/** Contact page: a short form that reaches the team inbox, plus the direct email. */
export default async function ContactPage({ params, searchParams }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.pages.contact;
  const m = dict.meta.pages.contact;
  const topic = (await searchParams).topic;

  const jsonLd = [
    { ...webPageLd("ContactPage", locale, "contact", m.title, m.description), mainEntity: { "@id": orgId } },
    breadcrumbLd(dict, locale, "contact", t.breadcrumb),
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero dict={dict} locale={locale} eyebrow={t.eyebrow} lines={t.headline} intro={t.intro} crumb={t.breadcrumb} />
        <section aria-label={t.eyebrow} className="pb-24 sm:pb-32">
          <Container className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <Reveal className="surface rounded-[var(--radius-panel)] p-6 sm:p-9">
              <ContactForm initialTopic={typeof topic === "string" ? topic : undefined} />
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal delay={80} className="surface rounded-[var(--radius-panel)] p-6 sm:p-8">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-500/12 text-brand-300">
                  <Icon name="send" className="size-4.5" />
                </span>
                <h2 className="mt-5 text-sm text-fg-muted">{t.emailLabel}</h2>
                <a href={`mailto:${siteConfig.contactEmail}`} className="mt-1 block text-lg font-medium tracking-tight break-all hover:text-brand-300">
                  {siteConfig.contactEmail}
                </a>
              </Reveal>
              <Reveal delay={140} className="surface edge-glow rounded-[var(--radius-panel)] p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight">{t.aside.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t.aside.text}</p>
                <FreeVideoButton source="contact_aside" className="mt-6" />
                <p className="mt-3 text-xs text-fg-subtle">{dict.common.noCard}</p>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
