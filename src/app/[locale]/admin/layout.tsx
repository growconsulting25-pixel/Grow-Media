import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/console/AdminNav";
import { SignOutButton } from "@/components/admin/console/SignOutButton";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { interpolate } from "@/i18n/interpolate";
import { consoleBadges } from "@/lib/admin/inbox";
import { requireAdmin } from "@/lib/admin/server";
import { getTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Admin console. Staff only (profiles.role = 'admin'); staff never see the client portal. */
export default async function AdminLayout({ children, params }: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { user, supabase } = await requireAdmin();
  const [badges, theme] = await Promise.all([consoleBadges(supabase, user.id), getTheme()]);
  return (
    <div data-theme={theme} className="min-h-dvh">
      <header className="glass sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-4 px-4 sm:px-8">
          <Logo href={`/${locale}/admin`} />
          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-on-brand">{dict.app.admin.title}</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-fg-subtle md:inline">{user.email}</span>
            <Link href={`/${locale}/admin/activity`} aria-label={interpolate(dict.app.admin.console.activity.bell, { count: badges.newAlerts })}
              className="relative grid size-9 place-items-center rounded-full bg-white/[0.05] text-fg-muted transition-colors hover:bg-white/10 hover:text-fg">
              <Icon name="bell" className="size-4.5" />
              {badges.newAlerts > 0 && (
                <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-bold text-[#fff] tabular-nums">{badges.newAlerts > 99 ? "99+" : badges.newAlerts}</span>
              )}
            </Link>
            <ThemeToggle initial={theme} />
            <LanguageSwitcher />
            <Link href={href("home", locale)} className="hidden text-sm text-fg-muted hover:text-fg sm:inline">{dict.app.admin.console.nav.site}</Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[88rem] px-4 py-6 sm:px-8 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-10 lg:py-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AdminNav badges={{ messages: badges.needsReply, activity: badges.newAlerts }} />
        </aside>
        <main id="main" className="mt-6 min-w-0 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
