import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";

const cli = resolve("packages/cli/dist/index.js");

test("platform scaffolds contain native entry points and keep the Octonode backend", () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-platforms-"));
  try {
    const snapshots = {};
    for (const choice of ["default", "vite", "next", "plain"]) {
      const platform = choice === "default" ? "vite" : choice;
      const cwd = join(root, choice);
      mkdirSync(cwd);
      const result = spawnSync(process.execPath, [cli, "app", "create", "my-app", ...(choice === "default" ? [] : ["--platform", platform])], {
        cwd,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      const app = join(cwd, "my-app");
      const descriptor = JSON.parse(readFileSync(join(app, "octonode.app.json"), "utf8"));
      const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
      assert.equal(descriptor.web.platform, platform);
      assert.equal(descriptor.web.entry, "src/server.ts");
      assert.ok(descriptor.extensions.some((extension) => extension.target === "workspace.block"));
      assert.ok(descriptor.extensions.some((extension) => extension.target === "app.page"));
      if (platform === "plain") {
        assert.ok(!pkg.devDependencies.vite && !pkg.devDependencies.next);
        assert.match(readFileSync(join(app, "src/welcome.html"), "utf8"), /octonode_session/);
        continue;
      }
      assert.ok(pkg.devDependencies[platform]);
      assert.match(readFileSync(join(app, "src/web/App.tsx"), "utf8"), /octonode_session/);
      assert.match(readFileSync(join(app, "src/server.ts"), "utf8"), /connectAppServer/);
      assert.match(
        readFileSync(join(app, platform === "vite" ? "index.html" : "app/page.tsx"), "utf8"),
        platform === "vite" ? /src\/web\/main.tsx/ : /src\/web\/App/,
      );
      snapshots[choice] = Object.fromEntries(readdirSync(app, { recursive: true })
        .filter((file) => statSync(join(app, file)).isFile())
        .map((file) => [file, readFileSync(join(app, file), "utf8")]));
    }
    assert.deepEqual(snapshots.default, snapshots.vite);
    const unsupported = spawnSync(process.execPath, [cli, "app", "create", "bad-platform", "--platform", "unknown"], { cwd: root, encoding: "utf8" });
    assert.notEqual(unsupported.status, 0);
    assert.match(unsupported.stderr, /Choose --platform plain, vite or next/);
    const invalid = spawnSync(process.execPath, [cli, "app", "create", "bad", "--template", "extension", "--platform", "vite"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /requires --template full/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
