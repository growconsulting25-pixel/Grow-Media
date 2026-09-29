"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { projectHref } from "@/i18n/routing";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import {
  createDraft,
  getQuote,
  submitProject,
  updateDraft,
} from "@/lib/projects/client-api";
import { projectTypes, videoStyles, type Branding, type Project, type ProjectType, type Quote, type VideoStyle } from "@/lib/projects/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { UploadManager, type UploadedFile } from "./UploadManager";

const STEPS = ["type", "details", "upload", "style", "branding", "notes", "review"] as const;
type StepId = (typeof STEPS)[number];

const typeIcons: Record<ProjectType, IconName> = {
  listing_video: "play",
  walkthrough: "cube",
  ugc: "user",
  video_ad: "megaphone",
};

interface Props {
  initialProject: Project | null;
  initialFiles: UploadedFile[];
  initialStep?: string;
  initialType?: string;
  initialNotes?: string;
  initialIdeaId?: string;
}

export function CreateWizard({ initialProject, initialFiles, initialStep, initialType, initialNotes, initialIdeaId }: Props) {
  const { dict, locale } = useI18n();
  const t = dict.app.create;
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const startIndex = Math.max(0, STEPS.indexOf((initialStep as StepId) ?? "type"));
  const [step, setStep] = useState(initialProject ? Math.max(startIndex, 1) : 0);
  const [project, setProject] = useState<Project | null>(initialProject);
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    type: (initialProject?.type ?? (projectTypes.includes(initialType as ProjectType) ? initialType : "listing_video")) as ProjectType,
    address: initialProject?.address ?? "",
    title: initialProject?.title ?? "",
    description: initialProject?.description ?? "",
    style: initialProject?.style ?? null as VideoStyle | null,
    notes: initialProject?.notes ?? initialNotes ?? "",
    branding: (initialProject?.branding ?? { useBrandKit: true }) as Branding,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [submitted, setSubmitted] = useState<Project | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const current: StepId = STEPS[step];

  // Move focus to the step heading for screen-reader and keyboard users.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (current !== "review" || !supabase) return;
    getQuote(supabase).then(setQuote).catch(() => setQuote(null));
  }, [current, supabase]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const validate = (id: StepId): string | null => {
    if (id === "details" && !form.address.trim() && !form.title.trim()) return t.errors.address;
    if (id === "upload" && files.length === 0) return t.errors.files;
    if (id === "style" && !form.style) return t.errors.style;
    return null;
  };

  /** Persists the current step to the draft (creating it after the details step). */
  const persist = async (id: StepId) => {
    if (!supabase) return;
    if (id === "type" && !project) return;
    const patch = {
      type: form.type,
      address: form.address.trim() || null,
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      style: form.style,
      notes: form.notes.trim() || null,
      branding: form.branding,
    };
    if (!project) {
      const created = await createDraft(supabase, { type: form.type, address: patch.address ?? undefined, title: patch.title ?? undefined, description: patch.description ?? undefined, notes: patch.notes ?? undefined, idea_id: initialIdeaId });
      setProject(created);
      track("project_started", { type: form.type });
      window.history.replaceState(null, "", `?project=${created.id}`);
      return;
    }
    const updated = await updateDraft(supabase, project.id, patch);
    setProject(updated);
  };

  const goNext = async () => {
    const problem = validate(current);
    if (problem) return setError(problem);
    setBusy(true);
    try {
      await persist(current);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    } catch {
      setError(t.errors.save);
    } finally {
      setBusy(false);
    }
  };

  const goTo = (index: number) => {
    // Only allow jumping back, or forward over steps that are already valid.
    if (index > step && STEPS.slice(0, index).some((s) => validate(s))) return;
    if (index >= 2 && !project) return;
    setError(null);
    setStep(index);
  };

  const onSubmit = async () => {
    if (!supabase || !project) return;
    for (const s of STEPS) {
      const problem = validate(s);
      if (problem) {
        setError(problem);
        setStep(STEPS.indexOf(s));
        return;
      }
    }
    setBusy(true);
    setError(null);
    try {
      await persist("notes");
      const result = await submitProject(supabase, project.id);
      if (result.ok) {
        track("project_submitted", { type: project.type, free: result.project.is_free, files: files.length });
        setSubmitted(result.project);
        router.refresh();
      } else {
        setError(result.error === "already_submitted" ? t.errors.already : result.error === "payment_required" ? t.paymentRequired : t.errors.submit);
        if (result.error === "missing_files") setStep(STEPS.indexOf("upload"));
        if (result.error === "missing_details") setStep(STEPS.indexOf("details"));
      }
    } catch {
      setError(t.errors.submit);
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center" aria-live="polite">
        <span className="btn-primary mx-auto grid size-16 place-items-center rounded-full"><Icon name="check" className="size-7" /></span>
        <h1 className="display mt-6 text-4xl">{t.successTitle}</h1>
        <p className="mt-3 text-fg-muted">{t.successDescription}</p>
        <Link href={projectHref(locale, submitted.id)} className={buttonClasses({ size: "lg", className: "mt-8" })}>{t.viewProject}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-sm font-medium text-fg-muted">{t.title}</h1>

      {/* Stepper */}
      <nav aria-label={t.title} className="mt-3">
        <p className="text-xs font-medium tracking-wide text-brand-300 uppercase">
          {interpolate(t.stepOf, { current: step + 1, total: STEPS.length })} · {t.steps[current]}
        </p>
        <ol className="mt-3 grid grid-cols-7 gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={t.steps[s]}
                aria-current={i === step ? "step" : undefined}
                className={cn("block h-1.5 w-full rounded-full transition-colors duration-500", i <= step ? "bg-brand-600 text-on-brand" : "bg-white/10 hover:bg-white/20")}
              />
            </li>
          ))}
        </ol>
      </nav>

      <section className="mt-10" aria-live="polite">
        {current === "type" && (
          <Step title={t.typeTitle} headingRef={headingRef}>
            <div role="radiogroup" aria-label={t.typeTitle} className="grid gap-3 sm:grid-cols-2">
              {projectTypes.map((type) => {
                const active = form.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("type", type)}
                    className={cn(
                      "flex items-start gap-4 rounded-2xl p-5 text-left transition-all",
                      active ? "bg-brand-500/12 shadow-[inset_0_0_0_1.5px_rgba(0,171,255,0.6)]" : "surface hover:bg-white/[0.05]",
                    )}
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", active ? "btn-primary" : "bg-white/[0.05] text-fg-muted")}>
                      <Icon name={typeIcons[type]} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-medium">{dict.app.types[type].label}</span>
                      <span className="mt-1 block text-sm text-fg-muted">{dict.app.types[type].description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {current === "details" && (
          <Step title={t.detailsTitle} headingRef={headingRef}>
            <div className="space-y-5">
              <Field id="address" label={t.address}>
                <input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder={t.addressPlaceholder} autoComplete="street-address" className={inputClass} />
              </Field>
              <Field id="title" label={t.listingTitle}>
                <input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t.listingTitlePlaceholder} className={inputClass} />
              </Field>
              <Field id="description" label={t.description}>
                <textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t.descriptionPlaceholder} className={cn(inputClass, "h-auto py-3")} />
              </Field>
            </div>
          </Step>
        )}

        {current === "upload" && project && supabase && (
          <Step title={t.uploadTitle} headingRef={headingRef}>
            <UploadManager supabase={supabase} project={project} files={files} onFilesChange={setFiles} onBusyChange={setUploading} />
          </Step>
        )}

        {current === "style" && (
          <Step title={t.styleTitle} hint={t.styleHint} headingRef={headingRef}>
            <div role="radiogroup" aria-label={t.styleTitle} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {videoStyles.map((s) => {
                const active = form.style === s;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("style", s)}
                    className={cn(
                      "flex h-20 items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all",
                      active ? "btn-primary" : "surface text-fg-muted hover:text-fg",
                    )}
                  >
                    {s === "surprise" && <Icon name="sparkle" className="size-4" />}
                    {dict.app.styles[s]}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {current === "branding" && (
          <Step title={t.brandingTitle} headingRef={headingRef}>
            <div role="radiogroup" aria-label={t.brandingTitle} className="grid gap-3 sm:grid-cols-2">
              {[true, false].map((useKit) => {
                const active = form.branding.useBrandKit === useKit;
                return (
                  <button
                    key={String(useKit)}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("branding", { ...form.branding, useBrandKit: useKit })}
                    className={cn("rounded-2xl p-5 text-left transition-all", active ? "bg-brand-500/12 shadow-[inset_0_0_0_1.5px_rgba(0,171,255,0.6)]" : "surface")}
                  >
                    <span className="block font-medium">{useKit ? t.useBrandKit : t.customize}</span>
                    {useKit && <span className="mt-1 block text-sm text-fg-muted">{t.useBrandKitHint}</span>}
                  </button>
                );
              })}
            </div>
            {!form.branding.useBrandKit && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="agentName" label={t.agentName}>
                  <input id="agentName" value={form.branding.agentName ?? ""} onChange={(e) => set("branding", { ...form.branding, agentName: e.target.value })} className={inputClass} />
                </Field>
                <Field id="agency" label={t.agency}>
                  <input id="agency" value={form.branding.agency ?? ""} onChange={(e) => set("branding", { ...form.branding, agency: e.target.value })} className={inputClass} />
                </Field>
                <Field id="phone" label={t.phone}>
                  <input id="phone" type="tel" value={form.branding.phone ?? ""} onChange={(e) => set("branding", { ...form.branding, phone: e.target.value })} className={inputClass} />
                </Field>
                <Field id="primaryColor" label={t.primaryColor}>
                  <div className="flex items-center gap-3">
                    <input id="primaryColor" type="color" value={form.branding.primaryColor ?? "#00abff"} onChange={(e) => set("branding", { ...form.branding, primaryColor: e.target.value })} className="h-11 w-16 cursor-pointer rounded-lg bg-transparent" />
                    <span className="font-mono text-sm text-fg-muted">{form.branding.primaryColor ?? "#00abff"}</span>
                  </div>
                </Field>
              </div>
            )}
          </Step>
        )}

        {current === "notes" && (
          <Step title={t.notesTitle} headingRef={headingRef}>
            <Field id="notes" label={`${t.notesLabel} (${t.optional})`}>
              <textarea id="notes" rows={6} maxLength={3000} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t.notesPlaceholder} className={cn(inputClass, "h-auto py-3")} />
            </Field>
          </Step>
        )}

        {current === "review" && (
          <Step title={t.reviewTitle} headingRef={headingRef}>
            <ReviewSummary form={form} fileCount={files.length} quote={quote} onEdit={(s) => goTo(STEPS.indexOf(s))} />
          </Step>
        )}
      </section>

      {error && <p role="alert" className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}{error === t.paymentRequired && <> <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></>}</p>}

      {/* Actions — sticky on mobile so the next step is always reachable */}
      <div className="glass sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 -mx-4 mt-10 flex items-center gap-3 border-t border-white/[0.06] px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:bottom-0">
        {step > 0 && (
          <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={busy}>
            {t.back}
          </Button>
        )}
        {current === "review" ? (
          <Button size="lg" arrow className="ml-auto" onClick={onSubmit} disabled={busy || uploading || quote?.mode === "payment_required"}>
            {busy ? t.submitting : t.submit}
          </Button>
        ) : (
          <Button size="lg" arrow className="ml-auto" onClick={goNext} disabled={busy || uploading}>
            {busy ? t.saving : t.next}
          </Button>
        )}
      </div>
    </div>
  );

}

interface ReviewForm {
  type: ProjectType;
  address: string;
  title: string;
  style: VideoStyle | null;
  notes: string;
  branding: Branding;
}

function ReviewSummary({ form: f, fileCount, quote: q, onEdit }: { form: ReviewForm; fileCount: number; quote: Quote | null; onEdit: (s: StepId) => void }) {
    const { dict, locale } = useI18n();
    const t = dict.app.create;
    const rows: { step: StepId; label: string; value: string }[] = [
      { step: "type", label: dict.app.project.type, value: dict.app.types[f.type].label },
      { step: "details", label: t.address, value: f.address || f.title || t.notSet },
      { step: "upload", label: t.files, value: interpolate(t.uploaded, { count: fileCount }) },
      { step: "style", label: t.style, value: f.style ? dict.app.styles[f.style] : t.notSet },
      { step: "branding", label: t.branding, value: f.branding.useBrandKit ? t.brandKit : t.custom },
      { step: "notes", label: dict.app.project.notes, value: f.notes || "—" },
    ];
    return (
      <div className="surface overflow-hidden rounded-[var(--radius-panel)]">
        <p className="border-b border-white/[0.06] px-5 py-3 text-sm font-medium text-fg-muted">{t.summary}</p>
        <dl className="divide-y divide-white/[0.06]">
          {rows.map((r) => (
            <div key={r.step} className="flex items-start justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <dt className="text-xs text-fg-subtle">{r.label}</dt>
                <dd className="mt-0.5 truncate text-sm">{r.value}</dd>
              </div>
              <button type="button" onClick={() => onEdit(r.step)} className="shrink-0 text-xs text-brand-300 hover:underline">{t.edit}</button>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <div>
            <p className="text-sm font-medium">{t.total}</p>
            {q?.mode === "free" && <p className="mt-0.5 flex items-center gap-1 text-xs text-success"><Icon name="check" className="size-3.5" /> {t.firstVideoFree}</p>}
            {q?.mode === "subscription" && <p className="mt-0.5 text-xs text-fg-muted">{interpolate(t.includedInPlan, { used: q.used, included: q.included })}</p>}
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{q ? formatPrice(q.price_cents / 100, locale) : "…"}</p>
        </div>
        {q?.mode === "payment_required" && (
          <p className="border-t border-white/[0.06] px-5 py-4 text-sm text-fg-muted">
            {t.paymentRequired} <a className="text-brand-300 underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        )}
      </div>
    );
  }

const inputClass =
  "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-[0.95rem] text-fg placeholder:text-fg-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]";

function Step({ title, hint, headingRef, children }: { title: string; hint?: string; headingRef: React.RefObject<HTMLHeadingElement | null>; children: React.ReactNode }) {
  return (
    <div className="animate-[stage-in_0.5s_var(--ease-out-expo)]">
      <h2 ref={headingRef} tabIndex={-1} className="display text-3xl outline-none sm:text-4xl">{title}</h2>
      {hint && <p className="mt-2 text-fg-muted">{hint}</p>}
      <div className="mt-8">{children}</div>
      <style>{`@keyframes stage-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

