# Integraciones

## Despliegue: Cloudflare Workers

1. En el repositorio, creá los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
2. Creá la variable de Actions `CLOUDFLARE_DEPLOY_ENABLED` con valor `true`.
3. El workflow `Publicar main y labs` despliega tres Workers: `c4cker-main`, `c4cker-labs` y `c4cker-blog`.
4. En Cloudflare, cargá en cada Worker las variables que correspondan. Main/Labs usan `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FLAG_HMAC_SECRET`, `FLAGS_JSON` y `PUBLIC_GOOGLE_FORM_URL` cuando aplique; el blog no necesita secretos.
5. Asigná los dominios finales desde Cloudflare cuando controles DNS. Hasta entonces, usá las URLs `workers.dev` que entrega Wrangler.
6. Antes de habilitar flags públicas, agregá una regla de Rate Limiting de Cloudflare para `POST /api/submit-flag` y revisá los headers de `apps/main/public/_headers` y `apps/labs/public/_headers`.

## Supabase

1. Creá un proyecto y corré `supabase/migrations/001_initial.sql` en el SQL Editor.
2. Para poblar la interfaz de desarrollo, corré también `supabase/seed.sql`. Solo inserta hashes sintéticos, no IPs.
3. La tabla mantiene RLS activa; el Worker es el único que usa la service role para insertar solves.
4. El endpoint de flags es `/api/submit-flag`; Cloudflare entrega la IP en `CF-Connecting-IP` y el Worker persiste solo su HMAC.

## Variables GitHub

El workflow usa los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Nunca los incluyas en archivos `.env`, `.dev.vars` ni en el repositorio. El token debe limitarse a permisos de edición de Workers para la cuenta correspondiente.
