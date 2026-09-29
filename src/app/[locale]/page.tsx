import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Benefits } from "@/components/marketing/Benefits";
import { ContentEngine } from "@/components/marketing/ContentEngine";
import { Examples } from "@/components/marketing/Examples";
import { Faq, faqItems } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Pricing } from "@/components/marketing/Pricing";
import { Results } from "@/components/marketing/Results";
import { Services } from "@/components/marketing/Services";
import { Transformation } from "@/components/marketing/Transformation";
import { plans, currency } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "home");
}

/**
 * Homepage — a continuous product demonstration:
 * hero → transformation → examples → how it works → content engine →
 * benefits (light) → services → pricing → results (light) → FAQ → final CTA.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: dict.meta.title,
      description: dict.meta.description,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      areaServed: "CA",
      inLanguage: localeTags[locale],
      offers: plans.map((p) => ({ "@type": "Offer", name: dict.pricing.plans[p.id].name, price: p.price, priceCurrency: currency })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems(dict, locale).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero dict={dict} />
        <Transformation />
        <Examples dict={dict} />
        <HowItWorks dict={dict} />
        <ContentEngine />
        <Benefits dict={dict} />
        <Services dict={dict} locale={locale} />
        <Pricing />
        <Results dict={dict} locale={locale} />
        <Faq dict={dict} locale={locale} />
        <FinalCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
