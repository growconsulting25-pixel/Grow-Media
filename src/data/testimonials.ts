import type { PropertyImageKey } from "@/config/media";

/**
 * Customer stories. Only add REAL, approved client stories to `testimonials`.
 * Metrics are optional and are rendered only when a real value exists.
 */
export interface ResultMetrics {
  views?: number;
  likes?: number;
  shares?: number;
  saves?: number;
}

export interface Testimonial {
  id: string;
  quote: { en: string; fr: string };
  name: string;
  role: string;
  agentPhoto?: string;
  propertyImage: PropertyImageKey;
  propertyLabel: string;
  photos: number;
  videoSeconds: number;
  deliveredHours: number;
  metrics?: ResultMetrics;
}

export const testimonials: Testimonial[] = [];

/** Layout-only placeholders. Never shown unless demo social proof is enabled. */
export const demoResults: Pick<Testimonial, "propertyImage" | "photos" | "videoSeconds" | "deliveredHours">[] = [
  { propertyImage: "facade", photos: 14, videoSeconds: 21, deliveredHours: 18 },
  { propertyImage: "interior", photos: 18, videoSeconds: 27, deliveredHours: 22 },
];
