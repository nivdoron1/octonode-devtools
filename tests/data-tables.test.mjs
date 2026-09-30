import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { createClient } from "../packages/sdk/dist/index.js";

test("table SDK forwards typed CRUD, pagination, SQL, scopes, and errors", async () => {
  const requests = [];
  const server = createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    requests.push({
      method: req.method,
      url: req.url,
      token: req.headers.authorization,
      contentType: req.headers["content-type"],
      body: raw ? JSON.parse(raw) : undefined,
    });
    res.setHeader("content-type", "application/json");
    if (req.url.endsWith("/rows/stale")) {
      res.statusCode = 409;
      res.end(JSON.stringify({ error: "Version conflict" }));
    } else res.end(JSON.stringify({ rows: [], nextCursor: "next", ok: true }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const client = createClient("test-token", { url: `http://127.0.0.1:${server.address().port}` });
    for (const kind of ["org", "team", "user"]) {
      const table = client.table("orders/a", { workspace: { kind, id: "workspace/b" } });
      await table.get();
      const page = await table.rows.list({ limit: 50, cursor: "a+b" });
      assert.equal(page.nextCursor, "next");
      await table.rows.insert({ name: "O'Brien", active: false });
      await table.rows.update("row/a", { data: { amount: 42 }, expectedVersion: 7 });
      await table.rows.delete("row/a");
      await table.update({ name: "Orders" });
      await table.sql('SELECT * FROM "orders" LIMIT 10');
      await table.delete();
      const batch = requests.splice(0);
      const base = `/workspaces/${kind}/workspace%2Fb/data-tables/orders%2Fa`;
      assert.deepEqual(
        batch.map(({ method, url }) => [method, url]),
        [
          ["GET", base],
          ["GET", `${base}/rows?limit=50&cursor=a%2Bb`],
          ["POST", `${base}/rows`],
          ["PATCH", `${base}/rows/row%2Fa`],
          ["DELETE", `${base}/rows/row%2Fa`],
          ["PATCH", base],
          ["POST", `${base}/sql`],
          ["DELETE", base],
        ],
      );
      assert.ok(batch.every((r) => r.token === "Bearer test-token"));
      assert.equal(batch[2].contentType, "application/json");
      assert.deepEqual(batch[2].body, { data: { name: "O'Brien", active: false } });
      assert.deepEqual(batch[3].body, { data: { amount: 42 }, expectedVersion: 7 });
      assert.deepEqual(batch[5].body, { name: "Orders" });
      assert.deepEqual(batch[6].body, { sql: 'SELECT * FROM "orders" LIMIT 10' });
      await assert.rejects(table.rows.update("stale", { data: {} }), { error: "Version conflict" });
      requests.length = 0;
    }
    const local = client.table("items", { projectId: "project/a" });
    await local.get();
    await local.sql("SELECT 1");
    assert.deepEqual(
      requests.map((r) => r.url),
      ["/api/projects/project%2Fa/data-tables/items", "/api/projects/project%2Fa/data-tables/sql"],
    );
    for (const id of ["", " ", ".", ".."]) {
      assert.throws(() => client.table(id, { projectId: "p" }));
      assert.throws(() => client.table("t", { projectId: id }));
      assert.throws(() => local.rows.delete(id));
    }
    assert.throws(() => client.table("t", { workspace: { kind: "invalid", id: "w" } }));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
