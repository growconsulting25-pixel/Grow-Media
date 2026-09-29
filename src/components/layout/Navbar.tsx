"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Icon } from "@/components/ui/Icon";
import { sectionIds } from "@/config/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Navbar() {
  const { dict, locale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const home = href("home", locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = [
    { id: sectionIds.howItWorks, label: dict.nav.howItWorks },
    { id: sectionIds.examples, label: dict.nav.examples },
    { id: sectionIds.services, label: dict.nav.services },
    { id: sectionIds.pricing, label: dict.nav.pricing },
    { id: sectionIds.faq, label: dict.nav.faq },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled || menuOpen ? "glass shadow-[0_1px_0_rgba(255,255,255,0.06)]" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[76rem] items-center gap-6 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Logo href={home} />

        <nav aria-label={dict.nav.label} className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1 rounded-full bg-white/[0.03] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            {links.map((l) => (
              <li key={l.id}>
                <Link href={`${home}#${l.id}`} className="rounded-full px-3.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Link href={href("login", locale)} className="text-sm text-fg-muted transition-colors hover:text-fg">
            {dict.nav.login}
          </Link>
          <FreeVideoButton source="nav" size="sm" label={dict.nav.cta} />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <span className="hidden sm:block">
            <FreeVideoButton source="nav_mobile" size="sm" label={dict.nav.cta} />
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            className="grid size-10 place-items-center rounded-full bg-white/[0.05] text-fg"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!menuOpen} className="border-t border-white/[0.06] lg:hidden">
        <nav aria-label={dict.nav.label} className="mx-auto max-w-[76rem] px-4 pt-3 pb-6 sm:px-6">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.id}>
                <Link href={`${home}#${l.id}`} onClick={() => setMenuOpen(false)} className="block border-b border-white/[0.05] py-3.5 text-lg tracking-tight text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between">
            <LanguageSwitcher />
            <Link href={href("login", locale)} className="text-sm text-fg-muted">
              {dict.nav.login}
            </Link>
          </div>
          <FreeVideoButton source="nav_menu" className="mt-5 w-full" onClick={() => setMenuOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
