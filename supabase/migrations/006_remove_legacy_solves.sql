-- Contracción autorizada del esquema anterior.
-- Los solves sin user_id son datos legacy y se eliminan porque deben volver a
-- registrarse con Supabase Auth. La operación es intencional y no afecta solves
-- autenticados.
delete from public.challenge_stage_solves where user_id is null;
delete from public.challenge_solves where user_id is null;

drop index if exists public.challenge_solves_slug_visitor_uniq;
drop index if exists public.challenge_stage_solves_visitor_idx;

alter table public.challenge_solves
  drop column if exists visitor_hash,
  drop column if exists nickname;

alter table public.challenge_stage_solves
  drop column if exists visitor_hash,
  drop column if exists nickname;
