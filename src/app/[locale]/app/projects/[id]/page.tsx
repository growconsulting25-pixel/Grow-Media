import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { projectLabel } from "@/components/app/ProjectCard";
import { MessageThread } from "@/components/app/MessageThread";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { RevisionForm } from "@/components/app/RevisionForm";
import { Upsell } from "@/components/app/Upsell";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import { getMessages, getProjectDetail, getRevisions } from "@/lib/projects/server";
import { timelineIndex, timelineSteps } from "@/lib/projects/types";
import { getCurrentUser } from "@/lib/supabase/server";
import { cn } from "@/lib/cn";

export default async function ProjectPage({ params }: PageProps<"/[locale]/app/projects/[id]">) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.project;
  const session = await getCurrentUser();
  if (!session) return null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const detail = await getProjectDetail(session.supabase, id);
  if (!detail) notFound();
  const { project, files, events, deliverables } = detail;
  const [messages, revisions] = await Promise.all([getMessages(session.supabase, project.id), getRevisions(session.supabase, project.id)]);
  const revisable = ["ready", "review", "completed"].includes(project.status);
  if (project.status === "draft") redirect(`${href("appCreate", locale)}?project=${project.id}`);

  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });
  const current = timelineIndex(project.status);
  const eventAt = (s: string) => events.findLast((e) => e.status === s)?.created_at;
  const video = deliverables.find((d) => d.kind === "video" && d.url);

  return (
    <div className="space-y-10">
      <div>
        <Link href={href("appProjects", locale)} className="text-sm text-fg-muted hover:text-fg">← {t.back}</Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="display text-3xl sm:text-4xl">{projectLabel(project, dict)}</h1>
          <ProjectStatusBadge status={project.status} dict={dict} />
          {project.is_free && <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-medium text-brand-300">{t.free}</span>}
        </div>
        <p className="mt-2 text-fg-muted">{dict.app.statusHint[project.status]}</p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-subtle">
          <div className="flex gap-1.5"><dt>{t.type}:</dt><dd className="text-fg-muted">{dict.app.types[project.type].label}</dd></div>
          <div className="flex gap-1.5"><dt>{t.created}</dt><dd className="text-fg-muted">{fmt.format(new Date(project.created_at))}</dd></div>
          {project.submitted_at && <div className="flex gap-1.5"><dt>{t.submitted}</dt><dd className="text-fg-muted">{fmt.format(new Date(project.submitted_at))}</dd></div>}
        </dl>
      </div>

      {/* Timeline */}
      <section aria-labelledby="timeline-title" className="surface rounded-[var(--radius-panel)] p-6">
        <h2 id="timeline-title" className="text-sm font-medium text-fg-muted">{t.timeline}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-4">
          {timelineSteps.map((step, i) => {
            const done = i < current || (i === current && step === "ready");
            const active = i === current && step !== "ready";
            const at = eventAt(step);
            return (
              <li key={step} className="flex items-center gap-3 sm:flex-col sm:items-start" aria-current={active ? "step" : undefined}>
                <div className="flex w-full items-center gap-2">
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs", done ? "bg-brand-500 text-on-brand" : active ? "bg-brand-500/20 text-brand-300 ring-2 ring-brand-400/60" : "bg-white/[0.06] text-fg-subtle")}>
                    {done ? <Icon name="check" className="size-3.5" /> : i + 1}
                  </span>
                  {i < timelineSteps.length - 1 && <span className={cn("hidden h-px flex-1 sm:block", i < current ? "bg-brand-500 text-on-brand" : "bg-white/10")} />}
                </div>
                <div>
                  <p className={cn("text-sm font-medium", !done && !active && "text-fg-subtle")}>
                    {step === "in_production" && project.status === "revision_requested" ? dict.app.status.revision_requested : dict.app.status[step]}
                  </p>
                  {at && <p className="text-xs text-fg-subtle">{fmt.format(new Date(at))}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Deliverables */}
      <section aria-labelledby="deliv-title">
        <h2 id="deliv-title" className="mb-4 text-lg font-semibold tracking-tight">{t.deliverables}</h2>
        {video ? (
          <div className="surface grid gap-6 rounded-[var(--radius-panel)] p-4 sm:p-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <video src={video.url} controls playsInline preload="metadata" className={cn("w-full rounded-2xl bg-black", video.format === "16:9" ? "aspect-video" : "aspect-[9/16] max-h-[70vh]")} />
            <div className="flex flex-col gap-4">
              {video.caption && <p className="text-sm leading-relaxed whitespace-pre-line text-fg-muted">{video.caption}</p>}
              {video.hashtags && <p className="text-sm text-brand-300">{video.hashtags}</p>}
              <div className="flex flex-wrap items-start gap-3">
                {revisable && <RevisionForm projectId={project.id} />}
                <a href={video.url} download className={buttonClasses({})}><Icon name="download" className="size-4" /> {t.download}</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="surface flex items-center gap-4 rounded-[var(--radius-panel)] p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300"><Icon name="clock" className="size-5" /></span>
            <p className="text-sm text-fg-muted">{t.deliverablesPending}</p>
          </div>
        )}
      </section>

      {project.is_free && (project.status === "ready" || project.status === "completed") && <Upsell dict={dict} locale={locale} />}

      {revisions.length > 0 && (
        <section aria-labelledby="revisions-title" className="surface rounded-[var(--radius-panel)] p-6">
          <h2 id="revisions-title" className="text-lg font-semibold tracking-tight">{dict.app.revision.history}</h2>
          <ul className="mt-4 space-y-3">
            {revisions.map((r) => (
              <li key={r.id} className="rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
                  <span>{fmt.format(new Date(r.created_at))}{r.timestamp_seconds !== null && ` · ${Math.floor(r.timestamp_seconds / 60)}:${String(Math.round(r.timestamp_seconds % 60)).padStart(2, "0")}`}</span>
                  <span className={cn("rounded-full px-2 py-0.5", r.status === "done" ? "bg-success/12 text-success" : "bg-brand-500/15 text-brand-300")}>{dict.app.revision.status[r.status]}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-fg-muted">{r.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <MessageThread projectId={project.id} userId={session.user.id} initial={messages} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brief */}
        <section aria-labelledby="brief-title" className="surface rounded-[var(--radius-panel)] p-6">
          <h2 id="brief-title" className="text-lg font-semibold tracking-tight">{t.brief}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-fg-subtle">{t.style}</dt><dd className="mt-0.5">{project.style ? dict.app.styles[project.style] : "—"}</dd></div>
            {project.description && <div><dt className="text-fg-subtle">{dict.app.create.description}</dt><dd className="mt-0.5 whitespace-pre-line text-fg-muted">{project.description}</dd></div>}
            <div><dt className="text-fg-subtle">{t.notes}</dt><dd className="mt-0.5 whitespace-pre-line text-fg-muted">{project.notes || t.noNotes}</dd></div>
          </dl>
        </section>

        {/* Files */}
        <section aria-labelledby="files-title" className="surface rounded-[var(--radius-panel)] p-6">
          <h2 id="files-title" className="text-lg font-semibold tracking-tight">{t.files} <span className="text-sm font-normal text-fg-subtle">({files.length})</span></h2>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {files.map((f) => (
              <li key={f.id} className="relative aspect-square overflow-hidden rounded-lg bg-ink-800" title={f.file_name}>
                {f.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- signed URL
                  <img src={f.url} alt={f.file_name} loading="lazy" className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center text-fg-subtle"><Icon name="play" className="size-5" /></span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
