create table if not exists public.drop_files (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  storage_bucket text not null default 'drop-files',
  storage_path text not null,
  file_name text not null,
  content_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.drop_files enable row level security;
create policy "participants view drop files" on public.drop_files for select to authenticated
  using (public.is_conversation_participant(conversation_id));
create policy "participants add drop files" on public.drop_files for insert to authenticated
  with check (uploaded_by=auth.uid() and public.is_conversation_participant(conversation_id));
create policy "uploaders delete drop files" on public.drop_files for delete to authenticated
  using (uploaded_by=auth.uid() or public.is_conversation_host(conversation_id));

insert into storage.buckets (id,name,public,file_size_limit)
values ('drop-files','drop-files',false,524288000)
on conflict (id) do nothing;

create policy "participants read drop file objects" on storage.objects for select to authenticated
  using (bucket_id='drop-files' and public.is_conversation_participant(((storage.foldername(name))[1])::uuid));
create policy "participants upload drop file objects" on storage.objects for insert to authenticated
  with check (bucket_id='drop-files' and public.is_conversation_participant(((storage.foldername(name))[1])::uuid) and ((storage.foldername(name))[2])::uuid=auth.uid());
create policy "uploaders delete drop file objects" on storage.objects for delete to authenticated
  using (bucket_id='drop-files' and ((storage.foldername(name))[2])::uuid=auth.uid());
