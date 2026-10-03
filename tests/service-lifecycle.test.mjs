import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("public services recover from factory failure and dispose their owned instances at each lifetime", () => {
  for (const lifecycle of ["invocation", "workflow-run", "worker"]) {
    const source = `
      import { defineService } from ${JSON.stringify(import.meta.resolve("@octonodes/sdk/nodes"))};
      import { runNode } from ${JSON.stringify(import.meta.resolve("@octonodes/sdk/plugins"))};
      let attempts = 0;
      class Counter { constructor() { this.id = attempts; } next() { return this.id; } }
      const node = defineService({ id: "counter", class: Counter, lifecycle: ${JSON.stringify(lifecycle)},
        create: async () => { if (++attempts === 1) throw new Error("retry"); return new Counter(); },
        dispose: instance => { process.stderr.write(instance.id + "\\n"); }, expose: ["next"] });
      await runNode(node);
    `;
    const requests = [
      { octonode: "1", type: "describe", invocationId: "describe", node: "counter.next" },
      ...["one", "one", "one", "two"].map((runId, index) => ({
        octonode: "1", type: "invoke", invocationId: String(index), node: "counter.next", inputs: {},
        context: { runId },
      })),
    ];
    const result = spawnSync(process.execPath, ["--input-type=module", "--eval", source], {
      encoding: "utf8", input: requests.map(value => JSON.stringify(value)).join("\n") + "\n",
    });
    assert.equal(result.status, 0, result.stderr);
    const replies = result.stdout.trim().split("\n").map(value => JSON.parse(value));
    assert.equal(replies[0].status, "ok");
    assert.equal(replies[1].status, "error", "describe must not initialize a service");
    assert.deepEqual(replies.slice(2).map(value => value.outputs),
      lifecycle === "invocation" ? [2, 3, 4] : lifecycle === "workflow-run" ? [2, 2, 3] : [2, 2, 2]);
    assert.deepEqual(result.stderr.trim().split("\n").map(Number).sort(),
      lifecycle === "invocation" ? [2, 3, 4] : lifecycle === "workflow-run" ? [2, 3] : [2]);
  }
});
