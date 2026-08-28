# c4cker.com

Tres aplicaciones separadas, con componentes y contenido ordenados para editarlos a mano:

- `apps/main`: portfolio, proyectos, writeups, contacto y legales.
- `apps/labs`: desafíos, laboratorios, Hall of Fame, comunidad y sus API routes.
- `apps/blog`: blog Jekyll independiente.
- `packages/shared`: identidad visual y componentes reutilizados por Main y Labs.

## Subdominios

- `c4cker.com`: perfil, portfolio, proyectos y writeups.
- `blog.c4cker.com`: blog Jekyll en GitHub Pages.
- `labs.c4cker.com`: desafíos, laboratorios, Hall of Fame y comunidad.

Main y Labs ya compilan como destinos separados. En Cloudflare podés desplegarlos como Workers/proyectos distintos, cada uno con su Custom Domain, o mantener el mismo repositorio con dos comandos de build: `npm.cmd run build:main` y `npm.cmd run build:labs`.

## Desarrollo local del sitio principal

Requiere Node.js 20.19 o superior.

```powershell
npm.cmd install
npm.cmd run dev
```

El comando inicia Main en `http://localhost:4321`, el blog en `http://127.0.0.1:4000` y Labs en `http://labs.localhost:4322`. Para levantar sólo uno usá `npm.cmd run dev:main`, `npm.cmd run dev:blog` o `npm.cmd run dev:labs`. El envío de flags no se activa hasta crear `apps/labs/.dev.vars` desde su `.dev.vars.example`; ese archivo está ignorado.

El script del blog apunta a la instalación estándar que usás: `C:\Ruby34-x64`. Si en el futuro instalás Ruby en otra ruta, actualizá `dev` y `dev:blog` en `package.json`.

## Formulario de contacto

Creá el formulario en Google Forms con nombre, correo de respuesta y mensaje. En **Respuestas** activá las notificaciones por correo para respuestas nuevas; así cada envío llega a tu cuenta. Después, en **Enviar → Insertar HTML**, copiá la URL del `iframe` y guardala como variable de compilación de Cloudflare:

```
PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/TU_ID/viewform?embedded=true
```

La URL de inserción es pública y no es un secreto. No guardes credenciales de Google, tokens ni claves en el repositorio. El formulario queda oculto hasta que esa variable exista.

```powershell
Copy-Item apps/labs/.dev.vars.example apps/labs/.dev.vars
npx wrangler dev
```

`wrangler dev` emula Cloudflare para probar el endpoint de flags localmente. No subas `.dev.vars` ni claves de Supabase.

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
- El Worker de Cloudflare valida flags y calcula el HMAC de la IP con secretos del servidor antes de usar Supabase.
- La IP original no se guarda; comunicá el tratamiento en la política de privacidad y respetá la normativa aplicable.
- Los retos descargables deben ejecutarse localmente y en entornos aislados.
# c4cker · portfolio y labs

Portfolio personal de Luciano Plaza Silva: Main corre con Astro + Tailwind, Labs expone desafíos, laboratorios, Hall of Fame y comunidad, y el blog se mantiene como un sitio Jekyll independiente.

## Rutas y desarrollo

En producción se usan `c4cker.com`, `labs.c4cker.com` y `blog.c4cker.com`. En local, `npm.cmd run dev` levanta Main en `http://localhost:4321`, Labs en `http://labs.localhost:4322` y el blog en `http://127.0.0.1:4000`. Para una sola aplicación: `npm.cmd run dev:site`, `npm.cmd run dev:labs` o `npm.cmd run dev:blog`.

```powershell
npm.cmd install
npm.cmd run dev
```

El blog requiere Ruby/Bundler y se ejecuta desde `apps/blog`. El formulario de contacto y el envío de flags necesitan variables locales de Cloudflare/Supabase; los ejemplos se encuentran en `apps/site/.dev.vars.example` y nunca deben reemplazarse por valores reales dentro del repositorio.

## Qué sí se versiona

Código fuente de `apps/main/src`, `apps/labs/src` y `apps/blog`; contenido Markdown, catálogos en `src/data`, componentes compartidos, migraciones/seed públicas de Supabase, configuración de despliegue sin secretos y assets públicos necesarios para cada sitio.

## Qué no se debe subir

No versionar `.env`, `.dev.vars`, credenciales, tokens, certificados, dumps de base de datos, archivos de configuración local, builds generados, cachés, logs ni carpetas de dependencias. El `.gitignore` ya cubre estos casos. Antes de publicar, revisar `git status`, ejecutar `npm.cmd run security:audit` y comprobar que no haya secretos en el diff.

Las claves de Supabase/Cloudflare deben configurarse en GitHub Actions o en el panel del proveedor. Sólo las claves públicas destinadas al navegador pueden usar el prefijo `PUBLIC_`; cualquier secreto permanece del lado del servidor.
