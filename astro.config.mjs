import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const pages = process.env.C4CKER_TARGET === "pages";
const site = "https://c4cker.github.io";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  base: pages && app === "labs" ? "/labs" : undefined,
  output: app === "labs" && !pages ? "hybrid" : "static",
  adapter: app === "labs" && !pages ? cloudflare() : undefined,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ["labs.localhost", "localhost", "127.0.0.1"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
