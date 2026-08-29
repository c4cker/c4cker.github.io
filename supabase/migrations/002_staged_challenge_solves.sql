-- Migra el esquema legado de Labs sin perder los solves ya registrados.
-- Legado: solves(challenge, solver_hash, nickname, solved_at).
-- Nuevo: challenge_solves(challenge_slug, visitor_hash, nickname, solved_at).
do $$
begin
  if to_regclass('public.solves') is not null then
    if to_regclass('public.challenge_solves') is not null then
      raise exception 'Existen solves y challenge_solves; revisá manualmente antes de migrar.';
    end if;

    alter table public.solves rename to challenge_solves;
  end if;

  if to_regclass('public.challenge_solves') is null then
    raise exception 'No se encontró la tabla de solves para migrar.';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'challenge_solves' and column_name = 'challenge'
  ) then
    alter table public.challenge_solves rename column challenge to challenge_slug;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'challenge_solves' and column_name = 'solver_hash'
  ) then
    alter table public.challenge_solves rename column solver_hash to visitor_hash;
  end if;
end $$;

-- El Hall of Fame se renderiza desde el servidor con service_role: no exponer hashes públicamente.
alter table public.challenge_solves enable row level security;
drop policy if exists "lectura pública" on public.challenge_solves;

-- El progreso por etapa no suma puntos. El ranking permanece en challenge_solves.
create table if not exists public.challenge_stage_solves (
  id bigint generated always as identity primary key,
  challenge_slug text not null check (challenge_slug ~ '^[a-z0-9-]{1,100}$'),
  stage_id text not null check (stage_id ~ '^[a-z0-9_-]{1,100}$'),
  visitor_hash text not null,
  solved_at timestamptz not null default now(),
  unique (challenge_slug, stage_id, visitor_hash)
);

alter table public.challenge_stage_solves enable row level security;
