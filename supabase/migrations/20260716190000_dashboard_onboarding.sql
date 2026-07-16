-- Dashboard onboarding, safe RLS helpers, and conversation creation.

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_conversation_participant(target_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = target_conversation_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_conversation_host(target_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversations
    where id = target_conversation_id and host_id = auth.uid()
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_admin(uuid) from public;
revoke all on function public.is_conversation_participant(uuid) from public;
revoke all on function public.is_conversation_host(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid) to authenticated;
grant execute on function public.is_conversation_participant(uuid) to authenticated;
grant execute on function public.is_conversation_host(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'Member'), '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.ensure_user_workspace()
returns table (workspace_id uuid, workspace_name text, member_role public.workspace_role)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  new_workspace_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select email into current_email from auth.users where id = current_user_id;
  insert into public.profiles (id, email, display_name)
  values (current_user_id, coalesce(current_email, ''), split_part(coalesce(current_email, 'Member'), '@', 1))
  on conflict (id) do nothing;

  return query
  select wm.workspace_id, w.name, wm.role
  from public.workspace_members wm
  join public.workspaces w on w.id = wm.workspace_id
  where wm.user_id = current_user_id
  order by wm.created_at
  limit 1;

  if found then return; end if;

  insert into public.workspaces (name, owner_id)
  values (
    coalesce(nullif(split_part(coalesce(current_email, ''), '@', 2), ''), 'My') || ' Workspace',
    current_user_id
  )
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, current_user_id, 'owner');

  return query
  select w.id, w.name, 'owner'::public.workspace_role
  from public.workspaces w where w.id = new_workspace_id;
end;
$$;

revoke all on function public.ensure_user_workspace() from public;
grant execute on function public.ensure_user_workspace() to authenticated;

drop policy if exists "workspace members can view workspace" on public.workspaces;
drop policy if exists "workspace owners and admins update workspace" on public.workspaces;
drop policy if exists "workspace members can view members" on public.workspace_members;
drop policy if exists "participants can view conversations" on public.conversations;
drop policy if exists "workspace members can create conversations" on public.conversations;
drop policy if exists "hosts can update conversations" on public.conversations;
drop policy if exists "participants can view participant rows" on public.conversation_participants;
drop policy if exists "hosts can manage participants" on public.conversation_participants;

create policy "members view workspace" on public.workspaces
  for select to authenticated using (public.is_workspace_member(id));
create policy "admins update workspace" on public.workspaces
  for update to authenticated using (public.is_workspace_admin(id)) with check (public.is_workspace_admin(id));

create policy "members view workspace members" on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));

create policy "members view workspace conversations" on public.conversations
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members create hosted conversations" on public.conversations
  for insert to authenticated with check (host_id = auth.uid() and public.is_workspace_member(workspace_id));
create policy "hosts update conversations" on public.conversations
  for update to authenticated using (host_id = auth.uid()) with check (host_id = auth.uid());

create policy "participants view participant rows" on public.conversation_participants
  for select to authenticated using (public.is_conversation_participant(conversation_id));
create policy "hosts insert participant rows" on public.conversation_participants
  for insert to authenticated with check (public.is_conversation_host(conversation_id));
create policy "hosts update participant rows" on public.conversation_participants
  for update to authenticated using (public.is_conversation_host(conversation_id)) with check (public.is_conversation_host(conversation_id));
create policy "hosts delete participant rows" on public.conversation_participants
  for delete to authenticated using (public.is_conversation_host(conversation_id));

