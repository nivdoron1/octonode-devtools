import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createServer, get } from "node:http";
import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const sdk = require("../packages/sdk/dist/index.js");
const cliAuth = require("../packages/cli/dist/auth.js");
const cliPackage = require("../packages/cli/package.json");

function testJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  return `${header}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.c2ln`;
}

test("SDK client configures the cloud origin and bearer token", async () => {
  const requests = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    requests.push(new Request(input));
    return Response.json({ status: "ok" });
  };
  try {
    assert.throws(() => sdk.createClient(" "), /token is required/);
    assert.throws(() => sdk.createClient("token", { url: "ftp://example.test" }), /HTTP or HTTPS/);
    const first = sdk.createClient("first-token");
    const second = sdk.createClient("second-token", {
      url: "https://second.example.test/",
      headers: { "x-octonode-test": "custom-header" },
    });
    assert.ok(first instanceof sdk.OctonodeClient);
    await first.projects.api.get();
    await second.projects.api.get();
    await second.projects.api.projectId.get({ path: { projectId: "project 1" } });
    assert.equal(requests[0].url, "https://api.octonode.dev/api/store/projects");
    assert.equal(requests[0].headers.get("authorization"), "Bearer first-token");
    assert.equal(requests[1].url, "https://second.example.test/api/store/projects");
    assert.equal(requests[1].headers.get("authorization"), "Bearer second-token");
    assert.equal(requests[1].headers.get("x-octonode-test"), "custom-header");
    assert.equal(requests[2].url, "https://second.example.test/api/projects/project%201");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("CLI exposes generated SDK operations", () => {
  const result = spawnSync(process.execPath, ["packages/cli/dist/index.js", "operations", "projects"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /projects\.api\.get/);

  const version = spawnSync(process.execPath, ["packages/cli/dist/index.js", "--version"], {
    encoding: "utf8",
  });
  assert.equal(version.stdout.trim(), cliPackage.version);
  assert.deepEqual(cliPackage.bin, { octonodes: "dist/index.js" });
});

test("CLI generates scoped MCP client configuration without storing a token", () => {
  const args = [
    "packages/cli/dist/index.js",
    "connect",
    "codex",
    "--workspace",
    "org:workspace-1",
    "--project",
    "project-1",
    "--project",
    "project-2",
  ];
  const codex = spawnSync(process.execPath, args, { encoding: "utf8" });
  assert.equal(codex.status, 0, codex.stderr);
  assert.match(codex.stdout, /https:\/\/mcp\.octonode\.dev\/mcp/);
  assert.match(codex.stdout, /http_headers_helper/);
  assert.doesNotMatch(codex.stdout, /octo_pat_test/);

  const claude = spawnSync(process.execPath, [...args.slice(0, 2), "claude", ...args.slice(3)], {
    encoding: "utf8",
  });
  assert.equal(claude.status, 0, claude.stderr);
  assert.match(claude.stdout, /claude mcp add-json/);
  assert.match(claude.stdout, /\$\{OCTONODE_TOKEN\}/);

  const cursor = spawnSync(process.execPath, [
    ...args.slice(0, 2), "cursor", ...args.slice(3), "--worktree", "worktree-1",
  ], { encoding: "utf8", env: { ...process.env, OCTONODE_TOKEN: "must-not-leak" } });
  assert.equal(cursor.status, 0, cursor.stderr);
  assert.deepEqual(JSON.parse(cursor.stdout), {
    mcpServers: {
      octonode: {
        url: "https://mcp.octonode.dev/mcp",
        headers: {
          Authorization: "Bearer ${env:OCTONODE_TOKEN}",
          "x-octonode-workspace": "org:workspace-1",
          "x-octonode-project": "project-1",
          "x-octonode-projects": '["project-1","project-2"]',
          "x-octonode-worktree": "worktree-1",
        },
      },
    },
  });
  const invalidCursor = spawnSync(process.execPath, [
    ...args.slice(0, 2), "cursor", "--workspace", "invalid", "--project", "project-1",
  ], { encoding: "utf8" });
  assert.notEqual(invalidCursor.status, 0);
  assert.equal(invalidCursor.stdout, "");

  const headers = spawnSync(process.execPath, [...args.slice(0, 2), "headers", ...args.slice(3)], {
    encoding: "utf8",
    env: { ...process.env, OCTONODE_TOKEN: "octo_pat_test" },
  });
  assert.equal(headers.status, 0, headers.stderr);
  assert.deepEqual(JSON.parse(headers.stdout), {
    Authorization: "Bearer octo_pat_test",
    "x-octonode-workspace": "org:workspace-1",
    "x-octonode-project": "project-1",
    "x-octonode-projects": '["project-1","project-2"]',
  });
});

test("CLI consumes generated SSE operations as JSON Lines", async () => {
  let authorization;
  const server = createServer((request, response) => {
    authorization = request.headers.authorization;
    response.writeHead(200, { "content-type": "text/event-stream" });
    response.end('data: {"status":"started"}\n\ndata: {"status":"completed"}\n\n');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try {
    const result = await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          "packages/cli/dist/index.js",
          "workflows.api.workflowId.run.post",
          "--base-url",
          `http://127.0.0.1:${address.port}`,
          "--input",
          '{"path":{"workflowId":"daily"},"body":{}}',
        ],
        { env: { ...process.env, OCTONODE_TOKEN: "stream-token" } },
      );
      let stdout = "";
      let stderr = "";
      child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk));
      child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk));
      child.once("error", reject);
      child.once("close", (status) => resolve({ status, stdout, stderr }));
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '{"status":"started"}\n{"status":"completed"}\n');
    assert.equal(authorization, "Bearer stream-token");
  } finally {
    server.close();
  }
});

test("CLI login stores a reusable token with user-only permissions", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-cli-"));
  const env = { ...process.env, OCTONODE_CONFIG_DIR: configDir };
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalToken = process.env.OCTONODE_TOKEN;
  process.env.OCTONODE_CONFIG_DIR = configDir;
  delete process.env.OCTONODE_TOKEN;
  try {
    const login = spawnSync(process.execPath, ["packages/cli/dist/index.js", "login", "--token", "octo_pat_test"], {
      encoding: "utf8",
      env,
    });
    assert.equal(login.status, 0, login.stderr);
    assert.match(login.stdout, /Finished octonodes login/);

    const tokenPath = join(configDir, "access-token");
    assert.equal(readFileSync(tokenPath, "utf8"), "octo_pat_test\n");
    assert.equal(await cliAuth.accessToken(), "octo_pat_test");
    if (process.platform !== "win32") assert.equal(statSync(tokenPath).mode & 0o777, 0o600);

    const logout = spawnSync(process.execPath, ["packages/cli/dist/index.js", "logout"], {
      encoding: "utf8",
      env,
    });
    assert.equal(logout.status, 0, logout.stderr);
    assert.equal(logout.stdout, "Logged out.\n");
    assert.throws(() => statSync(tokenPath), { code: "ENOENT" });

    const repeated = spawnSync(process.execPath, ["packages/cli/dist/index.js", "logout"], {
      encoding: "utf8",
      env,
    });
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal(repeated.stdout, "No saved login found.\n");

    const environmentToken = spawnSync(process.execPath, ["packages/cli/dist/index.js", "logout"], {
      encoding: "utf8",
      env: { ...env, OCTONODE_TOKEN: "octo_pat_environment" },
    });
    assert.match(environmentToken.stdout, /OCTONODE_TOKEN is still set/);
  } finally {
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    if (originalToken === undefined) delete process.env.OCTONODE_TOKEN;
    else process.env.OCTONODE_TOKEN = originalToken;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI signs Studio users in through Supabase and restores their session", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-supabase-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalToken = process.env.OCTONODE_TOKEN;
  const originalFetch = globalThis.fetch;
  const accessToken = testJwt({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "user-1" });
  const user = {
    id: "user-1",
    aud: "authenticated",
    role: "authenticated",
    email: "user@example.test",
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: new Date(0).toISOString(),
  };
  const requests = [];
  process.env.OCTONODE_CONFIG_DIR = configDir;
  delete process.env.OCTONODE_TOKEN;
  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    requests.push(request);
    if (request.url === "https://api.test/api/auth/config") {
      return Response.json({ supabaseUrl: "https://auth.test", supabasePublishableKey: "publishable-key" });
    }
    if (request.url === "https://auth.test/auth/v1/otp") return Response.json({});
    if (request.url === "https://auth.test/auth/v1/verify") {
      return Response.json({
        access_token: accessToken,
        refresh_token: "refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user,
      });
    }
    if (request.url === "https://auth.test/auth/v1/user") return Response.json(user);
    return Response.json({ message: `unexpected request: ${request.url}` }, { status: 500 });
  };

  try {
    const message = await cliAuth.login("https://api.test", { email: user.email, code: "123456" });
    assert.match(message, /user@example\.test/);
    assert.equal(await cliAuth.accessToken(), accessToken);
    const session = JSON.parse(readFileSync(join(configDir, "session.json"), "utf8"));
    assert.equal(session.refreshToken, "refresh-token");
    assert.deepEqual(
      requests.map((request) => new URL(request.url).pathname),
      ["/api/auth/config", "/auth/v1/otp", "/auth/v1/verify", "/auth/v1/user"],
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    if (originalToken === undefined) delete process.env.OCTONODE_TOKEN;
    else process.env.OCTONODE_TOKEN = originalToken;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI signs Studio users in through GitHub browser OAuth", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-oauth-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalFetch = globalThis.fetch;
  const accessToken = testJwt({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "user-2" });
  const user = {
    id: "user-2",
    aud: "authenticated",
    role: "authenticated",
    email: "github@example.test",
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: new Date(0).toISOString(),
  };
  const requests = [];
  process.env.OCTONODE_CONFIG_DIR = configDir;
  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    requests.push(request);
    if (request.url === "https://api.test/api/auth/config") {
      return Response.json({ supabaseUrl: "https://auth.test", supabasePublishableKey: "publishable-key" });
    }
    if (request.url.startsWith("https://auth.test/auth/v1/token?grant_type=pkce")) {
      return Response.json({
        access_token: accessToken,
        refresh_token: "github-refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user,
      });
    }
    return Response.json({ message: `unexpected request: ${request.url}` }, { status: 500 });
  };

  try {
    const message = await cliAuth.login("https://api.test", {
      openBrowser: async (authorizationUrl) => {
        const authorization = new URL(authorizationUrl);
        assert.ok(authorization.searchParams.get("code_challenge"));
        assert.equal(authorization.searchParams.get("code_challenge_method"), "s256");
        const redirectTo = authorization.searchParams.get("redirect_to");
        assert.ok(redirectTo);
        await new Promise((resolve, reject) => {
          get(`${redirectTo}?code=github-auth-code`, (response) => {
            response.resume();
            response.once("end", resolve);
          }).once("error", reject);
        });
      },
    });
    assert.match(message, /github@example\.test/);
    const tokenRequest = requests.find((request) => request.url.includes("grant_type=pkce"));
    assert.ok(tokenRequest);
    const tokenBody = JSON.parse(await tokenRequest.text());
    assert.equal(tokenBody.auth_code, "github-auth-code");
    assert.ok(tokenBody.code_verifier);
    const session = JSON.parse(readFileSync(join(configDir, "session.json"), "utf8"));
    assert.equal(session.refreshToken, "github-refresh-token");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI reports rejected GitHub browser login", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-oauth-rejected-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalFetch = globalThis.fetch;
  process.env.OCTONODE_CONFIG_DIR = configDir;
  globalThis.fetch = async (input) => {
    const request = new Request(input);
    if (request.url === "https://api.test/api/auth/config") {
      return Response.json({ supabaseUrl: "https://auth.test", supabasePublishableKey: "publishable-key" });
    }
    return Response.json({ message: `unexpected request: ${request.url}` }, { status: 500 });
  };

  try {
    await assert.rejects(
      cliAuth.login("https://api.test", {
        openBrowser: async (authorizationUrl) => {
          const redirectTo = new URL(authorizationUrl).searchParams.get("redirect_to");
          assert.ok(redirectTo);
          await new Promise((resolve, reject) => {
            get(`${redirectTo}?error=access_denied&error_description=User%20denied`, (response) => {
              assert.equal(response.statusCode, 400);
              response.resume();
              response.once("end", resolve);
            }).once("error", reject);
          });
        },
      }),
      /User denied/,
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI validates auth configuration and saved sessions", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-invalid-auth-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalToken = process.env.OCTONODE_TOKEN;
  const originalFetch = globalThis.fetch;
  process.env.OCTONODE_CONFIG_DIR = configDir;
  delete process.env.OCTONODE_TOKEN;

  try {
    globalThis.fetch = async () => Response.json({ message: "unavailable" }, { status: 503 });
    await assert.rejects(
      cliAuth.login("https://api.test", { email: "user@example.test", code: "123456" }),
      /HTTP 503/,
    );

    globalThis.fetch = async () => Response.json({ supabaseUrl: "https://auth.test" });
    await assert.rejects(
      cliAuth.login("https://api.test", { email: "user@example.test", code: "123456" }),
      /invalid login configuration/,
    );

    globalThis.fetch = async (input) => {
      const request = new Request(input);
      if (request.url.endsWith("/api/auth/config")) {
        return Response.json({ supabaseUrl: "https://auth.test", supabasePublishableKey: "publishable-key" });
      }
      return Response.json({});
    };
    await assert.rejects(cliAuth.login("https://api.test", { email: " ", code: " " }), /email is required/);

    writeFileSync(join(configDir, "session.json"), "{}\n");
    await assert.rejects(cliAuth.accessToken(), /saved login is invalid/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    if (originalToken === undefined) delete process.env.OCTONODE_TOKEN;
    else process.env.OCTONODE_TOKEN = originalToken;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI refreshes and revokes a saved Studio session", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-refresh-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalToken = process.env.OCTONODE_TOKEN;
  const originalFetch = globalThis.fetch;
  const refreshedToken = testJwt({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "user-3" });
  const user = {
    id: "user-3",
    aud: "authenticated",
    role: "authenticated",
    email: "refresh@example.test",
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: new Date(0).toISOString(),
  };
  const requests = [];
  process.env.OCTONODE_CONFIG_DIR = configDir;
  delete process.env.OCTONODE_TOKEN;
  writeFileSync(
    join(configDir, "session.json"),
    `${JSON.stringify({
      supabaseUrl: "https://auth.test",
      supabasePublishableKey: "publishable-key",
      accessToken: testJwt({ exp: 0, sub: user.id }),
      refreshToken: "old-refresh-token",
    })}\n`,
  );
  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    requests.push(request);
    if (request.url.includes("/auth/v1/token?grant_type=refresh_token")) {
      return Response.json({
        access_token: refreshedToken,
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user,
      });
    }
    if (request.url.endsWith("/auth/v1/user")) return Response.json(user);
    if (request.url.includes("/auth/v1/logout")) return Response.json({});
    return Response.json({ message: `unexpected request: ${request.url}` }, { status: 500 });
  };

  try {
    assert.equal(await cliAuth.accessToken(), refreshedToken);
    assert.equal(JSON.parse(readFileSync(join(configDir, "session.json"), "utf8")).refreshToken, "new-refresh-token");
    assert.deepEqual(await cliAuth.logout(), { removed: true });
    assert.throws(() => statSync(join(configDir, "session.json")), { code: "ENOENT" });
    assert.ok(requests.some((request) => request.url.includes("grant_type=refresh_token")));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    if (originalToken === undefined) delete process.env.OCTONODE_TOKEN;
    else process.env.OCTONODE_TOKEN = originalToken;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI removes an expired saved session even when revocation fails", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-expired-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalFetch = globalThis.fetch;
  process.env.OCTONODE_CONFIG_DIR = configDir;
  mkdirSync(configDir, { recursive: true });
  writeFileSync(
    join(configDir, "session.json"),
    `${JSON.stringify({
      supabaseUrl: "https://auth.test",
      supabasePublishableKey: "publishable-key",
      accessToken: testJwt({ exp: 0, sub: "expired-user" }),
      refreshToken: "expired-refresh-token",
    })}\n`,
  );
  globalThis.fetch = async () => Response.json({ message: "refresh token expired" }, { status: 401 });

  try {
    await assert.rejects(cliAuth.accessToken(), /saved login expired: refresh token expired/);
    const result = await cliAuth.logout();
    assert.equal(result.removed, true);
    assert.match(result.warning, /could not be revoked/);
    assert.throws(() => statSync(join(configDir, "session.json")), { code: "ENOENT" });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI reports Supabase email login failures", async () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-email-errors-"));
  const originalConfigDir = process.env.OCTONODE_CONFIG_DIR;
  const originalFetch = globalThis.fetch;
  let failure = "send";
  process.env.OCTONODE_CONFIG_DIR = configDir;
  globalThis.fetch = async (input) => {
    const request = new Request(input);
    if (request.url.endsWith("/api/auth/config")) {
      return Response.json({ supabaseUrl: "https://auth.test", supabasePublishableKey: "publishable-key" });
    }
    if (request.url.endsWith("/auth/v1/otp")) {
      return failure === "send"
        ? Response.json({ message: "email delivery failed" }, { status: 400 })
        : Response.json({});
    }
    if (request.url.endsWith("/auth/v1/verify")) {
      return Response.json({ message: "invalid verification code" }, { status: 400 });
    }
    return Response.json({ message: `unexpected request: ${request.url}` }, { status: 500 });
  };

  try {
    await assert.rejects(
      cliAuth.login("https://api.test", { email: "user@example.test", code: "123456" }),
      /email delivery failed/,
    );
    failure = "verify";
    await assert.rejects(
      cliAuth.login("https://api.test", { email: "user@example.test", code: "123456" }),
      /invalid verification code/,
    );
    await assert.rejects(
      cliAuth.login("https://api.test", { email: "user@example.test", code: " " }),
      /verification code is required/,
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (originalConfigDir === undefined) delete process.env.OCTONODE_CONFIG_DIR;
    else process.env.OCTONODE_CONFIG_DIR = originalConfigDir;
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI rejects unknown operations and invalid input", () => {
  const configDir = mkdtempSync(join(tmpdir(), "octonodes-invalid-input-"));
  const unauthenticatedEnv = { ...process.env, OCTONODE_CONFIG_DIR: configDir };
  delete unauthenticatedEnv.OCTONODE_TOKEN;
  try {
    const unknown = spawnSync(process.execPath, ["packages/cli/dist/index.js", "not.an.operation"], {
      encoding: "utf8",
      env: unauthenticatedEnv,
    });
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /unknown operation/);

    const noToken = spawnSync(process.execPath, ["packages/cli/dist/index.js", "projects.api.get"], {
      encoding: "utf8",
      env: unauthenticatedEnv,
    });
    assert.equal(noToken.status, 1);
    assert.match(noToken.stderr, /octonodes login/);

    const authenticatedEnv = { ...unauthenticatedEnv, OCTONODE_TOKEN: "octo_pat_test" };
    const invalidInput = spawnSync(
      process.execPath,
      ["packages/cli/dist/index.js", "projects.api.get", "--input", "[]"],
      { encoding: "utf8", env: authenticatedEnv },
    );
    assert.equal(invalidInput.status, 1);
    assert.match(invalidInput.stderr, /--input must be a JSON object/);

    const missingInput = spawnSync(process.execPath, ["packages/cli/dist/index.js", "projects.api.get", "--input"], {
      encoding: "utf8",
      env: authenticatedEnv,
    });
    assert.equal(missingInput.status, 1);
    assert.match(missingInput.stderr, /--input requires a value/);
  } finally {
    rmSync(configDir, { recursive: true, force: true });
  }
});

test("CLI supports every help spelling globally and per command", () => {
  for (const flag of ["-h", "--h", "--help"]) {
    const result = spawnSync(process.execPath, ["packages/cli/dist/index.js", flag], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /octonodes login/);
  }

  const login = spawnSync(process.execPath, ["packages/cli/dist/index.js", "login", "--help"], { encoding: "utf8" });
  assert.equal(login.status, 0, login.stderr);
  assert.match(login.stdout, /octonodes login --email <email>/);
  assert.match(login.stdout, /octonodes login --token <api-token>/);

  for (const topic of ["operations", "logout", "projects.api.get"]) {
    const result = spawnSync(process.execPath, ["packages/cli/dist/index.js", topic, "--help"], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`octonodes ${topic.replaceAll(".", "\\.")}`));
  }
});
