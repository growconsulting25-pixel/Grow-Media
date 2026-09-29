"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { authInputClass } from "../login/authInputClass";

export function ForgotForm() {
  const { dict, locale } = useI18n();
  const t = dict.auth;
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    const supabase = getSupabaseBrowser();
    if (!supabase) return setError(t.unavailable);
    setBusy(true);
    const next = href("resetPassword", locale);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    });
    setBusy(false);
    // Same message whether or not the account exists (no account enumeration).
    if (resetError && resetError.status === 429) return setError(t.errors.rateLimited);
    setSentTo(email);
  };

  return (
    <div>
      <h1 className="display text-4xl">{t.forgotTitle}</h1>
      <p className="mt-2 text-fg-muted">{t.forgotSubtitle}</p>
      {sentTo ? (
        <p role="status" className="mt-8 rounded-xl bg-violet-500/10 px-4 py-3 text-sm text-violet-300">{interpolate(t.forgotSent, { email: sentTo })}</p>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium">{t.email}</label>
            <input id="forgot-email" name="email" type="email" autoComplete="email" required className={authInputClass} />
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          <Button type="submit" className="w-full" arrow disabled={busy}>{t.forgotSubmit}</Button>
        </form>
      )}
      <Link href={href("login", locale)} className="mt-8 inline-block text-sm text-fg-muted hover:text-fg">← {t.backToLogin}</Link>
    </div>
  );
}
