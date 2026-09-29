import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routing";
import type { ContentIdea } from "@/lib/projects/server";

/** "Use This Idea" starts a new project with the idea prefilled. */
export function IdeaCard({ idea, dict, locale }: { idea: ContentIdea; dict: Dictionary; locale: Locale }) {
  const params = new URLSearchParams({ idea: idea.title, ideaId: idea.id, type: idea.project_type });
  return (
    <article className="surface hover-glow flex flex-col rounded-[var(--radius-card)] p-5">
      <span className="grid size-9 place-items-center rounded-xl bg-violet-500/12 text-violet-300"><Icon name="sparkle" className="size-4" /></span>
      <h3 className="mt-4 font-medium tracking-tight">{idea.title}</h3>
      {idea.description && <p className="mt-1.5 text-sm text-fg-muted">{idea.description}</p>}
      <Link href={`${href("appCreate", locale)}?${params}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:underline">
        {dict.app.ideas.use} <Icon name="arrowRight" className="size-3.5" />
      </Link>
    </article>
  );
}
