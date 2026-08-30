-- Conserva el nickname elegido al resolver la primera etapa de un desafío.
-- Permite no volver a pedirlo mientras el visitante completa staged/multi-staged.
alter table public.challenge_stage_solves
  add column if not exists nickname text
  check (nickname is null or char_length(nickname) between 1 and 32);

create index if not exists challenge_solves_ranking_idx
  on public.challenge_solves (solved_at desc);

-- Migration 002's rename path does not carry the UNIQUE constraint from 001's CREATE TABLE IF NOT EXISTS.
create unique index if not exists challenge_solves_slug_visitor_uniq
  on public.challenge_solves (challenge_slug, visitor_hash);

create index if not exists challenge_stage_solves_visitor_idx
  on public.challenge_stage_solves (challenge_slug, visitor_hash);

-- El Worker usa service_role y RLS permanece activo para cualquier cliente público.
grant usage, select on all sequences in schema public to service_role;
grant select, insert on public.challenge_solves to service_role;
grant select, insert on public.challenge_stage_solves to service_role;
