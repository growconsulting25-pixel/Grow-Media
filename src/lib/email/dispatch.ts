import "server-only";
import { siteConfig } from "@/config/site";
import { getSupabaseService } from "@/lib/supabase/admin";
import { sendEmail } from "./send";
import { renderEmail, renderStaffAlert, type EmailKind, type StaffAlertKind } from "./templates";

const CLIENT_KINDS: EmailKind[] = ["project_received", "in_production", "video_ready", "message", "revision_complete"];

interface Row {
  id: string;
  type: string;
  project_id: string | null;
  created_at: string;
  profiles: { email: string; first_name: string; last_name: string; locale: "fr" | "en" } | null;
  projects: { title: string | null; address: string | null } | null;
}

/**
 * Emails every notification not yet emailed (last 3 days), then marks it.
 * Runs from the scheduled Netlify function and right after staff actions.
 * Then emails pending staff alerts (see migration 20260930000000) to the team.
 */
export async function dispatchEmails(limit = 50) {
  const db = getSupabaseService();
  if (!db || !process.env.RESEND_API_KEY) return { sent: 0, skipped: "not_configured" as const };

  const since = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
  const { data, error } = await db
    .from("notifications")
    .select("id, type, project_id, created_at, profiles(email, first_name, last_name, locale), projects(title, address)")
    .is("emailed_at", null)
    .gte("created_at", since)
    .order("created_at")
    .limit(limit);
  if (error) throw error;

  let sent = 0;
  for (const n of (data ?? []) as unknown as Row[]) {
    const kind = n.type as EmailKind;
    const p = n.profiles;
    const title = n.projects?.address || n.projects?.title || (p?.locale === "en" ? "your project" : "votre projet");
    const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || p?.email || "";
    let ok = true;

    if (p?.email && CLIENT_KINDS.includes(kind)) {
      const lang = p.locale === "en" ? "en" : "fr";
      const url = n.project_id ? `${siteConfig.url}/${lang}/app/projects/${n.project_id}` : `${siteConfig.url}/${lang}/app`;
      const email = renderEmail(kind, lang, { name: p.first_name || name, title, url });
      ok = (await sendEmail({ to: p.email, ...email })).ok;
    }
    if (ok) {
      await db.from("notifications").update({ emailed_at: new Date().toISOString() }).eq("id", n.id);
      sent++;
    }
  }

  sent += await dispatchStaffAlerts(db, since, limit);
  return { sent };
}

interface AlertRow {
  id: string;
  kind: StaffAlertKind;
  project_id: string | null;
  payload: Record<string, unknown>;
  profiles: { email: string; first_name: string; last_name: string } | null;
  projects: { title: string | null; address: string | null; type: string } | null;
}

const TYPE_LABEL: Record<string, string> = { listing_video: "Vidéo d'inscription", walkthrough: "Visite virtuelle 3D", ugc: "UGC IA", video_ad: "Publicité vidéo" };
const PLAN_LABEL: Record<string, string> = { single: "À l'unité", agent: "Courtier", pro: "Pro" };
const money = (cents: unknown) => new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(Number(cents ?? 0) / 100);

/** Emails each pending staff alert (sign-ups, projects, messages, revisions, billing) to the team inbox. */
async function dispatchStaffAlerts(db: NonNullable<ReturnType<typeof getSupabaseService>>, since: string, limit: number) {
  const to = process.env.ADMIN_NOTIFY_EMAIL || siteConfig.contactEmail;
  const { data, error } = await db
    .from("staff_alerts")
    .select("id, kind, project_id, payload, profiles(email, first_name, last_name), projects(title, address, type)")
    .is("emailed_at", null)
    .gte("created_at", since)
    .order("created_at")
    .limit(limit);
  if (error) throw error;

  let sent = 0;
  for (const a of (data ?? []) as unknown as AlertRow[]) {
    const p = a.profiles;
    const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || p?.email || "Client";
    const title = a.projects?.address || a.projects?.title || "";
    const rows: [string, string][] = [];
    if (title) rows.push(["Projet", title]);
    if (a.projects?.type) rows.push(["Type", TYPE_LABEL[a.projects.type] ?? a.projects.type]);
    if (typeof a.payload.plan === "string") rows.push(["Forfait", PLAN_LABEL[a.payload.plan] ?? a.payload.plan]);
    if (a.payload.amount_cents) rows.push(["Montant", money(a.payload.amount_cents)]);
    if (typeof a.payload.ends_at === "string") rows.push(["Fin d'accès", new Date(a.payload.ends_at).toLocaleDateString("fr-CA")]);
    if (typeof a.payload.excerpt === "string") rows.push(["Message", a.payload.excerpt]);
    const url = a.project_id ? `${siteConfig.url}/fr/admin/projects/${a.project_id}` : `${siteConfig.url}/fr/admin`;
    const email = renderStaffAlert(a.kind, { name, email: p?.email ?? "", title, amount: money(a.payload.amount_cents), url, rows });
    const { ok } = await sendEmail({ to, ...email });
    if (ok) {
      await db.from("staff_alerts").update({ emailed_at: new Date().toISOString() }).eq("id", a.id);
      sent++;
    }
  }
  return sent;
}
