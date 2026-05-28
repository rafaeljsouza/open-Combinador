# Architecture

## Overview

Combinador is a React + Vite frontend that uses Supabase as backend platform.
The browser talks directly to Supabase using the publishable key and relies on
Postgres + RLS for data access control.

## Runtime Components

- Frontend: React pages/components in `src/`
- Backend SDK layer: service modules in `src/lib/backend/`
- Database: Supabase Postgres schema in `supabase/schema.sql`
- Auth: Supabase Auth (email/password)
- Authorization: Row-Level Security (RLS) policies in SQL schema

## Service Layer Responsibilities

- `authService.js`: session lifecycle, auth state subscription
- `profileService.js`: public/private profile reads and updates
- `challengeService.js`: challenge CRUD, tag matching, in-app notifications
- `collaborationService.js`: matches, join requests, timeline events, solutions
- `notificationService.js`: list/read status management for notifications
- `tagService.js`: tag catalog and usage counters

## Data Boundaries

- Public profile data stays in `profiles`
- Private contact data stays in `profile_private`
- Challenge public details stay in `challenges`
- Sensitive challenge context stays in `challenge_details`

This separation allows public discovery while preserving protected data paths.

## FAIR/Open Science in Architecture

- FAIR fields are stored in `solutions` (`api_docs_url`, `license_code`, `license_data`)
- Challenge detail page exports public timeline data as JSON/CSV
- Filtering in `Soluções` uses FAIR metadata for transparency and reuse criteria

## Environment Model

Frontend must use:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Frontend must not use:

- `VITE_SUPABASE_SECRET_KEY`

`src/lib/supabaseClient.js` enforces this at runtime.
