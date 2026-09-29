-- Internal helpers and trigger functions are never called through the API.
revoke execute on function public.active_subscription(uuid) from public, anon, authenticated;
revoke execute on function public.videos_used_in_period(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.on_project_status_change() from public, anon, authenticated;
revoke execute on function public.on_message_created() from public, anon, authenticated;

-- Client RPCs: signed-in users only (each also checks auth.uid() and ownership).
revoke execute on function public.get_submission_quote() from public, anon;
revoke execute on function public.submit_project(uuid) from public, anon;
revoke execute on function public.request_revision(uuid, text, numeric) from public, anon;
revoke execute on function public.reorder_project_files(uuid, uuid[]) from public, anon;
grant execute on function public.get_submission_quote() to authenticated;
grant execute on function public.submit_project(uuid) to authenticated;
grant execute on function public.request_revision(uuid, text, numeric) to authenticated;
grant execute on function public.reorder_project_files(uuid, uuid[]) to authenticated;

-- is_admin() stays executable: RLS policies call it as the requesting role.
-- It only reveals whether the caller themself is staff.
