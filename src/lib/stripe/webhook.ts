import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

type SubStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

const STATUS: Record<string, SubStatus> = {
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  unpaid: "past_due",
  canceled: "canceled",
  paused: "canceled",
  incomplete: "incomplete",
  incomplete_expired: "incomplete",
};

const iso = (seconds?: number | null) => new Date((seconds ?? 0) * 1000).toISOString();
const idOf = (v: string | { id: string } | null | undefined) => (typeof v === "string" ? v : v?.id ?? null);

/** Mirrors a Stripe subscription into public.subscriptions (idempotent upsert). */
export async function syncSubscription(db: SupabaseClient, sub: Stripe.Subscription) {
  const customerId = idOf(sub.customer);
  let userId: string | null = sub.metadata?.user_id ?? null;
  if (!userId && customerId) {
    const { data } = await db.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
    userId = (data?.id as string | undefined) ?? null;
  }
  const planId = sub.metadata?.plan_id;
  if (!userId || !planId) throw new Error(`subscription ${sub.id}: missing user_id/plan_id metadata`);
  const item = sub.items?.data?.[0];
  const { error } = await db.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      status: STATUS[sub.status] ?? "incomplete",
      current_period_start: iso(item?.current_period_start ?? sub.start_date),
      current_period_end: iso(item?.current_period_end ?? sub.start_date),
      cancel_at_period_end: sub.cancel_at_period_end,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw error;
}

/** Records the order and, for a paid project (video and/or add-on), submits it. */
export async function handleCheckoutCompleted(db: SupabaseClient, stripe: Stripe | null, session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return "unpaid";
  const meta = session.metadata ?? {};
  const userId = meta.user_id;
  if (!userId) throw new Error(`checkout ${session.id}: missing user_id`);

  // Idempotency: the session id is unique on orders, so a retried webhook is a no-op.
  const { data: inserted, error } = await db
    .from("orders")
    .upsert(
      {
        user_id: userId,
        project_id: meta.kind === "single" ? meta.project_id : null,
        plan_id: meta.kind === "single" ? "single" : meta.plan_id ?? null,
        amount_cents: session.amount_total ?? 0,
        currency: (session.currency ?? "cad").toUpperCase(),
        status: "paid",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: idOf(session.payment_intent as string | { id: string } | null),
      },
      { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw error;
  if (!inserted?.length) return "duplicate";

  if (meta.kind === "single" && meta.project_id) {
    // The database re-prices the draft (video + add-on) and submits it. The
    // pre-discount subtotal is compared, so promotion codes stay valid.
    const { error: pErr } = await db.rpc("finalize_paid_submission", {
      p_project_id: meta.project_id,
      p_user_id: userId,
      p_paid_cents: session.amount_subtotal ?? session.amount_total ?? 0,
    });
    if (pErr?.message?.includes("underpaid")) {
      console.error(`checkout ${session.id}: paid less than the project now costs; needs staff review`);
      return "needs_review";
    }
    if (pErr) throw pErr;
    return "project_submitted";
  }

  if (meta.kind === "subscription" && session.subscription && stripe) {
    const sub = await stripe.subscriptions.retrieve(idOf(session.subscription as string | { id: string })!);
    await syncSubscription(db, sub);
    return "subscription_synced";
  }
  return "recorded";
}

export async function handleStripeEvent(db: SupabaseClient, stripe: Stripe | null, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return handleCheckoutCompleted(db, stripe, event.data.object as Stripe.Checkout.Session);
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(db, event.data.object as Stripe.Subscription);
      return "subscription_synced";
    default:
      return "ignored";
  }
}
