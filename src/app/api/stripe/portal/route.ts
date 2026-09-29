import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";
import { getOrCreateCustomer } from "@/lib/stripe/customer";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseService } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

/** Opens Stripe's customer portal (change plan, update card, cancel, invoices). */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const service = getSupabaseService();
  if (!stripe || !service) return NextResponse.json({ error: "billing_not_configured" }, { status: 503 });
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = isLocale(body.locale) ? body.locale : "fr";
  const customer = await getOrCreateCustomer(stripe, service, session.user);
  const portal = await stripe.billingPortal.sessions.create({
    customer,
    locale: locale === "fr" ? "fr-CA" : "en",
    return_url: `${request.nextUrl.origin}/${locale}/app/subscription`,
  });
  return NextResponse.json({ url: portal.url });
}
