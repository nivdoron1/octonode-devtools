import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function createPlugin(name: string, version: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name))
    throw new Error("Plugin name must be lowercase alphanumeric/dash");
  const root = resolve(name);
  mkdirSync(root); // Never overwrite an existing project.
  mkdirSync(join(root, "plugins"));
  mkdirSync(join(root, "tests"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify(
      {
        name,
        private: true,
        engines: { node: ">=24" },
        scripts: {
          build: "tsc --noEmit && octonodes plugin build",
          test: "npm run build && node --test tests/*.test.cjs",
        },
        dependencies: { "@octonodes/sdk": version },
        devDependencies: {
          "@octonodes/cli": version,
          typescript: "5.9.3",
          "@types/node": "^24.0.0",
        },
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    join(root, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2024",
          module: "Node16",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ["plugins/**/*.ts", "src/**/*.ts"],
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(join(root, ".gitignore"), "node_modules/\ndist/\n.env\n.env.*\n");
  writeFileSync(
    join(root, "plugins", `${name}.plugin.ts`),
    `import { definePlugin, defineNode } from "@octonodes/sdk/plugins";

export default definePlugin({
  id: ${JSON.stringify(name)}, name: ${JSON.stringify(name)}, version: "0.1.0", license: "MIT",
  scope: ["user"],
  nodes: [defineNode({
    id: "echo", label: "Echo text",
    inputs: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    outputs: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    defaults: { text: "hello" },
    run: ({ text }) => ({ text }),
  })],
});
`,
  );
  writeFileSync(
    join(root, "tests/plugin.test.cjs"),
    `const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
test("echo runs through the packaged plugin", () => {
  const result = JSON.parse(execFileSync(process.execPath, ["dist/index.js", "echo"], {
    cwd: ${JSON.stringify(`dist/plugins/${name}`)}, encoding: "utf8",
    input: JSON.stringify({octonode:"1",type:"invoke",invocationId:"test",inputs:{text:"hello"}}),
  }));
  assert.equal(result.status, "ok");
  assert.deepEqual(result.outputs, {text:"hello"});
});
`,
  );
  writeFileSync(
    join(root, "README.md"),
    `# ${name}\n\nRun \`npm install\`, then \`npm test\`. Define additional plugins in \`plugins/*.plugin.ts\`.\n\nAll metadata belongs in code; \`dist/plugins/<id>/octonode.yml\` is generated.\nSet \`scope: ["public"]\` to share publicly. Configure \`OCTONODE_MARKETPLACE_URL\`, run \`octonodes login\`, then \`octonodes plugin publish dist/plugins/${name}\`.\nBuild executes local source; only build trusted projects. Keep secrets out of definitions and assets.\n`,
  );
  return root;
}
