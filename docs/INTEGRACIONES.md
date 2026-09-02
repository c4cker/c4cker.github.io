# Integraciones

## Backend actual: Supabase + Cloudflare Worker

1. Creá el proyecto de Supabase y aplicá las migraciones de `supabase/migrations/` en orden, incluida `007_ranking_rpc.sql`.
2. Si necesitás datos de prueba local, cargá `supabase/seed.local.sql`; está ignorado y no debe ejecutarse en producción.
3. El frontend usa la clave publicable; el Worker usa la service role únicamente en servidor. Nunca publiques la service role ni flags válidas.

## Despliegue: GitHub Pages

GitHub Pages publica un único artefacto: Main en `/`, Labs en `/labs/` y el blog Chirpy en `/blog/`. Las funciones persistentes de Labs —flags y Hall of Fame— pasan por `workers/labs-api.ts`. Pages publica el frontend y los ZIPs; Wrangler despliega el Worker por separado.

El workflow de Pages se ejecuta en cada cambio relevante. No guardes secretos de Cloudflare ni de Supabase en el repositorio.
