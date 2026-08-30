export type Laboratory = { id: string; title: string; runtime: string; time: string; description: string; relation: string; versions: string[]; techniques: string[]; attackChain: string[]; scope: string; repoUrl: string };

/** `laboratories.local.ts` es local; renombralo a `laboratories.published.ts` al publicarlo. */
const localCatalogs = import.meta.glob("./laboratories.*.ts", { eager: true });
export const labs: Laboratory[] = Object.values(localCatalogs).flatMap((catalog) => {
  const items = (catalog as { labs?: Laboratory[] }).labs;
  return Array.isArray(items) ? items : [];
});
