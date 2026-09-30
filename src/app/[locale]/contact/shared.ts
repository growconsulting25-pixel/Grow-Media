export const CONTACT_TOPICS = ["question", "team", "ads", "walkthrough", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export type ContactState = { status: "idle" | "sent" | "invalid" | "error" };
