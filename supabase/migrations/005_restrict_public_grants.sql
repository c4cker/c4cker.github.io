-- Defensa adicional: el Worker usa service_role como única vía de acceso.
-- Las políticas RLS siguen activas y estas revocaciones evitan accesos directos
-- accidentales desde los roles públicos de Supabase.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.challenge_solves from anon, authenticated;
revoke all on table public.challenge_stage_solves from anon, authenticated;
