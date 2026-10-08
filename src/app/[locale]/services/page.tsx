import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContentEngine } from "@/components/marketing/ContentEngine";
import { Faq, faqItems } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PageHero } from "@/components/marketing/PageHero";
import { PaperBand } from "@/components/marketing/PaperBand";
import { Services } from "@/components/marketing/Services";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/config/services";
import { currency } from "@/config/pricing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { absolute, breadcrumbLd, faqLd, orgId, webPageLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "services", dict.meta.pages.services);
}

/** Services + FAQ: what we make, in which formats, and the questions agents ask. */
export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.pages.services;
  const m = dict.meta.pages.services;
  const url = absolute(href("services", locale));
  const faq = faqItems(dict, locale);

  const jsonLd = [
    webPageLd("CollectionPage", locale, "services", m.title, m.description),
    ...services.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#${s.id}`,
      name: dict.services.items[s.id].title,
      description: dict.services.items[s.id].description,
      serviceType: dict.services.items[s.id].title,
      provider: { "@id": orgId },
      areaServed: [{ "@type": "AdministrativeArea", name: "Québec" }, { "@type": "Country", name: "Canada" }],
      audience: { "@type": "BusinessAudience", audienceType: locale === "fr" ? "Courtiers immobiliers" : "Real estate agents" },
      ...(s.startingPrice !== null && {
        offers: { "@type": "Offer", price: s.startingPrice, priceCurrency: currency, url: absolute(href("pricing", locale)) },
      }),
    })),
    faqLd(faq, url),
    breadcrumbLd(dict, locale, "services", t.breadcrumb),
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero dict={dict} locale={locale} eyebrow={t.eyebrow} lines={t.headline} intro={t.intro} crumb={t.breadcrumb} image="keysHandover" />
        <Services dict={dict} locale={locale} flush />
        <HowItWorks dict={dict} />
        <ContentEngine />
        <PaperBand className="mb-20 sm:mb-28">
          <Faq dict={dict} locale={locale} items={faq} />
        </PaperBand>
        <FinalCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
