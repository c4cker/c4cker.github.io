# Integraciones

## c4cker.com: Cloudflare

1. Creá un proyecto Cloudflare Workers/Pages conectado a este repositorio.
2. Usá `npm run build` como comando de build y `dist` como directorio de salida.
3. Asigná únicamente el dominio personalizado `c4cker.com`. No crees ni redirijas `www.c4cker.com`.
4. En **Settings → Variables and Secrets** cargá como secretos: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FLAG_HMAC_SECRET` (aleatorio, 32 bytes o más) y `FLAGS_JSON`.
5. Dejá los secretos solo en Cloudflare; nunca en GitHub, `.env` versionados o JavaScript público.
6. Antes de habilitar flags públicas, agregá una regla de Rate Limiting de Cloudflare para `POST /api/submit-flag` y revisá los headers de `apps/site/public/_headers` con tu dominio final.

## blog.c4cker.com: GitHub Pages

1. En GitHub, activá Pages con **GitHub Actions**. El workflow construye `apps/blog`.
2. Configurá `blog.c4cker.com` como dominio personalizado en Pages.
3. En Cloudflare DNS, creá el registro que GitHub Pages indique para `blog`. Empezá con proxy desactivado y habilitá HTTPS en GitHub cuando propague.

## Supabase

1. Creá un proyecto y corré `supabase/migrations/001_initial.sql` en el SQL Editor.
2. Para poblar la interfaz de desarrollo, corré también `supabase/seed.sql`. Solo inserta hashes sintéticos, no IPs.
3. La tabla mantiene RLS activa; el Worker es el único que usa la service role para insertar solves.
4. El endpoint de flags es `/api/submit-flag`; Cloudflare entrega la IP en `CF-Connecting-IP` y el Worker persiste solo su HMAC.

## Variables GitHub

No se necesitan secretos de GitHub en esta versión. GitHub Pages solo publica el blog estático.
