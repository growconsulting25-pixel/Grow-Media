import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { plans } from "@/config/pricing";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import type { AccountSummary } from "@/lib/projects/server";

/** Plan + usage at a glance ("Agent plan · 2 / 4 videos used"). */
export function UsageCard({ summary, dict, locale }: { summary: AccountSummary; dict: Dictionary; locale: Locale }) {
  const t = dict.app.usage;
  const fmt = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "long" });
  const single = plans.find((p) => p.id === "single")!;

  if (!summary.plan_id || summary.plan_id === "single") {
    return (
      <Link href={href("appSubscription", locale)} className="surface flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] p-5 transition-colors hover:bg-white/[0.04]">
        <div>
          <p className="text-sm text-fg-subtle">{t.noPlan}</p>
          <p className="mt-1 font-medium">
            {summary.free_credits > 0 ? interpolate(t.freeLeft, { count: summary.free_credits }) : interpolate(t.payAsYouGo, { price: formatPrice(single.price, locale) })}
          </p>
        </div>
        <span className="text-sm text-brand-300">{t.manage} →</span>
      </Link>
    );
  }

  const used = summary.used ?? 0;
  const included = summary.included ?? 0;
  const remaining = Math.max(0, included - used);
  const planName = dict.pricing.plans[summary.plan_id].name;
  return (
    <Link href={href("appSubscription", locale)} className="surface block rounded-[var(--radius-card)] p-5 transition-colors hover:bg-white/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">{interpolate(t.plan, { plan: planName })}</p>
        <span className="text-sm text-brand-300">{t.manage} →</span>
      </div>
      <p className="mt-3 text-sm text-fg-muted tabular-nums">{interpolate(t.used, { used, included })}</p>
      <ProgressIndicator className="mt-2" value={included ? (used / included) * 100 : 0} label={interpolate(t.used, { used, included })} />
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-fg-subtle">
        {summary.period_end && <span>{interpolate(summary.cancel_at_period_end ? t.cancels : t.renews, { date: fmt.format(new Date(summary.period_end)) })}</span>}
        {remaining === 1 && <span className="flex items-center gap-1 text-brand-300"><Icon name="clock" className="size-3.5" /> {interpolate(t.lowRemaining, { count: remaining })}</span>}
      </div>
    </Link>
  );
}
