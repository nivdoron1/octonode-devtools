import { mkdirSync, writeFileSync } from "node:fs";
import { generateNodeCatalog } from "@octonodes/sdk/definitions/compiler";
import { join, resolve } from "node:path";

export function createPlugin(name: string, version: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name))
    throw new Error("Plugin name must be lowercase alphanumeric/dash");
  const root = resolve(name);
  mkdirSync(root); // Never overwrite an existing project.
  mkdirSync(join(root, "src"));
  mkdirSync(join(root, "tests"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify(
      {
        name,
        private: true,
        engines: { node: ">=24" },
        scripts: {
          build: "octonodes plugin build",
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
        include: ["octonode.plugin.ts", "octonode.nodes.ts", "src/**/*.ts"],
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    join(root, "plugin.octonode.json"),
    JSON.stringify(
      { apiVersion: "octonode.plugin/v1", id: name, version: "0.1.0", scope: "user" },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(join(root, ".gitignore"), "node_modules/\ndist/\n.env\n.env.*\n");
  writeFileSync(
    join(root, "src/echo.ts"),
    "export function echo(text: string): { text: string } { return { text }; }\n",
  );
  writeFileSync(
    join(root, "octonode.plugin.ts"),
    `import { definePlugin, defineNode } from "@octonodes/sdk/plugin";
import { nodes } from "./octonode.nodes.js";
export default definePlugin({
  id: ${JSON.stringify(name)}, name: ${JSON.stringify(name)}, version: "0.1.0", license: "MIT",
  nodes: [defineNode(nodes.echo, { label: "Echo text", defaults: { text: "hello" } })],
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
    `# ${name}\n\nRun \`npm install\`, then \`npm test\`. Keep all definitions in \`octonode.plugin.ts\`; import handles from \`octonode.nodes.ts\` and implement functions in \`src/\`.\n\nVersion and publishing scope belong in \`plugin.octonode.json\`; node definitions stay in code; \`dist/plugins/<id>/octonode.yml\` is generated.\nSet \`"scope": "public"\` in the release file to share publicly. Run \`octonodes login\`, then \`octonodes plugin deploy .\`. For automatic publishing, connect the repository and release file at https://partner.octonodes.com/github-publishing and commit its downloaded workflow. Use \`octonodes plugin version patch\`, then merge the version bump.\nConfig compilation reads definitions without executing application code. Keep secrets out of definitions and assets.\n`,
  );
  generateNodeCatalog(root);
  return root;
}
