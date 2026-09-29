/**
 * Single source of truth for prices. Copy (names, features) lives in the
 * dictionaries under `pricing.plans[id]` so it can be localized.
 * Stripe price IDs will be attached here in Phase 4.
 */
export const currency = "CAD" as const;

export type PlanId = "single" | "agent" | "pro";
export type BillingInterval = "one_time" | "month";

export interface Plan {
  id: PlanId;
  price: number;
  interval: BillingInterval;
  /** Videos included per billing period (`one_time` = per purchase). */
  videosIncluded: number;
  highlighted?: boolean;
  /** Only add annual pricing when real annual prices exist. */
  annualPrice?: number;
}

export const plans: Plan[] = [
  { id: "single", price: 49.95, interval: "one_time", videosIncluded: 1 },
  { id: "agent", price: 99, interval: "month", videosIncluded: 4, highlighted: true },
  { id: "pro", price: 199, interval: "month", videosIncluded: 10 },
];

export type AddOnId = "walkthrough" | "ads";

export interface AddOn {
  id: AddOnId;
  /** `null` = custom quote / contact us. */
  price: number | null;
}

export const addOns: AddOn[] = [
  { id: "walkthrough", price: 99 },
  { id: "ads", price: null },
];

export const launchOffer = {
  active: true,
  freeVideos: 1,
  requiresCard: false,
} as const;

/** Presented strictly as an illustrative typical range, never as a fact. */
export const traditionalShootReference = 1000;

export const startingPrice = Math.min(...plans.map((p) => p.price));

export function hasAnnualPricing() {
  return plans.some((p) => p.annualPrice !== undefined);
}
