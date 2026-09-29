"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey } from "@/lib/supabase/env";
import { ACCEPTED_UPLOADS, PROJECT_BUCKET, type Project, type ProjectFile, type ProjectType, type Quote } from "./types";

/**
 * Client-side project operations. Everything here is protected by RLS; money
 * and status changes go through database functions (`submit_project`).
 */

export async function createDraft(supabase: SupabaseClient, input: { type: ProjectType; title?: string; address?: string; description?: string; notes?: string; idea_id?: string }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("not_authenticated");
  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: auth.user.id, ...input })
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateDraft(supabase: SupabaseClient, id: string, patch: Partial<Pick<Project, "type" | "title" | "address" | "description" | "style" | "notes" | "branding">>) {
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as Project;
}

export async function listFiles(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase.from("project_files").select("*").eq("project_id", projectId).order("position");
  if (error) throw error;
  return (data ?? []) as ProjectFile[];
}

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot).toLowerCase() : "";
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .slice(0, 60);
  return `${base || "file"}${ext}`;
}

/**
 * Uploads one file with real progress events (signed upload URL + XHR), then
 * records it in `project_files`.
 */
export async function uploadProjectFile(
  supabase: SupabaseClient,
  project: Pick<Project, "id" | "user_id">,
  file: File,
  position: number,
  onProgress: (fraction: number) => void,
  signal?: AbortSignal,
): Promise<ProjectFile> {
  const kind = ACCEPTED_UPLOADS[file.type];
  if (!kind) throw new Error("unsupported_type");
  const path = `${project.user_id}/${project.id}/${crypto.randomUUID()}-${safeName(file.name)}`;

  const { data: signed, error: signError } = await supabase.storage.from(PROJECT_BUCKET).createSignedUploadUrl(path);
  if (signError || !signed) throw signError ?? new Error("upload_failed");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signed.signedUrl);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`upload_failed_${xhr.status}`)));
    xhr.onerror = () => reject(new Error("network_error"));
    xhr.onabort = () => reject(new DOMException("aborted", "AbortError"));
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    xhr.send(body);
  });
  onProgress(1);

  const { data, error } = await supabase
    .from("project_files")
    .insert({
      project_id: project.id,
      user_id: project.user_id,
      storage_path: path,
      file_name: file.name.slice(0, 200),
      mime_type: file.type,
      size_bytes: file.size,
      kind,
      position,
    })
    .select()
    .single();
  if (error) throw error;
  return data as ProjectFile;
}

export async function removeProjectFile(supabase: SupabaseClient, fileId: string) {
  const { error } = await supabase.from("project_files").delete().eq("id", fileId);
  if (error) throw error;
}

export async function reorderFiles(supabase: SupabaseClient, projectId: string, ids: string[]) {
  const { error } = await supabase.rpc("reorder_project_files", { p_project_id: projectId, p_file_ids: ids });
  if (error) throw error;
}

export async function signedPreviewUrls(supabase: SupabaseClient, paths: string[]) {
  if (!paths.length) return {} as Record<string, string>;
  const { data } = await supabase.storage.from(PROJECT_BUCKET).createSignedUrls(paths, 60 * 60);
  return Object.fromEntries((data ?? []).filter((d) => d.signedUrl).map((d) => [d.path, d.signedUrl])) as Record<string, string>;
}

export async function getQuote(supabase: SupabaseClient): Promise<Quote> {
  const { data, error } = await supabase.rpc("get_submission_quote");
  if (error) throw error;
  return data as Quote;
}

export type SubmitError = "payment_required" | "missing_files" | "missing_details" | "already_submitted" | "unknown";

export async function submitProject(supabase: SupabaseClient, id: string): Promise<{ ok: true; project: Project } | { ok: false; error: SubmitError }> {
  const { data, error } = await supabase.rpc("submit_project", { p_project_id: id });
  if (!error) return { ok: true, project: data as Project };
  const known: SubmitError[] = ["payment_required", "missing_files", "missing_details", "already_submitted"];
  const match = known.find((k) => error.message?.includes(k));
  return { ok: false, error: match ?? "unknown" };
}
