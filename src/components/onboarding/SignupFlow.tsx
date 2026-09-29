"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { authProviders, signUp } from "./auth-adapter";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Step = 0 | 1 | 2;
type Errors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "files", string>>;

/**
 * Three light steps: details → password → photos. The visitor never sees a
 * long form, and no payment is requested for the free video.
 */
export function SignupFlow({ source, onDone }: { source: string; onDone?: () => void }) {
  const { dict, locale } = useI18n();
  const t = dict.signup;
  const [step, setStep] = useState<Step>(0);
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [step]);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const validate = (s: Step): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!values.firstName.trim()) e.firstName = t.errors.required;
      if (!values.lastName.trim()) e.lastName = t.errors.required;
      if (!values.email.trim()) e.email = t.errors.required;
      else if (!EMAIL_RE.test(values.email.trim())) e.email = t.errors.email;
    }
    if (s === 1 && values.password.length < 8) e.password = t.errors.password;
    if (s === 2 && files.length === 0) e.files = t.errors.files;
    return e;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) {
      setStep((step + 1) as Step);
      return;
    }
    setSubmitting(true);
    track("photos_uploaded", { count: files.length, source });
    const result = await signUp({ ...values, email: values.email.trim(), files, source, locale });
    setSubmitting(false);
    if (result.ok) {
      track("signup_completed", { source });
      onDone?.();
    } else {
      setPending(true);
    }
  };

  if (pending) {
    const subject = encodeURIComponent(t.title);
    return (
      <div className="px-6 pt-14 pb-8 text-center sm:px-8" aria-live="polite">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-violet-500/15 text-violet-300">
          <Icon name="sparkle" className="size-6" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">{t.pending.title}</h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-fg-muted">
          {interpolate(t.pending.description, { contact: siteConfig.contactEmail })}
        </p>
        <a
          href={`mailto:${siteConfig.contactEmail}?subject=${subject}`}
          className="btn-primary mt-7 inline-flex h-11 items-center gap-2 rounded-full px-6 font-medium"
        >
          {t.pending.action}
        </a>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="px-6 pt-12 pb-7 sm:px-8">
      <p className="text-xs font-medium tracking-wide text-violet-300 uppercase">
        {interpolate(t.stepOf, { current: step + 1, total: 3 })} · {t.steps[step]}
      </p>
      <h3 className="mt-2 text-[1.6rem] leading-tight font-semibold tracking-tight">{t.title}</h3>
      <p className="mt-1.5 text-sm text-fg-muted">{t.subtitle}</p>

      <ol className="mt-5 grid grid-cols-3 gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <li key={i} className={cn("h-1 rounded-full transition-colors duration-500", i <= step ? "bg-gradient-to-r from-violet-600 to-orchid-400" : "bg-white/10")} />
        ))}
      </ol>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <>
            {authProviders.google && (
              <>
                <Button variant="secondary" className="w-full" onClick={() => track("signup_started", { method: "google" })}>
                  <Icon name="google" className="size-4" /> {t.google}
                </Button>
                <p className="text-center text-xs text-fg-subtle">{t.or}</p>
              </>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.firstName} error={errors.firstName}>
                {(id, describedBy) => (
                  <input ref={firstFieldRef} id={id} aria-describedby={describedBy} aria-invalid={!!errors.firstName} autoComplete="given-name" value={values.firstName} onChange={set("firstName")} className={inputClass(!!errors.firstName)} />
                )}
              </Field>
              <Field label={t.lastName} error={errors.lastName}>
                {(id, describedBy) => (
                  <input id={id} aria-describedby={describedBy} aria-invalid={!!errors.lastName} autoComplete="family-name" value={values.lastName} onChange={set("lastName")} className={inputClass(!!errors.lastName)} />
                )}
              </Field>
            </div>
            <Field label={t.email} error={errors.email}>
              {(id, describedBy) => (
                <input id={id} type="email" inputMode="email" aria-describedby={describedBy} aria-invalid={!!errors.email} autoComplete="email" placeholder={t.emailPlaceholder} value={values.email} onChange={set("email")} className={inputClass(!!errors.email)} />
              )}
            </Field>
          </>
        )}

        {step === 1 && (
          <Field label={t.password} error={errors.password} hint={t.passwordHint}>
            {(id, describedBy) => (
              <div className="relative">
                <input ref={firstFieldRef} id={id} type={showPassword ? "text" : "password"} aria-describedby={describedBy} aria-invalid={!!errors.password} autoComplete="new-password" value={values.password} onChange={set("password")} className={cn(inputClass(!!errors.password), "pr-12")} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? t.hidePassword : t.showPassword} aria-pressed={showPassword} className="absolute inset-y-0 right-1 my-auto grid size-9 place-items-center rounded-lg text-fg-subtle hover:text-fg">
                  <Icon name="eye" className="size-4" />
                </button>
              </div>
            )}
          </Field>
        )}

        {step === 2 && <PhotoPicker files={files} onChange={(f) => { setFiles(f); setErrors({}); }} error={errors.files} inputRef={firstFieldRef} />}
      </div>

      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <Button variant="ghost" className="px-2" onClick={() => setStep((step - 1) as Step)}>
            {dict.common.back}
          </Button>
        )}
        <Button type="submit" arrow className="ml-auto flex-1 sm:flex-none" disabled={submitting}>
          {step < 2 ? dict.common.next : t.submit}
        </Button>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-fg-subtle">
        {step === 0 ? (
          <>
            {t.haveAccount}{" "}
            <Link href={href("login", locale)} className="text-fg-muted underline-offset-4 hover:underline">
              {dict.nav.login}
            </Link>
          </>
        ) : (
          t.terms
        )}
      </p>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-[0.95rem] text-fg placeholder:text-fg-subtle",
    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none transition-shadow",
    "focus:shadow-[inset_0_0_0_1.5px_var(--color-violet-400)]",
    invalid && "shadow-[inset_0_0_0_1.5px_#f87171]",
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => React.ReactNode }) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      {children(id, error || hint ? msgId : undefined)}
      {(error || hint) && (
        <p id={msgId} className={cn("mt-1.5 text-xs", error ? "text-red-400" : "text-fg-subtle")} role={error ? "alert" : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function PhotoPicker({ files, onChange, error, inputRef }: { files: File[]; onChange: (f: File[]) => void; error?: string; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const { dict } = useI18n();
  const t = dict.signup;
  const [dragging, setDragging] = useState(false);
  const previews = useMemo(() => files.slice(0, 8).map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const add = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).filter((f) => ACCEPTED.includes(f.type));
    onChange([...files, ...next]);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{t.uploadTitle}</p>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); add(e.dataTransfer.files); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging ? "border-violet-400 bg-violet-500/10" : "border-white/15 bg-white/[0.02] hover:border-white/25",
          error && "border-red-400/70",
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-violet-500/15 text-violet-300">
          <Icon name="upload" className="size-5" />
        </span>
        <span className="text-sm text-fg">{t.browse}</span>
        <span className="text-xs text-fg-subtle">{t.uploadHint}</span>
        <input ref={inputRef} type="file" multiple accept={ACCEPTED.join(",")} className="sr-only" onChange={(e) => add(e.target.files)} />
      </label>
      {files.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs text-success">
            <Icon name="check" className="size-3.5" /> {interpolate(t.filesSelected, { count: files.length })}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
              <img key={src} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  );
}
