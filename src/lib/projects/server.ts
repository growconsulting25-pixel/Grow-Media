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
