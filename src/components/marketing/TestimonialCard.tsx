import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { PropertyImageKey } from "@/config/media";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import type { ResultMetrics } from "@/data/testimonials";
import { localeTags, type Locale } from "@/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
  quote: string;
  name: string;
  role: string;
  propertyLabel: string;
  propertyImage: PropertyImageKey;
  photos: number;
  videoSeconds: number;
  deliveredHours: number;
  metrics?: ResultMetrics;
  demo?: boolean;
}

export function TestimonialCard({ dict, locale, quote, name, role, propertyLabel, propertyImage, photos, videoSeconds, deliveredHours, metrics, demo }: Props) {
  const t = dict.results;
  const metricEntries = Object.entries(metrics ?? {}).filter(([, v]) => typeof v === "number" && v > 0) as [keyof ResultMetrics, number][];
  const nf = new Intl.NumberFormat(localeTags[locale], { notation: "compact" });

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(11,22,34,0.06),0_24px_48px_-32px_rgba(11,34,57,0.3)] md:flex-row">
      {demo && (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-amber-100 px-2.5 py-1 text-[0.68rem] font-semibold text-amber-800 ring-1 ring-amber-300">
          {dict.common.demoBadge}
        </span>
      )}
      <div className="relative aspect-[16/10] md:aspect-auto md:w-[42%]">
        <Photo name={propertyImage} width={520} sizes="(min-width: 768px) 30vw, 92vw" className="size-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-3 left-3 text-sm font-medium text-white">{propertyLabel}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-on-paper">
          <li className="rounded-full bg-paper-2 px-2.5 py-1">{interpolate(t.photos, { count: photos })}</li>
          <li aria-hidden><Icon name="arrowRight" className="size-3.5" /></li>
          <li className="rounded-full bg-paper-2 px-2.5 py-1">{interpolate(t.video, { count: videoSeconds })}</li>
          <li aria-hidden><Icon name="arrowRight" className="size-3.5" /></li>
          <li className="rounded-full bg-brand-600/10 px-2.5 py-1 text-brand-700">{interpolate(t.delivered, { count: deliveredHours })}</li>
        </ol>
        <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed tracking-tight text-ink-on-paper">“{quote}”</blockquote>
        {metricEntries.length > 0 && (
          <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-paper-3 pt-4">
            {metricEntries.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.68rem] text-muted-on-paper">{t.metrics[k]}</dt>
                <dd className="text-sm font-semibold">{nf.format(v)}</dd>
              </div>
            ))}
          </dl>
        )}
        <footer className="mt-5 flex items-center gap-3 border-t border-paper-3 pt-4">
          <span className="grid size-10 place-items-center rounded-full bg-paper-2 text-muted-on-paper">
            <Icon name="user" className="size-5" />
          </span>
          <div className="text-sm leading-tight">
            <p className="font-semibold">{name}</p>
            <p className="text-muted-on-paper">{role}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
