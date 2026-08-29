export type Project = { slug: string; title: string; status: string; kind: string; stack: string; description: string; detail: string; objective: string; repoUrl: string };

/**
 * El catálogo público empieza vacío. Para trabajar en local, agregá
 * `projects.local.ts` con `export const projects: Project[] = [...]`.
 * Para publicar, renombralo a `projects.published.ts` y agregalo a Git.
 */
const localCatalogs = import.meta.glob("./projects.*.ts", { eager: true });
export const projects: Project[] = Object.values(localCatalogs).flatMap((catalog) => {
  const items = (catalog as { projects?: Project[] }).projects;
  return Array.isArray(items) ? items : [];
});
