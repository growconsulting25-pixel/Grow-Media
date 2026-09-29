import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PROJECT_BUCKET, type Project, type ProjectFile, type StatusEvent } from "./types";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  locale: "fr" | "en";
  role: "client" | "admin";
  free_video_credits: number;
}

export interface Deliverable {
  id: string;
  kind: string;
  storage_path: string;
  format: string | null;
  caption: string | null;
  hashtags: string | null;
  version: number;
  created_at: string;
  url?: string;
}

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data as Profile | null;
}

/** Projects with file counts and a signed cover image for each. */
export async function listProjects(supabase: SupabaseClient, limit = 60) {
  const { data } = await supabase
    .from("projects")
    .select("*, project_files(storage_path, mime_type, position)")
    .order("created_at", { ascending: false })
    .limit(limit);
  const rows = (data ?? []) as (Project & { project_files: Pick<ProjectFile, "storage_path" | "mime_type" | "position">[] })[];

  const coverPaths = rows
    .map((r) => [...r.project_files].sort((a, b) => a.position - b.position).find((f) => f.mime_type.startsWith("image/"))?.storage_path)
    .filter((p): p is string => Boolean(p));
  const covers = await signPaths(supabase, PROJECT_BUCKET, coverPaths, 60 * 60);

  return rows.map(({ project_files, ...project }) => {
    const cover = [...project_files].sort((a, b) => a.position - b.position).find((f) => f.mime_type.startsWith("image/"));
    return { project: project as Project, fileCount: project_files.length, cover: cover ? covers[cover.storage_path] : undefined };
  });
}

export async function getProjectDetail(supabase: SupabaseClient, id: string) {
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) return null;
  const [files, events, deliverables] = await Promise.all([
    supabase.from("project_files").select("*").eq("project_id", id).order("position"),
    supabase.from("project_status_events").select("id, status, created_at").eq("project_id", id).order("created_at"),
    supabase.from("deliverables").select("*").eq("project_id", id).order("created_at", { ascending: false }),
  ]);
  const fileRows = (files.data ?? []) as ProjectFile[];
  const previews = await signPaths(supabase, PROJECT_BUCKET, fileRows.filter((f) => f.mime_type.startsWith("image/")).map((f) => f.storage_path), 60 * 60);
  const delivRows = (deliverables.data ?? []) as Deliverable[];
  const delivUrls = await signPaths(supabase, "deliverables", delivRows.map((d) => d.storage_path), 60 * 60 * 6);

  return {
    project: project as Project,
    files: fileRows.map((f) => ({ ...f, url: previews[f.storage_path] })),
    events: (events.data ?? []) as StatusEvent[],
    deliverables: delivRows.map((d) => ({ ...d, url: delivUrls[d.storage_path] })),
  };
}

async function signPaths(supabase: SupabaseClient, bucket: string, paths: string[], expiresIn: number) {
  if (!paths.length) return {} as Record<string, string>;
  const { data } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresIn);
  return Object.fromEntries((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [d.path as string, d.signedUrl])) as Record<string, string>;
}

// ---------------------------------------------------------------------------
// Phase 3 loaders
// ---------------------------------------------------------------------------

export interface AccountSummary {
  free_credits: number;
  plan_id: "agent" | "pro" | "single" | null;
  status?: string;
  price_cents?: number;
  used?: number;
  included?: number;
  period_end?: string;
  cancel_at_period_end?: boolean;
}

export async function getAccountSummary(supabase: SupabaseClient): Promise<AccountSummary> {
  const { data } = await supabase.rpc("get_account_summary");
  return (data as AccountSummary) ?? { free_credits: 0, plan_id: null };
}

export async function unreadNotificationCount(supabase: SupabaseClient) {
  const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
  return count ?? 0;
}

export interface BrandKit {
  user_id: string;
  agent_name: string | null;
  agency: string | null;
  logo_path: string | null;
  profile_photo_path: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  social: Record<string, string>;
}

export async function getBrandKit(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from("brand_kits").select("*").eq("user_id", userId).maybeSingle();
  const kit = data as BrandKit | null;
  const paths = [kit?.logo_path, kit?.profile_photo_path].filter((p): p is string => Boolean(p));
  const urls = await signPaths(supabase, "brand", paths, 60 * 60);
  return { kit, logoUrl: kit?.logo_path ? urls[kit.logo_path] : undefined, photoUrl: kit?.profile_photo_path ? urls[kit.profile_photo_path] : undefined };
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
}

export async function listIdeas(supabase: SupabaseClient, locale: string, limit = 50) {
  const { data } = await supabase.from("content_ideas").select("id, title, description, project_type").eq("locale", locale).order("sort").limit(limit);
  return (data ?? []) as ContentIdea[];
}

/** Non-draft projects with their newest video deliverable (signed) and cover. */
export async function listVideos(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("projects")
    .select("*, deliverables(id, kind, storage_path, format, duration_seconds, created_at), project_files(storage_path, mime_type, position)")
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(100);
  type Row = Project & {
    deliverables: Pick<Deliverable, "id" | "kind" | "storage_path" | "format" | "created_at">[];
    project_files: Pick<ProjectFile, "storage_path" | "mime_type" | "position">[];
  };
  const rows = (data ?? []) as Row[];
  const latest = (r: Row) => [...r.deliverables].filter((d) => d.kind === "video").sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const cover = (r: Row) => [...r.project_files].sort((a, b) => a.position - b.position).find((f) => f.mime_type.startsWith("image/"));
  const [videoUrls, coverUrls] = await Promise.all([
    signPaths(supabase, "deliverables", rows.map(latest).filter(Boolean).map((d) => d!.storage_path), 60 * 60 * 6),
    signPaths(supabase, PROJECT_BUCKET, rows.map(cover).filter(Boolean).map((f) => f!.storage_path), 60 * 60),
  ]);
  return rows.map((r) => {
    const d = latest(r);
    const c = cover(r);
    const { deliverables: _d, project_files: _f, ...project } = r;
    void _d;
    void _f;
    return { project: project as Project, video: d ? { ...d, url: videoUrls[d.storage_path] } : undefined, cover: c ? coverUrls[c.storage_path] : undefined };
  });
}

export interface Message {
  id: string;
  project_id: string;
  author_id: string;
  body: string;
  attachment_path: string | null;
  is_staff: boolean;
  created_at: string;
  attachment_url?: string;
}

export async function getMessages(supabase: SupabaseClient, projectId: string) {
  const { data } = await supabase.from("messages").select("*").eq("project_id", projectId).order("created_at");
  const rows = (data ?? []) as Message[];
  const urls = await signPaths(supabase, PROJECT_BUCKET, rows.map((m) => m.attachment_path).filter((p): p is string => Boolean(p)), 60 * 60);
  return rows.map((m) => ({ ...m, attachment_url: m.attachment_path ? urls[m.attachment_path] : undefined }));
}

export interface Revision {
  id: string;
  message: string;
  timestamp_seconds: number | null;
  status: "open" | "in_progress" | "done";
  created_at: string;
}

export async function getRevisions(supabase: SupabaseClient, projectId: string) {
  const { data } = await supabase.from("revisions").select("id, message, timestamp_seconds, status, created_at").eq("project_id", projectId).order("created_at", { ascending: false });
  return (data ?? []) as Revision[];
}

/** Latest message per project, newest first. */
export async function messagesOverview(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("messages")
    .select("id, project_id, body, is_staff, created_at, projects(title, address, status)")
    .order("created_at", { ascending: false })
    .limit(300);
  type Row = { id: string; project_id: string; body: string; is_staff: boolean; created_at: string; projects: { title: string | null; address: string | null; status: string } | null };
  const seen = new Set<string>();
  const out: (Row & { count: number })[] = [];
  const counts = new Map<string, number>();
  for (const r of (data ?? []) as unknown as Row[]) counts.set(r.project_id, (counts.get(r.project_id) ?? 0) + 1);
  for (const r of (data ?? []) as unknown as Row[]) {
    if (seen.has(r.project_id)) continue;
    seen.add(r.project_id);
    out.push({ ...r, count: counts.get(r.project_id) ?? 1 });
  }
  return out;
}
