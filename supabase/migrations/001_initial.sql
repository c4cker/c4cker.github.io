-- Ejecutar en el SQL Editor de Supabase. No agrega IPs ni flags en texto plano.
create table if not exists public.challenge_solves (
  id bigint generated always as identity primary key,
  challenge_slug text not null check (challenge_slug ~ '^[a-z0-9-]{1,100}$'),
  visitor_hash text not null,
  nickname text check (nickname is null or char_length(nickname) between 1 and 32),
  solved_at timestamptz not null default now(),
  unique (challenge_slug, visitor_hash)
);

alter table public.challenge_solves enable row level security;
alter table public.challenge_solves add column if not exists nickname text check (nickname is null or char_length(nickname) between 1 and 32);
-- Sin políticas de lectura/escritura pública: solo la Edge Function con service role inserta.
