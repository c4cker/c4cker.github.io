import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const bundle = isWindows ? "bundle.bat" : "bundle";
const mode = process.argv[2] ?? "--check";

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: isWindows, ...options });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(npm, ["run", "check"]);
run("node", ["scripts/astro.mjs", "labs", "check"]);
run(npm, ["run", "community:check"]);

if (mode === "--build") {
  run(npm, ["run", "build:main"]);
  run(npm, ["run", "build:labs"]);
  run(bundle, ["exec", "jekyll", "build", "--source", ".", "--destination", ".verify-site"], { cwd: "apps/blog" });
}

console.log(mode === "--build" ? "Verificación completa y builds válidos." : "Checks completos válidos.");
