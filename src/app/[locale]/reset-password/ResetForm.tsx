"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { authInputClass } from "../login/authInputClass";

/** Reached from the recovery email (the callback already created a session). */
export function ResetForm() {
  const { dict, locale } = useI18n();
  const t = dict.auth;
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(() => (getSupabaseBrowser() ? null : false));
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 8) return setError(dict.signup.errors.password);
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(t.errors.generic);
    setDone(true);
    setTimeout(() => router.replace(href("app", locale)), 1200);
  };

  return (
    <div>
      <h1 className="display text-4xl">{t.resetTitle}</h1>
      <p className="mt-2 text-fg-muted">{t.resetSubtitle}</p>
      {hasSession === false ? (
        <p className="mt-8 rounded-xl bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
          {t.resetNoSession}{" "}
          <Link href={href("forgotPassword", locale)} className="underline">{t.forgotSubmit}</Link>
        </p>
      ) : done ? (
        <p role="status" className="mt-8 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">{t.resetDone}</p>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="reset-password" className="mb-1.5 block text-sm font-medium">{t.newPassword}</label>
            <input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={8} required className={authInputClass} />
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          <Button type="submit" className="w-full" arrow disabled={busy || hasSession === null}>{t.resetSubmit}</Button>
        </form>
      )}
    </div>
  );
}
