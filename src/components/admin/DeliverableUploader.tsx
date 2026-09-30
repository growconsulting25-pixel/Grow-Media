"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { recordDeliverable } from "@/app/[locale]/admin/actions";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { supabaseAnonKey } from "@/lib/supabase/env";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const input =
  "w-full rounded-xl bg-white/[0.04] px-3.5 text-sm text-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_9%,transparent)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]";

/** Staff upload of the final video into the client's private deliverables folder. */
export function DeliverableUploader({ projectId, clientId }: { projectId: string; clientId: string }) {
  const { dict } = useI18n();
  const t = dict.app.admin;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("9:16");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [markReady, setMarkReady] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !file) return;
    setMsg(null);
    setProgress(0);
    try {
      const safe = file.name.replace(/[^\w.-]+/g, "-").slice(-80);
      const path = `${clientId}/${projectId}/${crypto.randomUUID()}-${safe}`;
      const { data: signed, error } = await supabase.storage.from("deliverables").createSignedUploadUrl(path);
      if (error || !signed) throw error ?? new Error("sign");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed.signedUrl);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.setRequestHeader("apikey", supabaseAnonKey);
        xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(ev.loaded / ev.total);
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(String(xhr.status))));
        xhr.onerror = () => reject(new Error("network"));
        const body = new FormData();
        body.append("cacheControl", "3600");
        body.append("", file);
        xhr.send(body);
      });
      const r = await recordDeliverable({ projectId, storagePath: path, format, caption, hashtags, markReady });
      if (!r.ok) throw new Error("record");
      setMsg(t.delivered);
      setFile(null);
      router.refresh();
    } catch {
      setMsg(t.error);
    } finally {
      setProgress(null);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="dv-file" className="mb-1.5 block text-sm font-medium">{t.videoFile}</label>
        <input id="dv-file" type="file" accept="video/mp4" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-fg-muted file:mr-3 file:rounded-full file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-fg" />
      </div>
      <div>
        <label htmlFor="dv-format" className="mb-1.5 block text-sm font-medium">{t.format}</label>
        <select id="dv-format" value={format} onChange={(e) => setFormat(e.target.value)} className={`${input} h-10`}>
          {["9:16", "16:9", "4:5", "1:1"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="dv-caption" className="mb-1.5 block text-sm font-medium">{t.caption}</label>
        <textarea id="dv-caption" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} className={`${input} py-2.5`} />
      </div>
      <div>
        <label htmlFor="dv-tags" className="mb-1.5 block text-sm font-medium">{t.hashtags}</label>
        <input id="dv-tags" value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#justlisted #realestate" className={`${input} h-10`} />
      </div>
      <label className="flex items-center gap-2 text-sm text-fg-muted">
        <input type="checkbox" checked={markReady} onChange={(e) => setMarkReady(e.target.checked)} className="size-4 accent-[var(--color-brand-500)]" />
        {t.markReady}
      </label>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={!file || progress !== null}>
          {progress !== null ? interpolate(t.uploading, { pct: Math.round(progress * 100) }) : t.upload}
        </Button>
        {msg && <p role="status" className="text-sm text-fg-muted">{msg}</p>}
      </div>
    </form>
  );
}
