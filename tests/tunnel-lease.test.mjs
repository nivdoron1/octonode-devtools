import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { registerTunnel } = require("../packages/cli/dist/apps/tunnel-lease.js");

test("branded tunnel client registers, renews and revokes without provider credentials", async () => {
  const previous = process.env.OCTONODE_TOKEN;
  process.env.OCTONODE_TOKEN = "test-login";
  const requests = [];
  const id = "bright-coral-otter";
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push({ method: request.method, path: request.url, auth: request.headers.authorization, body: body ? JSON.parse(body) : undefined });
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(request.method === "DELETE" ? { ok: true } : { id, url: "https://preview.example.test", expiresAt: Date.now() + 600_000 }));
  });
  try {
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const lease = await registerTunnel("https://test.trycloudflare.com", "x".repeat(43), "user:owner", baseUrl);
    assert.equal(lease.url, "https://preview.example.test");
    await lease.renew();
    await lease.close();
    await lease.renew();
    assert.deepEqual(requests.map(({ method }) => method), ["POST", "POST", "DELETE"]);
    assert.deepEqual(requests[0].body, { upstream: "https://test.trycloudflare.com", previewToken: "x".repeat(43), workspace: { kind: "user", id: "owner" } });
    assert.equal(requests[0].auth, "Bearer test-login");
    assert.equal(requests[1].path, `/api/marketplace/publisher/app-tunnels/${id}`);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    if (previous === undefined) delete process.env.OCTONODE_TOKEN;
    else process.env.OCTONODE_TOKEN = previous;
  }
});
