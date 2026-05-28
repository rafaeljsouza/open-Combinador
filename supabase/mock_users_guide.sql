-- Combinador mock setup guide (users + seed)
--
-- You do NOT need to create challenges manually.
-- The file `supabase/mock_seed.sql` creates challenges, matches, events, solutions, and notifications.
-- You only need 3 Auth users and their UUIDs.

-- 1) After creating demo users in Supabase Auth, list them:
select id, email, created_at
from auth.users
where email in (
  'manager.demo@combinador.local',
  'researcher.a.demo@combinador.local',
  'researcher.b.demo@combinador.local'
)
order by email;

-- 2) Copy each `id` and paste into `supabase/mock_seed.sql` placeholders:
-- manager:
--   11111111-1111-1111-1111-111111111111
-- researcher A:
--   22222222-2222-2222-2222-222222222222
-- researcher B:
--   33333333-3333-3333-3333-333333333333

-- 3) Run the seed file in SQL Editor:
--    supabase/mock_seed.sql

-- 4) Quick validation queries

-- challenges created by seed
select id, title, area, status, tags, created_at
from public.challenges
where id in (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'
)
order by created_at;

-- matches + participants
select id, challenge_id, status, participant_ids, created_at
from public.matches
where id in (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'
)
order by created_at;

-- solution with FAIR metadata
select
  id,
  challenge_title,
  repo_url,
  api_docs_url,
  license_code,
  license_data,
  published_at
from public.solutions
where id = 'cccccccc-cccc-cccc-cccc-ccccccccccc1';

-- notifications
select user_id, type, title, is_read, created_at
from public.notifications
where id in (
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'dddddddd-dddd-dddd-dddd-ddddddddddd2'
)
order by created_at;
