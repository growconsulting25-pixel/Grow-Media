import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BrandMarquee } from "@/components/marketing/BrandMarquee";
import { Benefits } from "@/components/marketing/Benefits";
import { Examples } from "@/components/marketing/Examples";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Hero } from "@/components/marketing/Hero";
import { HomeTeaser } from "@/components/marketing/HomeTeaser";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Transformation } from "@/components/marketing/Transformation";
import { JsonLd } from "@/components/seo/JsonLd";
import { currency, plans } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { absolute, orgId, webPageLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // The layout's "%s — Grow Media" template doesn't apply to the home page itself.
  return pageMetadata(locale, "home", { title: `${dict.meta.title} — ${siteConfig.name}` });
}

/**
 * Homepage, kept focused: hero → before/after → brand band → examples →
 * how it works → benefits → links to Services, Pricing, Contact → final CTA.
 * Services + FAQ, Pricing and Contact each have their own page.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const pricingUrl = absolute(href("pricing", locale));

  const jsonLd = [
    webPageLd("WebPage", locale, "home", dict.meta.title, dict.meta.description),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absolute(href("home", locale))}#service`,
      name: dict.meta.title,
      serviceType: dict.services.items.listing.title,
      description: dict.meta.description,
      provider: { "@id": orgId },
      areaServed: [{ "@type": "AdministrativeArea", name: "Québec" }, { "@type": "Country", name: "Canada" }],
      audience: { "@type": "BusinessAudience", audienceType: locale === "fr" ? "Courtiers immobiliers" : "Real estate agents" },
      offers: plans.map((p) => ({ "@type": "Offer", name: dict.pricing.plans[p.id].name, price: p.price, priceCurrency: currency, url: pricingUrl })),
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero dict={dict} />
        <Transformation />
        <BrandMarquee dict={dict} />
        <Examples dict={dict} />
        <HowItWorks dict={dict} />
        <Benefits dict={dict} />
        <HomeTeaser dict={dict} locale={locale} />
        <FinalCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
