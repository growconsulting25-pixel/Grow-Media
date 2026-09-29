import { NextResponse, type NextRequest } from "next/server";
import { plans, type PlanId } from "@/config/pricing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getOrCreateCustomer } from "@/lib/stripe/customer";
import { getStripe, planLineItem } from "@/lib/stripe/server";
import { getSupabaseService } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Starts a Stripe Checkout session.
 * - { kind: "subscription", plan: "agent" | "pro" }
 * - { kind: "single", projectId }: pays for one video and submits that draft
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
    const { data: quote } = await session.supabase.rpc("get_submission_quote");
    if ((quote as { mode?: string } | null)?.mode !== "payment_required") return NextResponse.json({ error: "no_payment_needed" }, { status: 409 });

    const label = project.address || project.title || "";
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer,
      line_items: [planLineItem("single" as PlanId, `${dict.pricing.plans.single.name}${label ? ` — ${label}` : ""}`)],
      locale: locale === "fr" ? "fr-CA" : "en",
      allow_promotion_codes: true,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      customer_update: process.env.STRIPE_AUTOMATIC_TAX === "true" ? { address: "auto" } : undefined,
      metadata: { kind: "single", user_id: session.user.id, project_id: projectId },
      success_url: `${origin}/${locale}/app/projects/${projectId}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/app/create?project=${projectId}&step=review`,
    });
    return NextResponse.json({ url: checkout.url });
  }

  return NextResponse.json({ error: "invalid_request" }, { status: 400 });
}
