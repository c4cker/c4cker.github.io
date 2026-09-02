-- Contrato server-side del ranking. Evita joins implícitos de PostgREST y
-- agrega todos los solves antes de aplicar el límite visible.
create or replace function public.get_ranking(limit_count integer default 100)
returns table (nickname text, points bigint)
language sql
security definer
set search_path = public
stable
as $$
  select p.public_nickname as nickname, count(*)::bigint as points
  from public.challenge_solves s
  join public.profiles p on p.id = s.user_id
  where s.user_id is not null
  group by p.public_nickname
  order by points desc, nickname asc
  limit least(greatest(coalesce(limit_count, 100), 1), 100);
$$;

revoke all on function public.get_ranking(integer) from public, anon, authenticated;
grant execute on function public.get_ranking(integer) to service_role;
