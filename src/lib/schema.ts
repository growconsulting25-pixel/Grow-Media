import { siteConfig } from "@/config/site";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, type RouteKey } from "@/i18n/routing";

/**
 * schema.org JSON-LD builders. Entities share stable @ids so Google and AI
 * answer engines can connect the Organization, WebSite and each page.
 */
export const orgId = `${siteConfig.url}/#organization`;
export const siteId = `${siteConfig.url}/#website`;

export const absolute = (path: string) => `${siteConfig.url}${path}`;

export function faqLd(items: { q: string; a: string }[], url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbLd(dict: Dictionary, locale: Locale, route: RouteKey, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.pages.breadcrumbHome, item: absolute(href("home", locale)) },
      { "@type": "ListItem", position: 2, name, item: absolute(href(route, locale)) },
    ],
  };
}

/** A page entity tied to the site and organization. */
export function webPageLd(type: "WebPage" | "ContactPage" | "CollectionPage", locale: Locale, route: RouteKey, name: string, description: string) {
  const url = absolute(href(route, locale));
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: localeTags[locale],
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
  };
}

/** Site-wide entities (rendered once in the locale layout). */
export function organizationLd(dict: Dictionary, locale: Locale) {
  const sameAs = siteConfig.social.map((s) => s.href).filter((u) => new URL(u).pathname.length > 1);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: siteConfig.name,
      alternateName: "Grow Media Québec",
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/apple-icon`, width: 180, height: 180 },
      email: siteConfig.contactEmail,
      description: dict.meta.description,
      slogan: dict.footer.tagline,
      parentOrganization: { "@type": "Organization", name: "Grow Consulting", url: "https://growconsulting.ca" },
      areaServed: [{ "@type": "AdministrativeArea", name: "Québec" }, { "@type": "Country", name: "Canada" }],
      knowsAbout: locale === "fr"
        ? ["Vidéo immobilière", "Vidéo d'inscription", "Visite virtuelle 3D", "Marketing immobilier sur les réseaux sociaux", "Reels immobiliers"]
        : ["Real estate video", "Listing video", "3D virtual tour", "Real estate social media marketing", "Real estate reels"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contactEmail,
        url: absolute(href("contact", locale)),
        areaServed: "CA",
        availableLanguage: ["French", "English"],
      },
      ...(sameAs.length && { sameAs }),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": siteId,
      url: siteConfig.url,
      name: siteConfig.name,
      description: dict.meta.description,
      publisher: { "@id": orgId },
      inLanguage: ["fr-CA", "en-CA"],
    },
  ];
}

/** Serializes JSON-LD safely for an inline <script>. */
export function ldJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
