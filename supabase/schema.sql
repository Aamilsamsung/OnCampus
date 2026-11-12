-- Run once in Supabase SQL editor. No mock events or users.
create extension if not exists pgcrypto;
create table if not exists public.admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.approved_groups(id uuid primary key default gen_random_uuid(),group_ref text unique not null,label text not null,enabled boolean not null default true,created_at timestamptz not null default now());
create table if not exists public.approved_sources(id uuid primary key default gen_random_uuid(),url text unique not null check(url like 'https://%.pes.edu/%' or url like 'https://pes.edu/%'),enabled boolean not null default true,created_at timestamptz not null default now());
create table if not exists public.events(id uuid primary key default gen_random_uuid(),title text not null,description text,campus text not null check(campus in('Electronic City','Ring Road','Hanumanth Nagar')),category text not null check(category in('Hackathon','Workshop','Competition','Club event','Cultural','Other')),starts_at timestamptz,registration_deadline timestamptz,venue text,registration_url text,source_url text,source_type text not null check(source_type in('pes_official','whatsapp_group')),source_ref text,fingerprint text not null unique,status text not null default 'pending' check(status in('pending','published','rejected','archived')),created_at timestamptz not null default now(),reviewed_at timestamptz);
create index if not exists events_public_idx on public.events(status,starts_at);
alter table public.admins enable row level security;
alter table public.approved_groups enable row level security;
alter table public.approved_sources enable row level security;
alter table public.events enable row level security;
revoke all on public.admins,public.approved_groups,public.approved_sources from anon,authenticated;
grant select on public.events to anon,authenticated;
create policy "Published event reading" on public.events for select to anon,authenticated using(status='published');
-- All privileged operations use the server-side service role after admin verification.

alter table public.events add column if not exists ends_at timestamptz;
