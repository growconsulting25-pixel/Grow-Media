import Link from "next/link";
import { notFound } from "next/navigation";
import { BarList, ColumnChart, Panel, StatCard } from "@/components/admin/console/Cards";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { requireAdmin } from "@/lib/admin/server";
import { loadAdminData, summarize } from "@/lib/admin/stats";
import { orderLabel } from "./payments/labels";

export default async function AdminDashboardPage({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const c = dict.app.admin.console;
  const t = c.dash;
  const { supabase, firstName } = await requireAdmin();
  const s = summarize(await loadAdminData(supabase));

  const base = `/${locale}/admin`;
  const tag = localeTags[locale];
  const money = (cents: number) => new Intl.NumberFormat(tag, { style: "currency", currency: "CAD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
  const day = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" });
  const date = new Intl.DateTimeFormat(tag, { dateStyle: "medium" });
  const total30 = s.daily.reduce((n, d) => n + d.value, 0);
  const st = dict.app.admin.statusLabels;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
        {firstName && <p className="mt-1 text-fg-muted">{interpolate(t.hello, { name: firstName })}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard href={`${base}/payments?range=today`} accent="cyan" icon="coins" label={t.revenueToday} value={money(s.revenueToday)} />
        <StatCard href={`${base}/payments?range=month`} accent="orange" icon="calendar" label={t.revenueMonth} value={money(s.revenueMonth)} sub={interpolate(t.vsLastMonth, { value: money(s.revenueLastMonth) })} />
        <StatCard href={`${base}/clients?segment=subscribers`} accent="emerald" icon="layers" label={t.mrr} value={money(s.mrrCents)} sub={interpolate(t.subscribersCount, { count: s.subscribers })} />
        <StatCard href={`${base}/clients`} accent="amber" icon="user" label={t.clients} value={String(s.clientsTotal)} sub={interpolate(t.newThisMonth, { count: s.clientsThisMonth })} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard href={`${base}/production?status=submitted`} accent="rose" icon="upload" label={t.toProduce} value={String(s.production.submitted)} />
        <StatCard href={`${base}/production?status=in_production`} accent="amber" icon="clock" label={t.inProduction} value={String(s.production.in_production)} />
        <StatCard href={`${base}/production?status=revision_requested`} accent="orange" icon="revise" label={t.openRevisions} value={String(s.openRevisions)} />
        <StatCard href={`${base}/production?status=ready`} accent="emerald" icon="check" label={t.deliveredMonth} value={String(s.deliveredMonth)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title={t.revenue30} href={`${base}/payments?range=30d`} action={t.viewAll} accent="cyan">
          <p className="-mt-2 mb-4 text-sm text-fg-muted">{interpolate(t.total30, { value: money(total30) })}</p>
          <ColumnChart
            label={t.revenue30}
            accent="cyan"
            height={260}
            format={money}
            data={s.daily.map((d) => ({ key: d.date, value: d.value, tip: day.format(new Date(d.date)), href: `${base}/payments?range=30d` }))}
          />
          <div className="mt-2 flex justify-between text-[0.7rem] text-fg-subtle">
            <span>{day.format(new Date(s.daily[0].date))}</span>
            <span>{day.format(new Date(s.daily[s.daily.length - 1].date))}</span>
          </div>
        </Panel>

        <Panel title={t.production} href={`${base}/production`} action={t.viewAll} accent="amber">
          <BarList
            accent="amber"
            rows={(["submitted", "in_production", "review", "revision_requested", "ready", "completed"] as const).map((k) => ({
              label: st[k], value: s.production[k], href: `${base}/production?status=${k}`,
            }))}
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title={t.segments} href={`${base}/clients`} action={t.viewAll} accent="emerald">
          <BarList
            accent="emerald"
            rows={(["subscriber_agent", "subscriber_pro", "single", "free"] as const).map((k) => ({
              label: c.segments[k], value: s.segments[k], href: `${base}/clients?segment=${k}`,
            }))}
          />
        </Panel>
        <Panel title={t.signups} href={`${base}/clients`} action={t.viewAll} accent="orange">
          <ColumnChart
            label={t.signups}
            accent="orange"
            height={140}
            format={(n) => String(n)}
            data={s.weekly.map((w) => ({ key: w.date, value: w.value, tip: interpolate(t.weekOf, { date: day.format(new Date(w.date)) }), href: `${base}/clients` }))}
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title={t.recentPayments} href={`${base}/payments`} action={t.viewAll} accent="orange">
          {s.recentOrders.length ? (
            <ul className="-mx-2 divide-y divide-white/[0.05]">
              {s.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`${base}/clients/${o.userId}`} className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.04]">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{o.clientName}</span>
                      <span className="block truncate text-xs text-fg-subtle">{orderLabel(o, c.payments.items)} · {date.format(new Date(o.createdAt))}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">{money(o.amountCents)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-fg-muted">{t.none}</p>}
        </Panel>
        <Panel title={t.recentClients} href={`${base}/clients`} action={t.viewAll} accent="emerald">
          {s.recentClients.length ? (
            <ul className="-mx-2 divide-y divide-white/[0.05]">
              {s.recentClients.map((cl) => (
                <li key={cl.id}>
                  <Link href={`${base}/clients/${cl.id}`} className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.04]">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{cl.name}</span>
                      <span className="block truncate text-xs text-fg-subtle">{cl.email}</span>
                    </span>
                    <span className="shrink-0 text-right text-xs text-fg-muted">
                      <span className="block">{c.segments[cl.segment]}</span>
                      <span className="block text-fg-subtle">{date.format(new Date(cl.createdAt))}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-fg-muted">{t.none}</p>}
        </Panel>
      </div>
    </div>
  );
}
