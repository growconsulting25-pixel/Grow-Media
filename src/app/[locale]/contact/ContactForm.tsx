"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { authInputClass } from "../login/authInputClass";
import { sendContactMessage } from "./actions";
import { CONTACT_TOPICS, type ContactState } from "./shared";

const label = "mb-1.5 block text-sm font-medium";

export function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const { dict, locale } = useI18n();
  const t = dict.pages.contact.form;
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-2xl btn-primary">
          <Icon name="check" className="size-5" />
        </span>
        <p className="max-w-sm text-lg font-medium tracking-tight">{t.sent}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="c-name" className={label}>{t.name}</label>
        <input id="c-name" name="name" required maxLength={120} autoComplete="name" className={authInputClass} />
      </div>
      <div>
        <label htmlFor="c-email" className={label}>{t.email}</label>
        <input id="c-email" name="email" type="email" required maxLength={254} autoComplete="email" className={authInputClass} />
      </div>
      <div>
        <label htmlFor="c-phone" className={label}>{t.phone}</label>
        <input id="c-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={authInputClass} />
      </div>
      <div>
        <label htmlFor="c-agency" className={label}>{t.agency}</label>
        <input id="c-agency" name="agency" maxLength={120} autoComplete="organization" className={authInputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className={label}>{t.topic}</label>
        <div className="relative">
          <select
            id="c-topic"
            name="topic"
            defaultValue={CONTACT_TOPICS.includes(initialTopic as never) ? initialTopic : "question"}
            className={`${authInputClass} appearance-none pr-10 [&_option]:bg-ink-900 [&_option]:text-fg`}
          >
            {CONTACT_TOPICS.map((id) => (
              <option key={id} value={id}>{t.topics[id]}</option>
            ))}
          </select>
          <Icon name="arrowDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-fg-subtle" />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className={label}>{t.message}</label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder={t.messagePlaceholder}
          className={`${authInputClass} h-auto resize-y py-3 placeholder:text-fg-subtle`}
        />
      </div>
      {(state.status === "invalid" || state.status === "error") && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:col-span-2">
          {state.status === "invalid" ? t.invalid : t.error}
        </p>
      )}
      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-subtle">{t.privacy}</p>
        <Button type="submit" arrow disabled={pending}>{pending ? t.sending : t.submit}</Button>
      </div>
    </form>
  );
}
