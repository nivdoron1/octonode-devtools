import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { createRequire } from "node:module";
import { defineNode, definePlugin, processRequest } from "@octonodes/sdk/plugins";
import { buildPlugins } from "../packages/cli/dist/plugins/build.js";
import { verifyBuild } from "../packages/cli/dist/plugins/artifact.js";
import { publishPlugin } from "../packages/cli/dist/plugins/publish.js";

const require = createRequire(import.meta.url);
const cli = resolve("packages/cli/dist/index.js");
const schema = { type: "object", properties: { text: { type: "string" } }, required: ["text"] };
const node = () =>
  defineNode({
    id: "echo",
    inputs: schema,
    outputs: schema,
    defaults: { text: "hello" },
    run: (inputs) => inputs,
  });
const request = (inputs) =>
  JSON.stringify({ octonode: "1", type: "invoke", invocationId: "test", inputs });

test("code-defined plugins share the runtime contract, defaults, validation and credential checks", async () => {
  const plugin = definePlugin({ id: "text", name: "Text", version: "1.0.0", nodes: [node()] });
  assert.equal(plugin.manifest.nodes[0].command, "node dist/index.js echo");
  assert.deepEqual(plugin.manifest.scope, ["user"]);
  assert.deepEqual((await processRequest(plugin.nodes.echo, request({}))).outputs, {
    text: "hello",
  });
  assert.equal((await processRequest(plugin.nodes.echo, request({ text: 1 }))).status, "error");
  assert.throws(
    () => definePlugin({ id: "text", name: "Text", version: "1.0.0", nodes: [node(), node()] }),
    /unique/,
  );
  assert.throws(
    () =>
      definePlugin({
        id: "text",
        name: "Text",
        version: "1.0.0",
        nodes: [{ ...node(), connections: ["absent"] }],
      }),
    /unknown connection/,
  );
  const credentials = definePlugin({
    id: "credentials",
    name: "Credentials",
    version: "1.0.0",
    permissions: [{ resource: "secrets", access: "read" }],
    connections: {
      service: {
        label: "Service",
        fields: { OCTONODES_TEST_MISSING_CREDENTIAL: { label: "Token" } },
      },
    },
    nodes: [{ ...node(), connections: ["service"] }],
  });
  assert.match(
    (await processRequest(credentials.nodes.echo, request({}))).error.message,
    /Missing connection credentials/,
  );
  const legacy = definePlugin(plugin.manifest, { echo: (inputs) => inputs });
  assert.equal((await processRequest(legacy.nodes.echo, request({ text: "legacy" }))).status, "ok");
});

test("ESM project plugins build independently, relocate, run, and publish the exact inspected artifact", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-plugins-"));
  const relocated = mkdtempSync(join(tmpdir(), "octonodes-installed-"));
  const originalFetch = globalThis.fetch;
  try {
    writeFileSync(join(root, "package.json"), JSON.stringify({ type: "module" }));
    mkdirSync(join(root, "plugins"));
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    writeFileSync(
      join(root, "shared.ts"),
      "export const uppercase = (text: string) => text.toUpperCase();",
    );
    writeFileSync(join(root, ".env"), "DO_NOT_SHIP=secret");
    for (const id of ["alpha", "beta"])
      writeFileSync(
        join(root, "plugins", `${id}.plugin.ts`),
        `
      import { defineNode, definePlugin } from '@octonodes/sdk/plugins';
      import { uppercase } from '../shared';
      export default definePlugin({ id: '${id}', name: '${id}', version: '1.0.0', nodes: [defineNode({
        id: 'run', inputs: ${JSON.stringify(schema)}, outputs: ${JSON.stringify(schema)}, run: ({text}) => ({text: uppercase(text)})
      })] });
    `,
      );
    const result = await buildPlugins(undefined, root);
    assert.deepEqual(
      result.map((plugin) => plugin.manifest.id),
      ["alpha", "beta"],
    );
    await buildPlugins("plugins/alpha.plugin.ts", root); // A normal rebuild replaces only generated output.
    const built = result[0].directory;
    cpSync(built, relocated, { recursive: true });
    assert.ok(!existsSync(join(relocated, "node_modules")));
    assert.ok(!existsSync(join(relocated, ".env")));
    assert.equal(verifyBuild(relocated).manifest.id, "alpha");
    rmSync(root, { recursive: true, force: true });
    const output = JSON.parse(
      execFileSync(process.execPath, ["dist/index.js", "run"], {
        cwd: relocated,
        input: request({ text: "portable" }),
        encoding: "utf8",
      }),
    );
    assert.deepEqual(output.outputs, { text: "PORTABLE" });
    const invoke = spawnSync(
      process.execPath,
      [cli, "plugin", "test", relocated, "run", "--input", '{"text":"cli"}'],
      { encoding: "utf8" },
    );
    assert.equal(invoke.status, 0, invoke.stderr);
    assert.equal(JSON.parse(invoke.stdout).outputs.text, "CLI");
    const invalid = spawnSync(
      process.execPath,
      [cli, "plugin", "test", relocated, "run", "--input", '{"text":1}'],
      { encoding: "utf8" },
    );
    assert.equal(invalid.status, 1);

    let uploads = 0;
    globalThis.fetch = async (url, init) => {
      uploads++;
      assert.equal(url, "https://registry.test/marketplace/plugins/alpha/versions");
      assert.equal(init.headers.authorization, "Bearer fake-token");
      assert.equal(init.redirect, "error");
      const manifest = JSON.parse(init.body.get("manifest"));
      assert.equal(manifest.id, "alpha");
      const archive = join(tmpdir(), `octonodes-test-${crypto.randomUUID()}.tgz`);
      try {
        writeFileSync(archive, Buffer.from(await init.body.get("bundle").arrayBuffer()));
        const listing = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" });
        assert.match(listing, /^octonode.yml$/m);
        assert.match(listing, /^dist\/index.js$/m);
        assert.doesNotMatch(listing, /node_modules|\.env|shared.ts/);
      } finally {
        rmSync(archive, { force: true });
      }
      return Response.json({ id: manifest.id, version: manifest.version });
    };
    assert.deepEqual(await publishPlugin(relocated, "https://registry.test", "fake-token"), {
      id: "alpha",
      version: "1.0.0",
    });
    writeFileSync(join(relocated, "dist/index.js"), "tampered");
    await assert.rejects(
      publishPlugin(relocated, "https://registry.test", "fake-token"),
      /changed since build/,
    );
    assert.equal(uploads, 1);
  } finally {
    globalThis.fetch = originalFetch;
    rmSync(root, { recursive: true, force: true });
    rmSync(relocated, { recursive: true, force: true });
  }
});

test("plugin UI entries build into the immutable artifact", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-plugin-ui-"));
  try {
    mkdirSync(join(root, "plugins"));
    mkdirSync(join(root, "ui"));
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    writeFileSync(
      join(root, "ui/MessageForm.tsx"),
      `
      import { defineExtension, InputField, NodeForm, Section } from '@octonodes/ui-extensions/react';
      export default defineExtension('node.inspector.inputs', () => (
        <NodeForm><Section title="Message"><InputField name="text" appearance="multiline" /></Section></NodeForm>
      ));`,
    );
    writeFileSync(
      join(root, "plugins/messages.plugin.ts"),
      `
      import { defineNode, definePlugin } from '@octonodes/sdk/plugins';
      export default definePlugin({ id:'messages', name:'Messages', version:'1.0.0', nodes:[defineNode({
        id:'send', inputs:${JSON.stringify(schema)}, outputs:${JSON.stringify(schema)},
        ui:{apiVersion:'1',renderers:{composer:{label:'Composer',targets:{'node.inspector.inputs':'ui/MessageForm.tsx'}}}},
        run: inputs => inputs
      })] });`,
    );
    const [built] = await buildPlugins(undefined, root);
    const ui = join(built.directory, "ui/MessageForm.tsx");
    assert.ok(existsSync(ui));
    assert.match(readFileSync(ui, "utf8"), /ui-extension/);
    assert.equal(verifyBuild(built.directory).manifest.nodes[0].ui.apiVersion, "1");
    const record = JSON.parse(readFileSync(join(built.directory, "octonode-build.json"), "utf8"));
    assert.deepEqual(record.ui[0], {
      nodeId: "send",
      apiVersion: "1",
      renderer: "composer",
      target: "node.inspector.inputs",
      path: "ui/MessageForm.tsx",
      size: statSync(ui).size,
      sha256: record.files["ui/MessageForm.tsx"],
    });
    writeFileSync(ui, "tampered");
    assert.throws(() => verifyBuild(built.directory), /changed since build/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("build rejects duplicate identities and unsafe assets without replacing previous output", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-build-errors-"));
  try {
    mkdirSync(join(root, "plugins"));
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    const source = (
      assets = [],
    ) => `import { definePlugin, defineNode } from '@octonodes/sdk/plugins';
      export default definePlugin({ id:'sample', name:'Sample', version:'1.0.0', assets: ${JSON.stringify(assets)},
      nodes:[defineNode({id:'run',inputs:{},outputs:{},run:()=>({ok:true})})] });`;
    const entry = join(root, "plugins/a.plugin.ts");
    writeFileSync(entry, source());
    const [built] = await buildPlugins(undefined, root);
    const original = readFileSync(join(built.directory, "octonode.yml"), "utf8");
    writeFileSync(join(root, "plugins/b.plugin.ts"), source());
    await assert.rejects(buildPlugins(undefined, root), /Duplicate plugin id/);
    assert.equal(readFileSync(join(built.directory, "octonode.yml"), "utf8"), original);
    rmSync(join(root, "plugins/b.plugin.ts"));
    for (const asset of ["../secret", ".env", "keys/service.key", "dist/index.js"]) {
      writeFileSync(entry, source([asset]));
      await assert.rejects(
        buildPlugins(undefined, root),
        /Unsafe plugin file|overwrites a generated/,
      );
    }
    writeFileSync(entry, source());
    writeFileSync(join(built.directory, "personal.txt"), "keep me");
    await assert.rejects(buildPlugins(undefined, root), /files changed since build/);
    assert.equal(readFileSync(join(built.directory, "personal.txt"), "utf8"), "keep me");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("public plugin types infer required and optional properties and check handler outputs", () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-plugin-types-"));
  try {
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    writeFileSync(
      join(root, "types.ts"),
      `
      import { defineNode, definePlugin } from '@octonodes/sdk/plugins';
      const node = defineNode({id:'typed',
        inputs:{type:'object',properties:{text:{type:'string'},count:{type:'number'}},required:['text']},
        outputs:{type:'object',properties:{text:{type:'string'}},required:['text']},
        run: ({text,count}) => {
          const optional: number | undefined = count;
          // @ts-expect-error inferred string cannot be assigned to a number
          const invalid: number = text;
          return {text:text.toUpperCase()};
        }
      });
      definePlugin({id:'types',name:'Types',version:'1.0.0',nodes:[node]});
      defineNode({id:'bad',inputs:{type:'string'},outputs:{type:'number'},
        // @ts-expect-error output must match the schema
        run: value => value
      });
    `,
    );
    const result = spawnSync(
      process.execPath,
      [
        require.resolve("typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--target",
        "es2024",
        "--module",
        "node16",
        join(root, "types.ts"),
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
