-- Staff alerts: everything the production team should hear about, written by
-- database triggers so nothing depends on which code path caused the event.
-- The email dispatcher sends each alert to ADMIN_NOTIFY_EMAIL once.

create table public.staff_alerts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in (
    'new_client', 'new_project', 'client_message', 'revision_requested',
    'subscription_started', 'subscription_canceled', 'payment'
  )),
  user_id uuid references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);
create index staff_alerts_pending_idx on public.staff_alerts (created_at) where emailed_at is null;
alter table public.staff_alerts enable row level security;
create policy "staff_alerts: staff read" on public.staff_alerts for select using (public.is_admin());

create or replace function public.add_staff_alert(p_kind text, p_user uuid, p_project uuid, p_payload jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.staff_alerts (kind, user_id, project_id, payload) values (p_kind, p_user, p_project, coalesce(p_payload, '{}'::jsonb));
$$;

-- New sign-up
create or replace function public.alert_new_client()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role = 'client' then
    perform public.add_staff_alert('new_client', new.id, null);
  end if;
  return null;
end;
$$;
create trigger profiles_alert_new_client after insert on public.profiles
  for each row execute function public.alert_new_client();

-- Project submitted (free, plan or paid)
create or replace function public.alert_new_project()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'submitted' and old.status = 'draft' then
    perform public.add_staff_alert('new_project', new.user_id, new.id,
      jsonb_build_object('type', new.type, 'walkthrough_paid', new.addon_paid));
  end if;
  return null;
end;
$$;
create trigger projects_alert_new_project after update of status on public.projects
  for each row execute function public.alert_new_project();

-- Client wrote in a project thread
create or replace function public.alert_client_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not new.is_staff then
    perform public.add_staff_alert('client_message', new.author_id, new.project_id,
      jsonb_build_object('excerpt', left(new.body, 280)));
  end if;
  return null;
end;
$$;
create trigger messages_alert_client after insert on public.messages
  for each row execute function public.alert_client_message();

-- Revision requested
create or replace function public.alert_revision()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.add_staff_alert('revision_requested', new.user_id, new.project_id,
    jsonb_build_object('excerpt', left(new.message, 280), 'timestamp', new.timestamp_seconds));
  return null;
end;
$$;
create trigger revisions_alert after insert on public.revisions
  for each row execute function public.alert_revision();

-- Subscription started / cancelled
create or replace function public.alert_subscription()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from 'active') then
    perform public.add_staff_alert('subscription_started', new.user_id, null, jsonb_build_object('plan', new.plan_id));
  elsif tg_op = 'UPDATE' and (
    (new.status = 'canceled' and old.status <> 'canceled')
    or (new.cancel_at_period_end and not old.cancel_at_period_end)
  ) then
    perform public.add_staff_alert('subscription_canceled', new.user_id, null,
      jsonb_build_object('plan', new.plan_id, 'ends_at', new.current_period_end, 'at_period_end', new.cancel_at_period_end));
  end if;
  return null;
end;
$$;
create trigger subscriptions_alert after insert or update on public.subscriptions
  for each row execute function public.alert_subscription();

-- Any paid order (plan, single video, add-on)
create or replace function public.alert_payment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'paid' and new.amount_cents > 0 then
    perform public.add_staff_alert('payment', new.user_id, new.project_id,
      jsonb_build_object('amount_cents', new.amount_cents, 'currency', new.currency, 'plan', new.plan_id));
  end if;
  return null;
end;
$$;
create trigger orders_alert_payment after insert on public.orders
  for each row execute function public.alert_payment();

revoke execute on function public.add_staff_alert(text, uuid, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.alert_new_client() from public, anon, authenticated;
revoke execute on function public.alert_new_project() from public, anon, authenticated;
revoke execute on function public.alert_client_message() from public, anon, authenticated;
revoke execute on function public.alert_revision() from public, anon, authenticated;
revoke execute on function public.alert_subscription() from public, anon, authenticated;
revoke execute on function public.alert_payment() from public, anon, authenticated;
