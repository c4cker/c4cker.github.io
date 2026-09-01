-- Migra los nuevos solves a Supabase Auth sin reasignar identidades históricas.
-- Los registros anteriores quedan como legacy: user_id NULL y no se publican
-- en el ranking autenticado.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_nickname text not null check (char_length(public_nickname) between 1 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_public_nickname_lower_uniq
  on public.profiles (lower(public_nickname));

alter table public.profiles enable row level security;
alter table public.challenge_solves add column if not exists user_id uuid references auth.users(id) on delete restrict;
alter table public.challenge_stage_solves add column if not exists user_id uuid references auth.users(id) on delete restrict;
alter table public.challenge_solves alter column visitor_hash drop not null;
alter table public.challenge_stage_solves alter column visitor_hash drop not null;

create unique index if not exists challenge_solves_slug_user_uniq
  on public.challenge_solves (challenge_slug, user_id)
  where user_id is not null;

create unique index if not exists challenge_stage_solves_slug_stage_user_uniq
  on public.challenge_stage_solves (challenge_slug, stage_id, user_id)
  where user_id is not null;

create index if not exists challenge_solves_user_idx
  on public.challenge_solves (user_id)
  where user_id is not null;

create index if not exists challenge_stage_solves_user_idx
  on public.challenge_stage_solves (user_id)
  where user_id is not null;

-- El Worker es la única vía de escritura. El rol público no puede leer perfiles.
grant select, insert, update on public.profiles to service_role;
grant select, insert on public.challenge_solves to service_role;
grant select, insert on public.challenge_stage_solves to service_role;
