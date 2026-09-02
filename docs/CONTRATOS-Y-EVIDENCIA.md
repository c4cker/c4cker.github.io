# Matriz de contratos y evidencia

Esta matriz es el checklist operativo del monorepo. Un estado `confirmado` solo se marca después de ejecutar la prueba indicada; `hipótesis` identifica un riesgo que todavía requiere evidencia.

| Área | Contrato | Evidencia / ubicación | Estado inicial | Prueba y criterio de aceptación | Responsable / rollback |
| --- | --- | --- | --- | --- | --- |
| Build | Main, Labs y Blog generan artefactos publicables | `package.json`, `.github/workflows/pages.yml` | confirmado parcial | `npm run check:all` y `npm run build:all` terminan en cero; cada salida existe | Mantenimiento / revertir el cambio del workflow |
| Rutas | Labs funciona bajo `/labs/` con y sin JavaScript | `apps/labs/src/layouts/LabsLayout.astro`, páginas Astro | hipótesis | Inspeccionar HTML generado y abrir enlaces internos sin JS; todos conservan `/labs/` | Frontend / revertir el cambio de rutas |
| Catálogo | Cada recurso tiene panel válido, HTTPS y ficha completa | `apps/labs/src/data/community*.ts`, `scripts/check-community.mjs` | confirmado parcial | `npm run community:check`; ningún recurso apunta a una categoría inexistente | Editorial / restaurar el catálogo anterior |
| Desafíos | Cada desafío publicado tiene ZIP descargable y etapas coincidentes | `apps/labs/src/data/challenges.published.ts`, `challenges-sources/` | confirmado parcial | Check de catálogo: un ZIP por slug, no vacío, y cada etapa aparece en el contrato | Labs / retirar el desafío del catálogo |
| Worker | El Worker acepta solo desafíos publicados y valida el formato de flags | `workers/labs-api.ts`, `challenges.published.ts` | confirmado parcial | `npm run worker:check` y `wrangler deploy --dry-run`; flags inválidas no insertan solves | Backend / despliegue anterior |
| Auth | Solo una sesión GitHub válida puede crear perfil o solve | `workers/labs-api.ts`, `supabase/migrations/004*` | prueba necesaria | Prueba E2E: sin token → 401; token inválido → 401; usuario válido → operación autorizada | Backend / revocar despliegue |
| Supabase/RLS | Cliente público no lee ni escribe tablas de ranking | `supabase/migrations/004–006` | confirmado por SQL, falta E2E | Verificar grants/RLS en Supabase y probar roles `anon`/`authenticated` | Backend / revertir migración solo con plan explícito |
| Solves | Un desafío suma una sola vez y staged respeta orden | `workers/labs-api.ts`, `challenges.published.ts` | prueba necesaria | E2E single, staged fuera de orden, staged completo y multi-staged; reintentos son idempotentes | Backend / eliminar solo datos de prueba |
| Ranking | Agrupa solves autenticados por nickname sin truncar resultados | `workers/labs-api.ts`, `supabase/migrations/007*` | hipótesis | Crear >1000 solves sintéticos y verificar ranking completo y ordenado | Backend / deshabilitar RPC nueva |
| Rate limit | Perfil y flags quedan limitados a 15 intentos por ventana | `workers/labs-api.ts`, `wrangler.jsonc` | confirmado en código | E2E: intento 16 → 429; ventana nueva vuelve a permitir; binding ausente → 503 | Infra / rollback del Worker |
| Deploy | Pages publica `/`, `/labs/`, `/blog/` y ZIPs | `.github/workflows/pages.yml` | confirmado por workflow, falta E2E | Verificar HTTP 200 de rutas y ZIPs tras deploy; workflow se dispara por cada área | Infra / redeploy del commit anterior |
| Operación | Errores de Supabase y despliegues son observables | Worker, GitHub Actions, Cloudflare | prueba necesaria | Registrar métricas/errores sin secretos; health responde y el pipeline conserva logs útiles | Infra / apagar solo la señal nueva |
| Redacción | Términos, paneles y estados editoriales usan vocabulario consistente | `README.md`, `docs/`, `apps/labs/src/data/community*` | confirmado parcial | Revisión editorial: sin referencias a backend “futuro”, rutas antiguas ni categorías mezcladas | Mantenimiento / revertir edición documental |

## Secuencia de validación

1. Ejecutar `npm run check:all` y `npm run build:all`.
2. Ejecutar `npm run community:check` y `npm run worker:check`.
3. Aplicar las migraciones pendientes en un proyecto Supabase de prueba.
4. Ejecutar las pruebas E2E con una cuenta y flags de prueba; nunca usar flags reales en logs.
5. Verificar el artefacto desplegado, rutas bajo `/labs/` y descargas.

La matriz debe actualizarse cuando cambien contratos, migraciones o workflows. No contiene credenciales, tokens ni flags válidas.
