import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes, type RouteKey } from "@/i18n/routing";

/** hreflang alternates for a route, including x-default. */
export function alternatesFor(route: RouteKey, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeTags[l]] = `${siteConfig.url}/${l}${routes[route][l]}`;
  languages["x-default"] = `${siteConfig.url}/fr${routes[route].fr}`;
  return { canonical: `${siteConfig.url}/${locale}${routes[route][locale]}`, languages };
}

export async function pageMetadata(locale: Locale, route: RouteKey, overrides?: { title?: string; description?: string; noindex?: boolean }): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const title = overrides?.title ?? dict.meta.title;
  const description = overrides?.description ?? dict.meta.description;
  // Inner pages define their own openGraph, which drops the inherited file-based image.
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: dict.meta.ogAlt };
  return {
    title,
    description,
    alternates: alternatesFor(route, locale),
    robots: overrides?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: `${siteConfig.url}/${locale}${routes[route][locale]}`,
      locale: localeTags[locale].replace("-", "_"),
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeTags[l].replace("-", "_")),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
