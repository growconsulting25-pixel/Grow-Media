"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { localeTags } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { projectHref } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  project_id: string | null;
  payload: { title?: string | null };
  read_at: string | null;
  created_at: string;
}

/** In-app notifications with live updates (Supabase Realtime, RLS-filtered). */
export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const { dict, locale } = useI18n();
  const t = dict.app.notifications;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[] | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
    const list = (data ?? []) as Notification[];
    setItems(list);
    setUnread(list.filter((n) => !n.read_at).length);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const channel = supabase
      .channel(`notifications:${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setUnread((n) => n + 1);
        setItems((list) => (list ? [payload.new as Notification, ...list] : list));
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !panelRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markAll = async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const now = new Date().toISOString();
    setItems((list) => list?.map((n) => ({ ...n, read_at: n.read_at ?? now })) ?? list);
    setUnread(0);
    await supabase.from("notifications").update({ read_at: now }).is("read_at", null);
  };

  const label = (n: Notification) => {
    const template = t.types[n.type as keyof typeof t.types] ?? n.type;
    return interpolate(template, { title: n.payload?.title || t.fallbackTitle });
  };
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        aria-label={`${t.title}${unread ? ` — ${interpolate(t.unread, { count: unread })}` : ""}`}
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          if (!items) void load();
        }}
        className="relative grid size-9 place-items-center rounded-full bg-white/[0.05] text-fg-muted transition-colors hover:text-fg"
      >
        <Icon name="bell" className="size-4" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-violet-500 px-1 text-[0.6rem] font-semibold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="surface-raised absolute top-11 right-0 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl lg:right-auto lg:left-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium">{t.title}</p>
            {unread > 0 && <button type="button" onClick={markAll} className="text-xs text-violet-300 hover:underline">{t.markAll}</button>}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items === null ? (
              <li className="px-4 py-6 text-center text-sm text-fg-subtle">…</li>
            ) : items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-fg-subtle">{t.empty}</li>
            ) : (
              items.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.project_id ? projectHref(locale, n.project_id) : "#"}
                    onClick={() => setOpen(false)}
                    className={cn("flex gap-3 border-b border-white/[0.04] px-4 py-3 text-sm transition-colors hover:bg-white/[0.03]", !n.read_at && "bg-violet-500/[0.05]")}
                  >
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read_at ? "bg-transparent" : "bg-violet-400")} />
                    <span className="min-w-0">
                      <span className="block text-fg">{label(n)}</span>
                      <span className="text-xs text-fg-subtle">{fmt.format(new Date(n.created_at))}</span>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
