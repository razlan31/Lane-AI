-- migrations/0001_phase1_init.sql
-- Phase-1 canonical schema + RLS (note: user_id stored as text to match auth.uid())

-- uuid generator
create extension if not exists "pgcrypto";

-- Ventures
create table if not exists ventures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Worksheets
create table if not exists worksheets (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id),
  user_id text,
  type text not null,
  inputs jsonb not null,
  outputs jsonb,
  created_at timestamptz default now()
);

-- Timeline events
do $$ begin
  if not exists (select 1 from pg_type where typname = 'timeline_kind') then
    create type timeline_kind as enum ('insight','decision','artifact');
  end if;
end $$;

create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id),
  user_id text,
  kind timeline_kind not null,
  title text not null,
  body text,
  payload jsonb,
  created_at timestamptz default now()
);

-- Audit logs & AI usage
create table if not exists ai_audit (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  model text,
  prompt_hash text,
  tokens integer,
  cost_estimate numeric,
  created_at timestamptz default now()
);

create table if not exists usage_ledger (
  user_id text primary key,
  credits_remaining numeric,
  last_updated timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  kind text,
  payload jsonb,
  created_at timestamptz default now()
);

-- Enable Row-Level Security and policies
alter table if exists worksheets enable row level security;
create policy if not exists "worksheets_is_owner" on worksheets
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table if exists timeline_events enable row level security;
create policy if not exists "timeline_is_owner" on timeline_events
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- For ai_audit, restrict write to authenticated users (select might be admin-only)
alter table if exists ai_audit enable row level security;
create policy if not exists "ai_audit_insert_auth" on ai_audit
  for insert
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Note: Admin users should bypass RLS via a Postgres role or service key for server-side tasks.
