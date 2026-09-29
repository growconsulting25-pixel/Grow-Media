-- Add-ons (3D walkthrough): priced on the server, paid before a project is
-- submitted. A walkthrough project costs the video (free credit, plan
-- allowance or single price) plus the add-on.

create table public.add_ons (
  id text primary key,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'CAD',
  active boolean not null default true
);
insert into public.add_ons (id, price_cents) values ('walkthrough', 9900);
alter table public.add_ons enable row level security;
create policy "add-ons are readable by signed-in users" on public.add_ons for select to authenticated using (true);

alter table public.projects add column addon_paid boolean not null default false;

-- Clients may not mark their own add-on as paid (drafts are otherwise editable).
create or replace function public.guard_addon_paid()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.addon_paid is distinct from old.addon_paid and current_user in ('anon', 'authenticated') and not public.is_admin() then
    new.addon_paid := old.addon_paid;
  end if;
  return new;
end;
$$;
create trigger projects_guard_addon_paid before update on public.projects
  for each row execute function public.guard_addon_paid();

-- Quote for one user and (optionally) one project. Internal: callers go
-- through get_submission_quote (client) or finalize_paid_submission (webhook).
create or replace function public.quote_for(uid uuid, p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  credits int;
  sub public.subscriptions;
  plan public.plans;
  used int;
  proj public.projects;
  video jsonb;
  addon int := 0;
  paid boolean := false;
begin
  select free_video_credits into credits from public.profiles where id = uid;
  if coalesce(credits, 0) > 0 then
    video := jsonb_build_object('mode', 'free', 'price_cents', 0, 'free_credits', credits);
  else
    sub := public.active_subscription(uid);
    if sub.id is not null then
      select * into plan from public.plans where id = sub.plan_id;
      used := public.videos_used_in_period(uid, sub.current_period_start);
      if used < plan.videos_included then
        video := jsonb_build_object('mode', 'subscription', 'price_cents', 0, 'plan_id', plan.id,
          'used', used, 'included', plan.videos_included);
      end if;
    end if;
    if video is null then
      select * into plan from public.plans where id = 'single';
      video := jsonb_build_object('mode', 'payment_required', 'price_cents', plan.price_cents, 'plan_id', 'single');
    end if;
  end if;

  if p_project_id is not null then
    select * into proj from public.projects where id = p_project_id and user_id = uid;
    if proj.type = 'walkthrough' then
      select price_cents into addon from public.add_ons where id = 'walkthrough' and active;
      paid := proj.addon_paid;
    end if;
  end if;
  addon := coalesce(addon, 0);

  return video || jsonb_build_object(
    'addon_id', case when addon > 0 then 'walkthrough' end,
    'addon_cents', addon,
    'addon_paid', paid,
    'due_cents',
      (case when video->>'mode' = 'payment_required' then (video->>'price_cents')::int else 0 end)
      + (case when addon > 0 and not paid then addon else 0 end)
  );
end;
$$;

drop function public.get_submission_quote();
create function public.get_submission_quote(p_project_id uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  return public.quote_for(auth.uid(), p_project_id);
end;
$$;

create or replace function public.submit_project(p_project_id uuid)
returns public.projects
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  proj public.projects;
  quote jsonb;
begin
  if uid is null then raise exception 'not_authenticated'; end if;

  select * into proj from public.projects where id = p_project_id for update;
  if proj.id is null or proj.user_id <> uid then raise exception 'not_found'; end if;
  if proj.status <> 'draft' then raise exception 'already_submitted'; end if;
  if coalesce(trim(proj.address), '') = '' and coalesce(trim(proj.title), '') = '' then
    raise exception 'missing_details';
  end if;
  if not exists (select 1 from public.project_files where project_id = proj.id) then
    raise exception 'missing_files';
  end if;

  quote := public.quote_for(uid, proj.id);
  -- Anything still owed (single video price or an unpaid add-on) goes through Stripe.
  if (quote->>'due_cents')::int > 0 then raise exception 'payment_required'; end if;

  if quote->>'mode' = 'free' then
    update public.profiles set free_video_credits = free_video_credits - 1 where id = uid;
    insert into public.orders (user_id, project_id, amount_cents, status) values (uid, proj.id, 0, 'free');
    update public.projects set status = 'submitted', submitted_at = now(), is_free = true, price_cents = 0
      where id = proj.id returning * into proj;
  else
    update public.projects set status = 'submitted', submitted_at = now(), is_free = false, price_cents = 0
      where id = proj.id returning * into proj;
  end if;

  return proj;
end;
$$;

-- Called by the server after Stripe confirms a payment (webhook, return page
-- or saved-card charge). Idempotent: a project that is no longer a draft is
-- returned unchanged.
create or replace function public.finalize_paid_submission(p_project_id uuid, p_user_id uuid, p_paid_cents integer)
returns public.projects
language plpgsql
security definer
set search_path = public
as $$
declare
  proj public.projects;
  quote jsonb;
  mode text;
begin
  select * into proj from public.projects where id = p_project_id and user_id = p_user_id for update;
  if proj.id is null then raise exception 'not_found'; end if;
  if proj.status <> 'draft' then return proj; end if;

  quote := public.quote_for(p_user_id, proj.id);
  if p_paid_cents < (quote->>'due_cents')::int then raise exception 'underpaid'; end if;
  mode := quote->>'mode';

  if mode = 'free' then
    update public.profiles set free_video_credits = free_video_credits - 1 where id = p_user_id;
  end if;
  update public.projects set
    status = 'submitted',
    submitted_at = now(),
    is_free = (mode = 'free'),
    price_cents = case when mode = 'payment_required' then (quote->>'price_cents')::int else 0 end,
    addon_paid = addon_paid or (quote->>'addon_cents')::int > 0
  where id = proj.id
  returning * into proj;
  return proj;
end;
$$;

revoke execute on function public.quote_for(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.guard_addon_paid() from public, anon, authenticated;
revoke execute on function public.finalize_paid_submission(uuid, uuid, integer) from public, anon, authenticated;
grant execute on function public.finalize_paid_submission(uuid, uuid, integer) to service_role;
revoke execute on function public.get_submission_quote(uuid) from public, anon;
grant execute on function public.get_submission_quote(uuid) to authenticated;
