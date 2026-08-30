export type CommunityResource = {
  category: string;
  title: string;
  source: string;
  description: string;
  href: string;
  topics: string[];
  level: "Inicial" | "Intermedio" | "Avanzado" | "Mixto";
  format: string;
  language: string;
  access: string;
};

export type CommunityPanel = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  categories: string[];
};

/** El mock local solo funciona como fallback cuando todavía no hay catálogo publicado. */
const publishedCatalogs = import.meta.glob("./community.published.ts", { eager: true });
const localCatalogs = import.meta.glob("./community.local.ts", { eager: true });
const catalogs = Object.keys(publishedCatalogs).length > 0 ? publishedCatalogs : localCatalogs;

export const communityResources: CommunityResource[] = Object.values(catalogs).flatMap((catalog) => {
  const items = (catalog as { communityResources?: CommunityResource[] }).communityResources;
  return Array.isArray(items) ? items : [];
});

export const communityPanels: CommunityPanel[] = [
  {
    slug: "computer-science",
    title: "Computer Science",
    eyebrow: "base técnica",
    description: "Conceptos de computación, sistemas operativos y fundamentos que sostienen cualquier recorrido de seguridad.",
    intro: "Antes de estudiar una técnica hay que entender el sistema donde ocurre. Este panel reúne material teórico, clases y referencias para construir esa base.",
    categories: ["Computer Science"]
  },
  {
    slug: "linux",
    title: "Linux",
    eyebrow: "sistemas y terminal",
    description: "Recursos para moverse por la terminal, administrar sistemas y entender permisos, procesos, red y hardening.",
    intro: "Linux aparece en servidores, laboratorios y herramientas de seguridad. Acá se puede practicar desde los comandos iniciales hasta la revisión de un sistema expuesto.",
    categories: ["Linux"]
  },
  {
    slug: "network",
    title: "Network",
    eyebrow: "protocolos y tráfico",
    description: "Redes, direccionamiento, routing y herramientas para leer el tráfico que conecta sistemas y servicios.",
    intro: "Una buena hipótesis de seguridad empieza por saber cómo viajan los datos. Este panel ordena cursos, libros y herramientas para estudiar redes desde cero.",
    categories: ["Network"]
  },
  {
    slug: "hacking-web",
    title: "Hacking Web",
    eyebrow: "aplicaciones y APIs",
    description: "Material para estudiar vulnerabilidades web, controles de seguridad, reconocimiento y práctica en laboratorios autorizados.",
    intro: "El objetivo es entender cómo se rompen y cómo se corrigen las aplicaciones: desde las vulnerabilidades clásicas hasta APIs, control de acceso y lógica de negocio.",
    categories: ["Hacking Web"]
  },
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    eyebrow: "construir para entender",
    description: "Cursos y rutas para crear aplicaciones con JavaScript, React, TypeScript, Node, Docker y CI/CD.",
    intro: "Construir aplicaciones ayuda a reconocer decisiones que después importan en seguridad. Este panel conecta frontend, backend, despliegue y automatización.",
    categories: ["Full Stack Development"]
  },
  {
    slug: "red-team-cloud-blue-team",
    title: "Red Team · Cloud · Blue Team",
    eyebrow: "ataque y defensa",
    description: "Referencias para estudiar operaciones ofensivas, seguridad cloud, living off the land, monitoreo y detección.",
    intro: "Las técnicas ofensivas se presentan junto a su contexto defensivo: qué comportamiento producen, cómo observarlo y en qué entornos se puede practicar de forma segura.",
    categories: ["Red Team · Cloud · Blue Team"]
  },
  {
    slug: "ctf",
    title: "CTF",
    eyebrow: "práctica guiada",
    description: "Máquinas, wargames, desafíos y write-ups para convertir conceptos en práctica dentro de entornos controlados.",
    intro: "Los CTF permiten entrenar metodología: enumerar, formular hipótesis, probar, documentar y volver a empezar sin tocar objetivos reales.",
    categories: ["CTF"]
  }
];

export const getCommunityPanel = (slug: string) => communityPanels.find((panel) => panel.slug === slug);

export const getResourcesForPanel = (panel: CommunityPanel) =>
  communityResources.filter((resource) => panel.categories.includes(resource.category));
