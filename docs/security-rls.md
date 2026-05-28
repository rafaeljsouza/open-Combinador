# Security and RLS Notes

## Threat Model (Practical)

- Frontend code is public and inspectable.
- Publishable keys are expected to be exposed.
- Secret keys must never be present in browser env vars.
- Authorization must be enforced in Postgres via RLS, not by UI assumptions.

## Key Security Decisions

- Supabase secret key is blocked in frontend runtime (`supabaseClient.js`).
- Public and private profile data are stored in separate tables.
- Collaboration records are split between public timeline visibility and private workspace data.

## RLS Expectations

`supabase/schema.sql` should ensure:

- Users can read/update only their own private profile row.
- Public challenge listing is readable without exposing private challenge details.
- Match events marked public are readable broadly; private events are restricted to participants.
- Join requests are writable by requester and reviewable by authorized match roles.
- Solution writes are restricted to authorized collaboration participants.

## Operational Checklist

- Keep Auth settings aligned with expected signup flow.
- Review RLS policies after every schema change.
- Validate critical flows using real user accounts, not only seeded data.
- Avoid adding server-trust logic in UI-only checks.

## Auditability

- Preserve SQL migrations/schema snapshots per release checkpoint.
- Keep a versioned build artifact + hash manifest for legal and technical traceability.
