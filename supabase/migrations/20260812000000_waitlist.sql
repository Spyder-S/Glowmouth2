-- GlowMouth waitlist.
--
-- Writes arrive through the waitlist-join Edge Function, which uses the service
-- role key and therefore bypasses RLS. The policies below still matter: they are
-- what keeps the table safe if a client ever talks to PostgREST directly.

create extension if not exists "citext";
create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       citext      not null unique,
  first_name  text,
  created_at  timestamptz not null default now(),
  source      text        not null default 'website',
  status      text        not null default 'waitlist',

  constraint waitlist_email_length check (char_length(email::text) between 3 and 254),
  constraint waitlist_email_shape  check (email::text ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint waitlist_first_name_length check (first_name is null or char_length(first_name) <= 80),
  constraint waitlist_status_allowed check (status in ('waitlist', 'invited', 'converted', 'unsubscribed'))
);

comment on table public.waitlist is
  'Pre-launch signups. Not readable by anon or authenticated roles.';

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

-- Anonymous visitors may add themselves, and nothing else.
drop policy if exists "anon may join the waitlist" on public.waitlist;
create policy "anon may join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (
    source = 'website'
    and status = 'waitlist'
  );

-- No select, update or delete policy exists for anon or authenticated, so none
-- of those operations are permitted for them. Stated explicitly so a future
-- reader does not assume it was an oversight.

-- Belt and braces: remove the underlying grants as well, so the list cannot be
-- read even if a permissive policy is added by mistake later.
revoke select, update, delete on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon;
