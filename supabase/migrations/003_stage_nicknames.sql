-- Conserva el nickname elegido al resolver la primera etapa de un desafío.
-- Permite no volver a pedirlo mientras el visitante completa staged/multi-staged.
alter table public.challenge_stage_solves
  add column if not exists nickname text
  check (nickname is null or char_length(nickname) between 1 and 32);

create index if not exists challenge_solves_ranking_idx
  on public.challenge_solves (solved_at desc);

create index if not exists challenge_stage_solves_visitor_idx
  on public.challenge_stage_solves (challenge_slug, visitor_hash);
