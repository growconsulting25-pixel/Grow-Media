import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "@/i18n/config";
import { safeNext } from "@/i18n/routing";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Landing point for email confirmation, password recovery and OAuth.
 * Exchanges the one-time code for a session, then continues to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"), `/${defaultLocale}/app`);
  const code = searchParams.get("code");
  const supabase = await getSupabaseServer();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  const locale = next.split("/")[1] || defaultLocale;
  return NextResponse.redirect(`${origin}/${locale}/login?error=link`);
}
