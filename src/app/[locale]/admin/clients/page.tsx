import Link from "next/link";
import { notFound } from "next/navigation";
import { accents, segmentAccent } from "@/components/admin/console/accents";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { loadAdminData, type ClientSegment } from "@/lib/admin/stats";
import { cn } from "@/lib/cn";

const SEGMENTS: ClientSegment[] = ["subscriber_agent", "subscriber_pro", "single", "free"];

/** Every client, filterable by type and searchable; rows open the client's page. */
export default async function ClientsPage({ params, searchParams }: PageProps<"/[locale]/admin/clients">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(locale);
  const c = dict.app.admin.console;
  const t = c.clients;
  const { supabase } = await requireAdmin();
  const { clients } = await loadAdminData(supabase);

  const seg = typeof sp.segment === "string" ? sp.segment : "all";
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const shown = clients.filter((cl) =>
    (seg === "all" || (seg === "subscribers" ? cl.segment.startsWith("subscriber") : cl.segment === seg)) &&
    (!q || cl.name.toLowerCase().includes(q) || cl.email.toLowerCase().includes(q)),
  );
  const base = `/${locale}/admin/clients`;
  const tag = localeTags[locale];
  const money = (cents: number) => new Intl.NumberFormat(tag, { style: "currency", currency: "CAD" }).format(cents / 100);
  const date = new Intl.DateTimeFormat(tag, { dateStyle: "medium" });
  const cell = "block px-4 py-3";

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <Link href={base} aria-current={seg === "all" ? "page" : undefined}
            className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm", seg === "all" ? "bg-white/10 text-fg" : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
            {t.all} <span className="rounded-full bg-white/[0.08] px-1.5 text-xs tabular-nums">{clients.length}</span>
          </Link>
          {SEGMENTS.map((s) => {
            const a = accents[segmentAccent[s]];
            const active = seg === s || (seg === "subscribers" && s.startsWith("subscriber"));
            return (
              <Link key={s} href={`${base}?segment=${s}`} aria-current={active ? "page" : undefined}
                className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm", active ? a.tab : "bg-white/[0.04] text-fg-muted hover:text-fg")}>
                <span className={cn("size-2 rounded-full", a.bar)} />
                {c.segments[s]}
                <span className="rounded-full bg-white/[0.08] px-1.5 text-xs tabular-nums">{clients.filter((cl) => cl.segment === s).length}</span>
              </Link>
            );
          })}
        </nav>
        <form action={base} className="ml-auto w-full sm:w-72">
          {seg !== "all" && <input type="hidden" name="segment" value={seg} />}
          <input name="q" defaultValue={q} placeholder={t.search} aria-label={t.search}
            className="h-10 w-full rounded-xl bg-white/[0.04] px-3.5 text-sm text-fg placeholder:text-fg-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]" />
        </form>
      </div>

      {shown.length ? (
        <div className="surface mt-5 overflow-x-auto rounded-[var(--radius-card)]">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">{t.columns.client}</th>
                <th className="px-4 py-3 font-medium">{t.columns.type}</th>
                <th className="px-4 py-3 text-right font-medium">{t.columns.projects}</th>
                <th className="px-4 py-3 text-right font-medium">{t.columns.spent}</th>
                <th className="px-4 py-3 font-medium">{t.columns.since}</th>
                <th className="px-4 py-3 font-medium">{t.columns.last}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {shown.map((cl) => {
                const link = `${base}/${cl.id}`;
                const a = accents[segmentAccent[cl.segment]];
                return (
                  <tr key={cl.id} className="transition-colors hover:bg-white/[0.04]">
                    <td className="p-0"><Link href={link} className={cell}><span className="block font-medium">{cl.name}</span><span className="block text-xs text-fg-subtle">{cl.email}</span></Link></td>
                    <td className="p-0">
                      <Link href={link} className={cn(cell, "flex items-center gap-2")}>
                        <span className={cn("size-2 rounded-full", a.bar)} />
                        {c.segments[cl.segment]}
                        {cl.cancelAtPeriodEnd && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[0.7rem] text-rose-300">{t.cancelling}</span>}
                      </Link>
                    </td>
                    <td className="p-0 text-right"><Link href={link} className={cn(cell, "tabular-nums")}>{cl.projects}</Link></td>
                    <td className="p-0 text-right"><Link href={link} className={cn(cell, "font-medium tabular-nums")}>{money(cl.spentCents)}</Link></td>
                    <td className="p-0"><Link href={link} className={cn(cell, "text-fg-muted")}>{date.format(new Date(cl.createdAt))}</Link></td>
                    <td className="p-0"><Link href={link} className={cn(cell, "text-fg-muted")}>{date.format(new Date(cl.lastActivity))}</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{dict.app.admin.empty}</p>
      )}
    </div>
  );
}
