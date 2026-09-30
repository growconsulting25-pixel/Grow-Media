import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Thread {
  projectId: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  lastBody: string;
  lastAt: string;
  lastFromStaff: boolean;
  count: number;
}

/** Client conversations grouped by project, most recent first. */
export async function loadThreads(db: SupabaseClient): Promise<Thread[]> {
  const { data } = await db
    .from("messages")
    .select("project_id, body, is_staff, created_at, projects(title, address, user_id, profiles(first_name, last_name, email))")
    .order("created_at", { ascending: false })
    .limit(2000);
  type Row = {
    project_id: string; body: string; is_staff: boolean; created_at: string;
    projects: { title: string | null; address: string | null; user_id: string; profiles: { first_name: string; last_name: string; email: string } | null } | null;
  };
  const threads = new Map<string, Thread>();
  for (const m of (data ?? []) as unknown as Row[]) {
    const t = threads.get(m.project_id);
    if (t) { t.count++; continue; }
    const p = m.projects;
    threads.set(m.project_id, {
      projectId: m.project_id,
      title: p?.address || p?.title || m.project_id.slice(0, 8),
      clientId: p?.user_id ?? "",
      clientName: [p?.profiles?.first_name, p?.profiles?.last_name].filter(Boolean).join(" ") || p?.profiles?.email || "—",
      clientEmail: p?.profiles?.email ?? "",
      lastBody: m.body,
      lastAt: m.created_at,
      lastFromStaff: m.is_staff,
      count: 1,
    });
  }
  return [...threads.values()];
}

/** Badges for the console: alerts since this admin last looked, threads awaiting a reply. */
export async function consoleBadges(db: SupabaseClient, userId: string) {
  const { data: me } = await db.from("profiles").select("alerts_seen_at").eq("id", userId).single();
  const seen = (me?.alerts_seen_at as string | null) ?? "1970-01-01T00:00:00Z";
  const [{ count }, threads] = await Promise.all([
    db.from("staff_alerts").select("id", { count: "exact", head: true }).gt("created_at", seen),
    loadThreads(db),
  ]);
  return { newAlerts: count ?? 0, needsReply: threads.filter((t) => !t.lastFromStaff).length, seen };
}
