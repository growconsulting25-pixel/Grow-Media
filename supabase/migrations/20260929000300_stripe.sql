-- Phase 4: Stripe. Customer IDs live on the profile (written only by the
-- server with the service role; not in the client-updatable column grant).
alter table public.profiles add column if not exists stripe_customer_id text unique;
create index if not exists subscriptions_stripe_idx on public.subscriptions (stripe_subscription_id);
