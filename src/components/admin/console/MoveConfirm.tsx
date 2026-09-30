"use client";

import { useState, useTransition } from "react";
import { updateProjectStatus } from "@/app/[locale]/admin/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useI18n } from "@/i18n/I18nProvider";
import { interpolate } from "@/i18n/interpolate";
import { NOTIFYING_STATUSES } from "@/lib/admin/statuses";
import type { ProjectStatus } from "@/lib/projects/types";

export interface PendingMove {
  id: string;
  title: string;
  client: string;
  from: ProjectStatus;
  to: ProjectStatus;
}

/**
 * Confirms a status change before it happens. Emailing the client is a
 * separate, visible choice (on by default only when the video is ready), so
 * moving cards around never spams a realtor.
 */
export function MoveConfirm({ move, onClose, onDone }: { move: PendingMove | null; onClose: () => void; onDone: (move: PendingMove, notified: boolean) => void }) {
  const { dict } = useI18n();
  const t = dict.app.admin.console.production;
  const labels = dict.app.admin.statusLabels;
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  // Remount per move so the default follows the target status.
  const key = move ? `${move.id}:${move.to}` : "none";

  return (
    <Modal open={!!move} onClose={onClose} title={move ? interpolate(t.confirmTitle, { status: labels[move.to] }) : ""} className="max-w-md">
      {move && <Body key={key} move={move} pending={pending} error={error} onCancel={onClose} onConfirm={(notify) => start(async () => {
        setError(false);
        const r = await updateProjectStatus(move.id, move.to, notify);
        if (r.ok) onDone(move, r.notified);
        else setError(true);
      })} labels={{ ...t, error: dict.app.admin.error }} />}
    </Modal>
  );
}

function Body({ move, pending, error, onCancel, onConfirm, labels: t }: {
  move: PendingMove; pending: boolean; error: boolean; onCancel: () => void; onConfirm: (notify: boolean) => void;
  labels: { confirmBody: string; notify: string; notifyHint: string; noEmail: string; confirm: string; cancel: string; error: string };
}) {
  const canEmail = NOTIFYING_STATUSES.includes(move.to);
  const [notify, setNotify] = useState(move.to === "ready");
  return (
    <div className="space-y-5 px-6 pt-3 pb-6">
      <p className="text-sm text-fg-muted">{interpolate(t.confirmBody, { title: move.title, client: move.client })}</p>
      {canEmail ? (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white/[0.04] p-4">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-brand-500)]" />
          <span>
            <span className="block text-sm font-medium">{t.notify}</span>
            <span className="mt-1 block text-xs text-fg-subtle">{t.notifyHint}</span>
          </span>
        </label>
      ) : (
        <p className="rounded-xl bg-white/[0.04] p-4 text-xs text-fg-subtle">{t.noEmail}</p>
      )}
      {error && <p role="alert" className="text-sm text-red-300">{t.error}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={pending}>{t.cancel}</Button>
        <Button onClick={() => onConfirm(canEmail && notify)} disabled={pending}>{t.confirm}</Button>
      </div>
    </div>
  );
}
