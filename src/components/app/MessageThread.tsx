"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { localeTags } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import type { Message } from "@/lib/projects/server";
import { PROJECT_BUCKET } from "@/lib/projects/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const MAX_ATTACHMENT = 25 * 1024 * 1024;

/** Simple per-project conversation with the production team. Live via Realtime. */
export function MessageThread({ projectId, userId, initial }: { projectId: string; userId: string; initial: Message[] }) {
  const { dict, locale } = useI18n();
  const t = dict.app.messages;
  const [messages, setMessages] = useState(initial);
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const channel = supabase
      .channel(`messages:${projectId}:${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${projectId}` }, (payload) => {
        const m = payload.new as Message;
        setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]));
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    const supabase = getSupabaseBrowser();
    if (!text || !supabase) return;
    setBusy(true);
    setError(null);
    try {
      let attachment_path: string | null = null;
      let attachment_url: string | undefined;
      if (file) {
        const path = `${userId}/${projectId}/messages/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "-").slice(-80)}`;
        const { error: upErr } = await supabase.storage.from(PROJECT_BUCKET).upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        attachment_path = path;
        attachment_url = URL.createObjectURL(file);
      }
      const { data, error: insErr } = await supabase
        .from("messages")
        .insert({ project_id: projectId, author_id: userId, body: text, attachment_path })
        .select()
        .single();
      if (insErr) throw insErr;
      setMessages((list) => (list.some((x) => x.id === data.id) ? list : [...list, { ...(data as Message), attachment_url }]));
      setBody("");
      setFile(null);
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="messages" aria-labelledby="messages-title" className="surface scroll-mt-24 rounded-[var(--radius-panel)] p-6">
      <h2 id="messages-title" className="text-lg font-semibold tracking-tight">{t.thread}</h2>
      {messages.length === 0 ? (
        <p className="mt-4 text-sm text-fg-subtle">{t.none}</p>
      ) : (
        <ol ref={listRef} className="mt-5 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {messages.map((m) => {
            const mine = !m.is_staff;
            return (
              <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", mine ? "rounded-br-sm bg-violet-600/80 text-white" : "rounded-bl-sm bg-white/[0.06] text-fg")}>
                  <p className={cn("mb-0.5 text-[0.7rem]", mine ? "text-white/70" : "text-violet-300")}>{mine ? t.you : t.team} · {fmt.format(new Date(m.created_at))}</p>
                  <p className="whitespace-pre-line">{m.body}</p>
                  {m.attachment_path && (
                    m.attachment_url ? (
                      <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs underline"><Icon name="paperclip" className="size-3.5" /> {t.attachment}</a>
                    ) : (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-xs opacity-70"><Icon name="paperclip" className="size-3.5" /> {t.attachment}</span>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <form onSubmit={send} className="mt-5 space-y-2">
        <label htmlFor="message-body" className="sr-only">{t.placeholder}</label>
        <textarea id="message-body" rows={3} maxLength={5000} value={body} onChange={(e) => setBody(e.target.value)} placeholder={t.placeholder}
          className="w-full rounded-xl bg-white/[0.04] px-3.5 py-3 text-sm text-fg placeholder:text-fg-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-violet-400)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1.5 hover:text-fg">
              <Icon name="paperclip" className="size-3.5" /> {t.attach}
            </button>
            {file && (
              <span className="inline-flex items-center gap-1.5">
                <span className="max-w-40 truncate">{file.name}</span>
                <button type="button" aria-label={t.removeAttachment} onClick={() => setFile(null)} className="text-fg-subtle hover:text-fg"><Icon name="close" className="size-3.5" /></button>
              </span>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4" className="sr-only" tabIndex={-1}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f && f.size <= MAX_ATTACHMENT ? f : null);
                e.target.value = "";
              }} />
          </div>
          <Button type="submit" size="sm" disabled={busy || !body.trim()}>
            <Icon name="send" className="size-3.5" /> {busy ? t.sending : t.send}
          </Button>
        </div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </form>
    </section>
  );
}
