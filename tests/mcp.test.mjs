import assert from "node:assert/strict";
import test from "node:test";
import worker from "../packages/mcp/dist/index.js";

const context = { waitUntil() {}, passThroughOnException() {} };

function request(method, params = {}, headers = {}) {
  return new Request("https://octonode.test/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      authorization: "Bearer octo_test",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
}

async function payload(response) {
  const text = await response.text();
  const data = text.match(/^data: (.+)$/m)?.[1];
  assert.ok(data, text);
  return JSON.parse(data);
}

test("health and MCP authentication", async () => {
  const health = await worker.fetch(new Request("https://octonode.test/health"), {}, context);
  assert.deepEqual(await health.json(), { ok: true });

  const unauthorized = await worker.fetch(
    new Request("https://octonode.test/mcp", { method: "POST" }),
    {},
    context,
  );
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get("www-authenticate"), "Bearer");

  const fallback = await worker.fetch(new Request("https://octonode.test/"), {}, context);
  assert.match(await fallback.text(), /connect a client to \/mcp/);
});

test("lists the curated Octonode tools", async () => {
  const response = await worker.fetch(request("tools/list"), {}, context);
  const body = await payload(response);
  assert.equal(response.status, 200);
  assert.deepEqual(
    body.result.tools.map(({ name }) => name),
    [
      "platform_capabilities",
      "profile_get",
      "profile_avatar_get",
      "workspace_members",
      "conversations",
      "conversation_members",
      "messages",
      "notifications",
      "github_repositories",
      "pull_requests",
      "pull_request",
      "workflow_diff",
      "review_file",
      "review_threads",
      "github_job",
      "project_pull_request_file",
      "project_pull_requests",
      "project_pull_request",
      "project_knowledge_search",
      "project_context",
      "project_source_index",
      "project_file_read",
      "project_file_create",
      "project_file_write",
      "project_validate",
      "project_nodes",
      "project_node_source_read",
      "project_node_source_write",
      "project_node_signature_write",
      "project_workflows",
      "project_workflow_graph",
      "project_workflow_create",
      "project_workflow_save",
      "project_workflow_validate_connection",
      "project_native_nodes",
      "project_native_materialize",
      "project_plugins",
      "project_plugin",
      "project_plugin_node_add",
      "project_runs",
      "project_run",
      "project_workflow_run",
      "project_workflow_cancel",
    ],
  );
  assert.equal(body.result.tools[0].description, "Read the server-declared platform mode and feature availability.");
  assert.deepEqual(body.result.tools[18].inputSchema.required, ["query"]);
});

test("publishes the authoring instructions and resources", async () => {
  const initialized = await payload(
    await worker.fetch(
      request("initialize", {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test", version: "1" },
      }),
      {},
      context,
    ),
  );
  assert.deepEqual(initialized.result.serverInfo, { name: "octonode", version: "0.1.0" });
  assert.match(initialized.result.instructions, /project_knowledge_search/);

  const listed = await payload(await worker.fetch(request("resources/list"), {}, context));
  assert.deepEqual(
    listed.result.resources.map(({ uri }) => uri),
    ["octonode://guidance/code-author", "octonode://references/index"],
  );

  const resource = await payload(
    await worker.fetch(
      request("resources/read", { uri: "octonode://references/index" }),
      {},
      context,
    ),
  );
  assert.match(resource.result.contents[0].text, /docs\/security\.md/);
});

test("forwards scope and the caller token through the Octonode SDK", async () => {
  const originalFetch = globalThis.fetch;
  let apiRequest;
  globalThis.fetch = async (input) => {
    apiRequest = input;
    return Response.json({ id: "project-1", name: "Test" });
  };

  try {
    const response = await worker.fetch(
      request(
        "tools/call",
        { name: "project_context", arguments: {} },
        {
          "x-octonode-workspace": "org:test",
          "x-octonode-project": "project-1",
          "x-octonode-worktree": "feature/test",
        },
      ),
      { OCTONODE_API_URL: "https://api.example.test" },
      context,
    );
    const body = await payload(response);
    assert.equal(body.result.isError, undefined);
    assert.match(body.result.content[0].text, /"ok": true/);
    const url = new URL(apiRequest.url);
    assert.equal(url.origin, "https://api.example.test");
    assert.equal(url.pathname, "/api/projects/project-1/files");
    assert.equal(url.searchParams.get("workspace"), "org:test");
    assert.equal(url.searchParams.get("project"), "project-1");
    assert.equal(apiRequest.headers.get("authorization"), "Bearer octo_test");
    assert.equal(apiRequest.headers.get("x-octonode-worktree"), "feature/test");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("plugin inspection forwards import identity metadata without changing scope", async () => {
  const originalFetch = globalThis.fetch;
  let apiRequest;
  const plugin = { id: "jira", version: "1.0.0", nodes: [{ id: "create", source: { kind: "plugin" }, libraryExport: "createIssue", implementation: { module: "src/nodes.ts", export: "createIssueNode", parameters: ["summary"] } }] };
  globalThis.fetch = async input => { apiRequest = input; return Response.json(plugin); };
  try {
    const body = await payload(await worker.fetch(
      request("tools/call", { name: "project_plugin", arguments: { pluginId: "jira" } }, { "x-octonode-workspace": "org:test", "x-octonode-project": "project-1" }),
      { OCTONODE_API_URL: "https://api.example.test" }, context,
    ));
    assert.equal(body.result.isError, undefined);
    assert.match(body.result.content[0].text, /createIssueNode/);
    assert.match(body.result.content[0].text, /libraryExport/);
    const url = new URL(apiRequest.url);
    assert.equal(url.pathname, "/api/plugins/jira");
    assert.equal(url.searchParams.get("project"), "project-1");
    assert.equal(url.searchParams.get("limit"), "100");
  } finally { globalThis.fetch = originalFetch; }
});

test("returns tool errors when required scope is missing", async () => {
  const noWorkspace = await payload(
    await worker.fetch(
      request("tools/call", { name: "platform_capabilities", arguments: {} }),
      {},
      context,
    ),
  );
  assert.equal(noWorkspace.result.isError, true);
  assert.match(noWorkspace.result.content[0].text, /x-octonode-workspace/);

  const noProject = await payload(
    await worker.fetch(
      request(
        "tools/call",
        { name: "project_context", arguments: {} },
        { "x-octonode-workspace": "org:test" },
      ),
      {},
      context,
    ),
  );
  assert.equal(noProject.result.isError, true);
  assert.match(noProject.result.content[0].text, /projectId/);
});

test("forwards write bodies, project overrides, and API errors", async () => {
  const originalFetch = globalThis.fetch;
  const apiRequests = [];
  globalThis.fetch = async (input) => {
    apiRequests.push(input);
    if (new URL(input.url).pathname.endsWith("/compile")) {
      return Response.json({ message: "compile failed" }, { status: 422 });
    }
    return Response.json({ created: true });
  };

  try {
    const created = await payload(
      await worker.fetch(
        request(
          "tools/call",
          {
            name: "project_file_create",
            arguments: { projectId: "project-override", path: "src/a.ts", content: "export {};" },
          },
          { "x-octonode-workspace": "org:test", "x-octonode-project": "project-default" },
        ),
        {},
        context,
      ),
    );
    assert.equal(created.result.isError, undefined);
    assert.equal(new URL(apiRequests[0].url).pathname, "/api/projects/project-override/files/content");
    assert.deepEqual(await apiRequests[0].clone().json(), {
      path: "src/a.ts",
      content: "export {};",
    });
    assert.match(apiRequests[0].headers.get("idempotency-key"), /^[0-9a-f-]{36}$/);

    const failed = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "project_validate", arguments: { projectId: "project-override" } },
          { "x-octonode-workspace": "org:test" },
        ),
        {},
        context,
      ),
    );
    assert.equal(failed.result.isError, true);
    assert.deepEqual(JSON.parse(failed.result.content[0].text), {
      ok: false,
      error: { message: "compile failed", status: 422 },
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("restricts project overrides to the caller's authorized projects", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ ok: true });

  try {
    const allowed = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "project_context", arguments: { projectId: "project-2" } },
          {
            "x-octonode-workspace": "org:test",
            "x-octonode-project": "project-1",
            "x-octonode-projects": '["project-1","project-2"]',
          },
        ),
        {},
        context,
      ),
    );
    assert.equal(allowed.result.isError, undefined);

    const denied = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "project_context", arguments: { projectId: "project-3" } },
          {
            "x-octonode-workspace": "org:test",
            "x-octonode-project": "project-1",
            "x-octonode-projects": '["project-1","project-2"]',
          },
        ),
        {},
        context,
      ),
    );
    assert.equal(denied.result.isError, true);
    assert.match(denied.result.content[0].text, /Unauthorized projectId: project-3/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects oversized upstream responses", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(null, { headers: { "content-length": String(4 * 1024 * 1024 + 1) } });

  try {
    const oversized = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "platform_capabilities", arguments: {} },
          { "x-octonode-workspace": "org:test" },
        ),
        {},
        context,
      ),
    );
    assert.equal(oversized.result.isError, true);
    assert.match(oversized.result.content[0].text, /exceeds the MCP limit/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("normalizes streaming and binary API responses", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = new URL(input.url).pathname;
    if (path.endsWith("/avatar")) {
      return new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "image/png" } });
    }
    return new Response('data: {"type":"started"}\n\ndata: plain\n\n', {
      headers: { "content-type": "text/event-stream" },
    });
  };

  try {
    const avatar = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "profile_avatar_get", arguments: { userId: "user/1" } },
          { "x-octonode-workspace": "org:test" },
        ),
        {},
        context,
      ),
    );
    assert.match(avatar.result.content[0].text, /"base64": "AQID"/);

    const stream = await payload(
      await worker.fetch(
        request(
          "tools/call",
          { name: "project_workflow_run", arguments: { workflowId: "workflow-1" } },
          { "x-octonode-workspace": "org:test", "x-octonode-project": "project-1" },
        ),
        {},
        context,
      ),
    );
    assert.match(stream.result.content[0].text, /"type": "started"/);
    assert.match(stream.result.content[0].text, /"plain"/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
