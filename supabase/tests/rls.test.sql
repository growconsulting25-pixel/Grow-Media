-- Run: psql -v ON_ERROR_STOP=1 -f supabase-stubs.sql -f ../migrations/*.sql -f rls.test.sql
-- Exercises the security model end to end as two different clients.
\set ON_ERROR_STOP 1
\set alice '11111111-1111-1111-1111-111111111111'
\set bob   '22222222-2222-2222-2222-222222222222'

insert into auth.users values (:'alice', 'alice@test.ca', '{"first_name":"Alice","last_name":"A","locale":"en"}');
insert into auth.users values (:'bob',   'bob@test.ca',   '{"first_name":"Bob","last_name":"B"}');

create or replace function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid::text, false);
  execute 'set role authenticated';
end $$;
create or replace function pg_temp.assert(cond boolean, msg text) returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then raise exception 'ASSERTION FAILED: %', msg; end if;
  raise notice 'ok - %', msg;
end $$;

-- Profile + brand kit created by trigger
select pg_temp.assert((select count(*) = 2 from public.profiles), 'profiles created on signup');
select pg_temp.assert((select locale = 'en' and free_video_credits = 1 from public.profiles where id = :'alice'), 'profile metadata + 1 free credit');

-- Alice creates a draft and a file
select pg_temp.act_as(:'alice');
insert into public.projects (id, user_id, address) values ('aaaaaaaa-0000-0000-0000-000000000001', :'alice', '1234 Example St');
insert into public.project_files (project_id, user_id, storage_path, file_name, mime_type, size_bytes)
  values ('aaaaaaaa-0000-0000-0000-000000000001', :'alice', :'alice' || '/aaaaaaaa-0000-0000-0000-000000000001/a.jpg', 'a.jpg', 'image/jpeg', 1000);

-- Alice cannot grant herself credits or submit by setting status directly
do $$ begin
  update public.profiles set free_video_credits = 99 where id = auth.uid();
  raise exception 'should not update credits';
exception when insufficient_privilege then raise notice 'ok - credits not client-writable'; end $$;
do $$ begin
  update public.projects set status = 'ready' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
  raise exception 'client changed status';
exception when insufficient_privilege then raise notice 'ok - status change rejected'; end $$;
reset role;
select pg_temp.assert((select status = 'draft' from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000001'), 'client cannot change status directly');

-- Bob sees nothing of Alice
select pg_temp.act_as(:'bob');
select pg_temp.assert((select count(*) = 0 from public.projects), 'bob cannot see alice projects');
select pg_temp.assert((select count(*) = 0 from public.project_files), 'bob cannot see alice files');
do $$ begin
  perform public.submit_project('aaaaaaaa-0000-0000-0000-000000000001');
  raise exception 'bob submitted alice project';
exception when raise_exception then
  if sqlerrm <> 'not_found' then raise; end if;
  raise notice 'ok - bob cannot submit alice project';
end $$;
-- Storage path isolation
do $$ begin
  insert into storage.objects (bucket_id, name) values ('project-files', '11111111-1111-1111-1111-111111111111/x/evil.jpg');
  raise exception 'bob wrote into alice folder';
exception when insufficient_privilege then raise notice 'ok - storage folder isolation'; end $$;
insert into storage.objects (bucket_id, name) values ('project-files', '22222222-2222-2222-2222-222222222222/p/ok.jpg');
reset role;

-- Alice submits with her free credit
select pg_temp.act_as(:'alice');
select pg_temp.assert((select public.get_submission_quote()->>'mode' = 'free'), 'quote is free');
select pg_temp.assert((select status = 'submitted' and is_free from public.submit_project('aaaaaaaa-0000-0000-0000-000000000001')), 'free submission');
select pg_temp.assert((select free_video_credits = 0 from public.profiles where id = auth.uid()), 'credit consumed');
select pg_temp.assert((select count(*) = 1 from public.project_status_events), 'timeline event recorded');
select pg_temp.assert((select count(*) = 1 from public.notifications where type = 'project_received'), 'notification created');

-- Files of a submitted project are locked
do $$ begin
  insert into public.project_files (project_id, user_id, storage_path, file_name, mime_type, size_bytes)
    values ('aaaaaaaa-0000-0000-0000-000000000001', auth.uid(), 'x/y/z.jpg', 'z.jpg', 'image/jpeg', 1);
  raise exception 'added file after submit';
exception when insufficient_privilege then raise notice 'ok - submitted project locked'; end $$;

-- Second project now requires payment
insert into public.projects (id, user_id, address) values ('aaaaaaaa-0000-0000-0000-000000000002', :'alice', '99 Lakeshore');
insert into public.project_files (project_id, user_id, storage_path, file_name, mime_type, size_bytes)
  values ('aaaaaaaa-0000-0000-0000-000000000002', :'alice', :'alice' || '/aaaaaaaa-0000-0000-0000-000000000002/b.jpg', 'b.jpg', 'image/jpeg', 1000);
select pg_temp.assert((select public.get_submission_quote()->>'mode' = 'payment_required'), 'no credit → payment required');
reset role;

-- With an active Agent subscription it is covered (4 / month)
insert into public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
  values (:'alice', 'agent', 'active', now() - interval '1 day', now() + interval '29 days');
select pg_temp.act_as(:'alice');
select pg_temp.assert((select q->>'mode' = 'subscription' and (q->>'used')::int = 0 from public.get_submission_quote() q), 'subscription covers video');
select pg_temp.assert((select status = 'submitted' from public.submit_project('aaaaaaaa-0000-0000-0000-000000000002')), 'subscription submission');
select pg_temp.assert((select (q->>'used')::int = 1 from public.get_submission_quote() q), 'usage counted (1/4)');
reset role;

-- Staff delivers; client is notified and can request a revision
update public.profiles set role = 'admin' where id = :'bob';
select pg_temp.act_as(:'bob');
select pg_temp.assert((select count(*) = 2 from public.projects), 'admin sees all projects');
update public.projects set status = 'ready' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
reset role;
select pg_temp.assert((select delivered_at is not null from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000001'), 'delivery stamped');
select pg_temp.act_as(:'alice');
select pg_temp.assert((select count(*) = 1 from public.notifications where type = 'video_ready'), 'video ready notification');
select public.request_revision('aaaaaaaa-0000-0000-0000-000000000001', 'Slower opening please');
select pg_temp.assert((select status = 'revision_requested' from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000001'), 'revision requested');
reset role;

\echo ALL RLS TESTS PASSED
