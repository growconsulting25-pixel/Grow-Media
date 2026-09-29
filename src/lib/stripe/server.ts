import "server-only";
import Stripe from "stripe";
import { addOns, currency, plans, type PlanId } from "@/config/pricing";

/** Stripe client, or null until STRIPE_SECRET_KEY is set (billing then falls back to email). */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

const cents = (n: number) => Math.round(n * 100);

/**
 * Line item for a plan. Uses a Stripe Price ID from the environment when one
 * is configured (STRIPE_PRICE_AGENT, …), otherwise inline price data built from
 * config/pricing.ts so prices are never duplicated by hand.
 */
export function planLineItem(planId: PlanId, name: string): Stripe.Checkout.SessionCreateParams.LineItem {
  const plan = plans.find((p) => p.id === planId)!;
  const envPrice = process.env[`STRIPE_PRICE_${planId.toUpperCase()}`];
  if (envPrice) return { price: envPrice, quantity: 1 };
  return {
    quantity: 1,
    price_data: {
      currency: currency.toLowerCase(),
      unit_amount: cents(plan.price),
      product_data: { name: `Grow Media — ${name}` },
      ...(plan.interval === "month" ? { recurring: { interval: "month" as const } } : {}),
    },
  };
}

export function walkthroughAddOnCents() {
  return cents(addOns.find((a) => a.id === "walkthrough")?.price ?? 0);
}
