import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import { AppAction, AppDefinition } from "../packages/sdk/dist/plugins/index.js";

const require = createRequire(import.meta.url);
const { readAppSource } = require("../packages/cli/dist/apps/source.js");
const cli = resolve("packages/cli/dist/index.js");

for (const template of ["full", "extension"]) {
  test(`${template} creation opts into project-file consent without starting a runtime`, () => {
    const parent = mkdtempSync(join(tmpdir(), "octonodes-project-scopes-"));
    try {
      for (const access of [undefined, "read", "write"]) {
        const name = access ?? "default";
        const args = [cli, "app", "create", name, "--template", template];
        if (template === "full") args.push("--platform", "plain");
        if (access) args.push("--project-access", access);
        const created = spawnSync(process.execPath, args, { cwd: parent, encoding: "utf8" });
        assert.equal(created.status, 0, created.stderr);
        const root = join(parent, name);
        const source = readAppSource(root);
        const actions = source.web?.requestedActions ?? source.requestedActions ?? [];
        assert.deepEqual(actions, access === "write" ? ["projects:read", "read:project", "write:project"] : access === "read" ? ["projects:read", "read:project"] : []);
        const descriptor = join(root, "octonode.app.json");
        const json = JSON.parse(readFileSync(descriptor, "utf8"));
        // Unknown scopes must fail validation, even when the descriptor was hand edited.
        if (json.web) json.web.requestedActions = ["execute:project"];
        else json.requestedActions = ["execute:project"];
        writeFileSync(descriptor, JSON.stringify(json));
        assert.throws(() => readAppSource(root));
      }
      const invalid = spawnSync(process.execPath, [cli, "app", "create", "invalid", "--project-access", "all"], { cwd: parent, encoding: "utf8" });
      assert.equal(invalid.status, 1);
      assert.match(invalid.stderr, /project-access read or write/);
      assert.equal(existsSync(join(parent, "invalid")), false);
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });
}

test("SDK file scopes are independent and all action combinations remain valid", () => {
  const actions = AppAction.options;
  assert.equal(actions.length, 6);
  for (let mask = 0; mask < 2 ** actions.length; mask++) {
    const requestedActions = actions.filter((_, i) => mask & (1 << i));
    const parsed = AppDefinition.parse({ apiVersion: "1", hosting: "self-hosted", applicationUrl: "https://example.com", redirectUrls: ["https://example.com"], requestedActions });
    assert.deepEqual(parsed.requestedActions, requestedActions);
  }
});
