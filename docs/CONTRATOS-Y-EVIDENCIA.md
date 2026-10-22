# Matriz de contratos y evidencia

Esta matriz es el checklist operativo del monorepo. Un estado `confirmado` solo se marca después de ejecutar la prueba indicada; `hipótesis` identifica un riesgo que todavía requiere evidencia.

| Área | Contrato | Evidencia / ubicación | Estado inicial | Prueba y criterio de aceptación | Responsable / rollback |
| --- | --- | --- | --- | --- | --- |
| Build | Main, Labs y Blog generan artefactos publicables | `package.json`, `.github/workflows/pages.yml` | confirmado parcial | `npm run check:all` y `npm run build:all` terminan en cero; cada salida existe | Mantenimiento / revertir el cambio del workflow |
| Rutas | Labs funciona bajo `/labs/` con y sin JavaScript | `apps/labs/src/layouts/LabsLayout.astro`, páginas Astro | hipótesis | Inspeccionar HTML generado y abrir enlaces internos sin JS; todos conservan `/labs/` | Frontend / revertir el cambio de rutas |
| Catálogo | Cada recurso tiene panel válido, HTTPS y ficha completa | `apps/labs/src/data/community*.ts`, `scripts/check-community.mjs` | confirmado parcial | `npm run community:check`; ningún recurso apunta a una categoría inexistente | Editorial / restaurar el catálogo anterior |
| Desafíos | Cada desafío publicado tiene ZIP descargable y etapas coincidentes | `apps/labs/src/data/challenges.published.ts`, `challenges-sources/` | confirmado parcial | Check de catálogo: un ZIP por slug, no vacío, y cada etapa aparece en el contrato | Labs / retirar el desafío del catálogo |
| Deploy | Pages publica `/`, `/labs/`, `/blog/` y ZIPs | `.github/workflows/pages.yml` | confirmado por workflow, falta E2E | Verificar HTTP 200 de rutas y ZIPs tras deploy; workflow se dispara por cada área | Infra / redeploy del commit anterior |
| Redacción | Términos, paneles y estados editoriales usan vocabulario consistente | `README.md`, `docs/`, `apps/labs/src/data/community*` | confirmado parcial | Revisión editorial: sin referencias a backend “futuro”, rutas antiguas ni categorías mezcladas | Mantenimiento / revertir edición documental |

## Secuencia de validación

1. Ejecutar `npm run check:all` y `npm run build:all`.
2. Ejecutar `npm run community:check`.
3. Verificar el artefacto desplegado, rutas bajo `/labs/` y descargas.

La matriz debe actualizarse cuando cambien contratos o workflows. No contiene credenciales, tokens ni flags válidas.
