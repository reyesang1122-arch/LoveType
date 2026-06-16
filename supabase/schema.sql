-- ============================================================================
-- Love Archetype Test — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- MVP uses only `test_results` (anonymous analytics). The remaining tables are
-- pre-built scaffolding for the next phase: couple matching, invite partner,
-- compatibility report and relationship score. They are intentionally NOT wired
-- into the app yet.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- MVP: anonymous test results (analytics + future personalization)
-- ---------------------------------------------------------------------------
create table if not exists public.test_results (
  id                  uuid primary key default gen_random_uuid(),
  top_archetype       text        not null,
  secondary_archetype text        not null,
  score               int         not null check (score between 0 and 100),
  scores              jsonb       not null,            -- raw per-archetype points
  source              text        default 'web',
  -- nullable owner: set once auth/invite features land
  user_id             uuid,
  created_at          timestamptz not null default now()
);

create index if not exists test_results_top_idx     on public.test_results (top_archetype);
create index if not exists test_results_created_idx  on public.test_results (created_at desc);

alter table public.test_results enable row level security;

-- Anonymous inserts allowed (anon key); reads restricted (analytics via service role).
drop policy if exists "anon insert results" on public.test_results;
create policy "anon insert results"
  on public.test_results for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Analytics: funnel + behavioural event log (powers /feedback dashboard)
-- ---------------------------------------------------------------------------
create table if not exists public.event_logs (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  session_id  text        not null,
  event_name  text        not null,         -- landing_view | test_started | test_completed
                                            -- | share_card_generated | share_clicked | xinyu_clicked
  archetype   text,                         -- nullable; set on test_completed / share / xinyu
  metadata    jsonb       not null default '{}'::jsonb
);

create index if not exists event_logs_name_idx     on public.event_logs (event_name);
create index if not exists event_logs_created_idx   on public.event_logs (created_at desc);
create index if not exists event_logs_session_idx   on public.event_logs (session_id);

alter table public.event_logs enable row level security;

-- Anonymous inserts allowed (anon key). Reads are done server-side with the
-- service-role key on the password-protected /feedback page, so no read policy.
drop policy if exists "anon insert events" on public.event_logs;
create policy "anon insert events"
  on public.event_logs for insert
  to anon, authenticated
  with check (true);

-- ===========================================================================
-- FUTURE ARCHITECTURE (scaffolding only — no app features yet)
-- ===========================================================================

-- Profiles: one per signed-in user (links to Supabase auth.users)
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  avatar_emoji  text,
  archetype     text,                                   -- their latest top archetype
  archetype_scores jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Couples: a link between two profiles
create table if not exists public.couples (
  id            uuid primary key default gen_random_uuid(),
  user_a        uuid not null references public.profiles (id) on delete cascade,
  user_b        uuid references public.profiles (id) on delete set null,
  status        text not null default 'pending'         -- pending | active | ended
                  check (status in ('pending', 'active', 'ended')),
  created_at    timestamptz not null default now(),
  unique (user_a, user_b)
);
alter table public.couples enable row level security;

-- Invites: "invite your partner" flow (share a code/link)
create table if not exists public.invites (
  id            uuid primary key default gen_random_uuid(),
  inviter_id    uuid not null references public.profiles (id) on delete cascade,
  code          text not null unique default encode(gen_random_bytes(6), 'hex'),
  invitee_email text,
  couple_id     uuid references public.couples (id) on delete set null,
  status        text not null default 'sent'            -- sent | accepted | expired
                  check (status in ('sent', 'accepted', 'expired')),
  expires_at    timestamptz default (now() + interval '14 days'),
  created_at    timestamptz not null default now()
);
alter table public.invites enable row level security;

-- Compatibility reports: generated when both partners have results
create table if not exists public.compatibility_reports (
  id                uuid primary key default gen_random_uuid(),
  couple_id         uuid not null references public.couples (id) on delete cascade,
  archetype_a       text not null,
  archetype_b       text not null,
  compatibility     int  not null check (compatibility between 0 and 100),
  summary           text,
  details           jsonb,
  created_at        timestamptz not null default now()
);
alter table public.compatibility_reports enable row level security;

-- Relationship score: an evolving health metric per couple over time
create table if not exists public.relationship_scores (
  id            uuid primary key default gen_random_uuid(),
  couple_id     uuid not null references public.couples (id) on delete cascade,
  score         int  not null check (score between 0 and 100),
  dimensions    jsonb,                                  -- communication, intimacy, trust...
  recorded_at   timestamptz not null default now()
);
alter table public.relationship_scores enable row level security;

create index if not exists invites_code_idx        on public.invites (code);
create index if not exists couples_user_a_idx       on public.couples (user_a);
create index if not exists couples_user_b_idx       on public.couples (user_b);
create index if not exists rel_scores_couple_idx    on public.relationship_scores (couple_id, recorded_at desc);
