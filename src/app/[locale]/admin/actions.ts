"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/server";
import { dispatchEmails } from "@/lib/email/dispatch";
import { projectStatuses, type ProjectStatus } from "@/lib/projects/types";

const UUID = /^[0-9a-f-]{36}$/i;

/** Changes a project's status. The DB trigger logs the timeline and notifies the client. */
export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  if (!UUID.test(projectId) || !projectStatuses.includes(status) || status === "draft") return { ok: false };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) return { ok: false };
  await dispatchEmails().catch(() => undefined);
  revalidatePath("/[locale]/admin", "layout");
  return { ok: true };
}

export async function updateRevisionStatus(revisionId: string, status: "open" | "in_progress" | "done") {
  if (!UUID.test(revisionId)) return { ok: false };
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("revisions")
    .update({ status, resolved_at: status === "done" ? new Date().toISOString() : null })
    .eq("id", revisionId);
  revalidatePath("/[locale]/admin", "layout");
  return { ok: !error };
}

/** Records an uploaded final video (file already in the `deliverables` bucket). */
export async function recordDeliverable(input: { projectId: string; storagePath: string; format: string; caption: string; hashtags: string; markReady: boolean }) {
  if (!UUID.test(input.projectId)) return { ok: false };
  const { supabase, user } = await requireAdmin();
  const { data: existing } = await supabase.from("deliverables").select("version").eq("project_id", input.projectId).order("version", { ascending: false }).limit(1);
  const version = ((existing?.[0]?.version as number | undefined) ?? 0) + 1;
  const { error } = await supabase.from("deliverables").insert({
    project_id: input.projectId,
    kind: "video",
    storage_path: input.storagePath,
    format: ["9:16", "16:9", "1:1", "4:5"].includes(input.format) ? input.format : "9:16",
    caption: input.caption.trim() || null,
    hashtags: input.hashtags.trim() || null,
    version,
    created_by: user.id,
  });
  if (error) return { ok: false };
  if (input.markReady) await supabase.from("projects").update({ status: "ready" }).eq("id", input.projectId);
  await dispatchEmails().catch(() => undefined);
  revalidatePath("/[locale]/admin", "layout");
  return { ok: true };
}
