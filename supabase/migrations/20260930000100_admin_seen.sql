-- In-app team notifications: each admin has their own "seen up to" mark, so
-- the console bell shows what's new for that person.
alter table public.profiles add column alerts_seen_at timestamptz;

create or replace function public.mark_staff_alerts_seen()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set alerts_seen_at = now() where id = auth.uid() and role = 'admin';
$$;

revoke execute on function public.mark_staff_alerts_seen() from public, anon;
grant execute on function public.mark_staff_alerts_seen() to authenticated;
