"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";

export default function NotFound() {
  const { dict, locale } = useI18n();
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-violet-300">404</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">{dict.notFound.title}</h1>
        <Link href={href("home", locale)} className={buttonClasses({ className: "mt-8" })}>
          {dict.notFound.back}
        </Link>
      </div>
    </main>
  );
}
