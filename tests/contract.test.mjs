import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const document = JSON.parse(readFileSync(new URL("../packages/sdk/openapi.json", import.meta.url), "utf8"));
const cli = new URL("../packages/cli/dist/index.js", import.meta.url);
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(cli), ...args], {
      env: { ...process.env, OCTONODE_TOKEN: "contract-test-token" },
      timeout: 15_000,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

test("every generated CLI operation forwards its public HTTP contract", async () => {
  const requests = [];
  let responseValue;
  let streaming = false;
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push({ method: request.method, url: request.url,
      authorization: request.headers.authorization, body });
    response.setHeader("content-type", streaming ? "text/event-stream" : "application/json");
    response.end(streaming ? `data: ${JSON.stringify(responseValue)}\n\n` : JSON.stringify(responseValue));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const commands = [];
    for (const [path, methods] of Object.entries(document.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (!operation.operationId) continue;
        const segments = path.split("/").filter(Boolean).map((segment) => segment.replace(/[{}]/g, "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()));
        const [, resource, ...rest] = segments;
        // The documented store route is exposed under the projects API namespace.
        const command = resource === "store" && rest[0] === "projects"
          ? ["projects", "api", ...rest.slice(1), method]
          : [resource, "api", ...rest, method];
        commands.push(command.join(" "));
        const inputs = { path: {} };
        for (const [, name] of path.matchAll(/\{([^}]+)\}/g)) inputs.path[name] = `${name} test`;
        if (operation.requestBody) inputs.body = { contract: operation.operationId };
        responseValue = { contract: operation.operationId };
        streaming = Object.values(operation.responses ?? {}).some((response) => response.content?.["text/event-stream"]);
        const result = await run([...command, "--input", JSON.stringify(inputs),
          "--base-url", `http://127.0.0.1:${server.address().port}`]);
        assert.equal(result.status, 0, `${command.join(" ")}: ${result.stderr}`);
        assert.deepEqual(JSON.parse(result.stdout), responseValue, operation.operationId);
        assert.deepEqual(requests.pop(), {
          method: method.toUpperCase(),
          url: path.replace(/\{([^}]+)\}/g, (_, name) => encodeURIComponent(inputs.path[name])),
          authorization: "Bearer contract-test-token",
          body: operation.requestBody ? JSON.stringify(inputs.body) : "",
        }, operation.operationId);
      }
    }
    const inventory = await run(["operations"]);
    assert.equal(inventory.status, 0, inventory.stderr);
    assert.deepEqual(inventory.stdout.trim().split("\n").sort(), commands.sort());
    assert.equal(requests.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
