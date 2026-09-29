-- Phase 3: one call for the dashboard/subscription page, plus realtime for
-- project messages and notifications.

create or replace function public.get_account_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  credits int;
  sub public.subscriptions;
  plan public.plans;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select free_video_credits into credits from public.profiles where id = uid;
  sub := public.active_subscription(uid);
  if sub.id is null then
    return jsonb_build_object('free_credits', coalesce(credits, 0), 'plan_id', null);
  end if;
  select * into plan from public.plans where id = sub.plan_id;
  return jsonb_build_object(
    'free_credits', coalesce(credits, 0),
    'plan_id', plan.id,
    'status', sub.status,
    'price_cents', plan.price_cents,
    'used', public.videos_used_in_period(uid, sub.current_period_start),
    'included', plan.videos_included,
    'period_end', sub.current_period_end,
    'cancel_at_period_end', sub.cancel_at_period_end
  );
end;
$$;

revoke execute on function public.get_account_summary() from public, anon;
grant execute on function public.get_account_summary() to authenticated;

-- Live updates in the app (RLS still applies to realtime payloads).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.messages, public.notifications;
  end if;
end $$;
