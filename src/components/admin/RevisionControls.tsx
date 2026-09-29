"use client";

import { useTransition } from "react";
import { updateRevisionStatus } from "@/app/[locale]/admin/actions";
import { useI18n } from "@/i18n/I18nProvider";

export function RevisionControls({ id, status }: { id: string; status: "open" | "in_progress" | "done" }) {
  const { dict } = useI18n();
  const t = dict.app.admin;
  const [pending, start] = useTransition();
  if (status === "done") return null;
  const btn = "rounded-full bg-white/[0.06] px-3 py-1 text-xs hover:bg-white/10 disabled:opacity-50";
  return (
    <div className="flex gap-2">
      {status === "open" && <button type="button" disabled={pending} className={btn} onClick={() => start(async () => { await updateRevisionStatus(id, "in_progress"); })}>{t.markInProgress}</button>}
      <button type="button" disabled={pending} className={btn} onClick={() => start(async () => { await updateRevisionStatus(id, "done"); })}>{t.markDone}</button>
    </div>
  );
}
