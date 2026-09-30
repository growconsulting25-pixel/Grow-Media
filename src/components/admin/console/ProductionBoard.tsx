"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { localeTags } from "@/i18n/config";
import type { ProjectRow } from "@/lib/admin/stats";
import { BOARD_COLUMNS, STAFF_STATUSES } from "@/lib/admin/statuses";
import { cn } from "@/lib/cn";
import type { ProjectStatus } from "@/lib/projects/types";
import { accents, type Accent } from "./accents";
import { MoveConfirm, type PendingMove } from "./MoveConfirm";

const columnAccent: Record<ProjectStatus, Accent> = {
  draft: "cyan", submitted: "cyan", in_production: "amber", review: "orange",
  revision_requested: "rose", ready: "emerald", completed: "emerald", cancelled: "rose",
};

export function ProductionBoard({ projects, view, status }: { projects: ProjectRow[]; view: "board" | "list"; status: ProjectStatus | null }) {
  const { dict, locale } = useI18n();
  const t = dict.app.admin.console.production;
  const labels = dict.app.admin.statusLabels;
  const router = useRouter();
  const base = `/${locale}/admin/production`;
  const [rows, setRows] = useState(projects);
  const [move, setMove] = useState<PendingMove | null>(null);
  const [dragOver, setDragOver] = useState<ProjectStatus | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const ask = (p: ProjectRow, to: ProjectStatus) => {
    if (p.status !== to) setMove({ id: p.id, title: p.title, client: p.clientName, from: p.status, to });
  };
  const byId = (id: string) => rows.find((r) => r.id === id);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label={t.title} className="inline-flex rounded-full bg-white/[0.04] p-1">
          {(["board", "list"] as const).map((v) => (
            <Link key={v} role="tab" aria-selected={view === v} href={`${base}?view=${v}`}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", view === v ? "bg-amber-400/15 text-amber-200" : "text-fg-muted hover:text-fg")}>
              {t[v]}
            </Link>
          ))}
        </div>
        {view === "board" && <p className="text-xs text-fg-subtle">{t.dragHint}</p>}
      </div>

      {toast && <p role="status" className="mt-4 rounded-xl bg-success/10 px-4 py-2.5 text-sm text-success">{toast}</p>}

      {view === "board" ? (
        <div className="no-scrollbar -mx-4 mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:px-0">
          {BOARD_COLUMNS.map((col) => {
            const items = rows.filter((r) => r.status === col);
            const a = accents[columnAccent[col]];
            return (
              <section
                key={col}
                aria-label={labels[col]}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col); }}
                onDragLeave={() => setDragOver((c) => (c === col ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const p = byId(e.dataTransfer.getData("text/plain"));
                  if (p) ask(p, col);
                }}
                className={cn("surface relative flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-panel)] transition-colors", dragOver === col && "bg-white/[0.06]")}
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-0.5", a.line)} />
                <header className="flex items-center justify-between px-4 pt-4 pb-3">
                  <h2 className="text-sm font-semibold">{labels[col]}</h2>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs tabular-nums", a.chip)}>{items.length}</span>
                </header>
                <div className="flex min-h-40 flex-1 flex-col gap-2.5 px-3 pb-3">
                  {items.length ? items.map((p) => <BoardCard key={p.id} p={p} onMove={(to) => ask(p, to)} />) : (
                    <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-white/10 text-xs text-fg-subtle">{t.empty}</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <ListView rows={rows} status={status} base={base} onMove={ask} />
      )}

      <MoveConfirm
        move={move}
        onClose={() => setMove(null)}
        onDone={(m, notified) => {
          setRows((rs) => rs.map((r) => (r.id === m.id ? { ...r, status: m.to } : r)));
          setMove(null);
          setToast(notified ? t.movedNotified : t.moved);
          router.refresh();
        }}
      />
    </div>
  );
}

/** A draggable card. The whole card opens the project; "Move" opens the status menu (works on touch too). */
function BoardCard({ p, onMove }: { p: ProjectRow; onMove: (to: ProjectStatus) => void }) {
  const { dict, locale } = useI18n();
  const t = dict.app.admin.console.production;
  const date = p.submittedAt ? new Intl.DateTimeFormat(localeTags[locale], { day: "numeric", month: "short" }).format(new Date(p.submittedAt)) : "";
  return (
    <article
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", p.id); e.dataTransfer.effectAllowed = "move"; }}
      className="group relative cursor-grab rounded-xl bg-ink-850 p-3.5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_7%,transparent)] transition-colors hover:bg-ink-800 active:cursor-grabbing"
    >
      <Link href={`/${locale}/admin/projects/${p.id}`} className="absolute inset-0 rounded-xl" aria-label={p.title} draggable={false} />
      <p className="pr-8 text-sm font-medium leading-snug">{p.title}</p>
      <p className="mt-1 truncate text-xs text-fg-muted">{p.clientName}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-fg-subtle">
        <span>{dict.app.types[p.type].label}</span>
        {date && <span>· {date}</span>}
        <span>· {interpolate(t.files, { count: p.files })}</span>
        {p.isFree && <span className="rounded-full bg-brand-500/15 px-1.5 text-brand-300">{dict.app.admin.free}</span>}
      </p>
      <MoveMenu current={p.status} onMove={onMove} />
    </article>
  );
}

function MoveMenu({ current, onMove }: { current: ProjectStatus; onMove: (to: ProjectStatus) => void }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute top-2.5 right-2.5 z-10">
      <button type="button" aria-label={dict.app.admin.console.production.move} aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="grid size-7 place-items-center rounded-lg text-fg-subtle hover:bg-white/10 hover:text-fg">
        <Icon name="arrowRight" className="size-3.5" />
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-48 overflow-hidden rounded-xl bg-ink-900 py-1 shadow-xl ring-1 ring-white/10" onMouseLeave={() => setOpen(false)}>
          {STAFF_STATUSES.filter((s) => s !== current).map((s) => (
            <li key={s}>
              <button type="button" onClick={() => { setOpen(false); onMove(s); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/[0.06]">
                <span className={cn("size-2 rounded-full", accents[columnAccent[s]].bar)} />
                {dict.app.admin.statusLabels[s]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListView({ rows, status, base, onMove }: { rows: ProjectRow[]; status: ProjectStatus | null; base: string; onMove: (p: ProjectRow, to: ProjectStatus) => void }) {
  const { dict, locale } = useI18n();
  const t = dict.app.admin;
  const shown = status ? rows.filter((r) => r.status === status) : rows;
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });
  const cell = "block px-4 py-3";

  return (
    <>
      <nav aria-label={t.queue} className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
        <Link href={`${base}?view=list`} aria-current={!status ? "page" : undefined}
          className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm", !status ? "bg-white/10 text-fg" : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
          {t.tabs.all} <span className="rounded-full bg-white/[0.08] px-1.5 text-xs tabular-nums">{rows.length}</span>
        </Link>
        {STAFF_STATUSES.map((s) => {
          const a = accents[columnAccent[s]];
          const active = status === s;
          return (
            <Link key={s} href={`${base}?view=list&status=${s}`} aria-current={active ? "page" : undefined}
              className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm", active ? a.tab : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
              <span className={cn("size-2 rounded-full", a.bar)} />
              {t.statusLabels[s]}
              <span className="rounded-full bg-white/[0.08] px-1.5 text-xs tabular-nums">{rows.filter((r) => r.status === s).length}</span>
            </Link>
          );
        })}
      </nav>

      {shown.length ? (
        <div className="surface mt-5 overflow-x-auto rounded-[var(--radius-card)]">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">{t.columns.project}</th>
                <th className="px-4 py-3 font-medium">{t.columns.client}</th>
                <th className="px-4 py-3 font-medium">{t.columns.type}</th>
                <th className="px-4 py-3 font-medium">{t.columns.submitted}</th>
                <th className="px-4 py-3 text-right font-medium">{t.columns.files}</th>
                <th className="px-4 py-3 font-medium">{t.columns.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {shown.map((r) => {
                const link = `/${locale}/admin/projects/${r.id}`;
                const a = accents[columnAccent[r.status]];
                return (
                  <tr key={r.id} className="cursor-pointer transition-colors hover:bg-white/[0.04]">
                    <td className="p-0"><Link href={link} className={cn(cell, "font-medium")}>{r.title}{r.isFree && <span className="ml-2 rounded-full bg-brand-500/15 px-2 py-0.5 text-[0.7rem] text-brand-300">{t.free}</span>}</Link></td>
                    <td className="p-0"><Link href={link} className={cell}><span className="block">{r.clientName}</span><span className="block text-xs text-fg-subtle">{r.clientEmail}</span></Link></td>
                    <td className="p-0"><Link href={link} className={cn(cell, "text-fg-muted")}>{dict.app.types[r.type].label}</Link></td>
                    <td className="p-0"><Link href={link} className={cn(cell, "text-fg-muted tabular-nums")}>{r.submittedAt ? fmt.format(new Date(r.submittedAt)) : "—"}</Link></td>
                    <td className="p-0 text-right"><Link href={link} className={cn(cell, "tabular-nums")}>{r.files}</Link></td>
                    <td className="px-4 py-2">
                      <select
                        aria-label={t.changeStatus}
                        value={r.status}
                        onChange={(e) => onMove(r, e.target.value as ProjectStatus)}
                        className={cn("h-9 rounded-lg bg-ink-900 px-2.5 text-sm text-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_12%,transparent)] outline-none", a.text)}
                      >
                        {STAFF_STATUSES.map((s) => <option key={s} value={s}>{t.statusLabels[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </>
  );
}
