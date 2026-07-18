create table if not exists public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role public.workspace_role not null default 'member',
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, email)
);

alter table public.workspace_invites enable row level security;
create policy "admins manage workspace invites" on public.workspace_invites
  for all to authenticated using (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

create or replace function public.invite_team_member(target_workspace_id uuid, target_email text)
returns public.workspace_invites
language plpgsql security definer set search_path = public
as $$
declare invite_row public.workspace_invites; invited_user_id uuid;
begin
  if not public.is_workspace_admin(target_workspace_id) then raise exception 'Only a workspace host or admin can invite team members.'; end if;
  insert into public.workspace_invites (workspace_id,email,role,invited_by)
  values (target_workspace_id,lower(trim(target_email)),'member',auth.uid())
  on conflict (workspace_id,email) do update set invited_by=auth.uid()
  returning * into invite_row;
  select id into invited_user_id from public.profiles where lower(email)=lower(trim(target_email)) limit 1;
  if invited_user_id is not null then
    insert into public.workspace_members (workspace_id,user_id,role) values (target_workspace_id,invited_user_id,'member')
    on conflict (workspace_id,user_id) do update set role=excluded.role;
    update public.workspace_invites set accepted_at=now() where id=invite_row.id returning * into invite_row;
  end if;
  return invite_row;
end; $$;

create or replace function public.claim_workspace_invites()
returns integer language plpgsql security definer set search_path = public
as $$
declare claimed integer;
begin
  insert into public.workspace_members (workspace_id,user_id,role)
  select workspace_id,auth.uid(),role from public.workspace_invites
  where lower(email)=lower(coalesce((select email from public.profiles where id=auth.uid()),'')) and accepted_at is null
  on conflict (workspace_id,user_id) do update set role=excluded.role;
  get diagnostics claimed = row_count;
  update public.workspace_invites set accepted_at=coalesce(accepted_at,now())
  where lower(email)=lower(coalesce((select email from public.profiles where id=auth.uid()),''));
  return claimed;
end; $$;

grant execute on function public.invite_team_member(uuid,text) to authenticated;
grant execute on function public.claim_workspace_invites() to authenticated;
