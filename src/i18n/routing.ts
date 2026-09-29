import { locales, type Locale } from "./config";

/**
 * Route map. Paths are localized so French URLs read naturally
 * (e.g. /fr/connexion). Add new routes here — never build URLs by hand.
 */
export const routes = {
  home: { en: "", fr: "" },
  login: { en: "/login", fr: "/connexion" },
  signup: { en: "/signup", fr: "/inscription" },
  privacy: { en: "/legal/privacy", fr: "/legal/confidentialite" },
  terms: { en: "/legal/terms", fr: "/legal/conditions" },
  cookies: { en: "/legal/cookies", fr: "/legal/temoins" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/**
 * Routes whose folder name (English) differs from the localized URL.
 * The proxy rewrites e.g. /fr/connexion → /fr/login internally.
 */
export const rewrittenRoutes: RouteKey[] = ["login", "signup"];

export function internalPath(pathname: string): string | null {
  const [, locale, ...rest] = pathname.split("/");
  if (!(locales as readonly string[]).includes(locale)) return null;
  const tail = `/${rest.join("/")}`;
  for (const key of rewrittenRoutes) {
    const localized = routes[key][locale as Locale];
    if (localized === tail && localized !== routes[key].en) return `/${locale}${routes[key].en}`;
  }
  return null;
}

export function href(route: RouteKey, locale: Locale, hash?: string) {
  return `/${locale}${routes[route][locale]}${hash ? `#${hash}` : ""}`;
}

/** Finds the equivalent URL in another locale (used by the language switcher). */
export function switchLocalePath(pathname: string, target: Locale) {
  const [, current, ...rest] = pathname.split("/");
  const tail = rest.length ? `/${rest.join("/")}` : "";
  if (!(locales as readonly string[]).includes(current)) return `/${target}`;
  const from = current as Locale;
  const match = (Object.keys(routes) as RouteKey[]).find((key) => routes[key][from] === tail);
  return `/${target}${match ? routes[match][target] : tail}`;
}
