import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { localeTags, locales } from "@/i18n/config";
import { routes, type RouteKey } from "@/i18n/routing";

const indexable: RouteKey[] = ["home", "signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  return indexable.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${routes[route][locale]}`,
      changeFrequency: "weekly" as const,
      priority: route === "home" ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [localeTags[l], `${siteConfig.url}/${l}${routes[route][l]}`])),
      },
    })),
  );
}
