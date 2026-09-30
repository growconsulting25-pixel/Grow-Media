"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { accents, type Accent } from "./accents";

type Key = "dashboard" | "production" | "clients" | "payments" | "team";
const items: { key: Key; path: string; icon: IconName; accent: Accent }[] = [
  { key: "dashboard", path: "", icon: "layers", accent: "cyan" },
  { key: "production", path: "/production", icon: "play", accent: "amber" },
  { key: "clients", path: "/clients", icon: "user", accent: "emerald" },
  { key: "payments", path: "/payments", icon: "coins", accent: "violet" },
  { key: "team", path: "/team", icon: "heart", accent: "rose" },
];

/** Admin console tabs: a sidebar on desktop, a scrollable tab row on mobile. Each tab has its own color. */
export function AdminNav() {
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
        return (
          <Link key={it.key} href={base + it.path} aria-current={active ? "page" : undefined}
            className={cn("inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? accents[it.accent].tab : "text-fg-muted hover:bg-white/[0.04] hover:text-fg")}>
            <Icon name={it.icon} className={cn("size-4", active ? "" : accents[it.accent].text)} />
            {t[it.key]}
          </Link>
        );
      })}
    </nav>
  );
}
