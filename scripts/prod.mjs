import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const blog = resolve(root, "apps", "blog");

if (process.platform === "win32") {
  throw new Error("npm run prod debe ejecutarse en el servidor de producción, dentro de /opt/c4cker.");
}

const run = (command, args, cwd = root) => {
  console.log(`\\n> ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd, stdio: "inherit" });
};

run("git", ["pull", "--ff-only", "origin", "main"]);
run("npm", ["ci", "--no-audit", "--no-fund"]);
run("npm", ["run", "build:main"]);
run("npm", ["run", "build:labs"]);
const bundleUser = process.env.C4CKER_DEPLOY_USER ?? "c4cker";
run("chown", ["-R", `${bundleUser}:${bundleUser}`, blog]);
run("runuser", ["-u", bundleUser, "--", "bundle", "install"], blog);
run("runuser", ["-u", bundleUser, "--", "bundle", "exec", "jekyll", "build", "--disable-disk-cache", "--destination", "_site"], blog);
run("caddy", ["validate", "--config", "/etc/caddy/Caddyfile"]);
run("systemctl", ["reload", "caddy"]);
run("systemctl", ["is-active", "caddy"]);

console.log("\\nProducción actualizada desde /opt/c4cker.");
