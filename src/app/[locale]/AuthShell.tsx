import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Photo } from "@/components/ui/Photo";
import { Sparkles } from "@/components/ui/Sparkles";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries";

/** Shared split layout for auth pages: form left, cinematic property right. */
export function AuthShell({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo href={href("home", locale)} />
          <LanguageSwitcher />
        </div>
        <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          {children}
        </main>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Photo name="keys" width={1200} sizes="50vw" priority className="absolute inset-0" imgClassName="animate-kenburns" />
        <div className="absolute inset-0 bg-ink-900/55" />
        <Sparkles density={6} />
        <p className="display absolute right-12 bottom-14 left-12 text-4xl text-white">{dict.footer.tagline}</p>
      </div>
    </div>
  );
}
