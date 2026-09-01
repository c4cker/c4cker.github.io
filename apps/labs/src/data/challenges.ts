export type FlagMode = "single" | "staged" | "multi-staged";
export type ChallengeStage = {
  id: string;
  title: string;
  objective: string;
};
export type ChallengeResource = {
  title: string;
  href: string;
  source: string;
};
export type Challenge = {
  id: string;
  slug: string;
  format: "docker" | "html";
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  delivery: string;
  artifact: string;
  protection: string;
  downloadUrl: string;
  description: string;
  objective: string;
  practiceHint: string;
  resources: ChallengeResource[];
  flagMode: FlagMode;
  stages: ChallengeStage[];
};

/**
 * FLAGS_JSON mantiene las flags fuera del catálogo público:
 * { "slug-single": "C4CKER{32caracteresalfanumericos...}", "slug-staged": { "recon": "C4CKER{32caracteresalfanumericos...}", "final": "C4CKER{32caracteresalfanumericos...}" } }
 */

/** El catálogo publicado no contiene flags; estas permanecen únicamente en FLAGS_JSON. */
const localCatalogs = import.meta.glob("./challenges.*.ts", { eager: true });
export const challenges: Challenge[] = Object.values(localCatalogs).flatMap((catalog) => {
  const items = (catalog as { challenges?: Challenge[] }).challenges;
  return Array.isArray(items) ? items : [];
});
