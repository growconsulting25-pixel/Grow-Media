"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { STAFF_STATUSES } from "@/lib/admin/statuses";
import type { ProjectStatus } from "@/lib/projects/types";
import { MoveConfirm, type PendingMove } from "./console/MoveConfirm";

/** Status picker on the project page; every change goes through the confirmation dialog. */
export function StatusControl({ projectId, current, title, client }: { projectId: string; current: ProjectStatus; title: string; client: string }) {
  const { dict } = useI18n();
  const t = dict.app.admin;
  const router = useRouter();
  const [value, setValue] = useState<ProjectStatus>(current);
  const [move, setMove] = useState<PendingMove | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="admin-status" className="mb-1.5 block text-sm font-medium">{t.changeStatus}</label>
        <select id="admin-status" value={value} onChange={(e) => { setValue(e.target.value as ProjectStatus); setMsg(null); }}
          className="h-11 rounded-xl bg-ink-900 px-3 text-sm text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]">
          {STAFF_STATUSES.map((s) => <option key={s} value={s}>{t.statusLabels[s]}</option>)}
        </select>
      </div>
      <Button disabled={value === current} onClick={() => setMove({ id: projectId, title, client, from: current, to: value })}>{t.updateStatus}</Button>
      {msg && <p role="status" className="text-sm text-success">{msg}</p>}
      <MoveConfirm move={move} onClose={() => setMove(null)} onDone={(_, notified) => {
        setMove(null);
        setMsg(notified ? t.console.production.movedNotified : t.console.production.moved);
        router.refresh();
      }} />
    </div>
  );
}
