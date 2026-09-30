import type { ProjectStatus } from "@/lib/projects/types";

/** Statuses that queue a client notification (see on_project_status_change). */
export const NOTIFYING_STATUSES: ProjectStatus[] = ["in_production", "ready"];

/** Board columns, in production order. Cancelled projects live in the list view. */
export const BOARD_COLUMNS: ProjectStatus[] = ["submitted", "in_production", "review", "revision_requested", "ready", "completed"];

/** Every status staff can set. */
export const STAFF_STATUSES: ProjectStatus[] = [...BOARD_COLUMNS, "cancelled"];
