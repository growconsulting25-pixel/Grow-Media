"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeLabels, locales } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { switchLocalePath } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <nav aria-label={dict.nav.language} className={cn("flex items-center rounded-full bg-white/[0.04] p-0.5 text-xs font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]", className)}>
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={localeLabels[l].long}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              active ? "bg-white/10 text-fg" : "text-fg-subtle hover:text-fg",
            )}
          >
            {localeLabels[l].short}
          </Link>
        );
      })}
    </nav>
  );
}
