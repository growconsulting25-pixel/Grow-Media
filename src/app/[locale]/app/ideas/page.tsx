import { notFound, redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { href } from "@/i18n/routing";
import { IdeaCard } from "@/components/app/IdeaCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { listIdeas } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function IdeasPage({ params }: PageProps<"/[locale]/app/ideas">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!siteConfig.contentIdeas) redirect(href("app", locale));
  const dict = await getDictionary(locale);
  const session = await getCurrentUser();
  if (!session) return null;
  const ideas = await listIdeas(session.supabase, locale);
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{dict.app.ideas.title}</h1>
      <p className="mt-2 text-fg-muted">{dict.app.ideas.subtitle}</p>
      {ideas.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} dict={dict} locale={locale} />)}
        </div>
      ) : (
        <p className="mt-12 text-center text-fg-muted">{dict.app.ideas.empty}</p>
      )}
    </div>
  );
}
