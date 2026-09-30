"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const input =
  "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-[0.95rem] text-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_9%,transparent)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)] disabled:opacity-60";

export function ProfileForm({ userId, email, firstName, lastName, preferred }: { userId: string; email: string; firstName: string; lastName: string; preferred: Locale }) {
  const { dict, locale } = useI18n();
  const t = dict.app.profile;
  const router = useRouter();
  const [values, setValues] = useState({ first_name: firstName, last_name: lastName, locale: preferred });
  const [profileStatus, setProfileStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [password, setPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setProfileStatus("saving");
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: values.first_name.trim(), last_name: values.last_name.trim(), locale: values.locale })
      .eq("id", userId);
    setProfileStatus(error ? "error" : "saved");
    if (!error && values.locale !== locale) router.replace(`/${values.locale}/app/profile`);
    else if (!error) router.refresh();
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setPwStatus("error");
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setPwStatus("saving");
    const { error } = await supabase.auth.updateUser({ password });
    setPwStatus(error ? "error" : "saved");
    if (!error) setPassword("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="surface space-y-4 rounded-[var(--radius-panel)] p-6">
        <h2 className="font-medium">{t.personal}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-first" className="mb-1.5 block text-sm font-medium">{t.firstName}</label>
            <input id="pf-first" autoComplete="given-name" value={values.first_name} onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))} className={input} />
          </div>
          <div>
            <label htmlFor="pf-last" className="mb-1.5 block text-sm font-medium">{t.lastName}</label>
            <input id="pf-last" autoComplete="family-name" value={values.last_name} onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="pf-email" className="mb-1.5 block text-sm font-medium">{t.email}</label>
          <input id="pf-email" value={email} disabled className={input} />
        </div>
        <div>
          <label htmlFor="pf-locale" className="mb-1.5 block text-sm font-medium">{t.language}</label>
          <select id="pf-locale" value={values.locale} onChange={(e) => setValues((v) => ({ ...v, locale: e.target.value as Locale }))} className={input}>
            {locales.map((l) => <option key={l} value={l}>{localeLabels[l].long}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={profileStatus === "saving"}>{t.save}</Button>
          <p aria-live="polite" className={profileStatus === "error" ? "text-sm text-red-300" : "text-sm text-success"}>
            {profileStatus === "saved" ? t.saved : profileStatus === "error" ? t.error : ""}
          </p>
        </div>
      </form>

      <form onSubmit={savePassword} className="surface space-y-4 self-start rounded-[var(--radius-panel)] p-6">
        <h2 className="font-medium">{t.security}</h2>
        <div>
          <label htmlFor="pf-password" className="mb-1.5 block text-sm font-medium">{t.newPassword}</label>
          <input id="pf-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => { setPassword(e.target.value); setPwStatus("idle"); }} className={input} />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" variant="secondary" disabled={pwStatus === "saving" || !password}>{t.changePassword}</Button>
          <p aria-live="polite" className={pwStatus === "error" ? "text-sm text-red-300" : "text-sm text-success"}>
            {pwStatus === "saved" ? t.passwordChanged : pwStatus === "error" ? t.passwordError : ""}
          </p>
        </div>
      </form>
    </div>
  );
}
