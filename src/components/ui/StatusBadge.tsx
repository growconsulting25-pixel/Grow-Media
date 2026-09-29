import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type Status = "uploading" | "submitted" | "production" | "review" | "ready";

const styles: Record<Status, string> = {
  uploading: "bg-white/[0.06] text-fg-muted",
  submitted: "bg-white/[0.06] text-fg",
  production: "bg-brand-500/15 text-brand-300",
  review: "bg-brand-300/15 text-brand-300",
  ready: "bg-success/12 text-success",
};

export function StatusBadge({ status, children, className }: { status: Status; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      {status === "ready" ? (
        <Icon name="check" className="size-3.5" />
      ) : (
        <span className={cn("size-1.5 rounded-full bg-current", status === "production" && "animate-pulse-soft")} />
      )}
      {children}
    </span>
  );
}
