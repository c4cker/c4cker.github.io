import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const pages = process.env.C4CKER_TARGET === "pages";
const site = pages ? "https://c4cker.github.io" : app === "labs" ? "https://labs.c4cker.com" : "https://c4cker.com";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  base: pages && app === "labs" ? "/labs" : undefined,
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ["labs.c4cker.com", "labs.localhost", "c4cker.com"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
