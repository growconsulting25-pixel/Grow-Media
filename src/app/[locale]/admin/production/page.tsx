import { notFound } from "next/navigation";
import { ProductionBoard } from "@/components/admin/console/ProductionBoard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { loadAdminData } from "@/lib/admin/stats";
import { STAFF_STATUSES } from "@/lib/admin/statuses";
import type { ProjectStatus } from "@/lib/projects/types";

/** Production: a drag-and-drop board by status, and a filterable list. */
export default async function ProductionPage({ params, searchParams }: PageProps<"/[locale]/admin/production">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(locale);
  const { supabase } = await requireAdmin();
  const { projects } = await loadAdminData(supabase);
  const status = typeof sp.status === "string" && (STAFF_STATUSES as string[]).includes(sp.status) ? (sp.status as ProjectStatus) : null;
  const view = sp.view === "list" || (sp.view !== "board" && status) ? "list" : "board";

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{dict.app.admin.console.production.title}</h1>
      <ProductionBoard key={`${view}:${status ?? "all"}`} projects={projects} view={view} status={status} />
    </div>
  );
}
