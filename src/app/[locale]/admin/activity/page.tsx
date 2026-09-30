import Link from "next/link";
import { notFound } from "next/navigation";
import { accents, type Accent } from "@/components/admin/console/accents";
import { Icon, type IconName } from "@/components/ui/Icon";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdmin } from "@/lib/admin/server";
import { cn } from "@/lib/cn";

type Kind = "new_client" | "new_project" | "client_message" | "revision_requested" | "subscription_started" | "subscription_canceled" | "payment";
const look: Record<Kind, { icon: IconName; accent: Accent }> = {
  new_client: { icon: "user", accent: "cyan" },
  new_project: { icon: "upload", accent: "amber" },
  client_message: { icon: "comment", accent: "blue" },
  revision_requested: { icon: "revise", accent: "rose" },
  subscription_started: { icon: "layers", accent: "emerald" },
  subscription_canceled: { icon: "close", accent: "rose" },
  payment: { icon: "coins", accent: "orange" },
};

/** The team's notification feed. Opening it marks everything as seen for this admin. */
export default async function ActivityPage({ params }: PageProps<"/[locale]/admin/activity">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const c = dict.app.admin.console;
  const t = c.activity;
  const { supabase, user } = await requireAdmin();

  const { data: me } = await supabase.from("profiles").select("alerts_seen_at").eq("id", user.id).single();
  const seen = (me?.alerts_seen_at as string | null) ?? "1970-01-01T00:00:00Z";
  const { data } = await supabase
    .from("staff_alerts")
    .select("id, kind, user_id, project_id, payload, created_at, profiles(first_name, last_name, email), projects(title, address)")
    .order("created_at", { ascending: false })
    .limit(200);
  await supabase.rpc("mark_staff_alerts_seen");

  type Row = { id: string; kind: Kind; user_id: string | null; project_id: string | null; payload: Record<string, unknown>; created_at: string;
    profiles: { first_name: string; last_name: string; email: string } | null; projects: { title: string | null; address: string | null } | null };
  const rows = (data ?? []) as unknown as Row[];
  const tag = localeTags[locale];
  const when = new Intl.DateTimeFormat(tag, { dateStyle: "medium", timeStyle: "short" });
  const money = (cents: unknown) => new Intl.NumberFormat(tag, { style: "currency", currency: "CAD" }).format(Number(cents ?? 0) / 100);
  const base = `/${locale}/admin`;

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">{t.subtitle}</p>

      {rows.length ? (
        <ul className="surface mt-6 divide-y divide-white/[0.05] overflow-hidden rounded-[var(--radius-panel)]">
          {rows.map((r) => {
            const l = look[r.kind];
            const a = accents[l.accent];
            const isNew = r.created_at > seen;
            const name = [r.profiles?.first_name, r.profiles?.last_name].filter(Boolean).join(" ") || r.profiles?.email || "—";
            const project = r.projects?.address || r.projects?.title;
            const href =
              r.kind === "payment" ? `${base}/payments`
              : r.project_id ? `${base}/projects/${r.project_id}${r.kind === "client_message" ? "#messages" : ""}`
              : r.user_id ? `${base}/clients/${r.user_id}` : base;
            const detail =
              r.kind === "payment" ? money(r.payload.amount_cents)
              : typeof r.payload.excerpt === "string" ? `« ${r.payload.excerpt} »`
              : typeof r.payload.plan === "string" ? dict.pricing.plans[r.payload.plan as "agent" | "pro"]?.name ?? r.payload.plan
              : null;
            return (
              <li key={r.id}>
                <Link href={href} className={cn("flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04]", isNew && "bg-white/[0.025]")}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", a.chip)}><Icon name={l.icon} className="size-4.5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{t.kinds[r.kind]}</span>
                      {isNew && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-bold text-[#fff] uppercase">{t.new}</span>}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-fg-muted">{name}{project ? ` · ${project}` : ""}</span>
                    {detail && <span className="mt-1 block truncate text-sm text-fg-subtle">{detail}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-fg-subtle tabular-nums">{when.format(new Date(r.created_at))}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </div>
  );
}
