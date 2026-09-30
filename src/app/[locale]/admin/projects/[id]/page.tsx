import Link from "next/link";
import { notFound } from "next/navigation";
import { DeliverableUploader } from "@/components/admin/DeliverableUploader";
import { RevisionControls } from "@/components/admin/RevisionControls";
import { StatusControl } from "@/components/admin/StatusControl";
import { MessageThread } from "@/components/app/MessageThread";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { Icon } from "@/components/ui/Icon";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { cn } from "@/lib/cn";
import { getMessages, getRevisions, type BrandKit, type Deliverable } from "@/lib/projects/server";
import type { Project, ProjectFile } from "@/lib/projects/types";

export default async function AdminProjectPage({ params }: PageProps<"/[locale]/admin/projects/[id]">) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.admin;
  const { supabase, user } = await requireAdmin();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();
  const p = project as Project;

  const [profileRes, filesRes, kitRes, subRes, delivRes, messages, revisions] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, email, locale, free_video_credits").eq("id", p.user_id).single(),
    supabase.from("project_files").select("*").eq("project_id", id).order("position"),
    supabase.from("brand_kits").select("*").eq("user_id", p.user_id).maybeSingle(),
    supabase.from("subscriptions").select("plan_id, status, current_period_end").eq("user_id", p.user_id).in("status", ["active", "trialing"]).order("current_period_end", { ascending: false }).limit(1),
    supabase.from("deliverables").select("*").eq("project_id", id).order("version", { ascending: false }),
    getMessages(supabase, id),
    getRevisions(supabase, id),
  ]);
  const profile = profileRes.data as { first_name: string; last_name: string; email: string; locale: string; free_video_credits: number } | null;
  const files = (filesRes.data ?? []) as ProjectFile[];
  const kit = kitRes.data as BrandKit | null;
  const sub = subRes.data?.[0] as { plan_id: "agent" | "pro" | "single"; status: string } | undefined;
  const deliverables = (delivRes.data ?? []) as Deliverable[];

  const [fileUrls, delivUrls] = await Promise.all([
    files.length ? supabase.storage.from("project-files").createSignedUrls(files.map((f) => f.storage_path), 3600, { download: true }) : { data: [] },
    deliverables.length ? supabase.storage.from("deliverables").createSignedUrls(deliverables.map((d) => d.storage_path), 3600) : { data: [] },
  ]);
  const fileUrl = Object.fromEntries((fileUrls.data ?? []).map((d) => [d.path, d.signedUrl]));
  const delivUrl = Object.fromEntries((delivUrls.data ?? []).map((d) => [d.path, d.signedUrl]));
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  const branding = p.branding ?? { useBrandKit: true };

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/${locale}/admin/production`} className="text-sm text-fg-muted hover:text-fg">← {t.back}</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="display text-3xl">{p.address || p.title || id.slice(0, 8)}</h1>
          <ProjectStatusBadge status={p.status} dict={dict} />
          {p.is_free && <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs text-brand-300">{t.free}</span>}
        </div>
        <p className="mt-2 text-sm text-fg-subtle">
          {dict.app.types[p.type].label} · {p.style ? dict.app.styles[p.style] : "—"} · {p.submitted_at ? fmt.format(new Date(p.submitted_at)) : "—"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="surface rounded-[var(--radius-panel)] p-6">
            <StatusControl key={p.status} projectId={id} current={p.status} title={p.address || p.title || id.slice(0, 8)} client={name || profile?.email || ""} />
          </section>

          <section className="surface rounded-[var(--radius-panel)] p-6">
            <h2 className="text-lg font-semibold">{t.brief}</h2>
            {p.title && <p className="mt-3 font-medium">{p.title}</p>}
            {p.description && <p className="mt-2 text-sm whitespace-pre-line text-fg-muted">{p.description}</p>}
            <p className="mt-3 text-sm whitespace-pre-line text-fg-muted">{p.notes || dict.app.project.noNotes}</p>
          </section>

          <section className="surface rounded-[var(--radius-panel)] p-6">
            <h2 className="text-lg font-semibold">{t.sourceFiles} <span className="text-sm font-normal text-fg-subtle">({files.length})</span></h2>
            <ul className="mt-4 divide-y divide-white/[0.05]">
              {files.map((f, i) => (
                <li key={f.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-6 font-mono text-xs text-fg-subtle">{i + 1}</span>
                    <Icon name={f.kind === "video" ? "play" : "image"} className="size-4 shrink-0 text-fg-subtle" />
                    <span className="truncate">{f.file_name}</span>
                    <span className="shrink-0 text-xs text-fg-subtle">{(f.size_bytes / 1024 / 1024).toFixed(1)} MB</span>
                  </span>
                  {fileUrl[f.storage_path] && (
                    <a href={fileUrl[f.storage_path]} className="inline-flex shrink-0 items-center gap-1 text-brand-400 hover:underline">
                      <Icon name="download" className="size-4" /> {t.downloadAll}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="surface rounded-[var(--radius-panel)] p-6">
            <h2 className="mb-4 text-lg font-semibold">{t.deliver}</h2>
            <DeliverableUploader projectId={id} clientId={p.user_id} />
            {deliverables.length > 0 && (
              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="mb-3 text-sm font-medium">{t.deliveries}</p>
                <ul className="space-y-2 text-sm">
                  {deliverables.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-3">
                      <span>{t.version.replace("{n}", String(d.version))} · {d.format} · <span className="text-fg-subtle">{fmt.format(new Date(d.created_at))}</span></span>
                      {delivUrl[d.storage_path] && <a href={delivUrl[d.storage_path]} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">{dict.app.videos.preview}</a>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {revisions.length > 0 && (
            <section className="surface rounded-[var(--radius-panel)] p-6">
              <h2 className="text-lg font-semibold">{t.revisions}</h2>
              <ul className="mt-4 space-y-3">
                {revisions.map((r) => (
                  <li key={r.id} className="rounded-xl bg-white/[0.03] p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-fg-subtle">{fmt.format(new Date(r.created_at))}{r.timestamp_seconds !== null && ` · ${Math.floor(r.timestamp_seconds / 60)}:${String(Math.round(r.timestamp_seconds % 60)).padStart(2, "0")}`}</span>
                      <span className="flex items-center gap-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs", r.status === "done" ? "bg-success/12 text-success" : "bg-brand-500/15 text-brand-300")}>{dict.app.revision.status[r.status]}</span>
                        <RevisionControls id={r.id} status={r.status} />
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-fg-muted">{r.message}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <MessageThread projectId={id} userId={user.id} initial={messages} asStaff ownerId={p.user_id} />
        </div>

        <aside className="space-y-6">
          <section className="surface rounded-[var(--radius-panel)] p-6 text-sm">
            <h2 className="text-lg font-semibold">{t.client}</h2>
            <p className="mt-3 font-medium">{name || "—"}</p>
            <a href={`mailto:${profile?.email}`} className="text-brand-400 hover:underline">{profile?.email}</a>
            <dl className="mt-4 space-y-2">
              <div className="flex justify-between gap-3"><dt className="text-fg-subtle">{t.plan}</dt><dd>{sub ? dict.pricing.plans[sub.plan_id].name : t.noPlan}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-fg-subtle">{dict.app.profile.language}</dt><dd>{profile?.locale === "en" ? "English" : "Français"}</dd></div>
            </dl>
          </section>

          <section className="surface rounded-[var(--radius-panel)] p-6 text-sm">
            <h2 className="text-lg font-semibold">{t.branding}</h2>
            <p className="mt-2 text-fg-muted">{branding.useBrandKit ? t.brandKit : t.customBranding}</p>
            <dl className="mt-4 space-y-2">
              {(branding.useBrandKit
                ? [[dict.app.brand.agentName, kit?.agent_name], [dict.app.brand.agency, kit?.agency], [dict.app.brand.phone, kit?.phone], [dict.app.brand.email, kit?.email], [dict.app.brand.website, kit?.website]]
                : [[dict.app.brand.agentName, branding.agentName], [dict.app.brand.agency, branding.agency], [dict.app.brand.phone, branding.phone]]
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><dt className="text-fg-subtle">{k}</dt><dd className="truncate text-right">{v || "—"}</dd></div>
              ))}
              {(() => {
                const colors = branding.useBrandKit ? [kit?.primary_color, kit?.secondary_color] : [branding.primaryColor];
                return (
                  <div className="flex justify-between gap-3"><dt className="text-fg-subtle">{dict.app.brand.primaryColor}</dt>
                    <dd className="flex gap-1.5">{colors.filter(Boolean).map((c) => <span key={c} title={c ?? ""} className="size-5 rounded-full ring-1 ring-white/20" style={{ background: c ?? undefined }} />)}</dd>
                  </div>
                );
              })()}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
