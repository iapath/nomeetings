alter table public.drop_files
  add column if not exists entry_id uuid references public.conversation_entries(id) on delete cascade;

create index if not exists drop_files_entry_id_idx on public.drop_files(entry_id);
