# c4cker.github.io

Tres aplicaciones separadas, con componentes y contenido ordenados para editarlos a mano:

- `apps/main`: portfolio, proyectos, writeups, contacto y legales.
- `apps/blog`: blog Jekyll independiente.
- `packages/shared`: identidad visual y componentes reutilizados por Main y Labs.

## Publicación y servicios

El proyecto Pages activo es `c4cker-github-io`, conectado al repositorio `c4cker/c4cker.github.io`. El Worker activo es `c4cker-labs-api` y atiende el envío de flags y el ranking en `https://c4cker-labs-api.lucianomps2015.workers.dev`.

Cloudflare Pages publica el frontend desde GitHub; el Worker se despliega por separado con Wrangler. Cloudflare también proporciona el Durable Object `RATE_LIMITER`, usado para limitar intentos del endpoint de flags. En el plan Free, su migración debe declararse como `new_sqlite_classes` en [wrangler.jsonc](wrangler.jsonc).

El repositorio solo referencia ese proyecto Pages y ese Worker. No borres ninguno sin actualizar primero las URLs y la configuración de despliegue.

La cuenta actual no tiene una zona DNS en Cloudflare, por lo que no se pueden aplicar reglas WAF de zona ni Bot Fight Mode sobre un dominio propio. La protección efectiva está en el Worker: Durable Object para rate limiting, validación de origen y método, JSON obligatorio, límite de payload, validación de entrada y respuestas con `nosniff` y `no-referrer`.

## Desarrollo local del sitio principal

Requiere Node.js 20.19 o superior.

```powershell
npm.cmd install
npm.cmd run dev
```

El comando inicia Main en `http://localhost:4321`, Labs en `http://labs.localhost:4322` y el blog en `http://127.0.0.1:4000`. Para levantar sólo uno usá `npm.cmd run dev:main`, `npm.cmd run dev:labs` o `npm.cmd run dev:blog`.

El script del blog apunta a la instalación estándar que usás: `C:\Ruby34-x64`. Si en el futuro instalás Ruby en otra ruta, actualizá `dev` y `dev:blog` en `package.json`.

## Contenido local antes de publicar

El sitio público no trae contenido de muestra. Para previsualizar una entrada antes de subirla, usá los mocks locales —todos están ignorados por Git— y reemplazá sus datos por los tuyos:

- `apps/main/src/data/projects.local.ts`
- `apps/main/src/content/writeups/writeup-local.local.md`

Cuando esté listo para publicar, renombrá los catálogos a `*.published.ts` y agregalos a Git. Para un writeup, quitale `.local` al nombre del Markdown. Así se incluye en el deploy; los mocks nunca se suben.

## Formulario de contacto

Creá el formulario en Google Forms con nombre, correo de respuesta y mensaje. En **Respuestas** activá las notificaciones por correo para respuestas nuevas; así cada envío llega a tu cuenta. Después, en **Enviar → Insertar HTML**, copiá la URL del `iframe` y usala como variable pública de compilación:

```
PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/TU_ID/viewform?embedded=true
```

La URL de inserción es pública y no es un secreto. No guardes credenciales de Google, tokens ni claves en el repositorio. El formulario queda oculto hasta que esa variable exista.

No subas archivos `.local`, `.dev.vars` ni claves de Supabase.

## Labs, flags y Supabase

Labs usa Supabase Auth con GitHub OAuth para identificar a cada participante. El Worker valida el JWT, guarda el `user_id` y relaciona el solve con un perfil público que contiene únicamente el nickname elegido. La IP puede usarse de forma efímera para rate limiting, pero no se guarda ni se convierte en identidad. Las flags deben tener el formato `C4CKER{...}` con exactamente 32 caracteres alfanuméricos dentro de las llaves. `SUPABASE_SERVICE_ROLE_KEY` y `FLAGS_JSON` son variables privadas del Worker; `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` no son secretos.

Para desplegar el Worker manualmente desde la raíz:

```powershell
npx wrangler deploy --config wrangler.jsonc
```

Comprobá el servicio sin enviar una flag:

```powershell
curl.exe https://c4cker-labs-api.lucianomps2015.workers.dev/health
```

Las migraciones de `supabase/migrations/` son acumulativas e históricas. No se deben borrar después de aplicarlas. Para una prueba controlada, usá una cuenta de prueba y una flag temporal fuera del repositorio; después eliminá solo el solve de prueba desde el SQL Editor:

```sql
DELETE FROM public.challenge_solves
WHERE challenge_slug = 'header-trace'
  AND user_id = 'UUID-DE-LA-CUENTA-DE-PRUEBA';
```

La API de producción no tiene permiso `DELETE` sobre esa tabla por diseño. No amplíes ese permiso solo para limpiar pruebas.

La migración `006_remove_legacy_solves.sql` elimina los solves anónimos anteriores y las columnas `visitor_hash` y `nickname` legacy. Los solves autenticados se conservan; quienes habían participado con el esquema anterior deben volver a enviar sus flags con GitHub.

El Worker también se publica automáticamente con [deploy-worker.yml](.github/workflows/deploy-worker.yml) cuando cambia su código o el catálogo de desafíos. El job usa el entorno protegido `cloudflare-production`, que debe tener como revisores requeridos a `c4cker`, y necesita los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` configurados en ese entorno.

## Desarrollo del blog

```powershell
cd apps/blog
bundle install
bundle exec jekyll serve --livereload
```

Abrí `http://127.0.0.1:4000`.

## Seguridad

La política y lista de salida para cambios relevantes está en [SECURITY.md](SECURITY.md). Ejecutá `npm.cmd run security:audit` antes de desplegar y habilitá Secret Scanning, Push Protection y Dependabot en GitHub.

- No hay credenciales, flags válidas ni claves de servicio en el repositorio.
- Los solves usan `user_id` y perfiles públicos separados; los solves anónimos anteriores se eliminan mediante la migración de contracción 006 y deben volver a registrarse.
- La IP original no se guarda; comunicá el tratamiento en la política de privacidad y respetá la normativa aplicable.
- Los retos descargables deben ejecutarse localmente y en entornos aislados.
- CodeQL está activo mediante la configuración predeterminada de GitHub y `npm audit` corre automáticamente en GitHub Actions. Las acciones externas del repositorio están fijadas a commits concretos.
