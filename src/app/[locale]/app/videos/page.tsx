import Link from "next/link";
import { notFound } from "next/navigation";
import { projectLabel } from "@/components/app/ProjectCard";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { Icon } from "@/components/ui/Icon";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href, projectHref } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { listVideos } from "@/lib/projects/server";
import type { ProjectStatus } from "@/lib/projects/types";
import { getCurrentUser } from "@/lib/supabase/server";

const filters = {
  all: null,
  ready: ["ready", "completed"],
  processing: ["submitted", "in_production", "review"],
  revision: ["revision_requested"],
} satisfies Record<string, ProjectStatus[] | null>;
type Filter = keyof typeof filters;

/** Content library: every non-draft project with its latest video. */
export default async function VideosPage({ params, searchParams }: PageProps<"/[locale]/app/videos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const filter: Filter = typeof sp.filter === "string" && sp.filter in filters ? (sp.filter as Filter) : "all";
  const dict = await getDictionary(locale);
  const t = dict.app.videos;
  const session = await getCurrentUser();
  if (!session) return null;
  const all = await listVideos(session.supabase);
  const allowed = filters[filter] as ProjectStatus[] | null;
  const shown = allowed ? all.filter((v) => allowed.includes(v.project.status)) : all;
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium" });

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-fg-muted">{t.subtitle}</p>
      <nav aria-label={t.title} className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4">
        {(Object.keys(filters) as Filter[]).map((f) => (
          <Link key={f} href={`${href("appVideos", locale)}${f === "all" ? "" : `?filter=${f}`}`} aria-current={f === filter ? "page" : undefined}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm transition-colors", f === filter ? "btn-primary" : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
            {t.filters[f]}
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ project, video, cover }) => (
            <li key={project.id} className="surface hover-glow flex flex-col overflow-hidden rounded-[var(--radius-card)]">
              <div className={cn("relative bg-ink-950", video?.format === "16:9" ? "aspect-video" : "aspect-[4/5]")}>
                {video?.url ? (
                  <video src={video.url} poster={cover} controls playsInline preload="none" className="absolute inset-0 size-full object-cover" aria-label={`${t.preview}: ${projectLabel(project, dict)}`} />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed URL */}
                    {cover && <img src={cover} alt="" className="absolute inset-0 size-full object-cover opacity-50" />}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-fg-muted backdrop-blur">{t.processing}</span>
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link href={projectHref(locale, project.id)} className="min-w-0 truncate font-medium hover:underline">{projectLabel(project, dict)}</Link>
                  <ProjectStatusBadge status={project.status} dict={dict} />
                </div>
                <p className="text-xs text-fg-subtle">
                  {fmt.format(new Date(project.created_at))}
                  {video?.format && ` · ${t.format} ${video.format}`}
                </p>
                {video?.url && (
                  <a href={video.url} download className="mt-auto inline-flex items-center gap-1.5 text-sm text-violet-300 hover:underline">
                    <Icon name="download" className="size-4" /> {dict.app.ready.download}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </div>
  );
}
