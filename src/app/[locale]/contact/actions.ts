"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { dispatchEmails } from "@/lib/email/dispatch";
import { getSupabaseService } from "@/lib/supabase/admin";
import { CONTACT_TOPICS, type ContactState } from "./shared";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/** Stores a contact-form message and alerts the team (trigger → staff_alerts → email). */
export async function sendContactMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (clip(form.get("website"), 200)) return { status: "sent" };

  const name = clip(form.get("name"), 120);
  const email = clip(form.get("email"), 254).toLowerCase();
  const message = clip(form.get("message"), 5000);
  const topic = clip(form.get("topic"), 20);
  const locale = form.get("locale") === "en" ? "en" : "fr";
  if (!name || !EMAIL.test(email) || message.length < 2) return { status: "invalid" };

  const db = getSupabaseService();
  if (!db) return { status: "error" };

  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = ip ? createHash("sha256").update(`gm-contact:${ip}`).digest("hex").slice(0, 32) : null;

  // Light rate limit: at most 3 messages per hour from the same address or email.
  const since = new Date(Date.now() - 3600_000).toISOString();
  const filter = ipHash ? `email.eq.${email},ip_hash.eq.${ipHash}` : `email.eq.${email}`;
  const { count } = await db.from("contact_messages").select("id", { count: "exact", head: true }).gte("created_at", since).or(filter);
  if ((count ?? 0) >= 3) return { status: "sent" };

  const { error } = await db.from("contact_messages").insert({
    name,
    email,
    phone: clip(form.get("phone"), 40) || null,
    agency: clip(form.get("agency"), 120) || null,
    topic: (CONTACT_TOPICS as readonly string[]).includes(topic) ? topic : "question",
    message,
    locale,
    ip_hash: ipHash,
  });
  if (error) return { status: "error" };

  await dispatchEmails().catch(() => undefined);
  return { status: "sent" };
}
