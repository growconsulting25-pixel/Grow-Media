import Link from "next/link";
import { notFound } from "next/navigation";
import { projectLabel } from "@/components/app/ProjectCard";
import { Icon } from "@/components/ui/Icon";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { projectHref } from "@/i18n/routing";
import { messagesOverview } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function MessagesPage({ params }: PageProps<"/[locale]/app/messages">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.messages;
  const session = await getCurrentUser();
  if (!session) return null;
  const threads = await messagesOverview(session.supabase);
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-fg-muted">{t.subtitle}</p>
      {threads.length ? (
        <ul className="surface mt-8 divide-y divide-white/[0.06] overflow-hidden rounded-[var(--radius-panel)]">
          {threads.map((th) => (
            <li key={th.project_id}>
              <Link href={`${projectHref(locale, th.project_id)}#messages`} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full ${th.is_staff ? "bg-violet-500/15 text-violet-300" : "bg-white/[0.05] text-fg-muted"}`}>
                  <Icon name="comment" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-medium">{projectLabel({ title: th.projects?.title ?? null, address: th.projects?.address ?? null }, dict)}</span>
                    <span className="shrink-0 text-xs text-fg-subtle">{fmt.format(new Date(th.created_at))}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-fg-muted">
                    <span className="text-fg-subtle">{th.is_staff ? t.team : t.you}: </span>{th.body}
                  </span>
                </span>
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
