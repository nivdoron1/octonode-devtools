import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { runPluginLifecycle } from "../packages/cli/runtime/plugin-lifecycle.cjs";

function fixture(t, scope = "org") {
  const cwd = mkdtempSync(join(tmpdir(), "octonodes-restore-"));
  const alias = `fixture-${randomUUID()}`;
  const sha256 = "a".repeat(64);
  const registry = "https://registry.example.invalid";
  const destination = { kind: "org", id: "destination" };
  const member = {
    pluginId: `publisher/${alias}`, version: "1.0.0", alias, name: "Fixture", manifestId: alias,
    sha256, scope, permissions: [], publisher: null, npmPackage: null, connections: [],
  };
  const toolkit = { id: "toolkit", registry, version: "1.0.0", sha256, plugins: [alias], destination };
  const lock = {
    lockfileVersion: 1,
    plugins: { [alias]: {
      pluginId: alias, remoteId: member.pluginId, version: member.version,
      sha256: `sha256:${sha256}`, archiveSha256: sha256, registry, scope,
    } },
    toolkits: { toolkit },
  };
  const release = {
    id: toolkit.id, name: "Fixture", description: "", version: toolkit.version,
    owner: destination, visibility: "org", revision: 1, sha256, status: "published", plugins: [member],
  };
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0" }));
  const lockFile = join(cwd, "octonode.lock");
  const originalLock = JSON.stringify(lock);
  writeFileSync(lockFile, originalLock);
  const originalFetch = globalThis.fetch;
  const previousUser = process.env.OCTONODE_USER;
  delete process.env.OCTONODE_USER;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (previousUser === undefined) delete process.env.OCTONODE_USER;
    else process.env.OCTONODE_USER = previousUser;
    rmSync(cwd, { recursive: true, force: true });
  });
  return { cwd, member, toolkit, release, lockFile, originalLock };
}

for (const scope of ["org", "public"]) {
  test(`toolkit restore forwards its destination to ${scope} plugin requests`, async (t) => {
    const { cwd, member, toolkit, release, lockFile, originalLock } = fixture(t, scope);
    const requests = [];
    globalThis.fetch = async (input, init) => {
      const url = new URL(input);
      requests.push(url.pathname);
      assert.equal(url.searchParams.get("workspace"), "org:destination");
      assert.equal(new Headers(init.headers).get("authorization"), "Bearer fixture-token");
      if (url.pathname.endsWith("/resolve")) {
        assert.equal(init.method, "POST");
        assert.deepEqual(JSON.parse(init.body), {
          version: toolkit.version, sha256: toolkit.sha256, destination: toolkit.destination,
        });
        return Response.json(release);
      }
      assert.equal(url.searchParams.get("scope"), scope);
      if (!url.pathname.endsWith("/bundle")) {
        return Response.json({ versions: [{ version: member.version, archiveSha256: member.sha256 }] });
      }
      return new Response("bundle access denied", { status: 403 });
    };
    await assert.rejects(
      runPluginLifecycle("restore", undefined, { cwd, "artifacts-only": true, token: "fixture-token" }),
      /403 bundle access denied/,
    );
    const pluginPath = `/marketplace/plugins/${encodeURIComponent(member.pluginId)}`;
    assert.deepEqual(requests, [
      "/marketplace/toolkits/toolkit/resolve",
      ...(scope === "public" ? [] : [pluginPath]),
      `${pluginPath}/versions/1.0.0/bundle`,
    ]);
    assert.equal(readFileSync(lockFile, "utf8"), originalLock);
  });
}

test("toolkit restore rejects a conflicting registry workspace before requesting access", async (t) => {
  const { cwd, lockFile, originalLock } = fixture(t);
  process.env.OCTONODE_USER = "workspace:org:other";
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    throw new Error("Unexpected request");
  };
  await assert.rejects(
    runPluginLifecycle("restore", undefined, { cwd, "artifacts-only": true, token: "fixture-token" }),
    /Toolkit destination must match the registry workspace/,
  );
  assert.equal(requests, 0);
  assert.equal(readFileSync(lockFile, "utf8"), originalLock);
});
