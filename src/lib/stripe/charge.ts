import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const idOf = (v: string | { id: string } | null | undefined) => (typeof v === "string" ? v : v?.id ?? null);

/** The card a subscriber already pays with, or null (no active plan / no card). */
export async function savedPaymentMethod(stripe: Stripe, customer: string) {
  const subs = await stripe.subscriptions.list({ customer, status: "active", limit: 1 });
  const sub = subs.data[0];
  if (!sub) return null;
  const fromSub = idOf(sub.default_payment_method as string | { id: string } | null);
  if (fromSub) return fromSub;
  const c = await stripe.customers.retrieve(customer);
  return c.deleted ? null : idOf(c.invoice_settings?.default_payment_method as string | { id: string } | null);
}

interface ChargeArgs {
  stripe: Stripe;
  db: SupabaseClient;
  customer: string;
  paymentMethod: string;
  userId: string;
  projectId: string;
  amountCents: number;
  description: string;
}

/**
 * One-click payment for subscribers: bills the saved card through a one-off
 * invoice (so it appears with their plan invoices), then submits the project.
 * Returns false when the card can't be charged without the client (declined,
 * 3-D Secure…), in which case the caller falls back to Stripe Checkout.
 */
export async function chargeSavedCard({ stripe, db, customer, paymentMethod, userId, projectId, amountCents, description }: ChargeArgs) {
  let invoice: Stripe.Invoice | null = null;
  try {
    invoice = await stripe.invoices.create({
      customer,
      collection_method: "charge_automatically",
      auto_advance: false,
      pending_invoice_items_behavior: "exclude",
      default_payment_method: paymentMethod,
      currency: "cad",
      description,
      metadata: { kind: "project", user_id: userId, project_id: projectId },
    });
    await stripe.invoiceItems.create({ customer, invoice: invoice.id, amount: amountCents, currency: "cad", description });
    await stripe.invoices.finalizeInvoice(invoice.id!);
    const paid = await stripe.invoices.pay(invoice.id!, { payment_method: paymentMethod, off_session: true });
    if (paid.status !== "paid") throw new Error(`invoice ${paid.status}`);
  } catch (e) {
    console.error("chargeSavedCard", projectId, e);
    if (invoice?.id) {
      const current = await stripe.invoices.retrieve(invoice.id).catch(() => null);
      if (current?.status === "draft") await stripe.invoices.del(invoice.id).catch(() => undefined);
      else if (current?.status === "open") await stripe.invoices.voidInvoice(invoice.id).catch(() => undefined);
    }
    return false;
  }

  // Paid: record the order (idempotent on the invoice id) and submit.
  await db.from("orders").upsert(
    { user_id: userId, project_id: projectId, amount_cents: amountCents, currency: "CAD", status: "paid", stripe_checkout_session_id: invoice.id },
    { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
  );
  const { error } = await db.rpc("finalize_paid_submission", { p_project_id: projectId, p_user_id: userId, p_paid_cents: amountCents });
  if (error) console.error("finalize after saved-card charge", projectId, invoice.id, error);
  return true;
}
