import { notFound } from "next/navigation";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { requireAdmin } from "@/lib/admin/server";
import { AddAdminForm, RemoveAdminButton } from "./TeamForms";

/** Staff list, plus adding and removing admins. */
export default async function AdminTeamPage({ params }: PageProps<"/[locale]/admin/team">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.admin.team;
  const { supabase, user } = await requireAdmin();
  const { data } = await supabase.from("profiles").select("id, email, first_name, last_name, created_at").eq("role", "admin").order("created_at");
  const admins = (data ?? []) as { id: string; email: string; first_name: string; last_name: string; created_at: string }[];
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium" });

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-fg-muted">{t.hint}</p>
      </div>

      <ul className="surface divide-y divide-white/[0.06] overflow-hidden rounded-[var(--radius-panel)]">
        {admins.map((a) => {
          const name = [a.first_name, a.last_name].filter(Boolean).join(" ") || a.email;
          return (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {name}
                  {a.id === user.id && <span className="ml-2 rounded-full bg-brand-500/15 px-2 py-0.5 text-xs text-brand-300">{t.you}</span>}
                </p>
                <p className="truncate text-sm text-fg-muted">{a.email} · {interpolate(t.since, { date: fmt.format(new Date(a.created_at)) })}</p>
              </div>
              {a.id !== user.id && <RemoveAdminButton userId={a.id} label={t.remove} done={t.removed} />}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="add-admin">
        <h2 id="add-admin" className="mb-4 text-lg font-semibold tracking-tight">{t.add}</h2>
        <AddAdminForm locale={locale} />
      </section>
    </div>
  );
}
