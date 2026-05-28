create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text not null check (user_type in ('pesquisador', 'gestor')),
  email text not null,
  name text not null,
  institution text not null,
  avatar_url text default '',
  lattes text default '',
  government_link text default '',
  bio text default '',
  research_line text default '',
  social jsonb not null default '{}'::jsonb,
  share_private_with_researchers boolean not null default false,
  share_private_with_managers boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_private (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  phone text not null,
  whatsapp text default '',
  notes text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null,
  description text not null,
  author_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'aberto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_details (
  challenge_id uuid primary key references public.challenges(id) on delete cascade,
  private_details text not null default '',
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  manager_id uuid references auth.users(id) on delete set null,
  lead_researcher_id uuid not null references auth.users(id) on delete cascade,
  participant_ids uuid[] not null default '{}',
  status text not null default 'contato_inicial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  type text not null,
  content text not null,
  tags text[] not null default '{}',
  attachment jsonb,
  is_public boolean not null default false,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.match_join_requests (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  manager_approved boolean not null default false,
  lead_approved boolean not null default false,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  challenge_title text not null,
  summary text not null,
  repo_url text not null,
  api_docs_url text not null default '',
  license_code text not null default '',
  license_data text not null default '',
  manager_id uuid references auth.users(id) on delete set null,
  lead_researcher_id uuid references auth.users(id) on delete set null,
  participant_ids uuid[] not null default '{}',
  published_at timestamptz not null default now()
);

alter table public.solutions add column if not exists api_docs_url text not null default '';
alter table public.solutions add column if not exists license_code text not null default '';
alter table public.solutions add column if not exists license_data text not null default '';

alter table public.profiles add column if not exists interest_tags text[] not null default '{}';
alter table public.profiles add column if not exists notify_email_enabled boolean not null default false;
alter table public.profiles add column if not exists notify_email_frequency text not null default 'daily';
alter table public.challenges add column if not exists tags text[] not null default '{}';

create table if not exists public.tag_catalog (
  tag text primary key,
  usage_count integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_digest_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  notification_id uuid not null references public.notifications(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create unique index if not exists notifications_unique_challenge_match
on public.notifications (user_id, type, ((payload->>'challengeId')))
where type = 'challenge_match';

alter table public.profiles enable row level security;
alter table public.profile_private enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_details enable row level security;
alter table public.matches enable row level security;
alter table public.match_events enable row level security;
alter table public.match_join_requests enable row level security;
alter table public.solutions enable row level security;
alter table public.tag_catalog enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_digest_queue enable row level security;

drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read
on public.profiles
for select
using (true);

drop policy if exists profiles_owner_write on public.profiles;
create policy profiles_owner_write
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profile_private_owner_read on public.profile_private;
create policy profile_private_owner_read
on public.profile_private
for select
using (auth.uid() = owner_id);

drop policy if exists profile_private_owner_write on public.profile_private;
create policy profile_private_owner_write
on public.profile_private
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists challenges_public_read on public.challenges;
create policy challenges_public_read
on public.challenges
for select
using (true);

drop policy if exists challenges_owner_write on public.challenges;
create policy challenges_owner_write
on public.challenges
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists challenge_details_owner_read on public.challenge_details;
create policy challenge_details_owner_read
on public.challenge_details
for select
using (auth.uid() = author_id);

drop policy if exists challenge_details_owner_write on public.challenge_details;
create policy challenge_details_owner_write
on public.challenge_details
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists matches_participant_read on public.matches;
create policy matches_participant_read
on public.matches
for select
using (auth.uid() = any(participant_ids));

drop policy if exists matches_participant_write on public.matches;
create policy matches_participant_write
on public.matches
for update
using (auth.uid() = any(participant_ids))
with check (auth.uid() = any(participant_ids));

drop policy if exists matches_creator_insert on public.matches;
create policy matches_creator_insert
on public.matches
for insert
with check (auth.uid() = lead_researcher_id);

drop policy if exists events_public_read on public.match_events;
create policy events_public_read
on public.match_events
for select
using (is_public = true);

drop policy if exists events_participant_read on public.match_events;
create policy events_participant_read
on public.match_events
for select
using (
  exists (
    select 1 from public.matches m
    where m.id = match_id
      and auth.uid() = any(m.participant_ids)
  )
);

drop policy if exists events_participant_insert on public.match_events;
create policy events_participant_insert
on public.match_events
for insert
with check (
  exists (
    select 1 from public.matches m
    where m.id = match_id
      and auth.uid() = any(m.participant_ids)
  )
);

drop policy if exists requests_participant_read on public.match_join_requests;
create policy requests_participant_read
on public.match_join_requests
for select
using (
  requester_id = auth.uid()
  or exists (
    select 1 from public.matches m
    where m.id = match_id
      and auth.uid() = any(m.participant_ids)
  )
);

drop policy if exists requests_requester_insert on public.match_join_requests;
create policy requests_requester_insert
on public.match_join_requests
for insert
with check (requester_id = auth.uid());

drop policy if exists requests_participant_update on public.match_join_requests;
create policy requests_participant_update
on public.match_join_requests
for update
using (
  requester_id = auth.uid()
  or exists (
    select 1 from public.matches m
    where m.id = match_id
      and auth.uid() = any(m.participant_ids)
  )
)
with check (
  requester_id = auth.uid()
  or exists (
    select 1 from public.matches m
    where m.id = match_id
      and auth.uid() = any(m.participant_ids)
  )
);

drop policy if exists solutions_public_read on public.solutions;
create policy solutions_public_read
on public.solutions
for select
using (true);

drop policy if exists solutions_participant_insert on public.solutions;
create policy solutions_participant_insert
on public.solutions
for insert
with check (
  exists (
    select 1 from public.matches m
    where m.challenge_id = challenge_id
      and auth.uid() = any(m.participant_ids)
  )
);

drop policy if exists tag_catalog_public_read on public.tag_catalog;
create policy tag_catalog_public_read
on public.tag_catalog
for select
using (true);

drop policy if exists tag_catalog_authenticated_insert on public.tag_catalog;
create policy tag_catalog_authenticated_insert
on public.tag_catalog
for insert
with check (auth.uid() is not null);

drop policy if exists tag_catalog_authenticated_update on public.tag_catalog;
create policy tag_catalog_authenticated_update
on public.tag_catalog
for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists notifications_owner_read on public.notifications;
create policy notifications_owner_read
on public.notifications
for select
using (auth.uid() = user_id);

drop policy if exists notifications_owner_update on public.notifications;
create policy notifications_owner_update
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists notifications_authenticated_insert on public.notifications;
create policy notifications_authenticated_insert
on public.notifications
for insert
with check (auth.uid() is not null);

drop policy if exists digest_queue_owner_read on public.notification_digest_queue;
create policy digest_queue_owner_read
on public.notification_digest_queue
for select
using (auth.uid() = user_id);

drop policy if exists digest_queue_authenticated_insert on public.notification_digest_queue;
create policy digest_queue_authenticated_insert
on public.notification_digest_queue
for insert
with check (auth.uid() is not null);
