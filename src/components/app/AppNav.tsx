"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { href, type RouteKey } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const items: { route: RouteKey; icon: IconName; key: "dashboard" | "create" | "projects" }[] = [
  { route: "app", icon: "layers", key: "dashboard" },
  { route: "appCreate", icon: "plus", key: "create" },
  { route: "appProjects", icon: "play", key: "projects" },
];

/** Sidebar on desktop, bottom tab bar on mobile. */
export function AppNav({ name, email }: { name: string; email: string }) {
  const { dict, locale } = useI18n();
  const t = dict.app.nav;
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const isActive = (route: RouteKey) => {
    const target = href(route, locale);
    return route === "app" ? pathname === target : pathname.startsWith(target);
  };

  const signOut = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    router.replace(href("home", locale));
    router.refresh();
  };

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/[0.06] bg-ink-950/60 px-4 py-6 lg:flex">
        <Logo href={href("app", locale)} className="px-2" />
        <nav aria-label={t.label} className="mt-10 flex-1">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.route);
              return (
                <li key={item.route}>
                  <Link
                    href={href(item.route, locale)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active ? "bg-violet-500/12 text-fg shadow-[inset_0_0_0_1px_rgba(170,125,255,0.35)]" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
                    )}
                  >
                    <Icon name={item.icon} className={cn("size-4", active && "text-violet-300")} />
                    {t[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-4 border-t border-white/[0.06] pt-5">
          <div className="px-2">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-fg-subtle">{email}</p>
          </div>
          <div className="flex items-center justify-between px-2">
            <LanguageSwitcher />
            <button type="button" onClick={signOut} className="text-xs text-fg-muted hover:text-fg">{dict.auth.signOut}</button>
          </div>
          <Link href={href("home", locale)} className="block px-2 text-xs text-fg-subtle hover:text-fg-muted">← {t.backToSite}</Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="glass sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] px-4 lg:hidden">
        <Logo href={href("app", locale)} />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button type="button" onClick={signOut} className="text-xs text-fg-muted">{dict.auth.signOut}</button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav aria-label={t.label} className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid grid-cols-3">
          {items.map((item) => {
            const active = isActive(item.route);
            const primary = item.key === "create";
            return (
              <li key={item.route}>
                <Link href={href(item.route, locale)} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-2.5 text-[0.7rem]", active ? "text-fg" : "text-fg-subtle")}>
                  <span className={cn("grid size-8 place-items-center rounded-full", primary ? "btn-primary" : active && "bg-violet-500/15 text-violet-300")}>
                    <Icon name={item.icon} className="size-4" />
                  </span>
                  {t[item.key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
