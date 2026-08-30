import type { Laboratory } from "./laboratories";

export const labs: Laboratory[] = [
  {
    id: "wp2shell-lab",
    title: "wp2shell-lab",
    runtime: "Docker · WordPress",
    time: "45 min",
    description: "Laboratorio local aislado para estudiar y reproducir, con autorización, un PoC de SQL injection sin autenticación en WordPress.",
    relation: "WordPress · REST API · SQL injection",
    versions: ["WordPress 6.9.4 · PHP 8.2 · puerto 8096", "WordPress 7.0.1 · PHP 8.3 · puerto 8097"],
    techniques: ["Enumeración de superficie REST", "SQL injection sin autenticación", "Confusión de rutas entre solicitudes REST", "Validación de impacto en un entorno Docker aislado"],
    attackChain: ["Levantar una de las dos versiones vulnerables", "Configurar WordPress y permalinks no planos", "Observar el endpoint REST batch /wp-json/batch/v1", "Analizar cómo un POST anidado a /wp/v2/posts provoca una consulta GET interna a /wp/v2/users", "Estudiar el efecto del parámetro author_exclude sin sanitizar y documentar evidencias sin salir del laboratorio"],
    scope: "Solo investigación educativa en localhost o una red propia aislada. No expone el servicio a Internet ni autoriza probar objetivos de terceros.",
    repoUrl: "https://github.com/KOGA-AR/wp2shell-lab"
  }
];
