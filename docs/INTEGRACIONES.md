# Integraciones

## Próximo backend: Supabase

1. Creá un proyecto de Supabase y ejecutá `supabase/migrations/001_initial.sql`.
2. Cargá `supabase/seed.sql` sólo para datos de demostración.
3. Cuando se migren las APIs de Labs, usá claves públicas en el cliente y políticas RLS; nunca publiques la service role ni flags válidas.

## Despliegue previsto: GitHub Pages

GitHub Pages publica un único artefacto: Main en `/`, Labs en `/labs/` y el blog Chirpy en `/blog/`. Las funciones persistentes de Labs —flags y Hall of Fame— se habilitan cuando Supabase esté configurado.

El workflow de Pages se ejecuta en cada cambio relevante. No guardes secretos de Cloudflare ni de Supabase en el repositorio.
