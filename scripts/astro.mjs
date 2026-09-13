import { spawn } from "node:child_process";
import { cp } from "node:fs/promises";

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

child.on('exit', async (code, signal) => {
  if (signal || code !== 0) {
    process.exitCode = 1;
    return;
  }

  if (app === 'labs' && command === 'build') {
    try {
      await cp('challenges-sources', 'dist/labs/challenges-sources', { recursive: true });
    } catch (error) {
      console.error('No se pudieron incorporar los paquetes descargables de Labs.', error);
      process.exitCode = 1;
      return;
    }
  }

  process.exitCode = 0;
});
