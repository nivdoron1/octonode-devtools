import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
const cli = resolve("packages/cli/dist/index.js");
const dependencies = resolve("node_modules");
const run = (cwd, ...args) => spawnSync(process.execPath, [cli, "app", ...args], { cwd, encoding: "utf8" });
const ok = (result) => {
  assert.equal(result.status, 0, result.stderr);
  return result;
};

test("app CLI creates, compiles, extends and validates an app without authentication", () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-app-"));
  try {
    ok(run(parent, "create", "notice"));
    const root = join(parent, "notice");
    symlinkSync(dependencies, join(root, "node_modules"), "dir");
    const descriptor = join(root, "octonode.app.json");
    const source = readFileSync(descriptor, "utf8");
    assert.equal(JSON.parse(source).extensions[0].target, "workspace.block");
    assert.doesNotMatch(source, /sha256|applicationUrl/);
    const typecheck = spawnSync(process.execPath, [join(dependencies, "typescript/bin/tsc"), "--noEmit"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(typecheck.status, 0, typecheck.stdout + typecheck.stderr);
    const result = JSON.parse(ok(run(root, "build")).stdout);
    assert.equal(result.manifest.app.hosting, "extension-only");
    assert.equal(readFileSync(descriptor, "utf8"), source);
    ok(run(root, "validate", result.directory));
    const smoke = spawnSync(process.execPath, ["--test", "tests/app.test.cjs"], { cwd: root, encoding: "utf8" });
    assert.equal(smoke.status, 0, smoke.stderr + smoke.stdout);
    ok(run(root, "extension", "add", "overview", "--target", "app.page"));
    assert.notEqual(run(root, "extension", "add", "overview", "--target", "app.page").status, 0);
    const extended = JSON.parse(ok(run(root, "build")).stdout);
    assert.deepEqual(
      extended.manifest.app.extensions.map((e) => e.target),
      ["workspace.block", "app.page"],
    );
    const manifest = readFileSync(join(result.directory, "octonode.json"), "utf8");
    writeFileSync(join(root, "src/extensions/notice.tsx"), "invalid {{{");
    assert.notEqual(run(root, "build").status, 0);
    assert.equal(readFileSync(join(result.directory, "octonode.json"), "utf8"), manifest);
    writeFileSync(join(result.directory, "extensions/notice.js"), "tampered");
    assert.notEqual(run(root, "validate", result.directory).status, 0);
    assert.notEqual(run(parent, "create", "notice").status, 0);
    assert.notEqual(run(parent, "create", "../escape").status, 0);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test("app build rejects source escapes and symlinks", () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-app-paths-"));
  try {
    ok(run(parent, "create", "notice"));
    const root = join(parent, "notice");
    symlinkSync(dependencies, join(root, "node_modules"), "dir");
    const descriptor = join(root, "octonode.app.json");
    const source = JSON.parse(readFileSync(descriptor, "utf8"));
    source.extensions[0].entry = "src/../../outside.tsx";
    writeFileSync(descriptor, JSON.stringify(source));
    assert.notEqual(run(root, "build").status, 0);
    source.extensions[0].entry = "src/extensions/notice.tsx";
    writeFileSync(descriptor, JSON.stringify(source));
    rmSync(join(root, source.extensions[0].entry));
    writeFileSync(join(parent, "outside.tsx"), "export default {};");
    symlinkSync(join(parent, "outside.tsx"), join(root, source.extensions[0].entry));
    assert.match(run(root, "build").stderr, /symlink/);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});
