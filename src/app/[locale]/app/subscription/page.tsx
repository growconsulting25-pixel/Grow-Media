import { notFound } from "next/navigation";
import { UsageCard } from "@/components/app/UsageCard";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { addOns, plans } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getAccountSummary } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Plan overview. Changing plans goes through Stripe in Phase 4; until then
 * every plan action opens an email so nothing is faked.
 */
export default async function SubscriptionPage({ params }: PageProps<"/[locale]/app/subscription">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.subscription;
  const session = await getCurrentUser();
  if (!session) return null;
  const summary = await getAccountSummary(session.supabase);
  const mail = (subject: string) => `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`;
  const hasPlan = summary.plan_id === "agent" || summary.plan_id === "pro";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      </div>

      <section aria-labelledby="current-plan" className="space-y-4">
        <h2 id="current-plan" className="text-lg font-semibold tracking-tight">{t.current}</h2>
        <UsageCard summary={summary} dict={dict} locale={locale} />
        {!hasPlan && <p className="text-sm text-fg-muted">{summary.free_credits > 0 ? t.freeCredit : t.none}</p>}
        {hasPlan && (
          <div className="flex flex-wrap gap-3">
            {summary.plan_id === "agent" && <a href={mail(t.upgrade)} className={buttonClasses({})}>{t.upgrade}</a>}
            <a href={mail(t.change)} className={buttonClasses({ variant: "secondary" })}>{t.change}</a>
            <a href={mail(t.cancel)} className={buttonClasses({ variant: "ghost" })}>{t.cancel}</a>
          </div>
        )}
        <p className="rounded-xl bg-brand-500/10 px-4 py-3 text-sm text-brand-300">{t.billingSoon}</p>
      </section>

      <section aria-labelledby="plans-title">
        <h2 id="plans-title" className="mb-4 text-lg font-semibold tracking-tight">{t.plans}</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const copy = dict.pricing.plans[p.id];
            const current = summary.plan_id === p.id;
            return (
              <li key={p.id} className={cn("flex flex-col rounded-[var(--radius-panel)] p-6", p.highlighted ? "edge-glow bg-brand-500/[0.08] shadow-[inset_0_0_0_1px_rgba(0,171,255,0.4)]" : "surface")}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{copy.name}</p>
                  {current && <span className="rounded-full bg-success/12 px-2.5 py-0.5 text-xs text-success">{t.currentBadge}</span>}
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {formatPrice(p.price, locale)} <span className="text-sm font-normal text-fg-muted">{p.interval === "month" ? dict.common.perMonth : dict.common.perVideo}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {copy.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-fg-muted"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-300" /> {f}</li>
                  ))}
                </ul>
                {!current && (
                  <a href={mail(interpolate(t.choose, { plan: copy.name }))} className={buttonClasses({ variant: p.highlighted ? "primary" : "secondary", className: "mt-6 w-full" })}>
                    {interpolate(t.choose, { plan: copy.name })}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="addons-title">
        <h2 id="addons-title" className="mb-4 text-lg font-semibold tracking-tight">{t.addOns}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {addOns.map((a) => (
            <li key={a.id} className="surface flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
              <span className="flex items-center gap-3 text-sm font-medium">
                <Icon name={a.id === "walkthrough" ? "cube" : "megaphone"} className="size-4 text-brand-300" />
                {dict.pricing.addOns[a.id].name}
              </span>
              {a.price !== null ? (
                <span className="font-semibold">{interpolate(dict.pricing.addOns[a.id].price, { price: formatPrice(a.price, locale) })}</span>
              ) : (
                <a href={mail(dict.pricing.addOns[a.id].name)} className="text-sm text-brand-300 hover:underline">{dict.pricing.addOns[a.id].price}</a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
