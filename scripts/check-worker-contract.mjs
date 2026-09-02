import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const worker = await readFile("workers/labs-api.ts", "utf8");
const catalog = await readFile("apps/labs/src/data/challenges.published.ts", "utf8");
const required = [
  ["auth", "auth/v1/user"],
  ["rate limiter", "RATE_LIMITER"],
  ["bounded body", "readJsonBody"],
  ["flag format", "FLAG_PATTERN"],
  ["ranking RPC", "rpc/get_ranking"],
  ["staged validation", "stage_locked"]
];
const missing = required.filter(([, marker]) => !worker.includes(marker));
if (missing.length) throw new Error(`Contrato del Worker incompleto: ${missing.map(([name]) => name).join(", ")}`);
const slugs = [...catalog.matchAll(/slug: \"([^\"]+)\"/g)].map((match) => match[1]);
const modes = new Set([...catalog.matchAll(/flagMode: \"([^\"]+)\"/g)].map((match) => match[1]));
for (const mode of ["single", "staged", "multi-staged"]) {
  if (!modes.has(mode)) throw new Error(`Falta un desafío de modo ${mode}`);
}
for (const slug of slugs) {
  if (!existsSync(`challenges-sources/${slug}.zip`)) throw new Error(`Falta ZIP publicado para ${slug}`);
}
if (/C4CKER\{[A-Za-z0-9]{32}\}/.test(catalog)) throw new Error("No guardes flags en el catálogo publicado");
if (!worker.includes("/^C4CKER\\{[A-Za-z0-9]{32,64}\\}$/")) throw new Error("El formato de flag debe usar C4CKER{flag} con 32 a 64 caracteres alfanuméricos");
console.log(`Contrato del Worker válido: ${slugs.length} desafíos publicados y ZIPs presentes.`);
