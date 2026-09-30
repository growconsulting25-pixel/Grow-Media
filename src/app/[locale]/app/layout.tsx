import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/components/app/AppNav";
import { NotConfigured } from "@/components/app/NotConfigured";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { getProfile, unreadNotificationCount } from "@/lib/projects/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { getTheme } from "@/lib/theme";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Protected client area. The proxy already redirects signed-out visitors; this double-checks. */
export default async function AppLayout({ children, params }: LayoutProps<"/[locale]/app">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  if (!isSupabaseConfigured) return <NotConfigured dict={dict} />;

  const session = await getCurrentUser();
  if (!session) redirect(`${href("login", locale)}?next=${encodeURIComponent(href("app", locale))}`);
  const theme = await getTheme();
  const [profile, unread] = await Promise.all([getProfile(session.supabase, session.user.id), unreadNotificationCount(session.supabase)]);
  // Staff work in the admin console; the client portal (plans, billing…) is for clients.
  if (profile?.role === "admin") redirect(`/${locale}/admin`);
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || session.user.email || "";

  return (
    <div data-theme={theme} className="min-h-dvh lg:flex">
      <AppNav name={name} email={session.user.email ?? ""} unread={unread} theme={theme} />
      <main id="main" className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-8 lg:px-12 lg:pt-10 lg:pb-16">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
