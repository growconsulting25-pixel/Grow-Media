import { addOns, plans } from "@/config/pricing";
import type { Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/format";

/** Formatted prices for `{singlePrice}`-style tokens in marketing copy. */
export function priceVars(locale: Locale) {
  const plan = (id: string) => plans.find((p) => p.id === id)?.price ?? 0;
  return {
    singlePrice: formatPrice(plan("single"), locale),
    agentPrice: formatPrice(plan("agent"), locale),
    proPrice: formatPrice(plan("pro"), locale),
    walkthroughPrice: formatPrice(addOns.find((a) => a.id === "walkthrough")?.price ?? 0, locale),
  };
}
