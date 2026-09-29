"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { href, type RouteKey } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { NotificationBell } from "./NotificationBell";

type NavKey = "dashboard" | "create" | "projects" | "videos" | "ideas" | "messages" | "brand" | "subscription" | "profile";

const items: { route: RouteKey; icon: IconName; key: NavKey }[] = [
  { route: "app", icon: "layers", key: "dashboard" },
  { route: "appCreate", icon: "plus", key: "create" },
  { route: "appProjects", icon: "image", key: "projects" },
  { route: "appVideos", icon: "play", key: "videos" },
  { route: "appIdeas", icon: "sparkle", key: "ideas" },
  { route: "appMessages", icon: "comment", key: "messages" },
  { route: "appBrand", icon: "palette", key: "brand" },
  { route: "appSubscription", icon: "coins", key: "subscription" },
  { route: "appProfile", icon: "user", key: "profile" },
];

const mobileTabs: NavKey[] = ["dashboard", "projects", "create", "videos"];

/** Sidebar on desktop; top bar + bottom tab bar (with a "More" sheet) on mobile. */
export function AppNav({ name, email, unread }: { name: string; email: string; unread: number }) {
  const { dict, locale } = useI18n();
  const t = dict.app.nav;
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const isActive = (route: RouteKey) => {
    const target = href(route, locale);
    return route === "app" ? pathname === target : pathname.startsWith(target);
  };

  const signOut = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    router.replace(href("home", locale));
    router.refresh();
  };

  const tabItems = mobileTabs.map((k) => items.find((i) => i.key === k)!);
  const moreItems = items.filter((i) => !mobileTabs.includes(i.key));
  const moreActive = moreItems.some((i) => isActive(i.route));

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 self-start shrink-0 flex-col border-r border-white/[0.06] bg-ink-950/60 px-4 py-6 lg:flex">
        <div className="flex items-center justify-between px-2">
          <Logo href={href("app", locale)} />
          <NotificationBell initialUnread={unread} />
        </div>
        <nav aria-label={t.label} className="mt-8 flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = isActive(item.route);
              return (
                <li key={item.route}>
                  <Link
                    href={href(item.route, locale)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active ? "bg-brand-500/12 text-fg shadow-[inset_0_0_0_1px_rgba(0,171,255,0.35)]" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
                    )}
                  >
                    <Icon name={item.icon} className={cn("size-4", active && "text-brand-300")} />
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
        <NotificationBell initialUnread={unread} />
      </header>

      {/* Mobile bottom nav */}
      <nav aria-label={t.label} className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid grid-cols-5">
          {tabItems.map((item) => {
            const active = isActive(item.route);
            const primary = item.key === "create";
            return (
              <li key={item.route}>
                <Link href={href(item.route, locale)} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-2 text-[0.66rem]", active ? "text-fg" : "text-fg-subtle")}>
                  <span className={cn("grid size-8 place-items-center rounded-full", primary ? "btn-primary" : active && "bg-brand-500/15 text-brand-300")}>
                    <Icon name={item.icon} className="size-4" />
                  </span>
                  <span className="max-w-full truncate px-0.5">{t[item.key]}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMoreOpen(true)} aria-expanded={moreOpen} aria-controls="app-more" className={cn("flex w-full flex-col items-center gap-1 py-2 text-[0.66rem]", moreActive ? "text-fg" : "text-fg-subtle")}>
              <span className={cn("grid size-8 place-items-center rounded-full", moreActive && "bg-brand-500/15 text-brand-300")}>
                <Icon name="menu" className="size-4" />
              </span>
              {t.more}
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <div id="app-more" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t.more}>
          <button type="button" aria-label={dict.common.close} className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
          <div className="surface-raised absolute inset-x-0 bottom-0 rounded-t-[1.75rem] px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />
            <ul className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => (
                <li key={item.route}>
                  <Link href={href(item.route, locale)} onClick={() => setMoreOpen(false)} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm", isActive(item.route) ? "bg-brand-500/12 text-fg" : "bg-white/[0.03] text-fg-muted")}>
                    <Icon name={item.icon} className="size-4 text-brand-300" />
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <LanguageSwitcher />
              <button type="button" onClick={signOut} className="text-sm text-fg-muted">{dict.auth.signOut}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
