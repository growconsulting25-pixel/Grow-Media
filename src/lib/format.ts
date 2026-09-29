import { currency } from "@/config/pricing";
import { localeTags, type Locale } from "@/i18n/config";

export function formatPrice(amount: number, locale: Locale) {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
