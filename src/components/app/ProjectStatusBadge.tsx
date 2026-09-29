import { StatusBadge, type Status } from "@/components/ui/StatusBadge";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ProjectStatus } from "@/lib/projects/types";

const variant: Record<ProjectStatus, Status> = {
  draft: "uploading",
  submitted: "submitted",
  in_production: "production",
  review: "review",
  ready: "ready",
  revision_requested: "production",
  completed: "ready",
  cancelled: "uploading",
};

export function ProjectStatusBadge({ status, dict }: { status: ProjectStatus; dict: Dictionary }) {
  return <StatusBadge status={variant[status]}>{dict.app.status[status]}</StatusBadge>;
}
