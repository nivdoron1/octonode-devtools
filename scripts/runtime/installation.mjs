import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

if (!process.env.npm_execpath) throw new Error("Run npm run test:install from the repository root");
const root = mkdtempSync(join(tmpdir(), "octonodes-installed-"));
const relocated = mkdtempSync(join(tmpdir(), "octonodes-library-"));
const preload = join(root, "isolated.cjs");
writeFileSync(preload, `require("node:os").homedir = () => ${JSON.stringify(root)};\n`);
const archives = Object.fromEntries(
  ["sdk", "ui-extensions", "cli"].map((name) => [
    `@octonodes/${name}`,
    `file:${resolve("artifacts/runtime", `${name}.tgz`)}`,
  ]),
);
const run = (args, cwd = root, input) =>
  execFileSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    input,
    timeout: 120_000,
    env: {
      ...process.env,
      NODE_PATH: "",
      NODE_OPTIONS: `--require ${preload}`,
      OCTONODE_CONFIG_DIR: join(root, ".config"),
      OCTONODE_TOKEN: "",
    },
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
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "octonodes-runtime-verification",
      private: true,
      dependencies: archives,
    }),
  );
  // A clean consumer install catches engine constraints and missing packaged
  // files that workspace links and source aliases can conceal.
  install(root);
  const cli = join(root, "node_modules/@octonodes/cli/dist/index.js");
  assert.match(run([cli, "--help"]), /octonodes/);
  for (const access of ["read", "write"]) {
    const name = `file-${access}-app`;
    run([cli, "app", "create", name, "--platform", "plain", "--project-access", access]);
    const descriptor = JSON.parse(readFileSync(join(root, name, "octonode.app.json"), "utf8"));
    assert.deepEqual(descriptor.web.requestedActions, access === "read"
      ? ["projects:read", "read:project"]
      : ["projects:read", "read:project", "write:project"]);
  }

  run([
    "--input-type=module",
    "--eval",
    `
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
    const { AppAction } = await import("@octonodes/sdk/plugins");
    assert.equal(AppAction.safeParse("read:project").success, true);
    assert.equal(AppAction.safeParse("write:project").success, true);
    assert.equal(AppAction.safeParse("execute:project").success, false);

    const { createClient } = await import("@octonodes/sdk");
    const instructions = { files: [{ path: "AGENTS.md", content: "Run project tests.", revision: "revision" }], skipped: [] };
    globalThis.fetch = async (input) => {
      const request = new Request(input);
      assert.equal(request.method, "GET");
      assert.equal(request.url, "https://consumer.example.test/api/projects/project%201/instructions");
      assert.equal(request.headers.get("authorization"), "Bearer consumer-test-token");
      return Response.json(instructions);
    };
    const client = createClient("consumer-test-token", { url: "https://consumer.example.test" });
    assert.deepEqual(await client.projects.api.projectId.instructions.get({ path: { projectId: "project 1" } }), instructions);
    globalThis.fetch = async (input) => {
      const request = new Request(input);
      assert.equal(request.url, "https://octonodes.com/api/identity");
      assert.equal(request.headers.get("authorization"), "Bearer consumer-test-token");
      return Response.json({ id: "consumer-user" });
    };
    assert.deepEqual(await createClient("consumer-test-token").identity.api.get(), { id: "consumer-user" });
  `,
  ]);
  run([cli, "plugin", "create", "example"]);
  const project = join(root, "example");
  install(project);
  const definition = join(project, "octonode.plugin.ts");
  const generatedId = readFileSync(definition, "utf8").match(/id: "([a-f0-9-]{36})"/)[1];
  const numericId = `1${generatedId.slice(1)}`;
  for (const file of [definition, join(project, "octonode.plugin.json"), join(project, "tests/plugin.test.cjs")]) {
    writeFileSync(file, readFileSync(file, "utf8").replaceAll(generatedId, numericId));
  }
  // Plugin libraries support macOS/Linux (Windows uses WSL). Exercise the
  // library build and its named exports alongside the normal IPC runner.
  if (process.platform !== "win32") {
    writeFileSync(
      definition,
      readFileSync(definition, "utf8").replace("  nodes: [", '  library: { entry: "src/echo.ts" },\n  nodes: ['),
    );
  }
  const [built] = JSON.parse(run([cli, "plugin", "build"], project));
  const result = JSON.parse(
    run(
      [join(built.directory, "dist/index.js"), built.manifest.nodes[0].id],
      project,
      JSON.stringify({
        octonode: "1",
        type: "invoke",
        invocationId: "compatibility",
        inputs: { text: "Node compatible" },
      }) + "\n",
    ),
  );
  assert.equal(result.status, "ok");
  assert.deepEqual(result.outputs, { text: "Node compatible" });
  // Execute the generated test as a separate process, outside node:test, so its
  // nested test runner is not silently skipped through NODE_TEST_CONTEXT.
  run(["--test", "tests/plugin.test.cjs"], project);
  if (process.platform !== "win32") {
    const consumer = join(root, "consumer");
    mkdirSync(consumer);
    writeFileSync(join(consumer, "package.json"), '{"name":"consumer","private":true}');
    const installed = JSON.parse(run([cli, "plugin", "install", built.directory], consumer));
    assert.equal(installed.id, numericId);
    const lockFile = join(consumer, "octonode.lock");
    const lock = readFileSync(lockFile, "utf8");
    assert.equal(JSON.parse(lock).plugins[numericId].pluginId, numericId);
    run(
      [
        "--input-type=module",
        "--eval",
        `
      import assert from "node:assert/strict";
      import { echo } from "@octonodes/plugin/${numericId}";
      assert.deepEqual(echo("installed"), { text: "installed" });
    `,
      ],
      consumer,
    );
    run([cli, "install", "--frozen", "--artifacts-only"], consumer);
    assert.equal(readFileSync(lockFile, "utf8"), lock);
    run([cli, "plugin", "remove", numericId], consumer);
    assert.deepEqual(JSON.parse(run([cli, "plugin", "list"], consumer)).plugins, {});
  }
  if (process.platform !== "win32") {
    cpSync(join(built.directory, "library"), relocated, { recursive: true });
    rmSync(project, { recursive: true, force: true });
    run(
      [
        "--input-type=module",
        "--eval",
        `
      import assert from "node:assert/strict";
      import { echo } from ${JSON.stringify(pathToFileURL(join(relocated, "index.js")).href)};
      assert.deepEqual(echo("portable"), { text: "portable" });
    `,
      ],
      relocated,
    );
  }
  for (const platform of ["plain", "vite"]) {
    run([cli, "app", "create", platform, "--platform", platform]);
    const app = join(root, platform);
    install(app);
    run([cli, "app", "build", "--app-url", "https://example.test"], app);
  }
  const installed = JSON.parse(readFileSync(join(root, "node_modules/@octonodes/cli/package.json"), "utf8"));
  process.stdout.write(
    `Installed CLI ${installed.version}, imported SDK, parsed/built/invoked plugin and built plain/Vite apps on ${process.version}\n`,
  );
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(relocated, { recursive: true, force: true });
}
