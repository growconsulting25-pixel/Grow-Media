-- =============================================================================
-- Grow Media — initial schema
-- Clients only ever see their own data (RLS). Staff/admin access goes through
-- `public.is_admin()`. State transitions that involve money or credits
-- (submitting a project, requesting a revision) run in SECURITY DEFINER
-- functions so the client can never set prices, credits or statuses directly.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('client', 'admin');
create type public.project_type as enum ('listing_video', 'walkthrough', 'ugc', 'video_ad');
create type public.project_status as enum (
  'draft', 'submitted', 'in_production', 'review', 'ready', 'revision_requested', 'completed', 'cancelled'
);
create type public.video_style as enum ('luxury', 'cinematic', 'modern', 'minimal', 'energetic', 'surprise');
create type public.file_kind as enum ('photo', 'video', 'logo', 'agent_photo', 'other');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded', 'free');
create type public.revision_status as enum ('open', 'in_progress', 'done');

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  role public.user_role not null default 'client',
  free_video_credits integer not null default 1 check (free_video_credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------------------------------------------------------------------------
-- Plans & subscriptions (written by the Stripe webhook with the service role)
-- ---------------------------------------------------------------------------
create table public.plans (
  id text primary key,                         -- 'single' | 'agent' | 'pro'
  price_cents integer not null,
  currency text not null default 'CAD',
  billing_interval text not null check (billing_interval in ('one_time', 'month')),
  videos_included integer not null,
  stripe_price_id text,
  active boolean not null default true
);

insert into public.plans (id, price_cents, billing_interval, videos_included) values
  ('single', 4995, 'one_time', 1),
  ('agent', 9900, 'month', 4),
  ('pro', 19900, 'month', 10);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status public.subscription_status not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id, status);

-- ---------------------------------------------------------------------------
-- Brand kit
-- ---------------------------------------------------------------------------
create table public.brand_kits (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  agent_name text,
  agency text,
  logo_path text,
  profile_photo_path text,
  phone text,
  email text,
  website text,
  primary_color text,
  secondary_color text,
  social jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content ideas (global, optionally personalized later)
-- ---------------------------------------------------------------------------
create table public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade, -- null = for everyone
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  description text,
  project_type public.project_type not null default 'listing_video',
  sort integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.project_type not null default 'listing_video',
  status public.project_status not null default 'draft',
  title text,
  address text,
  description text,
  style public.video_style,
  notes text,
  branding jsonb not null default '{"useBrandKit": true}'::jsonb,
  idea_id uuid references public.content_ideas (id) on delete set null,
  is_free boolean not null default false,
  price_cents integer,
  submitted_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_user_idx on public.projects (user_id, created_at desc);
create index projects_status_idx on public.projects (status, submitted_at);

create table public.project_status_events (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  status public.project_status not null,
  note text,
  created_at timestamptz not null default now()
);
create index project_status_events_project_idx on public.project_status_events (project_id, created_at);

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  kind public.file_kind not null default 'photo',
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index project_files_project_idx on public.project_files (project_id, position);

-- Final outputs (videos, captions…). One project can have many deliverables/versions.
create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null default 'video' check (kind in ('video', 'image', 'document')),
  storage_path text not null,
  poster_path text,
  format text,                          -- '9:16', '16:9', '1:1', '4:5'
  duration_seconds numeric,
  caption text,
  hashtags text,
  version integer not null default 1,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);
create index deliverables_project_idx on public.deliverables (project_id, created_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(body) between 1 and 5000),
  attachment_path text,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_project_idx on public.messages (project_id, created_at);

create table public.revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (length(message) between 1 and 5000),
  timestamp_seconds numeric,
  status public.revision_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,  -- project_received | in_production | video_ready | message | revision_complete | credits_low
  project_id uuid references public.projects (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  emailed_at timestamptz,  -- set by the email worker (Phase 4)
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  plan_id text references public.plans (id),
  amount_cents integer not null default 0,
  currency text not null default 'CAD',
  status public.order_status not null default 'pending',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
create trigger subscriptions_touch before update on public.subscriptions for each row execute function public.touch_updated_at();
create trigger brand_kits_touch before update on public.brand_kits for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- New user → profile + empty brand kit
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  loc text := case when meta->>'locale' in ('fr', 'en') then meta->>'locale' else 'fr' end;
begin
  insert into public.profiles (id, email, first_name, last_name, locale)
  values (
    new.id,
    new.email,
    coalesce(meta->>'first_name', split_part(coalesce(meta->>'full_name', ''), ' ', 1), ''),
    coalesce(meta->>'last_name', ''),
    loc
  );
  insert into public.brand_kits (user_id, agent_name, email)
  values (new.id, trim(coalesce(meta->>'first_name', '') || ' ' || coalesce(meta->>'last_name', '')), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Status changes → timeline event + notification
-- ---------------------------------------------------------------------------
create or replace function public.stamp_delivery()
returns trigger language plpgsql as $$
begin
  if new.status = 'ready' and new.delivered_at is null then
    new.delivered_at := now();
  end if;
  return new;
end;
$$;

create trigger projects_stamp_delivery
  before update of status on public.projects
  for each row execute function public.stamp_delivery();

create or replace function public.on_project_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notif text;
begin
  if tg_op = 'UPDATE' and new.status is not distinct from old.status then
    return null;
  end if;
  if new.status = 'draft' then
    return null;
  end if;

  insert into public.project_status_events (project_id, status) values (new.id, new.status);

  notif := case new.status
    when 'submitted' then 'project_received'
    when 'in_production' then 'in_production'
    when 'ready' then case when tg_op = 'UPDATE' and old.status = 'revision_requested' then 'revision_complete' else 'video_ready' end
    else null
  end;
  if notif is not null then
    insert into public.notifications (user_id, type, project_id, payload)
    values (new.user_id, notif, new.id, jsonb_build_object('title', coalesce(new.title, new.address)));
  end if;
  return null;
end;
$$;

create trigger projects_status_change
  after insert or update of status on public.projects
  for each row execute function public.on_project_status_change();

-- ---------------------------------------------------------------------------
-- Usage helpers
-- ---------------------------------------------------------------------------
create or replace function public.active_subscription(uid uuid)
returns public.subscriptions
language sql
stable
security definer
set search_path = public
as $$
  select * from public.subscriptions
  where user_id = uid and status in ('active', 'trialing') and current_period_end > now()
  order by current_period_end desc
  limit 1;
$$;

create or replace function public.videos_used_in_period(uid uuid, period_start timestamptz)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from public.projects
  where user_id = uid and is_free = false and price_cents = 0
    and submitted_at >= period_start and status <> 'cancelled';
$$;

-- What submitting a project would cost right now. The UI shows this; the
-- submit function recomputes it — the client never decides the price.
create or replace function public.get_submission_quote()
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
  used int;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select free_video_credits into credits from public.profiles where id = uid;
  if coalesce(credits, 0) > 0 then
    return jsonb_build_object('mode', 'free', 'price_cents', 0, 'free_credits', credits);
  end if;
  sub := public.active_subscription(uid);
  if sub.id is not null then
    select * into plan from public.plans where id = sub.plan_id;
    used := public.videos_used_in_period(uid, sub.current_period_start);
    if used < plan.videos_included then
      return jsonb_build_object('mode', 'subscription', 'price_cents', 0, 'plan_id', plan.id,
        'used', used, 'included', plan.videos_included);
    end if;
  end if;
  select * into plan from public.plans where id = 'single';
  return jsonb_build_object('mode', 'payment_required', 'price_cents', plan.price_cents, 'plan_id', 'single');
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

  quote := public.get_submission_quote();

  if quote->>'mode' = 'free' then
    update public.profiles set free_video_credits = free_video_credits - 1 where id = uid;
    insert into public.orders (user_id, project_id, amount_cents, status) values (uid, proj.id, 0, 'free');
    update public.projects set status = 'submitted', submitted_at = now(), is_free = true, price_cents = 0
      where id = proj.id returning * into proj;
  elsif quote->>'mode' = 'subscription' then
    update public.projects set status = 'submitted', submitted_at = now(), is_free = false, price_cents = 0
      where id = proj.id returning * into proj;
  else
    -- Paid path is completed by the Stripe webhook (Phase 4).
    raise exception 'payment_required';
  end if;

  return proj;
end;
$$;

create or replace function public.request_revision(p_project_id uuid, p_message text, p_timestamp numeric default null)
returns public.revisions
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  proj public.projects;
  rev public.revisions;
begin
  select * into proj from public.projects where id = p_project_id for update;
  if proj.id is null or proj.user_id <> uid then raise exception 'not_found'; end if;
  if proj.status not in ('ready', 'review', 'completed') then raise exception 'not_revisable'; end if;
  insert into public.revisions (project_id, user_id, message, timestamp_seconds)
    values (proj.id, uid, p_message, p_timestamp) returning * into rev;
  update public.projects set status = 'revision_requested' where id = proj.id;
  return rev;
end;
$$;

-- Lets a client reorder photos of a draft in one call.
create or replace function public.reorder_project_files(p_project_id uuid, p_file_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.projects where id = p_project_id and user_id = auth.uid() and status = 'draft') then
    raise exception 'not_found';
  end if;
  update public.project_files f
    set position = x.ord
    from unnest(p_file_ids) with ordinality as x(id, ord)
    where f.id = x.id and f.project_id = p_project_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.brand_kits enable row level security;
alter table public.content_ideas enable row level security;
alter table public.projects enable row level security;
alter table public.project_status_events enable row level security;
alter table public.project_files enable row level security;
alter table public.deliverables enable row level security;
alter table public.messages enable row level security;
alter table public.revisions enable row level security;
alter table public.notifications enable row level security;
alter table public.orders enable row level security;

-- profiles: read/update self; role and credits are not client-writable
create policy "profiles: read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (first_name, last_name, locale) on public.profiles to authenticated;

create policy "plans: readable" on public.plans for select using (true);

create policy "subscriptions: read own" on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
create policy "orders: read own" on public.orders for select using (user_id = auth.uid() or public.is_admin());

create policy "brand_kits: read own" on public.brand_kits for select using (user_id = auth.uid() or public.is_admin());
create policy "brand_kits: upsert own" on public.brand_kits for insert with check (user_id = auth.uid());
create policy "brand_kits: update own" on public.brand_kits for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ideas: read" on public.content_ideas for select
  using (is_active and (user_id is null or user_id = auth.uid()) or public.is_admin());
create policy "ideas: admin write" on public.content_ideas for all using (public.is_admin()) with check (public.is_admin());

-- projects: clients create and edit drafts only; staff manage everything
create policy "projects: read own" on public.projects for select using (user_id = auth.uid() or public.is_admin());
create policy "projects: create draft" on public.projects for insert
  with check (user_id = auth.uid() and status = 'draft' and is_free = false and price_cents is null);
create policy "projects: edit own draft" on public.projects for update
  using (user_id = auth.uid() and status = 'draft')
  with check (user_id = auth.uid() and status = 'draft' and is_free = false and price_cents is null);
create policy "projects: delete own draft" on public.projects for delete using (user_id = auth.uid() and status = 'draft');
create policy "projects: admin update" on public.projects for update using (public.is_admin()) with check (public.is_admin());

create policy "events: read own" on public.project_status_events for select
  using (public.is_admin() or exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

create policy "files: read own" on public.project_files for select using (user_id = auth.uid() or public.is_admin());
create policy "files: add to own draft" on public.project_files for insert
  with check (user_id = auth.uid() and exists (
    select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid() and p.status = 'draft'));
create policy "files: remove from own draft" on public.project_files for delete
  using (user_id = auth.uid() and exists (
    select 1 from public.projects p where p.id = project_id and p.status = 'draft'));

create policy "deliverables: read own" on public.deliverables for select
  using (public.is_admin() or exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));
create policy "deliverables: admin write" on public.deliverables for all using (public.is_admin()) with check (public.is_admin());

create policy "messages: read own" on public.messages for select
  using (public.is_admin() or exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));
create policy "messages: client post" on public.messages for insert
  with check (author_id = auth.uid() and is_staff = false and exists (
    select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));
create policy "messages: staff post" on public.messages for insert
  with check (public.is_admin() and author_id = auth.uid() and is_staff = true);

create policy "revisions: read own" on public.revisions for select using (user_id = auth.uid() or public.is_admin());
create policy "revisions: admin update" on public.revisions for update using (public.is_admin()) with check (public.is_admin());

create policy "notifications: read own" on public.notifications for select using (user_id = auth.uid());
create policy "notifications: mark read" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.notifications from authenticated, anon;
grant update (read_at) on public.notifications to authenticated;

-- A new message from staff notifies the client
create or replace function public.on_message_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_staff then
    insert into public.notifications (user_id, type, project_id)
    select p.user_id, 'message', p.id from public.projects p where p.id = new.project_id;
  end if;
  return new;
end;
$$;
create trigger messages_notify after insert on public.messages for each row execute function public.on_message_created();

-- ---------------------------------------------------------------------------
-- Storage: private buckets, files namespaced by user id
--   project-files/{user_id}/{project_id}/{file}
--   deliverables/{user_id}/{project_id}/{file}   (written by staff)
--   brand/{user_id}/{file}
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('project-files', 'project-files', false, 524288000, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
  ('deliverables', 'deliverables', false, 2147483648, array['video/mp4', 'image/jpeg', 'image/png', 'application/pdf']),
  ('brand', 'brand', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

-- Clients can add and read their own source files, but never delete them
-- (submitted projects must keep their sources). Brand assets are replaceable.
create policy "storage: clients upload own files" on storage.objects for insert
  with check (bucket_id in ('project-files', 'brand') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage: clients read own files" on storage.objects for select
  using (bucket_id in ('project-files', 'brand') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage: clients replace own brand assets" on storage.objects for update
  using (bucket_id = 'brand' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'brand' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage: clients delete own brand assets" on storage.objects for delete
  using (bucket_id = 'brand' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "storage: clients read own deliverables" on storage.objects for select
  using (bucket_id = 'deliverables' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "storage: staff full access" on storage.objects for all
  using (bucket_id in ('project-files', 'deliverables', 'brand') and public.is_admin())
  with check (bucket_id in ('project-files', 'deliverables', 'brand') and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed: starter content ideas
-- ---------------------------------------------------------------------------
insert into public.content_ideas (locale, title, description, sort) values
  ('en', '3 mistakes first-time buyers make', 'Educational reel that positions you as the expert.', 1),
  ('en', 'POV: You just found the perfect condo', 'Trend-style reel from the buyer''s point of view.', 2),
  ('en', '5 things buyers should know before visiting', 'Save-worthy checklist content.', 3),
  ('en', 'New listing teaser', 'Short coming-soon hint before the listing goes live.', 4),
  ('en', 'Sold in X days', 'Celebrate a result and attract sellers.', 5),
  ('en', 'Neighborhood spotlight', 'Show the lifestyle around your listing.', 6),
  ('fr', '3 erreurs des premiers acheteurs', 'Reel éducatif qui vous positionne comme expert.', 1),
  ('fr', 'POV : vous venez de trouver le condo parfait', 'Reel tendance du point de vue de l''acheteur.', 2),
  ('fr', '5 choses à savoir avant une visite', 'Une liste pratique que l''on enregistre.', 3),
  ('fr', 'Aperçu d''une nouvelle inscription', 'Un avant-goût avant la mise en marché.', 4),
  ('fr', 'Vendu en X jours', 'Célébrez un résultat et attirez des vendeurs.', 5),
  ('fr', 'Portrait de quartier', 'Montrez le style de vie autour de la propriété.', 6);
