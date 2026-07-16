-- Make invited Conversations visible across workspaces and repair existing invitees.

create or replace function public.invite_to_conversation(
  target_conversation_id uuid,
  target_email text,
  target_role public.participant_role default 'required',
  target_response_required boolean default true
)
returns public.conversation_invites
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invite_row public.conversation_invites;
  invited_user_id uuid;
  target_workspace_id uuid;
begin
  if not public.is_conversation_host(target_conversation_id) then
    raise exception 'Only the Conversation host can invite people.';
  end if;
  if nullif(trim(target_email), '') is null then
    raise exception 'An email address is required.';
  end if;

  select workspace_id into target_workspace_id
  from public.conversations where id = target_conversation_id;

  insert into public.conversation_invites
    (conversation_id, email, role, response_required, invited_by)
  values
    (target_conversation_id, lower(trim(target_email)), target_role, target_response_required, auth.uid())
  on conflict (conversation_id, email) do update set
    role = excluded.role,
    response_required = excluded.response_required,
    invited_by = excluded.invited_by
  returning * into invite_row;

  select id into invited_user_id from auth.users where lower(email) = lower(trim(target_email)) limit 1;
  if invited_user_id is not null then
    insert into public.profiles (id, email, display_name)
    select id, email, coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
    from auth.users where id = invited_user_id
    on conflict (id) do nothing;

    insert into public.workspace_members (workspace_id, user_id, role)
    values (target_workspace_id, invited_user_id, 'guest')
    on conflict (workspace_id, user_id) do nothing;

    insert into public.conversation_participants
      (conversation_id, user_id, role, response_required, response_status)
    values
      (target_conversation_id, invited_user_id, target_role, target_response_required,
       case when target_response_required then 'pending'::public.response_status else 'not_required'::public.response_status end)
    on conflict (conversation_id, user_id) do update set
      role = excluded.role,
      response_required = excluded.response_required,
      response_status = excluded.response_status;

    update public.conversation_invites set accepted_at = now() where id = invite_row.id;
  end if;
  return invite_row;
end;
$$;

create or replace function public.claim_conversation_invites()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare claimed integer;
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  select distinct c.workspace_id, auth.uid(), 'guest'::public.workspace_role
  from public.conversation_invites i
  join public.conversations c on c.id = i.conversation_id
  join public.profiles p on p.id = auth.uid() and lower(p.email) = lower(i.email)
  on conflict (workspace_id, user_id) do nothing;

  insert into public.conversation_participants
    (conversation_id, user_id, role, response_required, response_status)
  select i.conversation_id, auth.uid(), i.role, i.response_required,
    case when i.response_required then 'pending'::public.response_status else 'not_required'::public.response_status end
  from public.conversation_invites i
  join public.profiles p on p.id = auth.uid() and lower(p.email) = lower(i.email)
  on conflict (conversation_id, user_id) do nothing;

  get diagnostics claimed = row_count;
  update public.conversation_invites i set accepted_at = coalesce(i.accepted_at, now())
  from public.profiles p
  where p.id = auth.uid() and lower(p.email) = lower(i.email);
  return claimed;
end;
$$;

-- Repair workspace membership for everyone already attached to a Conversation.
insert into public.workspace_members (workspace_id, user_id, role)
select distinct c.workspace_id, cp.user_id, 'guest'::public.workspace_role
from public.conversation_participants cp
join public.conversations c on c.id = cp.conversation_id
left join public.workspace_members wm on wm.workspace_id = c.workspace_id and wm.user_id = cp.user_id
where wm.user_id is null
on conflict (workspace_id, user_id) do nothing;
