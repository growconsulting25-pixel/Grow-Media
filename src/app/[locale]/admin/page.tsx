import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { cn } from "@/lib/cn";
import type { Project, ProjectStatus } from "@/lib/projects/types";

const tabs = {
  new: ["submitted"],
  in_production: ["in_production"],
  review: ["review"],
  revision_requested: ["revision_requested"],
  ready: ["ready"],
  completed: ["completed", "cancelled"],
  all: null,
} satisfies Record<string, ProjectStatus[] | null>;
type Tab = keyof typeof tabs;

type Row = Project & {
  profiles: { first_name: string; last_name: string; email: string } | null;
  project_files: { count: number }[];
};

/** Production queue: every submitted project, oldest first within a status. */
export default async function AdminQueuePage({ params, searchParams }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const tab: Tab = typeof sp.tab === "string" && sp.tab in tabs ? (sp.tab as Tab) : "new";
  const dict = await getDictionary(locale);
  const t = dict.app.admin;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("projects")
    .select("*, profiles(first_name, last_name, email), project_files(count)")
    .neq("status", "draft")
    .order("submitted_at", { ascending: true })
    .limit(500);
  const rows = (data ?? []) as Row[];
  const count = (k: Tab) => (tabs[k] ? rows.filter((r) => (tabs[k] as ProjectStatus[]).includes(r.status)).length : rows.length);
  const allowed = tabs[tab] as ProjectStatus[] | null;
  const shown = allowed ? rows.filter((r) => allowed.includes(r.status)) : [...rows].reverse();
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <h1 className="display text-3xl">{t.queue}</h1>
      <nav aria-label={t.queue} className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4">
        {(Object.keys(tabs) as Tab[]).map((k) => (
          <Link key={k} href={`/${locale}/admin?tab=${k}`} aria-current={k === tab ? "page" : undefined}
            className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm", k === tab ? "btn-primary" : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
            {t.tabs[k]}
            <span className={cn("rounded-full px-1.5 text-xs tabular-nums", k === tab ? "bg-white/20" : "bg-white/[0.06]")}>{count(k)}</span>
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <div className="surface mt-6 overflow-x-auto rounded-[var(--radius-card)]">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">{t.columns.project}</th>
                <th className="px-4 py-3 font-medium">{t.columns.client}</th>
                <th className="px-4 py-3 font-medium">{t.columns.type}</th>
                <th className="px-4 py-3 font-medium">{t.columns.status}</th>
                <th className="px-4 py-3 font-medium">{t.columns.submitted}</th>
                <th className="px-4 py-3 text-right font-medium">{t.columns.files}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {shown.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/${locale}/admin/projects/${r.id}`} className="font-medium hover:text-brand-400">{r.address || r.title || r.id.slice(0, 8)}</Link>
                    {r.is_free && <span className="ml-2 rounded-full bg-brand-500/15 px-2 py-0.5 text-[0.7rem] text-brand-300">{t.free}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <p>{[r.profiles?.first_name, r.profiles?.last_name].filter(Boolean).join(" ") || "—"}</p>
                    <p className="text-xs text-fg-subtle">{r.profiles?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{dict.app.types[r.type].label}</td>
                  <td className="px-4 py-3"><ProjectStatusBadge status={r.status} dict={dict} /></td>
                  <td className="px-4 py-3 text-fg-muted tabular-nums">{r.submitted_at ? fmt.format(new Date(r.submitted_at)) : "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.project_files?.[0]?.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </div>
  );
}
