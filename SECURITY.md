# Seguridad de c4cker

Esta lista es una condición de salida para cambios medianos/grandes, nuevos endpoints, integraciones externas, formularios, cargas de archivos y contenido generado por usuarios. Si un punto no aplica, la revisión debe indicar por qué.

## Lista de verificación

1. No exponer claves API, tokens, flags, credenciales ni archivos `.env`.
2. Revisar que Git no incluya secretos actuales o históricos; usar el escaneo de secretos de GitHub y rotar cualquier valor expuesto.
3. Usar únicamente la clave pública/anon de Supabase en el cliente. La clave `service_role` queda solo en secretos del servidor.
4. Activar y probar RLS en cada tabla de Supabase antes de exponerla.
5. Cifrar datos sensibles en reposo cuando se almacenen; minimizar los datos antes de cifrar.
6. Aplicar autenticación y autorización del lado del servidor para toda acción protegida.
7. Restringir por política quién puede leer, crear, actualizar o borrar cada registro.
8. Derivar en el servidor los campos sensibles (autor, rol, identidad, puntuación); nunca confiar en los valores enviados por el navegador.
9. Proteger cookies de sesión con `Secure`, `HttpOnly`, `SameSite` y caducidad apropiada.
10. Hashear contraseñas con un algoritmo adaptativo gestionado por el proveedor de autenticación; nunca guardarlas ni registrarlas en texto plano.
11. Limitar intentos de inicio de sesión y recuperación de cuenta.
12. Aplicar protección contra bots y límites por IP/identidad a formularios y APIs expuestas.
13. Medir consultas y errores de base de datos sin registrar secretos ni datos personales innecesarios.
14. Validar y normalizar todas las entradas en el servidor, con límites de tamaño y formato.
15. Escapar o sanitizar contenido proporcionado por usuarios antes de renderizarlo.
16. Restringir cargas de archivo por tipo real, tamaño, cantidad, almacenamiento aislado y autorización.
17. Limitar respuestas de API: paginación, campos mínimos, límites de tamaño y mensajes de error no reveladores.
18. Mantener encabezados de seguridad, CSP, protección anti-iframe y políticas de referencias.
19. Forzar HTTPS en producción y no mezclar contenido HTTP.
20. Escanear dependencias antes de publicar y revisar alertas de Dependabot/GitHub.

## Comandos

```powershell
npm.cmd run check
npm.cmd run security:audit
```

`security:audit` falla ante vulnerabilidades de severidad alta o crítica de dependencias de producción. El análisis completo no sustituye una revisión de autorización, RLS, entradas y exposición de datos.

## Despliegue de Labs

El frontend se publica mediante el proyecto Pages `c4cker-github-io`. La API se publica por separado como Worker `c4cker-labs-api`:

```powershell
npx wrangler deploy --config wrangler.jsonc
```

El Worker usa el Durable Object `RATE_LIMITER`. Para cuentas Cloudflare Free, la migración de `RateLimiter` debe usar `new_sqlite_classes`; cambiarla a `new_classes` hace fallar el despliegue.

La cuenta no tiene una zona DNS administrada por Cloudflare, así que no hay reglas WAF de zona ni Bot Fight Mode aplicables al dominio actual. El Worker funciona como primera barrera: limita intentos, restringe orígenes y métodos, exige JSON, limita el cuerpo y añade headers defensivos. Si se incorpora un dominio a Cloudflare, se debe agregar un WAF Managed Ruleset y una regla de rate limiting específica para `/submit-flag` sin retirar estas validaciones.

Las migraciones de `supabase/migrations/` deben conservarse en orden. La tabla `challenge_solves` concede al rol del Worker solo lectura e inserción; no se concede borrado desde la API. Los datos creados por pruebas deben limpiarse manualmente desde el SQL Editor con un identificador específico, nunca con un borrado amplio.

## Reglas concretas para este repositorio

- `.dev.vars`, `.env*` y claves privadas están ignorados; los valores de producción viven en Cloudflare/GitHub Secrets & Variables.
- El endpoint de flags solo debe usar secretos desde bindings del Worker y debe almacenar el identificador HMAC, no la IP original.
- Un laboratorio descargable no incluye una flag válida, credenciales, tokens ni servicios expuestos fuera del entorno aislado.
- Los writeups publicados no incluyen información de terceros, secretos ni instrucciones fuera de un entorno autorizado.
- Antes de conectar Supabase: crear RLS, políticas por operación, pruebas con el rol `anon` y una revisión de la respuesta mínima necesaria.

## Antes de desplegar

Revisar el diff, ejecutar los comandos anteriores, verificar cabeceras en producción y confirmar que GitHub Secret Scanning, Push Protection, Dependabot alerts y Dependabot security updates estén habilitados para el repositorio público.
