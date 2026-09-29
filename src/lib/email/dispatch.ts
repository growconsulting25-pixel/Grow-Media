import "server-only";
import { siteConfig } from "@/config/site";
import { getSupabaseService } from "@/lib/supabase/admin";
import { sendEmail } from "./send";
import { renderEmail, type EmailKind } from "./templates";

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
 * Also alerts the production team about each newly submitted project.
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
  const staff = process.env.ADMIN_NOTIFY_EMAIL;
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
    if (ok && staff && kind === "project_received" && n.project_id) {
      const email = renderEmail("staff_new_project", "fr", { name, title, url: `${siteConfig.url}/fr/admin/projects/${n.project_id}` });
      await sendEmail({ to: staff, ...email });
    }
    if (ok) {
      await db.from("notifications").update({ emailed_at: new Date().toISOString() }).eq("id", n.id);
      sent++;
    }
  }
  return { sent };
}
