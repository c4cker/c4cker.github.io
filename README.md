# c4cker.github.io

Sitio 100 % estático, publicado con GitHub Pages:

- `apps/main`: portfolio, proyectos, writeups, contacto y legales → `https://c4cker.com/`
- `apps/labs`: desafíos descargables, laboratorios y comunidad → `https://c4cker.com/labs/`
- `apps/blog`: blog Jekyll → `https://c4cker.com/blog/`
- `packages/shared`: identidad visual y componentes reutilizados por Main y Labs.

## Publicación

[pages.yml](.github/workflows/pages.yml) compila las tres apps en un único artefacto y lo publica en GitHub Pages en cada push a `main`. No hay backend, base de datos ni login: los desafíos se descargan y se resuelven localmente, sin envío ni validación de flags.

## Desarrollo local del sitio principal

Requiere Node.js 24 LTS (cualquier versión 24.x). La versión de referencia del proyecto está en `.nvmrc`.

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

No subas archivos `.local` ni `.env`.

Antes de abrir un PR ejecutá `npm.cmd run check:all`; para reproducir los builds de Pages ejecutá `npm.cmd run build:all`.

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
- Los retos descargables deben ejecutarse localmente y en entornos aislados.
- CodeQL está activo mediante la configuración predeterminada de GitHub y `npm audit` corre automáticamente en GitHub Actions. Las acciones externas del repositorio están fijadas a commits concretos.
