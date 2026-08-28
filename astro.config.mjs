import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const site = app === "labs" ? "https://labs.c4cker.com" : "https://c4cker.com";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  output: "server",
  devToolbar: { enabled: false },
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ["labs.c4cker.com", "labs.localhost", "c4cker.com"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
