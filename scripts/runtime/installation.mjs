import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

if (!process.env.npm_execpath) throw new Error("Run npm run test:install from the repository root");
const root = mkdtempSync(join(tmpdir(), "octonodes-installed-"));
const relocated = mkdtempSync(join(tmpdir(), "octonodes-library-"));
const archives = Object.fromEntries(["sdk", "ui-extensions", "cli"].map((name) => [
  `@octonodes/${name}`, `file:${resolve("artifacts/runtime", `${name}.tgz`)}`,
]));
const run = (args, cwd = root, input) => execFileSync(process.execPath, args, {
  cwd, encoding: "utf8", input, timeout: 120_000,
  env: { ...process.env, NODE_PATH: "", OCTONODE_CONFIG_DIR: join(root, ".config") },
});
function install(cwd) {
  const path = join(cwd, "package.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  // The candidate version is not on npm yet. Preserve each scaffold's dependency
  // set, substituting only the three public packages with the candidate tarballs.
  for (const field of ["dependencies", "devDependencies"]) {
    for (const name of Object.keys(manifest[field] ?? {})) {
      if (archives[name]) manifest[field][name] = archives[name];
    }
  }
  manifest.overrides = archives;
  writeFileSync(path, JSON.stringify(manifest));
  run([process.env.npm_execpath, "install", "--engine-strict", "--no-audit", "--no-fund"], cwd);
}
try {
  writeFileSync(join(root, "package.json"), JSON.stringify({
    name: "octonodes-runtime-verification", private: true,
    dependencies: archives,
  }));
  // A clean consumer install catches engine constraints and missing packaged
  // files that workspace links and source aliases can conceal.
  install(root);
  const cli = join(root, "node_modules/@octonodes/cli/dist/index.js");
  assert.match(run([cli, "--help"]), /octonodes/);
  run(["--input-type=module", "--eval", `
    import assert from "node:assert/strict";
    import { createRequire } from "node:module";
    const require = createRequire(import.meta.url);
    const manifest = require("./node_modules/@octonodes/sdk/package.json");
    for (const name of Object.keys(manifest.exports)) {
      const specifier = "@octonodes/sdk" + (name === "." ? "" : name.slice(1));
      assert.ok(Object.keys(await import(specifier)).length, specifier);
    }
    await import("@octonodes/ui-extensions");
    await import("@octonodes/ui-extensions/app/server");
  `]);
  run([cli, "plugin", "create", "example"]);
  const project = join(root, "example");
  install(project);
  // Plugin libraries support macOS/Linux (Windows uses WSL). Exercise the
  // library build and its named exports alongside the normal IPC runner.
  if (process.platform !== "win32") {
    const definition = join(project, "octonode.plugin.ts");
    writeFileSync(definition, readFileSync(definition, "utf8").replace(
      "  nodes: [", '  library: { entry: "src/echo.ts" },\n  nodes: [',
    ));
  }
  const [built] = JSON.parse(run([cli, "plugin", "build"], project));
  const result = JSON.parse(run([join(built.directory, "dist/index.js"), built.manifest.nodes[0].id], project,
    JSON.stringify({ octonode: "1", type: "invoke", invocationId: "compatibility", inputs: { text: "Node compatible" } }) + "\n"));
  assert.equal(result.status, "ok");
  assert.deepEqual(result.outputs, { text: "Node compatible" });
  // Execute the generated test as a separate process, outside node:test, so its
  // nested test runner is not silently skipped through NODE_TEST_CONTEXT.
  run(["--test", "tests/plugin.test.cjs"], project);
  if (process.platform !== "win32") {
    cpSync(join(built.directory, "library"), relocated, { recursive: true });
    rmSync(project, { recursive: true, force: true });
    run(["--input-type=module", "--eval", `
      import assert from "node:assert/strict";
      import { echo } from ${JSON.stringify(pathToFileURL(join(relocated, "index.js")).href)};
      assert.deepEqual(echo("portable"), { text: "portable" });
    `], relocated);
  }
  for (const platform of ["plain", "vite"]) {
    run([cli, "app", "create", platform, "--platform", platform]);
    const app = join(root, platform);
    install(app);
    run([cli, "app", "build", "--app-url", "https://example.test"], app);
  }
  const installed = JSON.parse(readFileSync(join(root, "node_modules/@octonodes/cli/package.json"), "utf8"));
  process.stdout.write(`Installed CLI ${installed.version}, imported SDK, parsed/built/invoked plugin and built plain/Vite apps on ${process.version}\n`);
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(relocated, { recursive: true, force: true });
}
