import { spawn } from "node:child_process";
import { cp, readdir, readFile } from "node:fs/promises";

const [app, command, ...args] = process.argv.slice(2);

if (!['main', 'labs'].includes(app) || !command) {
  console.error('Uso: node scripts/astro.mjs <main|labs> <comando de Astro> [...args]');
  process.exit(1);
}

const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', command, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    C4CKER_APP: app,
    ...(command === 'dev' ? { C4CKER_LOCAL_DEV: '1' } : {}),
    VITE_CACHE_DIR: process.env.VITE_CACHE_DIR ?? `node_modules/.vite-${app}`,
    ...(app === 'labs' ? { ASTRO_DEV_BACKGROUND: '1' } : {})
  }
});

const assertLabsLinks = async () => {
  const files = await readdir('dist/labs', { recursive: true });
  const invalid = [];

  for (const file of files) {
    if (typeof file !== 'string' || !file.endsWith('.html')) continue;
    const target = `dist/labs/${file.replaceAll('\\', '/')}`;
    const content = await readFile(target, 'utf8');
    if (/\bhref=["']\/\//.test(content)) invalid.push(target);
  }

  if (invalid.length) {
    throw new Error(`Se generaron enlaces internos inválidos (//): ${invalid.join(', ')}`);
  }
};

child.on('exit', async (code, signal) => {
  if (signal || code !== 0) {
    process.exitCode = 1;
    return;
  }

  if (app === 'labs' && command === 'build') {
    try {
      await cp('challenges-sources', 'dist/labs/challenges-sources', { recursive: true });
      await assertLabsLinks();
    } catch (error) {
      console.error('No se pudieron incorporar los paquetes descargables de Labs.', error);
      process.exitCode = 1;
      return;
    }
  }

  process.exitCode = 0;
});
