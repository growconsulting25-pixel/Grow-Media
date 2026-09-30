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
import { requireAdmin } from "@/lib/admin/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Admin console. Staff only (profiles.role = 'admin'); staff never see the client portal. */
export default async function AdminLayout({ children, params }: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { user } = await requireAdmin();
  return (
    <div className="min-h-dvh">
      <header className="glass sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-4 px-4 sm:px-8">
          <Logo href={`/${locale}/admin`} />
          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-on-brand">{dict.app.admin.title}</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-fg-subtle md:inline">{user.email}</span>
            <LanguageSwitcher />
            <Link href={href("home", locale)} className="hidden text-sm text-fg-muted hover:text-fg sm:inline">{dict.app.admin.console.nav.site}</Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[88rem] px-4 py-6 sm:px-8 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-10 lg:py-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AdminNav />
        </aside>
        <main id="main" className="mt-6 min-w-0 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
