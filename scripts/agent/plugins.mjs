import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = mkdtempSync(join(tmpdir(), "octonodes-agent-plugins-"));
const checkout = join(root, "marketplace");
const claudeConfig = join(root, "claude");
const codexConfig = join(root, "codex");
mkdirSync(checkout);
mkdirSync(claudeConfig);
mkdirSync(codexConfig);
const env = {
  PATH: process.env.PATH,
  SystemRoot: process.env.SystemRoot,
  TMPDIR: process.env.TMPDIR,
  CLAUDE_CONFIG_DIR: claudeConfig,
  CODEX_HOME: codexConfig,
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
};
const run = (client, args) => execFileSync(client, args, {
  cwd: checkout, env, encoding: "utf8", timeout: 60_000,
});
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
try {
  // A relocated source catches wrong catalog roots and references to files that
  // exist only in the developer checkout. Nothing loads the user's credentials.
  for (const path of [".agents/plugins", ".claude-plugin", "octonode-plugin"]) {
    cpSync(new URL(`../../${path}`, import.meta.url), join(checkout, path), { recursive: true });
  }
  run("claude", ["plugin", "validate", "."]);
  run("claude", ["plugin", "marketplace", "add", "./"]);
  run("claude", ["plugin", "install", "octonode-plugin@octonode"]);
  const claudePlugins = JSON.parse(run("claude", ["plugin", "list", "--json"]));
  assert.ok(claudePlugins.some((plugin) => plugin.id === "octonode-plugin@octonode" && plugin.enabled));
  const claudeInstalled = read(join(claudeConfig, "plugins", "installed_plugins.json"));
  const claudePath = claudeInstalled.plugins["octonode-plugin@octonode"][0].installPath;
  assert.deepEqual(readdirSync(join(claudePath, "skills")).sort(),
    ["octonode-connect", "octonode-plugin-author", "octonode-plugin-manage"]);
  assert.match(run("claude", ["plugin", "details", "octonode-plugin"]), /octonode-connect/);
  run("codex", ["plugin", "marketplace", "add", "./"]);
  const codexInstalled = JSON.parse(run("codex", ["plugin", "add", "octonode-plugin@octonode", "--json"]));
  assert.equal(codexInstalled.pluginId, "octonode-plugin@octonode");
  assert.match(run("codex", ["plugin", "list"]), /octonode-plugin/);
  process.stdout.write("Claude and Codex installed the relocated Octonode plugin; Claude loaded all three skills. No model calls made.\n");
} finally {
  rmSync(root, { recursive: true, force: true });
}
