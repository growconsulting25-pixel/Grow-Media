/** Domain types mirroring supabase/migrations. Keep in sync with the schema. */
export const projectTypes = ["listing_video", "walkthrough", "ugc", "video_ad"] as const;
export type ProjectType = (typeof projectTypes)[number];

export const projectStatuses = [
  "draft", "submitted", "in_production", "review", "ready", "revision_requested", "completed", "cancelled",
] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const videoStyles = ["luxury", "cinematic", "modern", "minimal", "energetic", "surprise"] as const;
export type VideoStyle = (typeof videoStyles)[number];

export type FileKind = "photo" | "video" | "logo" | "agent_photo" | "other";

export interface Branding {
  useBrandKit: boolean;
  agentName?: string;
  agency?: string;
  phone?: string;
  primaryColor?: string;
}

export interface Project {
  id: string;
  user_id: string;
  type: ProjectType;
  status: ProjectStatus;
  title: string | null;
  address: string | null;
  description: string | null;
  style: VideoStyle | null;
  notes: string | null;
  branding: Branding;
  is_free: boolean;
  price_cents: number | null;
  submitted_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  kind: FileKind;
  position: number;
  created_at: string;
}

export interface StatusEvent {
  id: number;
  status: ProjectStatus;
  created_at: string;
}

/** Add-on part of a quote: `due_cents` is what is still owed (video + unpaid add-on). */
interface QuoteTotals {
  addon_id: "walkthrough" | null;
  addon_cents: number;
  addon_paid: boolean;
  due_cents: number;
}

export type Quote = QuoteTotals &
  (
    | { mode: "free"; price_cents: 0; free_credits: number }
    | { mode: "subscription"; price_cents: 0; plan_id: string; used: number; included: number }
    | { mode: "payment_required"; price_cents: number; plan_id: string }
  );

/** The client-facing progress steps (a subset of statuses). */
export const timelineSteps = ["submitted", "in_production", "review", "ready"] as const;

export function timelineIndex(status: ProjectStatus): number {
  switch (status) {
    case "draft":
      return -1;
    case "submitted":
      return 0;
    case "in_production":
    case "revision_requested":
      return 1;
    case "review":
      return 2;
    case "ready":
    case "completed":
      return 3;
    default:
      return -1;
  }
}

export const PROJECT_BUCKET = "project-files";
export const ACCEPTED_UPLOADS: Record<string, FileKind> = {
  "image/jpeg": "photo",
  "image/png": "photo",
  "image/webp": "photo",
  "video/mp4": "video",
};
export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;
