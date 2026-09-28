import assert from "node:assert/strict";
import { spawnSync, spawn } from "node:child_process";
import { mkdtempSync, symlinkSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import { get } from "node:http";
import { runInNewContext } from "node:vm";
const require = createRequire(import.meta.url);
const { startAppDev, serveApp } = require("../packages/cli/dist/apps/dev.js");
const { buildAppProject, verifyWebBuild } = require("../packages/cli/dist/apps/build.js");
const cli = resolve("packages/cli/dist/index.js");

test("full app dev serves backend, protects preview, rebuilds and shuts down", async () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-full-app-"));
  let dev;
  try {
    const result = spawnSync(process.execPath, [cli, "app", "create", "full", "--platform", "plain"], {
      cwd: parent,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const root = join(parent, "full");
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "dir");
    dev = await startAppDev(root, { localhost: true, open: false });
    assert.deepEqual(await (await fetch(dev.origin + "/api/hello")).json(), {
      message: "Hello from your app backend",
    });
    assert.equal((await fetch(dev.origin + "/_octonode/state")).status, 401);
    const headers = { authorization: `Bearer ${dev.secret}` };
    assert.equal((await fetch(dev.origin + "/_octonode/verify")).status, 401);
    assert.equal((await fetch(dev.origin + "/_octonode/verify", { headers })).status, 204);
    const state = await (await fetch(dev.origin + "/_octonode/state", { headers })).json();
    assert.equal(state.extensions.length, 2);
    assert.equal(state.session.token, "development-preview");
    const backend = join(root, "src/server.ts");
    writeFileSync(backend, readFileSync(backend, "utf8").replace("Hello from your app backend", "Updated backend"));
    await dev.rebuild();
    assert.equal((await (await fetch(dev.origin + "/api/hello")).json()).message, "Updated backend");
    writeFileSync(backend, "invalid {{{");
    await dev.rebuild();
    assert.equal((await (await fetch(dev.origin + "/api/hello")).json()).message, "Updated backend");
    assert.match((await (await fetch(dev.origin + "/_octonode/state", { headers })).json()).error, /Build failed/);
    dev.setOrigin("https://branded.example.test", "https://transport.trycloudflare.com");
    const withHost = (host) => new Promise((resolve, reject) => {
      get(dev.origin + "/_octonode/ping", { headers: { host } }, (response) => {
        response.resume();
        resolve(response.statusCode);
      }).on("error", reject);
    });
    assert.equal(await withHost("transport.trycloudflare.com"), 200);
    assert.equal(await withHost("evil.example.test"), 403);
    const origin = dev.origin;
    await dev.close();
    dev = undefined;
    await assert.rejects(fetch(origin));
  } finally {
    await dev?.close();
    rmSync(parent, { recursive: true, force: true });
  }
});

test("app dev uses the public Quick Tunnel even when signed in", async () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-default-tunnel-"));
  const auth = require("../packages/cli/dist/auth.js");
  const cloudflared = require("../packages/cli/dist/apps/cloudflared.js");
  const tunnel = require("../packages/cli/dist/apps/tunnel.js");
  const leases = require("../packages/cli/dist/apps/tunnel-lease.js");
  const original = [auth.accessToken, cloudflared.ensureCloudflared, tunnel.startTunnel, leases.registerTunnel];
  let dev;
  let registrations = 0;
  try {
    const result = spawnSync(process.execPath, [cli, "app", "create", "default", "--platform", "plain"], {
      cwd: parent,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const root = join(parent, "default");
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "dir");
    cloudflared.ensureCloudflared = async () => "/test/cloudflared";
    tunnel.startTunnel = (port) => ({ url: Promise.resolve(`http://127.0.0.1:${port}`), process: new EventEmitter(), stop() {} });
    leases.registerTunnel = async () => { registrations++; throw new Error("preview service offline"); };
    for (const token of [undefined, "signed-in"]) {
      auth.accessToken = async () => token;
      dev = await startAppDev(root, { open: false });
      assert.match(dev.origin, /^http:\/\/127\.0\.0\.1:\d+$/);
      assert.equal((await fetch(dev.origin + "/_octonode/ping")).status, 200);
      await dev.close();
      dev = undefined;
    }
    assert.equal(registrations, 0);
  } finally {
    await dev?.close();
    [auth.accessToken, cloudflared.ensureCloudflared, tunnel.startTunnel, leases.registerTunnel] = original;
    rmSync(parent, { recursive: true, force: true });
  }
});

test("full app release requires a production URL and separates server code from registration", async () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-full-release-"));
  try {
    const result = spawnSync(process.execPath, [cli, "app", "create", "full", "--platform", "plain"], {
      cwd: parent,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const root = join(parent, "full");
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "dir");
    await assert.rejects(buildAppProject(root), /applicationUrl/);
    const descriptorPath = join(root, "octonode.app.json");
    const descriptor = JSON.parse(readFileSync(descriptorPath, "utf8"));
    descriptor.web.requestedActions = ["data:read"];
    writeFileSync(descriptorPath, JSON.stringify(descriptor));
    const built = await buildAppProject(root, "https://example.com");
    assert.deepEqual(built.manifest.app.requestedActions, ["data:read"]);
    assert.equal(built.manifest.app.hosting, "self-hosted");
    assert.equal(
      built.manifest.app.extensions[0].url,
      `https://example.com/extensions/${built.manifest.app.extensions[0].sha256.slice(7)}.js`,
    );
    assert.equal(verifyWebBuild(built.webDirectory).applicationUrl, "https://example.com");
    const typecheck = spawnSync(process.execPath, [resolve("node_modules/typescript/bin/tsc"), "--noEmit"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(typecheck.status, 0, typecheck.stdout + typecheck.stderr);
    const smoke = spawnSync(process.execPath, ["--test", "tests/app.test.cjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(smoke.status, 0, smoke.stdout + smoke.stderr);
    const oldExtension = built.manifest.app.extensions[0];
    const oldBytes = readFileSync(join(built.webDirectory, "extensions", oldExtension.sha256.slice(7) + ".js"), "utf8");
    const entry = join(root, "src/extensions/notice.tsx");
    writeFileSync(entry, readFileSync(entry, "utf8").replace("Welcome to the workspace", "Version two"));
    const originalId = descriptor.extensions[0].id;
    descriptor.extensions[0].id = oldExtension.sha256.slice(7);
    writeFileSync(descriptorPath, JSON.stringify(descriptor));
    await assert.rejects(buildAppProject(root, "https://example.com"), /reserved for immutable assets/);
    descriptor.extensions[0].id = originalId;
    descriptor.version = "0.2.0";
    writeFileSync(descriptorPath, JSON.stringify(descriptor));
    const updated = await buildAppProject(root, "https://example.com");
    assert.notEqual(updated.manifest.app.extensions[0].sha256, oldExtension.sha256);
    const production = await serveApp(built.webDirectory, 0);
    try {
      const url = `http://127.0.0.1:${production.port}`;
      assert.equal((await fetch(url + "/api/hello")).status, 200);
      const html = await (await fetch(url)).text();
      const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
      for (const [token, status] of [
        ["test-app-token", 200],
        ["expired-token", 401],
        ["", 200],
      ]) {
        const output = { textContent: "" };
        let cleared = false;
        let sent = false;
        runInNewContext(script, {
          URLSearchParams,
          location: { hash: token ? `#octonode_session=${token}` : "", pathname: "/", search: "" },
          history: {
            replaceState(_a, _b, path) {
              assert.equal(path, "/");
              cleared = true;
            },
          },
          document: {
            getElementById() {
              return output;
            },
          },
          fetch: async (path, options) => {
            sent = true;
            assert.equal(path, "/api/context");
            assert.equal(options.headers.authorization, `Bearer ${token}`);
            return {
              ok: status === 200,
              json: async () => ({ workspace: { kind: "team", id: "alpha" } }),
            };
          },
        });
        await new Promise((resolve) => setImmediate(resolve));
        assert.ok(cleared);
        assert.equal(sent, !!token);
        assert.match(
          output.textContent,
          token
            ? status === 200
              ? /Connected to team:alpha/
              : /expired or access was revoked/
            : /Open this app from Octonode/,
        );
      }

      assert.equal(await (await fetch(url + new URL(oldExtension.url).pathname)).text(), oldBytes);
      assert.equal((await fetch(url + new URL(updated.manifest.app.extensions[0].url).pathname)).status, 200);
      assert.equal((await fetch(url + "/_octonode/state")).status, 404);
      assert.equal((await fetch(url + "/src/server.ts")).status, 404);
      assert.equal((await fetch(url + "/extensions/notice.js")).status, 200);
    } finally {
      await production.close();
    }
    const child = spawn(process.execPath, [join(built.webDirectory, "start.cjs")], {
      cwd: parent,
      env: { ...process.env, PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(Error("Standalone launch timed out")), 5000);
        child.stdout.once("data", () => {
          clearTimeout(timeout);
          resolve();
        });
        child.once("exit", (code) => {
          clearTimeout(timeout);
          reject(Error(`Standalone exit ${code}`));
        });
      });
    } finally {
      child.kill();
      await new Promise((resolve) => child.once("exit", resolve));
    }
    writeFileSync(join(built.webDirectory, "server.cjs"), "tampered");
    assert.throws(() => verifyWebBuild(built.webDirectory), /changed/);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test("publisher dev sessions refresh and revoke; publication sends fresh verified bundles", async () => {
  const { createServer } = await import("node:http");
  const { createDevelopmentSession } = require("../packages/cli/dist/apps/development.js");
  const { publishApp } = require("../packages/cli/dist/apps/publish.js");
  const { readAppSource } = require("../packages/cli/dist/apps/source.js");
  const parent = mkdtempSync(join(tmpdir(), "octonodes-publisher-"));
  const previous = {
    token: process.env.OCTONODE_TOKEN,
    app: process.env.OCTONODE_APP_ID,
    api: process.env.OCTONODE_API_URL,
  };
  const requests = [];
  let revision = 0;
  let session;
  const id = "00000000-0000-4000-8000-000000000001";
  const server = createServer(async (request, response) => {
    let text = "";
    for await (const chunk of request) text += chunk;
    requests.push({
      method: request.method,
      url: request.url,
      auth: request.headers.authorization,
      body: text ? JSON.parse(text) : undefined,
    });
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ id, revision: ++revision, expiresAt: Date.now() + 600_000 }));
  });
  try {
    process.env.OCTONODE_TOKEN = "test-publisher-token";
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const result = spawnSync(process.execPath, [cli, "app", "create", "draft", "--template", "extension"], {
      cwd: parent,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const root = join(parent, "draft");
    symlinkSync(resolve("node_modules"), join(root, "node_modules"));
    const built = await buildAppProject(root);
    session = await createDevelopmentSession("user:owner", baseUrl, baseUrl);
    await session.sync(readAppSource(root), built, built.directory);
    assert.equal(session.url, `${baseUrl}/studio/apps/development/${id}`);
    await session.sync();
    await session.close();
    session = undefined;
    assert.equal(requests[0].body.expectedRevision, 0);
    assert.equal(requests[1].body.expectedRevision, 1);
    assert.equal(requests[2].method, "DELETE");
    assert.equal(requests[0].auth, "Bearer test-publisher-token");
    await publishApp(root, { workspace: "user:owner", baseUrl });
    assert.equal(requests[3].url, "/api/marketplace/publisher/apps");
    assert.equal(requests[3].body.app.hosting, "extension-only");
    assert.equal(requests[3].body.bundles[0].code, readFileSync(join(built.directory, "extensions/notice.js"), "utf8"));
    await publishApp(root, { workspace: "user:owner", baseUrl, appId: id, revision: 7 });
    assert.equal(requests[4].body.expectedRevision, 7);
    assert.equal(requests[4].url, `/api/marketplace/publisher/apps/${id}/versions`);
    await assert.rejects(publishApp(root, { workspace: "user:owner", baseUrl, appId: id }), /revision/);
  } finally {
    await session?.close();
    await new Promise((resolve) => server.close(resolve));
    for (const [key, value] of Object.entries({
      OCTONODE_TOKEN: previous.token,
      OCTONODE_APP_ID: previous.app,
      OCTONODE_API_URL: previous.api,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    rmSync(parent, { recursive: true, force: true });
  }
});

test("tunnel origins reject URL credentials and startup failure is actionable", async () => {
  const { publicOrigin, startTunnel } = require("../packages/cli/dist/apps/tunnel.js");
  assert.equal(publicOrigin("https://example.com/"), "https://example.com");
  for (const url of [
    "http://example.com",
    "https://user@example.com",
    "https://example.com/path",
    "https://example.com/?key=secret",
  ])
    assert.throws(() => publicOrigin(url));
  await assert.rejects(startTunnel(3000, "/nonexistent-octonode-cloudflared").url, /Could not start the tunnel helper/);
});

test("managed tunnel setup verifies downloads, reuses cache and recovers from corruption", async (t) => {
  const { createHash } = await import("node:crypto");
  const { readdirSync } = await import("node:fs");
  const { c } = require("tar");
  const { ensureCloudflared } = require("../packages/cli/dist/apps/cloudflared.js");
  const { CLOUDFLARED_ASSETS } = require("../packages/cli/dist/apps/constants.js");
  const root = mkdtempSync(join(tmpdir(), "octonodes-tunnel-cache-"));
  const bytes = Buffer.from("test-only tunnel binary");
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  let downloads = 0;
  let payload = bytes;
  let status = 200;
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.match(String(url), /^https:\/\/github.com\/cloudflare\/cloudflared\/releases\/download\//);
    downloads++;
    return new Response(payload, { status });
  });
  CLOUDFLARED_ASSETS["test-raw"] = { file: "test", sha256 };
  try {
    const path = await ensureCloudflared(undefined, root, "test-raw");
    assert.deepEqual(readFileSync(path), bytes);
    assert.equal(await ensureCloudflared(undefined, root, "test-raw"), path);
    assert.equal(downloads, 1);
    writeFileSync(path, "corrupted cache");
    payload = Buffer.from("bad download");
    await assert.rejects(ensureCloudflared(undefined, root, "test-raw"), /checksum mismatch/);
    assert.deepEqual(readdirSync(join(path, "..")), ["cloudflared"]);
    status = 503;
    await assert.rejects(ensureCloudflared(undefined, root, "test-raw"), /HTTP 503/);
    status = 200;
    payload = bytes;
    await ensureCloudflared(undefined, root, "test-raw");
    assert.deepEqual(readFileSync(path), bytes);
    writeFileSync(join(root, "cloudflared"), bytes);
    await c({ cwd: root, gzip: true, file: join(root, "asset.tgz") }, ["cloudflared"]);
    payload = readFileSync(join(root, "asset.tgz"));
    CLOUDFLARED_ASSETS["test-tar"] = {
      file: "test.tgz",
      sha256: createHash("sha256").update(payload).digest("hex"),
      binarySha256: sha256,
    };
    assert.deepEqual(readFileSync(await ensureCloudflared(undefined, root, "test-tar")), bytes);
    writeFileSync(path, "corrupted cache");
    payload = bytes;
    await assert.rejects(ensureCloudflared(AbortSignal.abort(), root, "test-raw"), /aborted/);
    await assert.rejects(ensureCloudflared(undefined, root, "unsupported"), /--tunnel-url/);
  } finally {
    delete CLOUDFLARED_ASSETS["test-raw"];
    delete CLOUDFLARED_ASSETS["test-tar"];
    rmSync(root, { recursive: true, force: true });
  }
});
