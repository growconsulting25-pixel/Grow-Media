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
select pg_temp.assert((select s->>'plan_id' = 'agent' and (s->>'used')::int = 1 and (s->>'included')::int = 4 from public.get_account_summary() s), 'account summary shows plan usage');
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
insert into public.messages (project_id, author_id, body) values ('aaaaaaaa-0000-0000-0000-000000000001', :'alice', 'Thanks!');
do $$ begin
  insert into public.messages (project_id, author_id, body, is_staff) values ('aaaaaaaa-0000-0000-0000-000000000001', auth.uid(), 'fake staff', true);
  raise exception 'client posted as staff';
exception when insufficient_privilege then raise notice 'ok - client cannot post as staff'; end $$;
do $$ begin
  update public.brand_kits set agency = 'My Agency' where user_id = auth.uid();
  if not found then raise exception 'brand kit not updatable'; end if;
  raise notice 'ok - brand kit editable by owner';
end $$;
select pg_temp.assert((select status = 'revision_requested' from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000001'), 'revision requested');
reset role;

-- Add-on: a 3D walkthrough costs the add-on even when the plan covers the video
select pg_temp.act_as(:'alice');
insert into public.projects (id, user_id, address, type) values ('aaaaaaaa-0000-0000-0000-000000000003', :'alice', '5 Rue des Érables', 'walkthrough');
insert into public.project_files (project_id, user_id, storage_path, file_name, mime_type, size_bytes)
  values ('aaaaaaaa-0000-0000-0000-000000000003', :'alice', :'alice' || '/aaaaaaaa-0000-0000-0000-000000000003/c.jpg', 'c.jpg', 'image/jpeg', 1000);
select pg_temp.assert((select q->>'mode' = 'subscription' and (q->>'addon_cents')::int = 9900 and (q->>'due_cents')::int = 9900
  from public.get_submission_quote('aaaaaaaa-0000-0000-0000-000000000003') q), 'walkthrough quote: plan covers video, add-on due');
do $$ begin
  perform public.submit_project('aaaaaaaa-0000-0000-0000-000000000003');
  raise exception 'unpaid add-on was submitted';
exception when raise_exception then
  if sqlerrm <> 'payment_required' then raise; end if;
  raise notice 'ok - unpaid add-on blocks submission';
end $$;
update public.projects set addon_paid = true where id = 'aaaaaaaa-0000-0000-0000-000000000003';
select pg_temp.assert((select not addon_paid from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000003'), 'client cannot mark add-on paid');
do $$ begin
  perform public.finalize_paid_submission('aaaaaaaa-0000-0000-0000-000000000003', auth.uid(), 9900);
  raise exception 'client called finalize';
exception when insufficient_privilege then raise notice 'ok - clients cannot finalize payments'; end $$;
reset role;
do $$ begin
  perform public.finalize_paid_submission('aaaaaaaa-0000-0000-0000-000000000003', (select user_id from public.projects where id = 'aaaaaaaa-0000-0000-0000-000000000003'), 5000);
  raise exception 'underpayment accepted';
exception when raise_exception then
  if sqlerrm <> 'underpaid' then raise; end if;
  raise notice 'ok - underpayment rejected';
end $$;
select pg_temp.assert((select status = 'submitted' and addon_paid and price_cents = 0 and not is_free
  from public.finalize_paid_submission('aaaaaaaa-0000-0000-0000-000000000003', :'alice', 9900)), 'paid add-on submitted, video from plan');
select pg_temp.assert((select status = 'submitted' from public.finalize_paid_submission('aaaaaaaa-0000-0000-0000-000000000003', :'alice', 9900)), 'finalize is idempotent');
select pg_temp.act_as(:'alice');
select pg_temp.assert((select (q->>'used')::int = 2 from public.get_submission_quote() q), 'walkthrough video counts toward the plan');
reset role;

-- Staff alerts: every business event lands in the staff inbox queue
insert into public.orders (user_id, amount_cents, status, plan_id) values (:'alice', 9900, 'paid', 'agent');
select pg_temp.assert((select count(*) >= 2 from public.staff_alerts where kind = 'new_client'), 'alert: new sign-ups');
select pg_temp.assert((select count(*) >= 2 from public.staff_alerts where kind = 'new_project'), 'alert: submitted projects');
select pg_temp.assert((select count(*) = 1 from public.staff_alerts where kind = 'revision_requested'), 'alert: revision requested');
select pg_temp.assert((select count(*) = 1 from public.staff_alerts where kind = 'client_message'), 'alert: client message (staff messages excluded)');
select pg_temp.assert((select count(*) = 1 from public.staff_alerts where kind = 'subscription_started'), 'alert: new subscriber');
select pg_temp.assert((select count(*) = 1 from public.staff_alerts where kind = 'payment' and (payload->>'amount_cents')::int = 9900), 'alert: payment');
select pg_temp.act_as(:'alice');
select pg_temp.assert((select count(*) = 0 from public.staff_alerts), 'clients cannot read staff alerts');
reset role;

-- Team bell: each admin marks alerts seen for themselves only
select pg_temp.act_as(:'bob');
select public.mark_staff_alerts_seen();
select pg_temp.assert((select alerts_seen_at is not null from public.profiles where id = :'bob'), 'admin marks alerts seen');
reset role;
select pg_temp.act_as(:'alice');
select public.mark_staff_alerts_seen();
reset role;
select pg_temp.assert((select alerts_seen_at is null from public.profiles where id = :'alice'), 'clients have no team alerts to mark');

-- Contact form: server inserts, staff are alerted, nobody else reads
insert into public.contact_messages (name, email, topic, message) values ('Visitor', 'v@example.com', 'team', 'Hello');
select pg_temp.assert((select count(*) = 1 from public.staff_alerts where kind = 'contact_request' and payload->>'email' = 'v@example.com'), 'alert: contact request');
select pg_temp.act_as(:'alice');
select pg_temp.assert((select count(*) = 0 from public.contact_messages), 'clients cannot read contact messages');
reset role;
select pg_temp.act_as(:'bob');
select pg_temp.assert((select count(*) = 1 from public.contact_messages), 'staff read contact messages');
reset role;

\echo ALL RLS TESTS PASSED
