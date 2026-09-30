"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { href } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin/server";
import { sendEmail } from "@/lib/email/send";
import { renderAdminInvite } from "@/lib/email/templates";
import { getSupabaseService } from "@/lib/supabase/admin";

export type TeamResult = { status: "idle" | "created" | "promoted" | "already" | "invalidEmail" | "error" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Gives someone admin access. An existing account is promoted; otherwise an
 * account is created (confirmed, with a random password nobody knows) and the
 * person is emailed a link to choose their own password.
 */
export async function addAdmin(_prev: TeamResult, form: FormData): Promise<TeamResult> {
  const { firstName: inviterName } = await requireAdmin();
  const db = getSupabaseService();
  if (!db) return { status: "error" };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const firstName = String(form.get("firstName") ?? "").trim().slice(0, 80);
  const lastName = String(form.get("lastName") ?? "").trim().slice(0, 80);
  const locale = String(form.get("locale") ?? "fr");
  const lang = isLocale(locale) ? locale : "fr";
  if (!EMAIL.test(email)) return { status: "invalidEmail" };

  const { data: existing } = await db.from("profiles").select("id, role").eq("email", email).maybeSingle();
  let status: TeamResult["status"];
  if (existing) {
    if (existing.role === "admin") return { status: "already" };
    const { error } = await db.from("profiles").update({ role: "admin" }).eq("id", existing.id);
    if (error) return { status: "error" };
    status = "promoted";
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email,
      password: randomBytes(32).toString("base64url"),
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName, locale: lang },
    });
    if (error || !data.user) return { status: "error" };
    await db.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
    // Not a client sign-up: drop the alert the sign-up trigger just queued.
    await db.from("staff_alerts").delete().eq("user_id", data.user.id).eq("kind", "new_client");
    status = "created";
  }

  const url = `${siteConfig.url}${href(status === "created" ? "forgotPassword" : "login", lang)}`;
  const mail = renderAdminInvite(lang, { name: firstName || email, invitedBy: inviterName || "Grow Media", email, url });
  await sendEmail({ to: email, ...mail }).catch(() => undefined);

  revalidatePath("/[locale]/admin/team", "page");
  return { status };
}

/** Removes admin access (the account stays, as a regular client). */
export async function removeAdmin(userId: string) {
  const { user } = await requireAdmin();
  const db = getSupabaseService();
  if (!db || !/^[0-9a-f-]{36}$/i.test(userId) || userId === user.id) return { ok: false };
  const { error } = await db.from("profiles").update({ role: "client" }).eq("id", userId).eq("role", "admin");
  revalidatePath("/[locale]/admin/team", "page");
  return { ok: !error };
}
