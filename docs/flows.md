# Core Flows

## 1. Registration and Profile Setup

1. User creates account via Supabase Auth.
2. App creates public profile row in `profiles`.
3. App creates private profile row in `profile_private`.
4. Interest tags are normalized and catalog usage is updated.

## 2. Challenge Publication

1. Manager submits challenge with public and private parts.
2. Public fields go to `challenges`.
3. Private details go to `challenge_details`.
4. Tags are normalized, catalog is updated, and interested researchers are notified.

## 3. Initial Contact and Workspace

1. Researcher sends initial message from challenge page.
2. If no match exists, app creates a new `matches` record and initial private event.
3. If match exists, app creates `match_join_requests` entry.
4. Manager + lead researcher approvals move request state toward participation.

## 4. Collaboration Timeline

1. Participants add timeline events in workspace (`match_events`).
2. Events can be private or public.
3. Public events appear in challenge timeline and are exportable.

## 5. Solution Publication (FAIR-Aware)

1. Team publishes solution from workspace.
2. Required metadata includes repo, Open API docs, code license, and data license.
3. Solution appears in catalog and can be filtered by FAIR signals.

## 6. Notifications

1. Tag-based challenge matching creates in-app notifications.
2. Notification dedup is handled by app checks and DB unique constraints.
3. Optional email digest queue records are generated when preference is enabled.
