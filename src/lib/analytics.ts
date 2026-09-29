/**
 * Typed conversion events. Provider-agnostic: events are pushed to
 * `window.dataLayer` (GTM-compatible) and re-dispatched as a DOM event so any
 * analytics provider can subscribe later without touching components.
 */
export type AnalyticsEvent =
  | "hero_free_video_click"
  | "example_video_play"
  | "pricing_view"
  | "plan_selected"
  | "signup_started"
  | "signup_completed"
  | "project_started"
  | "photos_uploaded"
  | "project_submitted"
  | "free_video_completed"
  | "subscription_started";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...props, ts: Date.now() };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("gm:analytics", { detail: payload }));
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", payload);
}
