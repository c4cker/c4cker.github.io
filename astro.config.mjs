import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const pages = process.env.C4CKER_TARGET === "pages";
const localDev = process.env.C4CKER_LOCAL_DEV === "1";
const site = app === "labs" ? "https://labs.c4cker.com" : "https://c4cker.com";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  base: pages && app === "labs" && !localDev ? "/labs" : undefined,
  output: "static",
  // El adaptador solo se usa para una eventual publicación directa en Workers.
  // Hetzner y Pages reciben artefactos estáticos.
  adapter: app === "labs" && process.env.C4CKER_TARGET === "worker" && !localDev ? cloudflare() : undefined,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ["labs.localhost", "localhost", "127.0.0.1"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
