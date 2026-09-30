"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** Switches the signed-in area between dark and light; remembered for a year. */
export function ThemeToggle({ initial, className, withLabel }: { initial: "dark" | "light"; className?: string; withLabel?: boolean }) {
  const { locale } = useI18n();
  const [theme, setTheme] = useState(initial);
  const next = theme === "dark" ? "light" : "dark";
  const label = locale === "fr" ? (next === "light" ? "Mode clair" : "Mode sombre") : next === "light" ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        document.cookie = `gm-theme=${next}; path=/; max-age=31536000; samesite=lax`;
        document.querySelectorAll("[data-theme]").forEach((el) => el.setAttribute("data-theme", next));
        setTheme(next);
      }}
      className={cn("inline-flex items-center gap-2 rounded-full bg-white/[0.05] text-fg-muted transition-colors hover:bg-white/10 hover:text-fg", withLabel ? "px-3 py-2 text-sm" : "size-9 justify-center", className)}
    >
      <Icon name={next === "light" ? "sun" : "moon"} className="size-4.5" />
      {withLabel && label}
    </button>
  );
}
