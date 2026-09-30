import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { plans } from "@/config/pricing";
import type { ProjectStatus, ProjectType } from "@/lib/projects/types";

/**
 * Business numbers for the admin console. Staff read every row through RLS
 * (`is_admin()`), so these run on the signed-in admin's own client.
 * Volumes are small (a studio, not a marketplace), so aggregation is in TS.
 */

export type ClientSegment = "subscriber_agent" | "subscriber_pro" | "single" | "free";

export interface ClientRow {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  segment: ClientSegment;
  plan: string | null;
  cancelAtPeriodEnd: boolean;
  projects: number;
  spentCents: number;
  lastActivity: string;
}

export interface OrderRow {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  projectId: string | null;
  planId: string | null;
  amountCents: number;
  createdAt: string;
}

export interface ProjectRow {
  id: string;
  userId: string;
  title: string;
  status: ProjectStatus;
  type: ProjectType;
  isFree: boolean;
  submittedAt: string | null;
  deliveredAt: string | null;
  clientName: string;
  clientEmail: string;
  files: number;
}

const DAY = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const nameOf = (p: { first_name?: string | null; last_name?: string | null; email?: string | null } | null) =>
  [p?.first_name, p?.last_name].filter(Boolean).join(" ") || p?.email || "—";

export async function loadAdminData(db: SupabaseClient) {
  const [profilesRes, subsRes, ordersRes, projectsRes, revisionsRes] = await Promise.all([
    db.from("profiles").select("id, email, first_name, last_name, created_at, role").eq("role", "client").order("created_at", { ascending: false }).limit(5000),
    db.from("subscriptions").select("user_id, plan_id, status, cancel_at_period_end, current_period_end, created_at").limit(5000),
    db.from("orders").select("id, user_id, project_id, plan_id, amount_cents, status, created_at").eq("status", "paid").gt("amount_cents", 0).order("created_at", { ascending: false }).limit(5000),
    db.from("projects").select("id, user_id, title, address, status, type, is_free, submitted_at, delivered_at, created_at, profiles(first_name, last_name, email), project_files(count)").neq("status", "draft").order("submitted_at", { ascending: true }).limit(5000),
    db.from("revisions").select("id, status").neq("status", "done").limit(5000),
  ]);

  const profiles = (profilesRes.data ?? []) as { id: string; email: string; first_name: string; last_name: string; created_at: string }[];
  const subs = (subsRes.data ?? []) as { user_id: string; plan_id: string; status: string; cancel_at_period_end: boolean; current_period_end: string; created_at: string }[];
  const rawOrders = (ordersRes.data ?? []) as { id: string; user_id: string; project_id: string | null; plan_id: string | null; amount_cents: number; created_at: string }[];
  type RawProject = {
    id: string; user_id: string; title: string | null; address: string | null; status: ProjectStatus; type: ProjectType; is_free: boolean;
    submitted_at: string | null; delivered_at: string | null; created_at: string;
    profiles: { first_name: string; last_name: string; email: string } | null; project_files: { count: number }[];
  };
  const rawProjects = (projectsRes.data ?? []) as unknown as RawProject[];

  const byId = new Map(profiles.map((p) => [p.id, p]));
  const activeSub = new Map(subs.filter((s) => ["active", "trialing", "past_due"].includes(s.status)).map((s) => [s.user_id, s]));

  const orders: OrderRow[] = rawOrders.map((o) => {
    const p = byId.get(o.user_id) ?? null;
    return { id: o.id, userId: o.user_id, clientName: nameOf(p), clientEmail: p?.email ?? "", projectId: o.project_id, planId: o.plan_id, amountCents: o.amount_cents, createdAt: o.created_at };
  });

  const projects: ProjectRow[] = rawProjects.map((r) => ({
    id: r.id, userId: r.user_id, title: r.address || r.title || r.id.slice(0, 8), status: r.status, type: r.type, isFree: r.is_free,
    submittedAt: r.submitted_at, deliveredAt: r.delivered_at, clientName: nameOf(r.profiles), clientEmail: r.profiles?.email ?? "",
    files: r.project_files?.[0]?.count ?? 0,
  }));

  const spent = new Map<string, number>();
  for (const o of orders) spent.set(o.userId, (spent.get(o.userId) ?? 0) + o.amountCents);
  const projectCount = new Map<string, number>();
  const lastProject = new Map<string, string>();
  for (const p of projects) {
    projectCount.set(p.userId, (projectCount.get(p.userId) ?? 0) + 1);
    const at = p.submittedAt ?? "";
    if (at > (lastProject.get(p.userId) ?? "")) lastProject.set(p.userId, at);
  }

  const clients: ClientRow[] = profiles.map((p) => {
    const sub = activeSub.get(p.id);
    const segment: ClientSegment = sub ? (sub.plan_id === "pro" ? "subscriber_pro" : "subscriber_agent") : (spent.get(p.id) ?? 0) > 0 ? "single" : "free";
    return {
      id: p.id, email: p.email, name: nameOf(p), createdAt: p.created_at, segment, plan: sub?.plan_id ?? null,
      cancelAtPeriodEnd: sub?.cancel_at_period_end ?? false, projects: projectCount.get(p.id) ?? 0, spentCents: spent.get(p.id) ?? 0,
      lastActivity: lastProject.get(p.id) || p.created_at,
    };
  });

  return { clients, orders, projects, openRevisions: (revisionsRes.data ?? []).length };
}

export type AdminData = Awaited<ReturnType<typeof loadAdminData>>;

/** Headline numbers + series for the dashboard. */
export function summarize({ clients, orders, projects, openRevisions }: AdminData, now = new Date()) {
  const today = startOfDay(now).getTime();
  const month = startOfMonth(now).getTime();
  const lastMonth = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)).getTime();
  const sum = (list: OrderRow[]) => list.reduce((n, o) => n + o.amountCents, 0);
  const t = (s: string) => new Date(s).getTime();

  const revenueToday = sum(orders.filter((o) => t(o.createdAt) >= today));
  const revenueMonth = sum(orders.filter((o) => t(o.createdAt) >= month));
  const revenueLastMonth = sum(orders.filter((o) => t(o.createdAt) >= lastMonth && t(o.createdAt) < month));
  const revenueAll = sum(orders);

  const price = (id: string | null) => (plans.find((p) => p.id === id)?.price ?? 0) * 100;
  const subscribers = clients.filter((c) => c.segment === "subscriber_agent" || c.segment === "subscriber_pro");
  const mrrCents = subscribers.reduce((n, c) => n + price(c.plan), 0);

  const segments: Record<ClientSegment, number> = { subscriber_agent: 0, subscriber_pro: 0, single: 0, free: 0 };
  for (const c of clients) segments[c.segment]++;

  // Revenue per day, last 30 days (oldest first)
  const daily = Array.from({ length: 30 }, (_, i) => {
    const start = today - (29 - i) * DAY;
    const value = sum(orders.filter((o) => t(o.createdAt) >= start && t(o.createdAt) < start + DAY));
    return { date: new Date(start).toISOString(), value };
  });

  // New clients per week, last 8 weeks
  const weekly = Array.from({ length: 8 }, (_, i) => {
    const start = today - (7 * (8 - i) - 1) * DAY;
    const end = start + 7 * DAY;
    return { date: new Date(start).toISOString(), value: clients.filter((c) => t(c.createdAt) >= start && t(c.createdAt) < end).length };
  });

  const byStatus = (s: ProjectStatus[]) => projects.filter((p) => s.includes(p.status)).length;
  const deliveredMonth = projects.filter((p) => p.deliveredAt && t(p.deliveredAt) >= month).length;

  return {
    revenueToday, revenueMonth, revenueLastMonth, revenueAll, mrrCents,
    clientsTotal: clients.length,
    clientsThisMonth: clients.filter((c) => t(c.createdAt) >= month).length,
    subscribers: subscribers.length,
    segments,
    daily,
    weekly,
    production: {
      submitted: byStatus(["submitted"]),
      in_production: byStatus(["in_production"]),
      review: byStatus(["review"]),
      revision_requested: byStatus(["revision_requested"]),
      ready: byStatus(["ready"]),
      completed: byStatus(["completed"]),
    },
    deliveredMonth,
    openRevisions,
    recentOrders: orders.slice(0, 6),
    recentClients: clients.slice(0, 6),
  };
}

export type RangeKey = "today" | "7d" | "month" | "30d" | "all";

export function inRange(iso: string, range: RangeKey, now = new Date()) {
  const at = new Date(iso).getTime();
  switch (range) {
    case "today": return at >= startOfDay(now).getTime();
    case "7d": return at >= startOfDay(now).getTime() - 6 * DAY;
    case "month": return at >= startOfMonth(now).getTime();
    case "30d": return at >= startOfDay(now).getTime() - 29 * DAY;
    default: return true;
  }
}
