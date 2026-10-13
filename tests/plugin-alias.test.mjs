import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

test(
  "a generated digit-leading UUID installs, restores and removes without an explicit alias",
  { timeout: 120_000 },
  (t) => {
    if (process.platform === "win32") return t.skip("Plugin dependency lifecycle requires WSL on Windows");
    const root = mkdtempSync(join(tmpdir(), "octonodes-numeric-alias-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    // Both the immutable store and auth storage belong to this disposable fixture.
    const preload = join(root, "isolated.cjs");
    writeFileSync(preload, `require("node:os").homedir = () => ${JSON.stringify(root)};\n`);
    const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^OCTONODES?_/.test(key)));
    const env = { ...cleanEnv, NODE_OPTIONS: `--require ${preload}`, OCTONODE_CONFIG_DIR: join(root, "credentials") };
    const cli = resolve("packages/cli/dist/index.js");
    const command = (cwd, ...args) =>
      execFileSync(process.execPath, [cli, ...args], {
        cwd,
        env,
        encoding: "utf8",
        timeout: 60_000,
        stdio: "pipe",
      });
    command(root, "plugin", "create", "example");
    const source = join(root, "example");
    symlinkSync(resolve("node_modules"), join(source, "node_modules"), "junction");
    const definition = join(source, "octonode.plugin.ts");
    const original = readFileSync(definition, "utf8");
    const generatedId = original.match(/id: "([a-f0-9-]{36})"/)[1];
    const id = `1${generatedId.slice(1)}`;
    for (const path of [definition, join(source, "octonode.plugin.json"), join(source, "tests/plugin.test.cjs")]) {
      writeFileSync(path, readFileSync(path, "utf8").replaceAll(generatedId, id));
    }
    const [built] = JSON.parse(command(source, "plugin", "build"));
    command(source, "plugin", "validate", built.directory);
    assert.equal(
      JSON.parse(command(source, "plugin", "test", built.directory, "--input", '{"text":"Ada"}')).outputs.text,
      "Ada",
    );

    const consumer = join(root, "consumer");
    mkdirSync(consumer);
    writeFileSync(join(consumer, "package.json"), '{"name":"consumer","private":true}');
    assert.throws(
      () => command(consumer, "plugin", "install", built.directory, "--alias", "../escape"),
      /Invalid project plugin alias/,
    );
    const installed = JSON.parse(command(consumer, "plugin", "install", built.directory));
    assert.equal(installed.id, id);
    const lock = JSON.parse(command(consumer, "plugin", "list"));
    assert.equal(lock.plugins[id].pluginId, id);
    assert.equal(lock.plugins[id].sha256, installed.sha256);
    const before = readFileSync(join(consumer, "octonode.lock"), "utf8");
    command(consumer, "install", "--frozen", "--artifacts-only");
    assert.equal(readFileSync(join(consumer, "octonode.lock"), "utf8"), before);
    command(consumer, "plugin", "remove", id);
    assert.deepEqual(JSON.parse(command(consumer, "plugin", "list")).plugins, {});
  },
);
