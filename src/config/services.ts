/** Service catalogue. Copy lives in dictionaries under `services.items[id]`. */
export type ServiceId = "listing" | "walkthrough" | "ugc" | "ads";

export interface Service {
  id: ServiceId;
  /** `null` means pricing is quoted on consultation. */
  startingPrice: number | null;
  cta: "create" | "learn" | "contact";
  href: string;
}

export const services: Service[] = [
  { id: "listing", startingPrice: 49.95, cta: "create", href: "#start" },
  { id: "walkthrough", startingPrice: 99, cta: "learn", href: "#faq" },
  { id: "ugc", startingPrice: null, cta: "learn", href: "#faq" },
  { id: "ads", startingPrice: null, cta: "contact", href: "mailto:media@growconsulting.ca" },
];
