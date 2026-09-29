"use client";

import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { addAdmin, removeAdmin, type TeamResult } from "./actions";

const input =
  "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-[0.95rem] text-fg placeholder:text-fg-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]";

export function AddAdminForm({ locale }: { locale: string }) {
  const { dict } = useI18n();
  const t = dict.app.admin.team;
  const [state, action, pending] = useActionState<TeamResult, FormData>(addAdmin, { status: "idle" });
  const message =
    state.status === "created" ? t.created
    : state.status === "promoted" ? t.promoted
    : state.status === "already" ? t.already
    : state.status === "invalidEmail" ? t.invalidEmail
    : state.status === "error" ? dict.app.admin.error
    : null;
  const good = state.status === "created" || state.status === "promoted";

  return (
    <form action={action} className="surface grid gap-4 rounded-[var(--radius-panel)] p-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-sm font-medium">
        {t.firstName}
        <input name="firstName" autoComplete="off" className={`${input} mt-1.5`} />
      </label>
      <label className="block text-sm font-medium">
        {t.lastName}
        <input name="lastName" autoComplete="off" className={`${input} mt-1.5`} />
      </label>
      <label className="block text-sm font-medium sm:col-span-2">
        {t.email}
        <input name="email" type="email" required autoComplete="off" className={`${input} mt-1.5`} />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={pending}>{pending ? t.adding : t.submit}</Button>
        {message && <p role="status" className={good ? "text-sm text-success" : "text-sm text-red-300"}>{message}</p>}
      </div>
    </form>
  );
}

export function RemoveAdminButton({ userId, label, done }: { userId: string; label: string; done: string }) {
  const [pending, start] = useTransition();
  const [removed, setRemoved] = useState(false);
  if (removed) return <span className="text-sm text-fg-muted">{done}</span>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => setRemoved((await removeAdmin(userId)).ok))}
      className="rounded-full px-3 py-1.5 text-sm text-red-300 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.35)] transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
