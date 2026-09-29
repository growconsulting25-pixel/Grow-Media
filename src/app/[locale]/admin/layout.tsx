import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Internal production area. Staff only (profiles.role = 'admin'). */
export default async function AdminLayout({ children, params }: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  await requireAdmin();
  return (
    <div className="min-h-dvh">
      <header className="glass sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-8">
          <Logo href={`/${locale}/admin`} />
          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-on-brand">{dict.app.admin.title}</span>
          <nav className="ml-auto flex items-center gap-4 text-sm">
            <Link href={`/${locale}/admin`} className="text-fg-muted hover:text-fg">{dict.app.admin.queue}</Link>
            <Link href={`/${locale}/admin/team`} className="text-fg-muted hover:text-fg">{dict.app.admin.team.nav}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={href("app", locale)} className="text-sm text-fg-muted hover:text-fg">{dict.app.nav.dashboard}</Link>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
