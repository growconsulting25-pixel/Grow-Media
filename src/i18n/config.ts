/**
 * Central locale configuration. To add a language:
 * 1. add its code to `locales`
 * 2. add a dictionary in `./dictionaries/<code>.ts` that satisfies `Dictionary`
 * 3. register it in `./dictionaries/index.ts`
 */
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** BCP 47 tags used for Intl formatting, <html lang> and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
};

export const localeLabels: Record<Locale, { short: string; long: string }> = {
  en: { short: "EN", long: "English" },
  fr: { short: "FR", long: "Français" },
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
