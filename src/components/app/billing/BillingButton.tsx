"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics";

type Action =
  | { kind: "subscription"; plan: "agent" | "pro" }
  | { kind: "single"; projectId: string }
  | { kind: "portal" };

/** Sends the client to Stripe Checkout or the billing portal. */
export function BillingButton({ action, children, variant = "primary", className }: { action: Action; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  const { dict, locale } = useI18n();
  const t = dict.app.billing;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    setBusy(true);
    setError(null);
    if (action.kind === "subscription") track("plan_selected", { plan: action.plan, location: "app" });
    try {
      const res = await fetch(action.kind === "portal" ? "/api/stripe/portal" : "/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...action, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (data.url) {
        if (action.kind === "subscription") track("subscription_started", { plan: action.plan });
        window.location.assign(data.url);
        return;
      }
      setError(data.error === "already_subscribed" ? t.alreadySubscribed : t.error);
    } catch {
      setError(t.error);
    }
    setBusy(false);
  };

  return (
    <div className={className}>
      <Button variant={variant} arrow={variant === "primary"} className="w-full" disabled={busy} onClick={go}>
        {busy ? t.redirecting : children}
      </Button>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
