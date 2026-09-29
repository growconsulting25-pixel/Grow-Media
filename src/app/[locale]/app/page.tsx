import Link from "next/link";
import { notFound } from "next/navigation";
import { IdeaCard } from "@/components/app/IdeaCard";
import { ProjectCard, projectLabel } from "@/components/app/ProjectCard";
import { UsageCard } from "@/components/app/UsageCard";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href, projectHref } from "@/i18n/routing";
import { getAccountSummary, getProfile, listIdeas, listProjects } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

function greetingKey(): "morning" | "afternoon" | "evening" {
  const hour = Number(new Intl.DateTimeFormat("en-CA", { hour: "numeric", hourCycle: "h23", timeZone: "America/Toronto" }).format(new Date()));
  return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
}

export default async function DashboardPage({ params }: PageProps<"/[locale]/app">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app;
  const session = await getCurrentUser();
  if (!session) return null;
  const [profile, projects, summary, ideas] = await Promise.all([
    getProfile(session.supabase, session.user.id),
    listProjects(session.supabase, 24),
    getAccountSummary(session.supabase),
    listIdeas(session.supabase, locale, 3),
  ]);

  const drafts = projects.filter((p) => p.project.status === "draft");
  const ready = projects.filter((p) => p.project.status === "ready" || p.project.status === "completed");
  const current = projects.filter((p) => !["draft", "ready", "completed", "cancelled"].includes(p.project.status));
  const greeting = interpolate(t.greeting[greetingKey()], { name: profile?.first_name ?? "" }).replace(/ \./, ".").replace(/,\s*\./, ".");

  return (
    <div className="space-y-12">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-3xl sm:text-4xl">{greeting}</h1>
          <p className="mt-2 text-fg-muted">{t.greeting.subtitle}</p>
        </div>
        <Link href={href("appCreate", locale)} className={buttonClasses({ size: "lg" })}>
          <Icon name="plus" className="size-4" /> {t.dashboard.newVideo}
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {summary.free_credits > 0 && (
          <div className="edge-glow flex items-center gap-4 rounded-[var(--radius-card)] bg-violet-500/[0.08] p-5 shadow-[inset_0_0_0_1px_rgba(170,125,255,0.3)]">
            <span className="btn-primary grid size-11 shrink-0 place-items-center rounded-xl"><Icon name="sparkle" className="size-5" fill="currentColor" /></span>
            <div>
              <p className="font-medium">{t.dashboard.freeCredit}</p>
              <p className="text-sm text-fg-muted">{t.dashboard.freeCreditNote}</p>
            </div>
          </div>
        )}
        <UsageCard summary={summary} dict={dict} locale={locale} />
      </section>

      {ready.length > 0 && (
        <section aria-labelledby="ready-title">
          <h2 id="ready-title" className="mb-4 text-lg font-semibold tracking-tight">{t.ready.title}</h2>
          <ul className="space-y-3">
            {ready.slice(0, 3).map(({ project, cover }) => (
              <li key={project.id} className="surface flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] p-3 pr-5">
                <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-ink-800">
                  {/* eslint-disable-next-line @next/next/no-img-element -- signed URL */}
                  {cover && <img src={cover} alt="" className="size-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{projectLabel(project, dict)}</p>
                  <p className="flex items-center gap-1 text-sm text-success"><Icon name="check" className="size-3.5" /> {dict.app.statusHint.ready}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={projectHref(locale, project.id)} className={buttonClasses({ size: "sm" })}><Icon name="play" className="size-3.5" fill="currentColor" /> {t.ready.watch}</Link>
                  <Link href={`${projectHref(locale, project.id)}#revision`} className={buttonClasses({ size: "sm", variant: "secondary" })}>{t.ready.revise}</Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="current-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="current-title" className="text-lg font-semibold tracking-tight">{t.dashboard.currentProjects}</h2>
          {projects.length > 0 && <Link href={href("appProjects", locale)} className="text-sm text-violet-300 hover:underline">{t.dashboard.viewAll}</Link>}
        </div>
        {current.length || drafts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...current, ...drafts].slice(0, 6).map((p) => <ProjectCard key={p.project.id} {...p} dict={dict} locale={locale} />)}
          </div>
        ) : (
          <div className="surface flex flex-col items-center rounded-[var(--radius-panel)] px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-violet-500/15 text-violet-300"><Icon name="upload" className="size-5" /></span>
            <p className="mt-4 text-lg font-medium">{t.dashboard.emptyTitle}</p>
            <p className="mt-1.5 max-w-sm text-sm text-fg-muted">{t.dashboard.emptyDescription}</p>
            <Link href={href("appCreate", locale)} className={buttonClasses({ className: "mt-6" })}>{t.dashboard.newVideo}</Link>
          </div>
        )}
      </section>

      {ideas.length > 0 && (
        <section aria-labelledby="ideas-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="ideas-title" className="text-lg font-semibold tracking-tight">{t.ideas.dashboardTitle}</h2>
            <Link href={href("appIdeas", locale)} className="text-sm text-violet-300 hover:underline">{t.dashboard.viewAll}</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} dict={dict} locale={locale} />)}
          </div>
        </section>
      )}
    </div>
  );
}
