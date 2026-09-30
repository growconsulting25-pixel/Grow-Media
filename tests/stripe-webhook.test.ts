/**
 * Offline tests for the Stripe webhook logic (no network): signature
 * verification with Stripe's own helpers, and the database writes the
 * handler performs, captured by a fake Supabase client.
 * Run: npm run test:stripe
 */
import assert from "node:assert/strict";
import Stripe from "stripe";
import { handleStripeEvent } from "../src/lib/stripe/webhook";

type Call = { table: string; op: string; payload?: unknown; opts?: unknown; filters: [string, unknown][] };

function fakeDb(opts: { duplicateOrder?: boolean; profileByCustomer?: string; rpcError?: string } = {}) {
  const calls: Call[] = [];
  const rpc = async (fn: string, args: unknown) => {
    calls.push({ table: `rpc:${fn}`, op: "rpc", payload: args, filters: [] });
    return { data: null, error: opts.rpcError ? { message: opts.rpcError } : null };
  };
  const from = (table: string) => {
    const call: Call = { table, op: "", filters: [] };
    calls.push(call);
    const chain = {
      upsert(payload: unknown, o: unknown) { call.op = "upsert"; call.payload = payload; call.opts = o; return chain; },
      update(payload: unknown) { call.op = "update"; call.payload = payload; return chain; },
      select() { if (!call.op) call.op = "select"; return chain; },
      eq(k: string, v: unknown) { call.filters.push([k, v]); return chain; },
      maybeSingle: async () => ({ data: opts.profileByCustomer ? { id: opts.profileByCustomer } : null, error: null }),
      then(resolve: (v: unknown) => void) {
        if (table === "orders") return resolve({ data: opts.duplicateOrder ? [] : [{ id: "order_1" }], error: null });
        return resolve({ data: null, error: null });
      },
    };
    return chain;
  };
  return { db: { from, rpc } as never, calls };
}

const stripe = new Stripe("sk_test_offline");
const secret = "whsec_test_secret";

async function run() {
  // 1. Signature verification round-trip (what the route does)
  const payload = JSON.stringify({ id: "evt_1", object: "event", type: "ping", data: { object: {} } });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  assert.equal(stripe.webhooks.constructEvent(payload, header, secret).id, "evt_1");
  assert.throws(() => stripe.webhooks.constructEvent(payload, header, "whsec_wrong"));
  assert.throws(() => stripe.webhooks.constructEvent(payload.replace("ping", "pong"), header, secret));
  console.log("ok - signatures: valid accepted, wrong secret and tampered payload rejected");

  // 2. Single video paid → order recorded + draft project submitted (only that user's draft)
  const single = { id: "cs_1", object: "checkout.session", mode: "payment", payment_status: "paid", amount_total: 4995, amount_subtotal: 4995, currency: "cad", payment_intent: "pi_1",
    metadata: { kind: "single", user_id: "user_1", project_id: "proj_1" } } as unknown as Stripe.Checkout.Session;
  let f = fakeDb();
  assert.equal(await handleStripeEvent(f.db, null, { type: "checkout.session.completed", data: { object: single } } as Stripe.Event), "project_submitted");
  const order = f.calls.find((c) => c.table === "orders")!;
  assert.deepEqual((order.opts as { onConflict: string }).onConflict, "stripe_checkout_session_id");
  assert.equal((order.payload as { amount_cents: number }).amount_cents, 4995);
  const fin = f.calls.find((c) => c.table === "rpc:finalize_paid_submission")!;
  assert.deepEqual(fin.payload, { p_project_id: "proj_1", p_user_id: "user_1", p_paid_cents: 4995 });
  console.log("ok - paid project: order recorded, the owner's draft is finalized by the database at 49.95");

  // 2b. Paid less than the draft now costs → recorded for staff, no retry loop
  f = fakeDb({ rpcError: "underpaid" });
  assert.equal(await handleStripeEvent(f.db, null, { type: "checkout.session.completed", data: { object: single } } as Stripe.Event), "needs_review");
  console.log("ok - underpaid project is flagged, not retried");

  // 3. Retried webhook → no second submission
  f = fakeDb({ duplicateOrder: true });
  assert.equal(await handleStripeEvent(f.db, null, { type: "checkout.session.completed", data: { object: single } } as Stripe.Event), "duplicate");
  assert.ok(!f.calls.some((c) => c.table.startsWith("rpc:")));
  console.log("ok - retried webhook is idempotent");

  // 4. Unpaid session → nothing written
  f = fakeDb();
  assert.equal(await handleStripeEvent(f.db, null, { type: "checkout.session.completed", data: { object: { ...single, payment_status: "unpaid" } } } as Stripe.Event), "unpaid");
  assert.equal(f.calls.length, 0);
  console.log("ok - unpaid checkout writes nothing");

  // 5. Subscription updates → mirrored with period from the item, status mapped
  const sub = { id: "sub_1", object: "subscription", status: "active", customer: "cus_1", cancel_at_period_end: false, start_date: 1790000000,
    metadata: { user_id: "user_1", plan_id: "agent" }, items: { data: [{ current_period_start: 1790000000, current_period_end: 1792592000 }] } } as unknown as Stripe.Subscription;
  f = fakeDb();
  await handleStripeEvent(f.db, null, { type: "customer.subscription.updated", data: { object: sub } } as Stripe.Event);
  const up = f.calls.find((c) => c.table === "subscriptions")!;
  const row = up.payload as Record<string, unknown>;
  assert.equal(row.plan_id, "agent");
  assert.equal(row.status, "active");
  assert.equal(row.current_period_end, new Date(1792592000 * 1000).toISOString());
  assert.equal((up.opts as { onConflict: string }).onConflict, "stripe_subscription_id");
  console.log("ok - subscription mirrored (plan, status, period, idempotent on subscription id)");

  // 6. Cancelled subscription, user resolved from the Stripe customer
  f = fakeDb({ profileByCustomer: "user_9" });
  await handleStripeEvent(f.db, null, { type: "customer.subscription.deleted", data: { object: { ...sub, status: "canceled", metadata: { plan_id: "pro" } } } } as unknown as Stripe.Event);
  const del = f.calls.find((c) => c.table === "subscriptions")!.payload as Record<string, unknown>;
  assert.equal(del.status, "canceled");
  assert.equal(del.user_id, "user_9");
  console.log("ok - cancellation recorded; user found via Stripe customer id");

  // 7. Unrelated events are ignored
  f = fakeDb();
  assert.equal(await handleStripeEvent(f.db, null, { type: "invoice.created", data: { object: {} } } as unknown as Stripe.Event), "ignored");
  console.log("ok - unrelated events ignored");

  // 8. Monthly renewal → recorded as an order (first charge and one-off invoices are not)
  const renewal = { id: "in_1", object: "invoice", billing_reason: "subscription_cycle", amount_paid: 9900, currency: "cad", customer: "cus_1",
    parent: { subscription_details: { metadata: { user_id: "user_1", plan_id: "agent" } } } } as unknown as Stripe.Invoice;
  f = fakeDb();
  assert.equal(await handleStripeEvent(f.db, null, { type: "invoice.paid", data: { object: renewal } } as Stripe.Event), "renewal_recorded");
  const ren = f.calls.find((c) => c.table === "orders")!;
  assert.deepEqual([(ren.payload as { amount_cents: number }).amount_cents, (ren.payload as { plan_id: string }).plan_id], [9900, "agent"]);
  f = fakeDb();
  assert.equal(await handleStripeEvent(f.db, null, { type: "invoice.paid", data: { object: { ...renewal, billing_reason: "subscription_create" } } } as Stripe.Event), "ignored");
  assert.equal(f.calls.length, 0);
  console.log("ok - renewals recorded as orders; first invoice not double-counted\nALL STRIPE WEBHOOK TESTS PASSED");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
