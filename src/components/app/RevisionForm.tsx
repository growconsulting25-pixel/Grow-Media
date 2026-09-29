"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/** Converts "1:05" or "65" to seconds. Returns null for empty/invalid input. */
function parseTimestamp(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const parts = v.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

export function RevisionForm({ projectId }: { projectId: string }) {
  const { dict } = useI18n();
  const t = dict.app.revision;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [stamp, setStamp] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"sent" | "error" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !message.trim()) return;
    setBusy(true);
    const { error } = await supabase.rpc("request_revision", { p_project_id: projectId, p_message: message.trim(), p_timestamp: parseTimestamp(stamp) });
    setBusy(false);
    setResult(error ? "error" : "sent");
    if (!error) router.refresh();
  };

  if (result === "sent") return <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">{t.sent}</p>;

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Icon name="revise" className="size-4" /> {dict.app.project.requestRevision}
      </Button>
    );
  }

  return (
    <form id="revision" onSubmit={submit} className="w-full space-y-4 rounded-2xl bg-white/[0.03] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
      <div>
        <p className="font-medium">{t.title}</p>
        <p className="mt-0.5 text-sm text-fg-muted">{t.intro}</p>
      </div>
      <div>
        <label htmlFor="revision-message" className="mb-1.5 block text-sm font-medium">{t.whatLabel}</label>
        <textarea id="revision-message" required rows={4} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.whatPlaceholder}
          className="w-full rounded-xl bg-white/[0.04] px-3.5 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-violet-400)]" />
      </div>
      <div className="max-w-40">
        <label htmlFor="revision-stamp" className="mb-1.5 block text-sm font-medium">{t.timestampLabel}</label>
        <input id="revision-stamp" inputMode="numeric" value={stamp} onChange={(e) => setStamp(e.target.value)} placeholder={t.timestampHint}
          className="h-10 w-full rounded-xl bg-white/[0.04] px-3.5 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-violet-400)]" />
      </div>
      {result === "error" && <p role="alert" className="text-sm text-red-300">{t.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy || !message.trim()}>{t.submit}</Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
      </div>
    </form>
  );
}
