"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { accents, type Accent } from "./accents";

type Key = "dashboard" | "production" | "messages" | "clients" | "payments" | "activity" | "team" | "settings";
const items: { key: Key; path: string; icon: IconName; accent: Accent }[] = [
  { key: "dashboard", path: "", icon: "layers", accent: "cyan" },
  { key: "production", path: "/production", icon: "play", accent: "amber" },
  { key: "messages", path: "/messages", icon: "comment", accent: "blue" },
  { key: "clients", path: "/clients", icon: "user", accent: "emerald" },
  { key: "payments", path: "/payments", icon: "coins", accent: "orange" },
  { key: "activity", path: "/activity", icon: "bell", accent: "rose" },
  { key: "team", path: "/team", icon: "users", accent: "slate" },
  { key: "settings", path: "/settings", icon: "palette", accent: "slate" },
];

/** Admin console tabs: a sidebar on desktop, a scrollable tab row on mobile. Each tab has its own color. */
export function AdminNav({ badges }: { badges: { messages: number; activity: number } }) {
  const { dict, locale } = useI18n();
  const t = dict.app.admin.console.nav;
  const pathname = usePathname() ?? "";
  const base = `/${locale}/admin`;
  const isActive = (path: string) => {
    if (path === "") return pathname === base;
    if (path === "/production") return pathname.startsWith(base + path) || pathname.startsWith(`${base}/projects`);
    return pathname.startsWith(base + path);
  };

  return (
    <nav aria-label={dict.app.admin.title} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
      {items.map((it) => {
        const active = isActive(it.path);
        const badge = it.key === "messages" ? badges.messages : it.key === "activity" ? badges.activity : 0;
        return (
          <Link key={it.key} href={base + it.path} aria-current={active ? "page" : undefined}
            className={cn("inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? accents[it.accent].tab : "text-fg-muted hover:bg-white/[0.04] hover:text-fg")}>
            <Icon name={it.icon} className={cn("size-4", active ? "" : accents[it.accent].text)} />
            {t[it.key]}
            {badge > 0 && <span className={cn("ml-auto rounded-full px-1.5 text-xs font-semibold tabular-nums", accents[it.accent].chip)}>{badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
