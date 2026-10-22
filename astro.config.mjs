import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const site = app === "labs" ? "https://labs.c4cker.com" : "https://c4cker.com";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Scripts siempre externos: la CSP de _headers usa script-src 'self' sin 'unsafe-inline'.
    build: { assetsInlineLimit: 0 },
    server: { allowedHosts: ["labs.localhost", "localhost", "127.0.0.1"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
