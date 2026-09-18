import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { syncOpenApi } from "../scripts/sync-openapi.mjs";

test("OpenAPI sync bumps both public packages once", () => {
  const root = mkdtempSync(join(tmpdir(), "octonode-devtools-sync-"));
  const source = join(root, "next.json");
  try {
    mkdirSync(join(root, "packages/sdk"), { recursive: true });
    mkdirSync(join(root, "packages/cli"), { recursive: true });
    writeFileSync(source, '{"openapi":"3.1.0"}\n');
    writeFileSync(join(root, "packages/sdk/openapi.json"), '{}\n');
    writeFileSync(join(root, "packages/sdk/package.json"), '{"version":"1.2.3"}\n');
    writeFileSync(join(root, "packages/cli/package.json"), '{"version":"1.2.3"}\n');

    assert.equal(syncOpenApi(source, root), "1.2.4");
    assert.equal(JSON.parse(readFileSync(join(root, "packages/sdk/package.json"))).version, "1.2.4");
    assert.equal(JSON.parse(readFileSync(join(root, "packages/cli/package.json"))).version, "1.2.4");
    assert.equal(syncOpenApi(source, root), undefined);
    assert.equal(syncOpenApi(source, root, true), "1.2.5");
    assert.equal(syncOpenApi(source, root), undefined);

    writeFileSync(source, '{"openapi":"3.1.1"}\n');
    writeFileSync(join(root, "packages/sdk/package.json"), '{"version":"invalid"}\n');
    assert.throws(() => syncOpenApi(source, root), /cannot bump SDK version/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("packaged OpenAPI contains only developer operations", () => {
  const document = JSON.parse(readFileSync("packages/sdk/openapi.json", "utf8"));
  assert.ok(document.paths["/api/workflows"]?.get);
  assert.equal(document.paths["/api/tokens"], undefined);
  assert.equal(document.paths["/api/super-admin/organizations"], undefined);
});

test("public packages use the owned npm scope", () => {
  const sdk = JSON.parse(readFileSync("packages/sdk/package.json", "utf8"));
  const cli = JSON.parse(readFileSync("packages/cli/package.json", "utf8"));
  assert.equal(sdk.name, "@octonodes/sdk");
  assert.equal(cli.name, "@octonodes/cli");
  assert.equal(cli.dependencies["@octonodes/sdk"], "workspace:*");
});
