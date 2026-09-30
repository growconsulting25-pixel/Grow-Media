import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { localeTags, locales } from "@/i18n/config";
import { routes, type RouteKey } from "@/i18n/routing";

/** Public, indexable pages (legal pages are noindex until their text is final). */
const indexable: { route: RouteKey; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { route: "home", priority: 1, changeFrequency: "weekly" },
  { route: "services", priority: 0.9, changeFrequency: "monthly" },
  { route: "pricing", priority: 0.9, changeFrequency: "monthly" },
  { route: "contact", priority: 0.7, changeFrequency: "monthly" },
  { route: "signup", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexable.flatMap(({ route, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${routes[route][locale]}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [localeTags[l], `${siteConfig.url}/${l}${routes[route][l]}`])),
          "x-default": `${siteConfig.url}/fr${routes[route].fr}`,
        },
      },
    })),
  );
}
