import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Faq, pricingFaqItems } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { PageHero } from "@/components/marketing/PageHero";
import { PaperBand } from "@/components/marketing/PaperBand";
import { Pricing } from "@/components/marketing/Pricing";
import { JsonLd } from "@/components/seo/JsonLd";
import { addOns, currency, plans } from "@/config/pricing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { priceVars } from "@/lib/marketing/prices";
import { absolute, breadcrumbLd, faqLd, orgId, webPageLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "pricing", dict.meta.pages.pricing);
}

/** Pricing (FR: /tarifs): plans, add-ons and pricing questions, with Offer markup. */
export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.pages.pricing;
  const m = dict.meta.pages.pricing;
  const url = absolute(href("pricing", locale));
  const faq = pricingFaqItems(dict, locale);
  const walkthrough = addOns.find((a) => a.id === "walkthrough");

  const offer = (name: string, price: number, monthly: boolean, description?: string) => ({
    "@type": "Offer",
    name,
    description,
    price,
    priceCurrency: currency,
    url,
    availability: "https://schema.org/InStock",
    ...(monthly && {
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: currency,
        billingDuration: "P1M",
        unitText: locale === "fr" ? "mois" : "month",
      },
    }),
  });

  const jsonLd = [
    webPageLd("WebPage", locale, "pricing", m.title, m.description),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: dict.services.items.listing.title,
      serviceType: dict.services.items.listing.title,
      description: m.description,
      provider: { "@id": orgId },
      areaServed: [{ "@type": "AdministrativeArea", name: "Québec" }, { "@type": "Country", name: "Canada" }],
      offers: [
        ...plans.map((p) => offer(dict.pricing.plans[p.id].name, p.price, p.interval === "month", dict.pricing.plans[p.id].tagline)),
        ...(walkthrough?.price ? [offer(dict.pricing.addOns.walkthrough.name, walkthrough.price, false)] : []),
      ],
    },
    faqLd(faq, url),
    breadcrumbLd(dict, locale, "pricing", t.breadcrumb),
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero dict={dict} locale={locale} eyebrow={t.eyebrow} lines={t.headline} intro={interpolate(t.intro, priceVars(locale))} crumb={t.breadcrumb} image="bungalow" />
        <Pricing flush />
        <PaperBand className="mb-20 sm:mb-28">
          <Faq dict={dict} locale={locale} items={faq} lines={[{ text: t.faqTitle }]} initialCount={faq.length} />
        </PaperBand>
        <FinalCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
