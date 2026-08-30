import { spawn } from "node:child_process";

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

child.on('exit', (code, signal) => process.exitCode = signal ? 1 : (code ?? 1));
