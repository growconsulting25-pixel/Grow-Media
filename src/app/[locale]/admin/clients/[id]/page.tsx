import Link from "next/link";
import { notFound } from "next/navigation";
import { accents, segmentAccent } from "@/components/admin/console/accents";
import { Panel, StatCard } from "@/components/admin/console/Cards";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { loadAdminData } from "@/lib/admin/stats";
import { cn } from "@/lib/cn";
import { orderLabel } from "../../payments/labels";

/** One client: type, spend, projects (open in production) and payments. */
export default async function ClientPage({ params }: PageProps<"/[locale]/admin/clients/[id]">) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const dict = await getDictionary(locale);
  const c = dict.app.admin.console;
  const t = c.clients;
  const { supabase } = await requireAdmin();
  const data = await loadAdminData(supabase);
  const client = data.clients.find((cl) => cl.id === id);
  if (!client) notFound();
  const projects = data.projects.filter((p) => p.userId === id).reverse();
  const orders = data.orders.filter((o) => o.userId === id);

  const tag = localeTags[locale];
  const money = (cents: number) => new Intl.NumberFormat(tag, { style: "currency", currency: "CAD" }).format(cents / 100);
  const date = new Intl.DateTimeFormat(tag, { dateStyle: "medium" });
  const a = accents[segmentAccent[client.segment]];

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/${locale}/admin/clients`} className="text-sm text-fg-muted hover:text-fg">← {t.back}</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="display text-3xl">{client.name}</h1>
          <span className={cn("rounded-full px-2.5 py-1 text-xs", a.chip)}>{c.segments[client.segment]}</span>
          {client.cancelAtPeriodEnd && <span className="rounded-full bg-rose-400/15 px-2.5 py-1 text-xs text-rose-300">{t.cancelling}</span>}
        </div>
        <a href={`mailto:${client.email}`} className="mt-1 inline-block text-sm text-brand-300 hover:underline">{client.email}</a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard href="#projects" accent="amber" icon="play" label={t.projects} value={String(client.projects)} />
        <StatCard href="#payments" accent="orange" icon="coins" label={t.spent} value={money(client.spentCents)} />
        <StatCard href={`/${locale}/admin/clients?segment=${client.segment}`} accent={segmentAccent[client.segment]} icon="calendar" label={t.since} value={date.format(new Date(client.createdAt))} sub={c.segments[client.segment]} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel id="projects" title={t.projects} accent="amber">
          {projects.length ? (
            <ul className="-mx-2 divide-y divide-white/[0.05]">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/${locale}/admin/projects/${p.id}`} className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.04]">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.title}</span>
                      <span className="block text-xs text-fg-subtle">{dict.app.types[p.type].label}{p.submittedAt ? ` · ${date.format(new Date(p.submittedAt))}` : ""}</span>
                    </span>
                    <ProjectStatusBadge status={p.status} dict={dict} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-fg-muted">{t.noProjects}</p>}
        </Panel>
        <Panel id="payments" title={t.payments} accent="orange">
          {orders.length ? (
            <ul className="-mx-2 divide-y divide-white/[0.05]">
              {orders.map((o) => {
                const inner = (
                  <>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{orderLabel(o, c.payments.items)}</span>
                      <span className="block text-xs text-fg-subtle">{date.format(new Date(o.createdAt))}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">{money(o.amountCents)}</span>
                  </>
                );
                return (
                  <li key={o.id}>
                    {o.projectId ? (
                      <Link href={`/${locale}/admin/projects/${o.projectId}`} className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.04]">{inner}</Link>
                    ) : (
                      <Link href={`/${locale}/admin/payments`} className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.04]">{inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : <p className="text-sm text-fg-muted">{t.noPayments}</p>}
        </Panel>
      </div>
    </div>
  );
}
