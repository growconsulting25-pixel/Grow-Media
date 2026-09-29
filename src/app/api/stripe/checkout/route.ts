import { NextResponse, type NextRequest } from "next/server";
import { plans, type PlanId } from "@/config/pricing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getOrCreateCustomer } from "@/lib/stripe/customer";
import { chargeSavedCard, savedPaymentMethod } from "@/lib/stripe/charge";
import { addOnLineItem, getStripe, planLineItem } from "@/lib/stripe/server";
import type { Quote } from "@/lib/projects/types";
import { getSupabaseService } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Starts a Stripe Checkout session.
 * - { kind: "subscription", plan: "agent" | "pro" }
 * - { kind: "single", projectId }: pays what a draft still owes (single video
 *   and/or add-on) and submits it. Subscribers are charged on their saved card.
 * Prices always come from the server; the client only names what it wants.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const service = getSupabaseService();
  if (!stripe || !service) return NextResponse.json({ error: "billing_not_configured" }, { status: 503 });
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { kind?: string; plan?: string; projectId?: string; locale?: string };
  const locale = isLocale(body.locale) ? body.locale : "fr";
  const dict = await getDictionary(locale);
  const origin = request.nextUrl.origin;
  const customer = await getOrCreateCustomer(stripe, service, session.user);

  if (body.kind === "subscription") {
    const plan = plans.find((p) => p.id === body.plan && p.interval === "month");
    if (!plan) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
    const { data: active } = await session.supabase.from("subscriptions").select("id").in("status", ["active", "trialing", "past_due"]).limit(1);
    if (active?.length) return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      line_items: [planLineItem(plan.id, dict.pricing.plans[plan.id].name)],
      locale: locale === "fr" ? "fr-CA" : "en",
      allow_promotion_codes: true,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      customer_update: process.env.STRIPE_AUTOMATIC_TAX === "true" ? { address: "auto" } : undefined,
      metadata: { kind: "subscription", user_id: session.user.id, plan_id: plan.id },
      subscription_data: { metadata: { user_id: session.user.id, plan_id: plan.id } },
      success_url: `${origin}/${locale}/app/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/app/subscription?checkout=cancelled`,
    });
    return NextResponse.json({ url: checkout.url });
  }

  if (body.kind === "single") {
    const projectId = body.projectId ?? "";
    if (!/^[0-9a-f-]{36}$/i.test(projectId)) return NextResponse.json({ error: "invalid_project" }, { status: 400 });
    const { data: project } = await session.supabase.from("projects").select("id, status, address, title").eq("id", projectId).maybeSingle();
    if (!project || project.status !== "draft") return NextResponse.json({ error: "invalid_project" }, { status: 400 });
    const { count } = await session.supabase.from("project_files").select("id", { count: "exact", head: true }).eq("project_id", projectId);
    if (!count) return NextResponse.json({ error: "missing_files" }, { status: 400 });
    const { data } = await session.supabase.rpc("get_submission_quote", { p_project_id: projectId });
    const quote = data as Quote | null;
    if (!quote || quote.due_cents <= 0) return NextResponse.json({ error: "no_payment_needed" }, { status: 409 });

    const label = project.address || project.title || "";
    const suffix = label ? ` — ${label}` : "";
    const videoDue = quote.mode === "payment_required";
    const addonDue = quote.addon_id && quote.addon_cents > 0 && !quote.addon_paid ? quote.addon_id : null;
    const done = `${origin}/${locale}/app/projects/${projectId}?checkout=success`;

    // Subscribers: charge the card already on file — one click, no redirect.
    const paymentMethod = await savedPaymentMethod(stripe, customer).catch(() => null);
    if (paymentMethod) {
      const parts = [videoDue && dict.pricing.plans.single.name, addonDue && dict.pricing.addOns[addonDue].name].filter(Boolean).join(" + ");
      const charged = await chargeSavedCard({
        stripe, db: service, customer, paymentMethod, userId: session.user.id, projectId,
        amountCents: quote.due_cents, description: `Grow Media — ${parts}${suffix}`,
      });
      if (charged) return NextResponse.json({ url: done });
    }

    const line_items = [
      ...(videoDue ? [planLineItem("single" as PlanId, `${dict.pricing.plans.single.name}${suffix}`)] : []),
      ...(addonDue ? [addOnLineItem(addonDue, `${dict.pricing.addOns[addonDue].name}${suffix}`)] : []),
    ];
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer,
      line_items,
      locale: locale === "fr" ? "fr-CA" : "en",
      allow_promotion_codes: true,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      customer_update: process.env.STRIPE_AUTOMATIC_TAX === "true" ? { address: "auto" } : undefined,
      metadata: { kind: "single", user_id: session.user.id, project_id: projectId },
      success_url: `${done}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/app/create?project=${projectId}&step=review`,
    });
    return NextResponse.json({ url: checkout.url });
  }

  return NextResponse.json({ error: "invalid_request" }, { status: 400 });
}
