import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type Stripe from "stripe";

/** Returns the user's Stripe customer, creating it (and saving the ID) on first use. */
export async function getOrCreateCustomer(stripe: Stripe, service: SupabaseClient, user: User) {
  const { data: profile } = await service.from("profiles").select("stripe_customer_id, first_name, last_name, email").eq("id", user.id).single();
  if (profile?.stripe_customer_id) return profile.stripe_customer_id as string;
  const customer = await stripe.customers.create({
    email: profile?.email ?? user.email,
    name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || undefined,
    metadata: { user_id: user.id },
  });
  await service.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", user.id);
  return customer.id;
}
