import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const app = process.env.C4CKER_APP === "labs" ? "labs" : "main";
const pages = process.env.C4CKER_TARGET === "pages";
const localDev = process.env.C4CKER_LOCAL_DEV === "1";
const site = "https://c4cker.com";

export default defineConfig({
  srcDir: `./apps/${app}/src`,
  publicDir: `./apps/${app}/public`,
  outDir: `./dist/${app}`,
  site,
  base: pages && app === "labs" && !localDev ? "/labs" : undefined,
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ["labs.localhost", "localhost", "127.0.0.1"] },
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {})
  }
});
