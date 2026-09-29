import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/app/ProjectCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { listProjects } from "@/lib/projects/server";
import type { ProjectStatus } from "@/lib/projects/types";
import { getCurrentUser } from "@/lib/supabase/server";
import { cn } from "@/lib/cn";

const filters = {
  all: null,
  active: ["submitted", "in_production", "review", "revision_requested"],
  ready: ["ready", "completed"],
  drafts: ["draft"],
} satisfies Record<string, ProjectStatus[] | null>;
type Filter = keyof typeof filters;

export default async function ProjectsPage({ params, searchParams }: PageProps<"/[locale]/app/projects">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const filter: Filter = typeof sp.filter === "string" && sp.filter in filters ? (sp.filter as Filter) : "all";
  const dict = await getDictionary(locale);
  const t = dict.app.projects;
  const session = await getCurrentUser();
  if (!session) return null;
  const all = await listProjects(session.supabase, 200);
  const allowed = filters[filter] as ProjectStatus[] | null;
  const shown = allowed ? all.filter((p) => allowed.includes(p.project.status)) : all;

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <nav aria-label={t.title} className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4">
        {(Object.keys(filters) as Filter[]).map((f) => (
          <Link
            key={f}
            href={`${href("appProjects", locale)}${f === "all" ? "" : `?filter=${f}`}`}
            aria-current={f === filter ? "page" : undefined}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm transition-colors", f === filter ? "btn-primary" : "bg-white/[0.04] text-fg-muted hover:text-fg")}
          >
            {t.filters[f]}
          </Link>
        ))}
      </nav>
      {shown.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <ProjectCard key={p.project.id} {...p} dict={dict} locale={locale} />)}
        </div>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </div>
  );
}
