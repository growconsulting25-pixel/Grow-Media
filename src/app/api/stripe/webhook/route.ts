import { NextResponse, type NextRequest } from "next/server";
import { dispatchEmails } from "@/lib/email/dispatch";
import { getStripe } from "@/lib/stripe/server";
import { handleStripeEvent } from "@/lib/stripe/webhook";
import { getSupabaseService } from "@/lib/supabase/admin";

/**
 * Stripe webhook. Subscription and payment state is only ever trusted from
 * here (signature-verified), never from the browser redirect.
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded,
 * customer.subscription.created | updated | deleted, invoice.paid (renewals)
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const db = getSupabaseService();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !db || !secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    const result = await handleStripeEvent(db, stripe, event);
    await dispatchEmails().catch(() => undefined);
    return NextResponse.json({ received: true, result });
  } catch (e) {
    // 500 makes Stripe retry later.
    console.error("stripe webhook", event.type, e);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }
}
