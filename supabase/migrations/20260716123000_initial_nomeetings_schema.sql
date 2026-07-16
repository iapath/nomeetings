-- NoMeetings initial schema for async Conversations.
create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'admin', 'member', 'guest');
create type public.conversation_status as enum ('draft', 'active', 'ended', 'overdue', 'archived');
create type public.response_kind as enum ('video', 'audio', 'screen', 'text');
create type public.participant_role as enum ('host', 'required', 'optional', 'viewer');
create type public.response_status as enum ('not_required', 'pending', 'responded', 'overdue');
create type public.entry_status as enum ('draft', 'uploading', 'ready', 'processing', 'failed');
create type public.marker_kind as enum ('agenda', 'person', 'topic', 'decision', 'manual', 'ai_suggested');
create type public.notification_kind as enum ('invited', 'mentioned', 'reminder_8h', 'reminder_3h', 'reminder_1h', 'ended', 'overdue');
create type public.notification_status as enum ('pending', 'sent', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  retention_days integer not null default 7,
  storage_bytes_used bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  due_at timestamptz,
  status public.conversation_status not null default 'draft',
  allowed_response_kinds public.response_kind[] not null default array['video','audio','screen','text']::public.response_kind[],
  max_duration_seconds integer not null default 600,
  expires_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.participant_role not null default 'viewer',
  response_required boolean not null default false,
  response_status public.response_status not null default 'not_required',
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table public.agenda_items (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 0,
  default_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.agenda_assignments (
  agenda_item_id uuid not null references public.agenda_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  required_to_watch boolean not null default false,
  required_to_respond boolean not null default false,
  can_skip boolean not null default true,
  primary key (agenda_item_id, user_id)
);

create table public.conversation_entries (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  kind public.response_kind not null,
  status public.entry_status not null default 'draft',
  storage_bucket text default 'conversation-clips',
  storage_path text,
  text_body text,
  duration_seconds integer,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((kind = 'text' and text_body is not null) or (kind <> 'text'))
);

create table public.conversation_markers (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.conversation_entries(id) on delete cascade,
  agenda_item_id uuid references public.agenda_items(id) on delete set null,
  mentioned_user_id uuid references public.profiles(id) on delete set null,
  marker_kind public.marker_kind not null default 'manual',
  label text not null,
  timestamp_seconds integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.watch_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_id uuid not null references public.conversation_entries(id) on delete cascade,
  last_watched_seconds integer not null default 0,
  completed boolean not null default false,
  skipped boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_id)
);

create table public.summaries (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  agenda_item_id uuid references public.agenda_items(id) on delete cascade,
  entry_id uuid references public.conversation_entries(id) on delete cascade,
  summary_scope text not null check (summary_scope in ('conversation','agenda','entry')),
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  kind public.notification_kind not null,
  status public.notification_status not null default 'pending',
  scheduled_for timestamptz,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.agenda_items enable row level security;
alter table public.agenda_assignments enable row level security;
alter table public.conversation_entries enable row level security;
alter table public.conversation_markers enable row level security;
alter table public.watch_progress enable row level security;
alter table public.summaries enable row level security;
alter table public.notifications enable row level security;

create policy "profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "workspace members can view workspace" on public.workspaces for select to authenticated using (exists (select 1 from public.workspace_members wm where wm.workspace_id = id and wm.user_id = auth.uid()));
create policy "workspace owners and admins update workspace" on public.workspaces for update to authenticated using (exists (select 1 from public.workspace_members wm where wm.workspace_id = id and wm.user_id = auth.uid() and wm.role in ('owner','admin')));

create policy "workspace members can view members" on public.workspace_members for select to authenticated using (exists (select 1 from public.workspace_members viewer where viewer.workspace_id = workspace_id and viewer.user_id = auth.uid()));

create policy "participants can view conversations" on public.conversations for select to authenticated using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = id and cp.user_id = auth.uid()));
create policy "workspace members can create conversations" on public.conversations for insert to authenticated with check (host_id = auth.uid() and exists (select 1 from public.workspace_members wm where wm.workspace_id = workspace_id and wm.user_id = auth.uid()));
create policy "hosts can update conversations" on public.conversations for update to authenticated using (host_id = auth.uid());

create policy "participants can view participant rows" on public.conversation_participants for select to authenticated using (exists (select 1 from public.conversation_participants viewer where viewer.conversation_id = conversation_id and viewer.user_id = auth.uid()));
create policy "hosts can manage participants" on public.conversation_participants for all to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and c.host_id = auth.uid())) with check (exists (select 1 from public.conversations c where c.id = conversation_id and c.host_id = auth.uid()));

create policy "participants can view agenda" on public.agenda_items for select to authenticated using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = agenda_items.conversation_id and cp.user_id = auth.uid()));
create policy "hosts can manage agenda" on public.agenda_items for all to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and c.host_id = auth.uid())) with check (exists (select 1 from public.conversations c where c.id = conversation_id and c.host_id = auth.uid()));

create policy "participants can view agenda assignments" on public.agenda_assignments for select to authenticated using (exists (select 1 from public.agenda_items ai join public.conversation_participants cp on cp.conversation_id = ai.conversation_id where ai.id = agenda_item_id and cp.user_id = auth.uid()));

create policy "participants can view entries" on public.conversation_entries for select to authenticated using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = conversation_entries.conversation_id and cp.user_id = auth.uid()));
create policy "participants can create own entries" on public.conversation_entries for insert to authenticated with check (author_id = auth.uid() and exists (select 1 from public.conversation_participants cp where cp.conversation_id = conversation_entries.conversation_id and cp.user_id = auth.uid()));

create policy "participants can view markers" on public.conversation_markers for select to authenticated using (exists (select 1 from public.conversation_entries ce join public.conversation_participants cp on cp.conversation_id = ce.conversation_id where ce.id = entry_id and cp.user_id = auth.uid()));
create policy "entry authors can create markers" on public.conversation_markers for insert to authenticated with check (created_by = auth.uid() and exists (select 1 from public.conversation_entries ce where ce.id = entry_id and ce.author_id = auth.uid()));

create policy "users manage own watch progress" on public.watch_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "participants can view summaries" on public.summaries for select to authenticated using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = summaries.conversation_id and cp.user_id = auth.uid()));
create policy "users view own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('conversation-clips', 'conversation-clips', false, 524288000, array['video/webm','video/mp4','video/quicktime','audio/webm','audio/mpeg','audio/mp4','audio/wav'])
on conflict (id) do nothing;
