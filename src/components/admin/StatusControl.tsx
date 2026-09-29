"use client";

import { useState, useTransition } from "react";
import { updateProjectStatus } from "@/app/[locale]/admin/actions";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import type { ProjectStatus } from "@/lib/projects/types";

const STAFF_STATUSES: ProjectStatus[] = ["submitted", "in_production", "review", "ready", "revision_requested", "completed", "cancelled"];

export function StatusControl({ projectId, current }: { projectId: string; current: ProjectStatus }) {
  const { dict } = useI18n();
  const t = dict.app.admin;
  const [value, setValue] = useState<ProjectStatus>(current);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="admin-status" className="mb-1.5 block text-sm font-medium">{t.changeStatus}</label>
        <select id="admin-status" value={value} onChange={(e) => { setValue(e.target.value as ProjectStatus); setMsg(null); }}
          className="h-11 rounded-xl bg-white/[0.04] px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]">
          {STAFF_STATUSES.map((s) => <option key={s} value={s}>{t.statusLabels[s]}</option>)}
        </select>
      </div>
      <Button disabled={pending || value === current} onClick={() => start(async () => {
        const r = await updateProjectStatus(projectId, value);
        setMsg(r.ok ? t.statusUpdated : t.error);
      })}>{t.updateStatus}</Button>
      {msg && <p role="status" className="text-sm text-fg-muted">{msg}</p>}
    </div>
  );
}
