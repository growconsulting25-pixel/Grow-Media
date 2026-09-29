import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { href, internalPath } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { refreshSession } from "@/lib/supabase/proxy";

/** Picks a locale: saved preference → Accept-Language → default. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.map((r) => r.lang).find(isLocale) ?? defaultLocale;
}

const APP_PATH = /^\/(en|fr)\/app(\/|$)/;
const AUTH_PATH = /^\/(en|fr)\/(login|connexion|signup|inscription|reset-password|nouveau-mot-de-passe)$/;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const locale = pathname.split("/")[1];

  if (!locales.some((l) => l === locale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const internal = internalPath(pathname);
  let response: NextResponse;
  if (internal) {
    const url = request.nextUrl.clone();
    url.pathname = internal;
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next({ request });
  }

  // Session work only where it matters, so marketing pages stay fast.
  if (isSupabaseConfigured && (APP_PATH.test(pathname) || AUTH_PATH.test(pathname))) {
    const signedIn = await refreshSession(request, response);
    if (APP_PATH.test(pathname) && !signedIn) {
      const url = request.nextUrl.clone();
      url.pathname = href("login", locale as Locale);
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      const redirect = NextResponse.redirect(url);
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
      return redirect;
    }
  }
  return response;
}

export const config = {
  // Skip Next internals, API routes, the auth callback and any file with an extension.
  matcher: ["/((?!_next|api|auth/|.*\\..*).*)"],
};
