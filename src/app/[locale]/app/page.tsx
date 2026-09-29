import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/app/ProjectCard";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { getProfile, listProjects } from "@/lib/projects/server";
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
  const [profile, projects] = await Promise.all([getProfile(session.supabase, session.user.id), listProjects(session.supabase, 24)]);

  const drafts = projects.filter((p) => p.project.status === "draft");
  const active = projects.filter((p) => p.project.status !== "draft");
  const firstName = profile?.first_name || "";

  return (
    <div className="space-y-12">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-3xl sm:text-4xl">{interpolate(t.greeting[greetingKey()], { name: firstName }).replace(/ \./, ".").replace(/,\s*\./, ".")}</h1>
          <p className="mt-2 text-fg-muted">{t.greeting.subtitle}</p>
        </div>
        <Link href={href("appCreate", locale)} className={buttonClasses({ size: "lg" })}>
          <Icon name="plus" className="size-4" /> {t.dashboard.newVideo}
        </Link>
      </section>

      {(profile?.free_video_credits ?? 0) > 0 && (
        <section className="edge-glow flex items-center gap-4 rounded-[var(--radius-card)] bg-violet-500/[0.08] p-5 shadow-[inset_0_0_0_1px_rgba(170,125,255,0.3)]">
          <span className="btn-primary grid size-11 shrink-0 place-items-center rounded-xl"><Icon name="sparkle" className="size-5" fill="currentColor" /></span>
          <div>
            <p className="font-medium">{t.dashboard.freeCredit}</p>
            <p className="text-sm text-fg-muted">{t.dashboard.freeCreditNote}</p>
          </div>
        </section>
      )}

      {drafts.length > 0 && (
        <section aria-labelledby="drafts-title">
          <h2 id="drafts-title" className="mb-4 text-lg font-semibold tracking-tight">{t.dashboard.drafts}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.slice(0, 3).map((p) => <ProjectCard key={p.project.id} {...p} dict={dict} locale={locale} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="current-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="current-title" className="text-lg font-semibold tracking-tight">{t.dashboard.currentProjects}</h2>
          {active.length > 0 && <Link href={href("appProjects", locale)} className="text-sm text-violet-300 hover:underline">{t.dashboard.viewAll}</Link>}
        </div>
        {active.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.slice(0, 6).map((p) => <ProjectCard key={p.project.id} {...p} dict={dict} locale={locale} />)}
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
    </div>
  );
}
