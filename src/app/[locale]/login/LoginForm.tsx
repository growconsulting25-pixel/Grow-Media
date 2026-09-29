"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authProviders, signInWithGoogle } from "@/components/onboarding/auth-adapter";
import { FreeVideoButton } from "@/components/onboarding/FreeVideoButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { href, safeNext } from "@/i18n/routing";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { authInputClass } from "./authInputClass";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const { dict, locale } = useI18n();
  const t = dict.auth;
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError === "link" ? t.errors.link : null);
  const [notice, setNotice] = useState(false);
  const [busy, setBusy] = useState(false);
  const target = safeNext(next, href("app", locale));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return setNotice(true);
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (signInError) {
      const msg = signInError.message.toLowerCase();
      setError(msg.includes("confirm") ? t.errors.unconfirmed : msg.includes("rate") ? t.errors.rateLimited : signInError.status === 400 ? t.errors.invalid : t.errors.generic);
      return;
    }
    router.replace(target);
    router.refresh();
  };

  return (
    <div>
      <h1 className="display text-4xl">{t.loginTitle}</h1>
      <p className="mt-2 text-fg-muted">{t.loginSubtitle}</p>

      {authProviders.google && (
        <>
          <Button variant="secondary" className="mt-8 w-full" onClick={() => signInWithGoogle(locale, target)}>
            <Icon name="google" className="size-4" /> {t.google}
          </Button>
          <p className="mt-4 text-center text-xs text-fg-subtle">{t.or}</p>
        </>
      )}

      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate={false}>
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">{t.email}</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required className={authInputClass} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium">{t.password}</label>
            <Link href={href("forgotPassword", locale)} className="text-xs text-fg-muted hover:text-fg">{t.forgot}</Link>
          </div>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required className={authInputClass} />
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full" arrow disabled={busy}>{busy ? t.submitting : t.submit}</Button>
        {notice && <p role="status" className="rounded-xl bg-violet-500/10 px-4 py-3 text-sm text-violet-300">{t.unavailable}</p>}
      </form>
      <div className="mt-10 border-t border-white/[0.07] pt-6 text-sm text-fg-muted">
        <p className="mb-3">{t.noAccount}</p>
        <FreeVideoButton source="login_page" variant="secondary" />
      </div>
    </div>
  );
}
