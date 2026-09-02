import { readFile } from "node:fs/promises";

const paths = ["apps/labs/src/data/community.published.ts", "apps/labs/src/data/community.browser.ts", "apps/labs/src/data/community.cross-panel.ts"];
const source = (await Promise.all(paths.map((path) => readFile(path, "utf8")))).join("\n");
const resources = source.match(/\n  \{/g) ?? [];
const requiredFields = ["category:", "title:", "source:", "description:", "href:", "topics:", "level:", "format:", "language:", "access:"];
const missing = requiredFields.filter((field) => !source.includes(field));
const forbidden = [/drive\.google/i, /category:\s*"Inglés"/i, /note:/i];
const hrefs = [...source.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
const invalidUrls = hrefs.filter((href) => !/^https:\/\//.test(href));

if (missing.length || forbidden.some((pattern) => pattern.test(source)) || invalidUrls.length) {
  console.error(`Catálogo inválido: ${resources.length} recursos detectados.`);
  if (missing.length) console.error(`Faltan campos: ${missing.join(", ")}`);
  if (forbidden.some((pattern) => pattern.test(source))) console.error("El catálogo contiene una categoría o referencia excluida.");
  if (invalidUrls.length) console.error(`URLs inválidas: ${invalidUrls.join(", ")}`);
  process.exit(1);
}

console.log(`Catálogo válido: ${resources.length} recursos, sin Drive, notas ni categoría de Inglés.`);
