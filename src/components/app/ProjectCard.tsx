import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { projectTypeImages } from "@/config/media";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href, projectHref } from "@/i18n/routing";
import { timelineIndex, type Project } from "@/lib/projects/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function projectLabel(p: Pick<Project, "title" | "address">, dict: Dictionary) {
  return p.address || p.title || dict.app.status.draft;
}

export function ProjectCard({ project, dict, locale, cover, fileCount }: { project: Project; dict: Dictionary; locale: Locale; cover?: string; fileCount?: number }) {
  const draft = project.status === "draft";
  const link = draft ? `${href("appCreate", locale)}?project=${project.id}` : projectHref(locale, project.id);
  const step = timelineIndex(project.status);
  const date = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium" }).format(new Date(project.created_at));

  return (
    <Link href={link} className="surface hover-glow group flex flex-col overflow-hidden rounded-[var(--radius-card)]">
      <div className="relative aspect-[16/9] bg-ink-800">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL
          <img src={cover} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        ) : (
          <Photo name={projectTypeImages[project.type]} width={480} ratio={16 / 9} sizes="(min-width: 1024px) 320px, 92vw" decorative className="absolute inset-0" imgClassName="opacity-70 transition-transform duration-700 group-hover:scale-[1.03]" />
        )}
        <span className="absolute top-3 left-3">
          <ProjectStatusBadge status={project.status} dict={dict} />
        </span>
        {project.status === "ready" && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="btn-primary grid size-12 place-items-center rounded-full"><Icon name="play" className="size-5 translate-x-px" fill="currentColor" /></span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="truncate font-medium tracking-tight">{projectLabel(project, dict)}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {dict.app.types[project.type].label} · {interpolate(dict.app.projects.created, { date })}
            {fileCount !== undefined && ` · ${interpolate(dict.app.projects.files, { count: fileCount })}`}
          </p>
        </div>
        {!draft && step < 3 && step >= 0 && (
          <ProgressIndicator value={((step + 1) / 4) * 100} label={dict.app.status[project.status]} animated={project.status === "in_production"} />
        )}
        {draft && <p className="mt-auto text-sm font-medium text-brand-300">{dict.app.dashboard.continueDraft} →</p>}
      </div>
    </Link>
  );
}
