export type CommunityResource = { category: string; title: string; source: string; description: string; href: string };

/** `community.local.ts` es local; renombralo a `community.published.ts` al publicarlo. */
const localCatalogs = import.meta.glob("./community.*.ts", { eager: true });
export const communityResources: CommunityResource[] = Object.values(localCatalogs).flatMap((catalog) => {
  const items = (catalog as { communityResources?: CommunityResource[] }).communityResources;
  return Array.isArray(items) ? items : [];
});
