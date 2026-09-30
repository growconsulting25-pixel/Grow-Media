import Link from "next/link";
import { notFound } from "next/navigation";
import { ColumnChart, Panel, StatCard } from "@/components/admin/console/Cards";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { requireAdmin } from "@/lib/admin/server";
import { inRange, loadAdminData, summarize, type RangeKey } from "@/lib/admin/stats";
import { cn } from "@/lib/cn";
import { orderLabel } from "./labels";

const RANGES: RangeKey[] = ["today", "7d", "month", "30d", "all"];

/** Every payment (plans, single videos, add-ons, renewals), by period. */
export default async function PaymentsPage({ params, searchParams }: PageProps<"/[locale]/admin/payments">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(locale);
  const c = dict.app.admin.console;
  const t = c.payments;
  const { supabase } = await requireAdmin();
  const data = await loadAdminData(supabase);
  const s = summarize(data);

  const range: RangeKey = typeof sp.range === "string" && (RANGES as string[]).includes(sp.range) ? (sp.range as RangeKey) : "month";
  const shown = data.orders.filter((o) => inRange(o.createdAt, range));
  const total = shown.reduce((n, o) => n + o.amountCents, 0);

  const base = `/${locale}/admin`;
  const tag = localeTags[locale];
  const money = (cents: number) => new Intl.NumberFormat(tag, { style: "currency", currency: "CAD" }).format(cents / 100);
  const day = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" });
  const date = new Intl.DateTimeFormat(tag, { dateStyle: "medium", timeStyle: "short" });
  const cell = "block px-4 py-3";

  return (
    <div className="space-y-6">
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>

      <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {RANGES.map((r) => (
          <Link key={r} href={`${base}/payments?range=${r}`} aria-current={r === range ? "page" : undefined}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm", r === range ? "bg-orange-400/15 text-orange-200 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.35)]" : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
            {t.ranges[r]}
          </Link>
        ))}
      </nav>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard href={`${base}/payments?range=${range}#list`} accent="orange" icon="coins" label={t.total} value={money(total)} sub={interpolate(t.count, { count: shown.length })} />
        <StatCard href={`${base}/payments?range=today`} accent="cyan" icon="calendar" label={c.dash.revenueToday} value={money(s.revenueToday)} />
        <StatCard href={`${base}/clients?segment=subscribers`} accent="emerald" icon="layers" label={c.dash.mrr} value={money(s.mrrCents)} sub={interpolate(c.dash.subscribersCount, { count: s.subscribers })} />
      </div>

      <Panel title={c.dash.revenue30} accent="orange">
        <ColumnChart label={c.dash.revenue30} accent="orange" format={money}
          data={s.daily.map((d) => ({ key: d.date, value: d.value, tip: day.format(new Date(d.date)) }))} />
        <div className="mt-2 flex justify-between text-[0.7rem] text-fg-subtle">
          <span>{day.format(new Date(s.daily[0].date))}</span>
          <span>{day.format(new Date(s.daily[s.daily.length - 1].date))}</span>
        </div>
      </Panel>

      {shown.length ? (
        <div id="list" className="surface scroll-mt-24 overflow-x-auto rounded-[var(--radius-card)]">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">{t.columns.date}</th>
                <th className="px-4 py-3 font-medium">{t.columns.client}</th>
                <th className="px-4 py-3 font-medium">{t.columns.item}</th>
                <th className="px-4 py-3 text-right font-medium">{t.columns.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {shown.map((o) => {
                const link = `${base}/clients/${o.userId}`;
                return (
                  <tr key={o.id} className="transition-colors hover:bg-white/[0.04]">
                    <td className="p-0"><Link href={link} className={cn(cell, "text-fg-muted tabular-nums")}>{date.format(new Date(o.createdAt))}</Link></td>
                    <td className="p-0"><Link href={link} className={cell}><span className="block font-medium">{o.clientName}</span><span className="block text-xs text-fg-subtle">{o.clientEmail}</span></Link></td>
                    <td className="p-0"><Link href={o.projectId ? `${base}/projects/${o.projectId}` : link} className={cell}>{orderLabel(o, t.items)}</Link></td>
                    <td className="p-0 text-right"><Link href={link} className={cn(cell, "font-semibold tabular-nums")}>{money(o.amountCents)}</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-fg-muted">{c.dash.none}</p>
      )}
    </div>
  );
}
