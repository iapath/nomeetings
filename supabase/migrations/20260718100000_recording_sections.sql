alter table public.conversation_markers
  add column if not exists end_seconds integer,
  add column if not exists summary text,
  add column if not exists position integer not null default 0;

create table if not exists public.marker_assignments (
  marker_id uuid not null references public.conversation_markers(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  requirement text not null default 'watch' check (requirement in ('watch','comment','respond')),
  created_at timestamptz not null default now(),
  primary key (marker_id, user_id)
);

alter table public.marker_assignments enable row level security;

create policy "participants view marker assignments" on public.marker_assignments
  for select to authenticated using (
    exists (
      select 1 from public.conversation_markers cm
      join public.conversation_entries ce on ce.id = cm.entry_id
      where cm.id = marker_id and public.is_conversation_participant(ce.conversation_id)
    )
  );

create policy "hosts manage marker assignments" on public.marker_assignments
  for all to authenticated using (
    exists (
      select 1 from public.conversation_markers cm
      join public.conversation_entries ce on ce.id = cm.entry_id
      where cm.id = marker_id and public.is_conversation_host(ce.conversation_id)
    )
  ) with check (
    exists (
      select 1 from public.conversation_markers cm
      join public.conversation_entries ce on ce.id = cm.entry_id
      where cm.id = marker_id and public.is_conversation_host(ce.conversation_id)
    )
  );

drop policy if exists "entry authors can update markers" on public.conversation_markers;
create policy "entry authors can update markers" on public.conversation_markers
  for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
