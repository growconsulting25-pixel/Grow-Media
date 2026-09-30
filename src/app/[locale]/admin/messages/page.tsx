import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { loadThreads } from "@/lib/admin/inbox";
import { requireAdmin } from "@/lib/admin/server";
import { cn } from "@/lib/cn";

/** Team inbox: one row per project conversation; the ones awaiting a reply come first. */
export default async function AdminMessagesPage({ params }: PageProps<"/[locale]/admin/messages">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.admin.console.messages;
  const { supabase } = await requireAdmin();
  const threads = (await loadThreads(supabase)).sort((a, b) => Number(a.lastFromStaff) - Number(b.lastFromStaff) || b.lastAt.localeCompare(a.lastAt));
  const when = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">{t.subtitle}</p>
      {threads.length ? (
        <ul className="surface mt-6 divide-y divide-white/[0.05] overflow-hidden rounded-[var(--radius-panel)]">
          {threads.map((th) => (
            <li key={th.projectId}>
              <Link href={`/${locale}/admin/projects/${th.projectId}#messages`} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04]">
                <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", th.lastFromStaff ? "bg-white/15" : "bg-blue-400")} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{th.clientName}</span>
                    <span className="text-sm text-fg-subtle">· {th.title}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem]", th.lastFromStaff ? "bg-white/[0.06] text-fg-muted" : "bg-blue-400/15 text-blue-300")}>
                      {th.lastFromStaff ? t.replied : t.needsReply}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-fg-muted">{th.lastFromStaff ? `${t.team} : ` : ""}{th.lastBody}</span>
                  <span className="mt-1 block text-xs text-fg-subtle">{interpolate(t.count, { count: th.count })}</span>
                </span>
                <span className="shrink-0 text-xs text-fg-subtle tabular-nums">{when.format(new Date(th.lastAt))}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{t.empty}</p>
      )}
    </div>
  );
}
