-- Datos de desarrollo para que el Hall of Fame tenga contenido visual desde el primer deploy.
-- Son hashes sintéticos; no provienen de direcciones IP reales.
insert into public.challenge_solves (challenge_slug, visitor_hash, solved_at) values
  ('hello-local', '4a21a5decc77c8e53a9d7d5f4624c38679110c4198de8e3ae61d7ebfbd9671ea', '2026-08-21T14:20:00Z'),
  ('packet-notes', '7c09e72bfa3ce2fe458d02637f0b52d5d3528163bc880cc4b8cd08e5ebba00bd', '2026-08-22T09:45:00Z'),
  ('header-trace', '2f88d7a9cbdd3207ed44c9ab1579e34c8ddf3b97aebbe4d10d673394a88e901d', '2026-08-24T18:05:00Z')
on conflict (challenge_slug, visitor_hash) do nothing;
