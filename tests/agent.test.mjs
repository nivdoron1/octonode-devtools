import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

test("both client catalogs resolve the same complete plugin after relocation", () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-marketplace-"));
  try {
    for (const path of [".agents/plugins", ".claude-plugin", "octonode-plugin"]) {
      cpSync(new URL(`../${path}`, import.meta.url), join(root, path), { recursive: true });
    }
    const read = (path) => JSON.parse(readFileSync(path, "utf8"));
    const codex = read(join(root, ".agents/plugins/marketplace.json"));
    const claude = read(join(root, ".claude-plugin/marketplace.json"));
    assert.equal(codex.name, "octonode");
    assert.equal(claude.name, codex.name);
    assert.equal(codex.plugins.length, 1);
    assert.equal(claude.plugins.length, 1);
    const entry = codex.plugins[0];
    assert.deepEqual(entry.policy, { installation: "AVAILABLE", authentication: "ON_USE" });
    assert.equal(entry.category, "Developer Tools");
    assert.equal(entry.source.source, "local");
    assert.equal(entry.source.path, claude.plugins[0].source);
    const pluginRoot = resolve(root, entry.source.path);
    assert.equal(pluginRoot, join(root, "octonode-plugin"));
    for (const path of ["plugin.json", ".codex-plugin/plugin.json", ".claude-plugin/plugin.json"]) {
      const manifest = read(join(pluginRoot, path));
      assert.equal(manifest.name, entry.name);
      assert.equal(manifest.name, claude.plugins[0].name);
      assert.equal(manifest.version, read(join(pluginRoot, "plugin.json")).version);
    }
    const skills = readdirSync(join(pluginRoot, "skills")).sort();
    assert.deepEqual(skills, ["octonode-connect", "octonode-plugin-author", "octonode-plugin-manage"]);
    for (const skill of skills) {
      assert.match(readFileSync(join(pluginRoot, "skills", skill, "SKILL.md"), "utf8"),
        new RegExp(`name: ${skill}`));
    }
    assert.match(readFileSync(join(pluginRoot, "skills/octonode-connect/references/mcp/index.md"), "utf8"), /registered tools/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
