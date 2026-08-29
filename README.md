# c4cker.com

Tres aplicaciones separadas, con componentes y contenido ordenados para editarlos a mano:

- `apps/main`: portfolio, proyectos, writeups, contacto y legales.
- `apps/labs`: desafíos, laboratorios, Hall of Fame, comunidad y sus API routes.
- `apps/blog`: blog Jekyll independiente.
- `packages/shared`: identidad visual y componentes reutilizados por Main y Labs.

## Publicación prevista

La publicación es un único sitio estático en GitHub Pages: Main en `/`, Labs en `/labs/` y el blog Jekyll en `/blog/`. Cloudflare se usará sólo como proxy de un dominio propio, para DNS, SSL y seguridad perimetral.

## Desarrollo local del sitio principal

Requiere Node.js 20.19 o superior.

```powershell
npm.cmd install
npm.cmd run dev
```

El comando inicia Main en `http://localhost:4321`, el blog en `http://127.0.0.1:4000` y Labs en `http://labs.localhost:4322`. Para levantar sólo uno usá `npm.cmd run dev:main`, `npm.cmd run dev:blog` o `npm.cmd run dev:labs`. El envío de flags no se activa hasta crear `apps/labs/.dev.vars` desde su `.dev.vars.example`; ese archivo está ignorado.

El script del blog apunta a la instalación estándar que usás: `C:\Ruby34-x64`. Si en el futuro instalás Ruby en otra ruta, actualizá `dev` y `dev:blog` en `package.json`.

## Formulario de contacto

Creá el formulario en Google Forms con nombre, correo de respuesta y mensaje. En **Respuestas** activá las notificaciones por correo para respuestas nuevas; así cada envío llega a tu cuenta. Después, en **Enviar → Insertar HTML**, copiá la URL del `iframe` y usala como variable pública de compilación:

```
PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/TU_ID/viewform?embedded=true
```

La URL de inserción es pública y no es un secreto. No guardes credenciales de Google, tokens ni claves en el repositorio. El formulario queda oculto hasta que esa variable exista.

```powershell
Copy-Item apps/labs/.dev.vars.example apps/labs/.dev.vars
```

No subas `.dev.vars` ni claves de Supabase.

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
- El backend futuro debe validar flags y calcular el HMAC de la IP con secretos del servidor antes de usar Supabase.
- La IP original no se guarda; comunicá el tratamiento en la política de privacidad y respetá la normativa aplicable.
- Los retos descargables deben ejecutarse localmente y en entornos aislados.
