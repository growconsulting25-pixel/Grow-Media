import type { OrderRow } from "@/lib/admin/stats";

type Items = { agent: string; pro: string; single: string; project: string; other: string };

/** What a payment was for. Plan orders carry a plan id; one-off project payments carry a project. */
export function orderLabel(o: Pick<OrderRow, "planId" | "projectId">, items: Items) {
  if (o.planId === "agent" || o.planId === "pro" || o.planId === "single") return items[o.planId];
  if (o.projectId) return items.project;
  return items.other;
}
