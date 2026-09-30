-- Contact form on the marketing site. Visitors are anonymous, so rows are
-- written by the server with the service role only; staff read them, and
-- each message raises a 'contact_request' staff alert (emailed to the team).

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (char_length(phone) <= 40),
  agency text check (char_length(agency) <= 120),
  topic text not null default 'question' check (topic in ('question', 'team', 'ads', 'walkthrough', 'other')),
  message text not null check (char_length(message) between 1 and 5000),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index contact_messages_recent_idx on public.contact_messages (created_at desc);
alter table public.contact_messages enable row level security;
create policy "contact_messages: staff read" on public.contact_messages for select using (public.is_admin());

alter table public.staff_alerts drop constraint staff_alerts_kind_check;
alter table public.staff_alerts add constraint staff_alerts_kind_check check (kind in (
  'new_client', 'new_project', 'client_message', 'revision_requested',
  'subscription_started', 'subscription_canceled', 'payment', 'contact_request'
));

create or replace function public.alert_contact_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.add_staff_alert('contact_request', null, null, jsonb_build_object(
    'name', new.name, 'email', new.email, 'phone', new.phone, 'agency', new.agency,
    'topic', new.topic, 'locale', new.locale, 'excerpt', left(new.message, 280), 'message', left(new.message, 5000)));
  return null;
end;
$$;
create trigger contact_messages_alert after insert on public.contact_messages
  for each row execute function public.alert_contact_message();

revoke execute on function public.alert_contact_message() from public, anon, authenticated;
