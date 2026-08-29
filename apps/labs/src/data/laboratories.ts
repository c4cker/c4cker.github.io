/** Catálogo de laboratorios. El `id` es estable aunque exista una segunda versión del ejercicio. */
export const labs = [
  { id: "01J8C4CK3R7A4M2N8Q6V0X6P1", title: "Proxy de papel", runtime: "Docker local", time: "35 min", description: "Un circuito pequeño para observar qué datos se transforman entre servicios.", relation: "Relacionado con Header trace", repoUrl: "https://github.com/c4cker/c4cker.github.io/tree/main/labs/proxy-de-papel" },
  { id: "01J8C4CK3R7A4M2N8Q6V0X6P2", title: "Logs con memoria", runtime: "HTML + navegador", time: "20 min", description: "Lectura de trazas y señales sin depender de herramientas pesadas.", relation: "Relacionado con Packet notes", repoUrl: "https://github.com/c4cker/c4cker.github.io/tree/main/labs/logs-con-memoria" },
  { id: "01J8C4CK3R7A4M2N8Q6V0X6P3", title: "Permisos visibles", runtime: "Linux local", time: "50 min", description: "Un laboratorio de rutas, ownership y modelo de amenazas.", relation: "Relacionado con Shell shape", repoUrl: "https://github.com/c4cker/c4cker.github.io/tree/main/labs/permisos-visibles" }
] as const;
