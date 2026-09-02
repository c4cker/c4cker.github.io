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
  /** Permite mostrar el mismo recurso en más de un panel con una ficha contextual. */
  curation?: "revisado" | "pendiente";
  warning?: string;
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
    description: "Recursos para usar Linux, administrar sistemas, entender permisos, procesos, filesystem, red y hardening.",
    intro: "Linux aparece en servidores, laboratorios y herramientas de seguridad. Acá se puede practicar desde los comandos iniciales hasta la revisión de un sistema expuesto.",
    categories: ["Linux"]
  },
  {
    slug: "windows",
    title: "Windows",
    eyebrow: "sistema y administración",
    description: "Comandos, administración y análisis de sistemas Windows para aprender y practicar en entornos propios o autorizados.",
    intro: "Estudiá Windows desde la terminal, los servicios y la administración del sistema. Usá máquinas de prueba y evitá ejecutar comandos sobre equipos ajenos.",
    categories: ["Windows"]
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
    slug: "mobile-security",
    title: "Mobile Security",
    eyebrow: "aplicaciones móviles",
    description: "Estándares y metodologías para evaluar la seguridad de aplicaciones Android e iOS.",
    intro: "Este panel reúne referencias específicas de seguridad móvil. Practicá sobre aplicaciones propias o entornos autorizados y preservá siempre los datos de prueba.",
    categories: ["Mobile Security"]
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
    slug: "red-team-pentesting",
    title: "Red Team · Pentesting",
    eyebrow: "ataque autorizado",
    description: "Reconocimiento, pentesting, explotación y operaciones ofensivas para practicar únicamente dentro de un alcance autorizado.",
    intro: "Estudiá técnicas ofensivas en laboratorios y sistemas propios. Documentá el alcance, el impacto y las medidas de mitigación de cada ejercicio.",
    categories: ["Red Team · Pentesting"]
  },
  {
    slug: "blue-team",
    title: "Blue Team",
    eyebrow: "detección y respuesta",
    description: "Recursos para monitoreo, hardening, análisis forense, respuesta a incidentes y detección de amenazas.",
    intro: "La defensa completa la práctica ofensiva: aprendé a observar señales, investigar incidentes y reducir la superficie de ataque.",
    categories: ["Blue Team"]
  },
  {
    slug: "cloud",
    title: "Cloud",
    eyebrow: "infraestructura cloud",
    description: "Rutas, guías y herramientas para estudiar seguridad, identidad y operación de servicios cloud.",
    intro: "Usá cuentas de laboratorio y presupuestos controlados. Revisá siempre permisos, costos y datos antes de probar una configuración.",
    categories: ["Cloud"]
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
