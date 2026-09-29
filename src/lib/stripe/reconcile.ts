import "server-only";
import { getStripe } from "@/lib/stripe/server";
import { handleCheckoutCompleted } from "@/lib/stripe/webhook";
import { getSupabaseService } from "@/lib/supabase/admin";

/**
 * Safety net for the webhook: when a client returns from Checkout, confirm the
 * payment by asking Stripe directly (server-side, with the secret key) and
 * record it. Both paths share the same idempotent handlers, so the webhook and
 * this can run in any order without double-recording.
 */
export async function confirmCheckoutSession(sessionId: string, userId: string) {
  const stripe = getStripe();
  const db = getSupabaseService();
  if (!stripe || !db || !sessionId.startsWith("cs_")) return;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.user_id !== userId || session.status !== "complete") return;
    await handleCheckoutCompleted(db, stripe, session);
  } catch (e) {
    console.error("confirmCheckoutSession", sessionId, e);
  }
}

/**
 * If a customer has paid but no active plan is recorded (e.g. a missed
 * webhook), pull their recent completed Checkout sessions from Stripe.
 */
export async function reconcileCustomer(userId: string) {
  const stripe = getStripe();
  const db = getSupabaseService();
  if (!stripe || !db) return;
  try {
    const { data: profile } = await db.from("profiles").select("stripe_customer_id").eq("id", userId).maybeSingle();
    const customer = profile?.stripe_customer_id as string | null | undefined;
    if (!customer) return;
    const { data: active } = await db.from("subscriptions").select("id").eq("user_id", userId).in("status", ["active", "trialing", "past_due"]).limit(1);
    if (active?.length) return;
    const sessions = await stripe.checkout.sessions.list({ customer, status: "complete", limit: 10 });
    for (const session of sessions.data) {
      if (session.metadata?.user_id === userId) await handleCheckoutCompleted(db, stripe, session);
    }
  } catch (e) {
    console.error("reconcileCustomer", userId, e);
  }
}
