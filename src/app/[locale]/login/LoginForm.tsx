"use client";

import Link from "next/link";
import { useState } from "react";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

/** UI for Phase 2 (Supabase Auth). Submitting shows an honest notice for now. */
export function LoginForm() {
  const { dict } = useI18n();
  const t = dict.auth;
  const [notice, setNotice] = useState(false);
  const input = "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-violet-400)]";

  return (
    <div>
      <h1 className="display text-4xl">{t.loginTitle}</h1>
      <p className="mt-2 text-fg-muted">{t.loginSubtitle}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(true);
        }}
      >
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">{t.email}</label>
          <input id="login-email" type="email" autoComplete="email" required className={input} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium">{t.password}</label>
            <Link href="#" className="text-xs text-fg-muted hover:text-fg">{t.forgot}</Link>
          </div>
          <input id="login-password" type="password" autoComplete="current-password" required className={input} />
        </div>
        <Button type="submit" className="w-full" arrow>{t.submit}</Button>
        {notice && (
          <p role="status" className="rounded-xl bg-violet-500/10 px-4 py-3 text-sm text-violet-300">{t.unavailable}</p>
        )}
      </form>
      <div className="mt-10 border-t border-white/[0.07] pt-6 text-sm text-fg-muted">
        <p className="mb-3">{t.noAccount}</p>
        <FreeVideoButton source="login_page" variant="secondary" />
      </div>
    </div>
  );
}
