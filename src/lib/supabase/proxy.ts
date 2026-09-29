import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Refreshes the auth session cookie on every request and reports whether a
 * user is signed in. Cookies are written onto `response`.
 */
export async function refreshSession(request: NextRequest, response: NextResponse): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}
