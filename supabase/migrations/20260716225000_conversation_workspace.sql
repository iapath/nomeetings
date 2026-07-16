-- Conversation workspace: pending invitations, safe host operations, and clip storage.

create table if not exists public.conversation_invites (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  email text not null,
  role public.participant_role not null default 'required',
  response_required boolean not null default true,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (conversation_id, email)
);

alter table public.conversation_invites enable row level security;

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
begin
  if not public.is_conversation_host(target_conversation_id) then
    raise exception 'Only the Conversation host can invite people.';
  end if;

  if nullif(trim(target_email), '') is null then
    raise exception 'An email address is required.';
  end if;

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
  insert into public.conversation_participants
    (conversation_id, user_id, role, response_required, response_status)
  select i.conversation_id, auth.uid(), i.role, i.response_required,
    case when i.response_required then 'pending'::public.response_status else 'not_required'::public.response_status end
  from public.conversation_invites i
  join public.profiles p on p.id = auth.uid() and lower(p.email) = lower(i.email)
  where i.accepted_at is null
  on conflict (conversation_id, user_id) do nothing;

  get diagnostics claimed = row_count;
  update public.conversation_invites i set accepted_at = now()
  from public.profiles p
  where p.id = auth.uid() and lower(p.email) = lower(i.email) and i.accepted_at is null;
  return claimed;
end;
$$;

grant execute on function public.invite_to_conversation(uuid,text,public.participant_role,boolean) to authenticated;
grant execute on function public.claim_conversation_invites() to authenticated;

drop policy if exists "participants view conversation invites" on public.conversation_invites;
drop policy if exists "hosts manage conversation invites" on public.conversation_invites;
create policy "participants view conversation invites" on public.conversation_invites
  for select to authenticated using (public.is_conversation_participant(conversation_id));
create policy "hosts manage conversation invites" on public.conversation_invites
  for all to authenticated using (public.is_conversation_host(conversation_id)) with check (public.is_conversation_host(conversation_id));

drop policy if exists "hosts manage agenda assignments" on public.agenda_assignments;
create policy "hosts manage agenda assignments" on public.agenda_assignments
  for all to authenticated
  using (exists (select 1 from public.agenda_items ai where ai.id = agenda_item_id and public.is_conversation_host(ai.conversation_id)))
  with check (exists (select 1 from public.agenda_items ai where ai.id = agenda_item_id and public.is_conversation_host(ai.conversation_id)));

drop policy if exists "entry authors update own entries" on public.conversation_entries;
drop policy if exists "entry authors delete own entries" on public.conversation_entries;
create policy "entry authors update own entries" on public.conversation_entries
  for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "entry authors delete own entries" on public.conversation_entries
  for delete to authenticated using (author_id = auth.uid());

drop policy if exists "participants read conversation clips" on storage.objects;
drop policy if exists "participants upload conversation clips" on storage.objects;
drop policy if exists "authors update conversation clips" on storage.objects;
drop policy if exists "authors delete conversation clips" on storage.objects;
create policy "participants read conversation clips" on storage.objects
  for select to authenticated using (
    bucket_id = 'conversation-clips'
    and public.is_conversation_participant(((storage.foldername(name))[1])::uuid)
  );
create policy "participants upload conversation clips" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'conversation-clips'
    and public.is_conversation_participant(((storage.foldername(name))[1])::uuid)
    and ((storage.foldername(name))[2])::uuid = auth.uid()
  );
create policy "authors update conversation clips" on storage.objects
  for update to authenticated using (bucket_id = 'conversation-clips' and ((storage.foldername(name))[2])::uuid = auth.uid());
create policy "authors delete conversation clips" on storage.objects
  for delete to authenticated using (bucket_id = 'conversation-clips' and ((storage.foldername(name))[2])::uuid = auth.uid());
