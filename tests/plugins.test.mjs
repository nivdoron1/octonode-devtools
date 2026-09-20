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
import { createHash } from "node:crypto";
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
const request = (inputs) => JSON.stringify({ octonode: "1", type: "invoke", invocationId: "test", inputs });

test("CLI scaffold uses the reserved plugin file and generated function handles", async () => {
  const parent = mkdtempSync(join(tmpdir(), "octonodes-scaffold-"));
  try {
    execFileSync(process.execPath, [cli, "plugin", "create", "example"], { cwd: parent });
    const root = join(parent, "example");
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    assert.ok(existsSync(join(root, "octonode.plugin.ts")));
    assert.ok(existsSync(join(root, "octonode.nodes.ts")));
    await buildPlugins(undefined, root);
    execFileSync(process.execPath, ["--test", "tests/plugin.test.cjs"], { cwd: root });
  } finally { rmSync(parent, { recursive: true, force: true }); }
});

test("workflow handles package verified runtime files and preserve custom public IDs", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-workflow-"));
  try {
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    const runtime = `let text=""; process.stdin.on("data", data=>text+=data); process.stdin.on("end",()=>{ const request=JSON.parse(text); process.stdout.write(JSON.stringify({status:"ok",outputs:{text:request.inputs.text}})); });`;
    writeFileSync(join(root, "workflow.cjs"), runtime);
    const handle = {
      definition: {
        id: "original",
        language: "javascript",
        command: "node workflow.cjs",
        inputs: schema,
        outputs: schema,
      },
      key: "a".repeat(24),
      files: { "workflow.cjs": createHash("sha256").update(runtime).digest("hex") },
      dependencies: {},
    };
    const body = `import {workflowNode} from "@octonodes/sdk/nodes"; export const nodes={flow:workflowNode(${JSON.stringify(handle)})} as const;\n`;
    writeFileSync(
      join(root, "octonode.nodes.ts"),
      `// Generated workflow inventory: ${createHash("sha256").update(body).digest("hex")}\n${body}`,
    );
    writeFileSync(
      join(root, "octonode.plugin.ts"),
      `import {definePlugin,defineNode} from "@octonodes/sdk/plugin"; import {nodes} from "./octonode.nodes.js"; export default definePlugin({id:"workflow",name:"Workflow",version:"1.0.0",nodes:[defineNode(nodes.flow,{id:"custom"})]});`,
    );
    const [built] = await buildPlugins(undefined, root);
    const result = JSON.parse(
      execFileSync(process.execPath, ["dist/index.js", "custom"], {
        cwd: built.directory,
        encoding: "utf8",
        input: request({ text: "hello" }),
      }),
    );
    assert.deepEqual(result.outputs, { text: "hello" });
    writeFileSync(join(root, "workflow.cjs"), "tampered");
    await assert.rejects(buildPlugins(undefined, root), /runtime changed/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("generated npm handles preserve adapter behavior, defaults and custom public IDs", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-npm-"));
  const consumer = mkdtempSync(join(tmpdir(), "octonodes-npm-consumer-"));
  try {
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    mkdirSync(join(consumer, "node_modules", "fixture"), { recursive: true });
    writeFileSync(
      join(consumer, "node_modules/fixture/package.json"),
      '{"name":"fixture","version":"1.0.0","main":"index.js"}',
    );
    writeFileSync(join(consumer, "node_modules/fixture/index.js"), "exports.add = (a, b) => a + b;");
    const handle = {
      packageName: "fixture",
      packageVersion: "1.0.0",
      descriptor: {
        id: "add",
        exportName: "add",
        params: ["a", "b"].map((name) => ({ name, required: true, rest: false, schema: { type: "number" } })),
        inputsSchema: {
          type: "object",
          properties: { a: { type: "number" }, b: { type: "number" } },
          required: ["a", "b"],
        },
        outputsSchema: { type: "object", properties: { result: { type: "number" }, dryRun: { type: "boolean" } } },
      },
    };
    const body = `import { npmNode } from "@octonodes/sdk/nodes";\nexport const nodes = { add: npmNode(${JSON.stringify(handle)}) } as const;\n`;
    const inventory = `// Generated npm inventory: ${createHash("sha256").update(body).digest("hex")}\n${body}`;
    writeFileSync(join(root, "octonode.nodes.ts"), inventory);
    writeFileSync(
      join(root, "octonode.plugin.ts"),
      `import {definePlugin,defineNode} from "@octonodes/sdk/plugin"; import {nodes} from "./octonode.nodes.js"; export default definePlugin({id:"math",name:"Math",version:"1.0.0",nodes:[defineNode(nodes.add,{id:"sum",label:"Sum",defaults:{b:3}})]});`,
    );
    const [built] = await buildPlugins(undefined, root);
    assert.equal(built.manifest.nodes[0].id, "sum");
    const result = JSON.parse(
      execFileSync(process.execPath, [join(built.directory, "dist/index.js"), "sum"], {
        cwd: consumer,
        encoding: "utf8",
        input: request({ a: 2 }),
      }),
    );
    assert.deepEqual(result.outputs, { result: 5, dryRun: false });
    writeFileSync(join(root, "octonode.nodes.ts"), inventory.replace('"add"', '"changed"'));
    await assert.rejects(buildPlugins(undefined, root), /was edited/);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(consumer, { recursive: true, force: true });
  }
});

test("npm SDK bindings use original subpaths, hide clients, require credentials and redact upstream errors", async () => {
  const root = mkdtempSync(join(tmpdir(), "octonodes-sdk-binding-"));
  const consumer = mkdtempSync(join(tmpdir(), "octonodes-sdk-consumer-"));
  try {
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    const upstream = join(consumer, "node_modules/fixture");
    mkdirSync(upstream, { recursive: true });
    writeFileSync(join(upstream, "package.json"), JSON.stringify({
      name: "fixture", version: "1.0.0",
      exports: { "./cloud": "./cloud.cjs", "./core": "./core.cjs" },
    }));
    const marker = join(consumer, "factory-called");
    writeFileSync(join(upstream, "core.cjs"), `exports.createClient = options => {
      require("node:fs").writeFileSync(${JSON.stringify(marker)}, "called");
      if (options.host !== "https://fixture.example" || options.auth.token !== "binding-secret") throw new Error("Invalid factory options");
      return { read: id => { if (id === "fail") throw new Error("Provider leaked " + options.auth.token); return { id, originalSdk: true }; } };
    };`);
    writeFileSync(join(upstream, "cloud.cjs"), "exports.getIssue = (client, parameters) => client.read(parameters.id);");
    const parameters = { type: "object", properties: { id: { type: "string" } }, required: ["id"] };
    const handle = {
      packageName: "fixture", packageVersion: "1.0.0",
      descriptor: {
        id: "get-issue", exportName: "getIssue", moduleSpecifier: "fixture/cloud",
        params: [
          { name: "client", required: true, rest: false, schema: { type: "object" } },
          { name: "parameters", required: true, rest: false, schema: parameters },
        ],
        inputsSchema: { type: "object", properties: { client: { type: "object" }, parameters }, required: ["client", "parameters"] },
        outputsSchema: { type: "object", properties: { result: { type: "object" }, dryRun: { type: "boolean" } } },
      },
    };
    const body = `import { npmNode } from "@octonodes/sdk/nodes"; export const nodes = { getIssue: npmNode(${JSON.stringify(handle)}) } as const;\n`;
    writeFileSync(join(root, "octonode.nodes.ts"), `// Generated npm inventory: ${createHash("sha256").update(body).digest("hex")}\n${body}`);
    writeFileSync(join(root, "octonode.plugin.ts"), `
      import {definePlugin,defineNode} from "@octonodes/sdk/plugin";
      import {nodes} from "./octonode.nodes.js";
      export default definePlugin({id:"issues",name:"Issues",version:"1.0.0",
        source:{kind:"npm",package:"fixture",version:"1.0.0"},
        permissions:[{resource:"secrets",access:"read"}],
        connections:{service:{label:"Service",fields:{OCTONODES_TEST_BINDING_TOKEN:{label:"Token"}}}},
        nodes:[defineNode(nodes.getIssue,{id:"read-issue",connections:["service"],bindings:{client:{
          module:"fixture/core",export:"createClient",options:{host:"https://fixture.example",auth:{}},
          env:{"auth.token":"OCTONODES_TEST_BINDING_TOKEN"}
        }}})]});`);
    const [built] = await buildPlugins(undefined, root);
    assert.deepEqual(Object.keys(built.manifest.nodes[0].inputs.properties), ["parameters"]);
    assert.deepEqual(built.manifest.nodes[0].inputs.required, ["parameters"]);
    assert.doesNotMatch(readFileSync(join(built.directory, "octonode.yml"), "utf8"), /binding-secret/);
    const invoke = (inputs, token = "binding-secret") => {
      const result = spawnSync(process.execPath, [join(built.directory, "dist/index.js"), "read-issue"], {
        cwd: consumer, encoding: "utf8", input: request(inputs),
        env: { ...process.env, OCTONODE_PROJECT_ROOT: consumer, OCTONODES_TEST_BINDING_TOKEN: token },
      });
      assert.equal(result.status, 0, result.stderr);
      assert.doesNotMatch(result.stderr, /binding-secret/);
      return JSON.parse(result.stdout);
    };
    const missing = invoke({ parameters: { id: "42" } }, "");
    assert.equal(missing.status, "error");
    assert.match(missing.error.message, /credentials/i);
    assert.equal(existsSync(marker), false);
    const success = invoke({ parameters: { id: "42" } });
    assert.equal(success.status, "ok", JSON.stringify(success));
    assert.deepEqual(success.outputs.result, { id: "42", originalSdk: true });
    const attemptedOverride = invoke({ parameters: { id: "43" }, client: { read: "attacker" } });
    assert.equal(attemptedOverride.status, "error");
    assert.match(attemptedOverride.error.message, /cannot be supplied as inputs/);
    const failed = invoke({ parameters: { id: "fail" } });
    assert.equal(failed.status, "error");
    assert.doesNotMatch(JSON.stringify(failed), /binding-secret/);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(consumer, { recursive: true, force: true });
  }
});

test("code-defined plugins share the runtime contract, defaults, validation and credential checks", async () => {
  const plugin = definePlugin({ id: "text", name: "Text", version: "1.0.0", nodes: [node()] });
  assert.equal(plugin.manifest.nodes[0].command, "node dist/index.js echo");
  assert.deepEqual(plugin.manifest.scope, ["user"]);
  assert.deepEqual((await processRequest(plugin.nodes.echo, request({}))).outputs, {
    text: "hello",
  });
  assert.equal((await processRequest(plugin.nodes.echo, request({ text: 1 }))).status, "error");
  assert.throws(() => definePlugin({ id: "text", name: "Text", version: "1.0.0", nodes: [node(), node()] }), /unique/);
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
    writeFileSync(join(root, "shared.ts"), "export const uppercase = (text: string) => text.toUpperCase();");
    writeFileSync(join(root, ".env"), "DO_NOT_SHIP=secret");
    writeFileSync(
      join(root, "action.ts"),
      "export function run(text: string) { return { text: text.toUpperCase() }; }",
    );
    writeFileSync(
      join(root, "octonode.plugin.ts"),
      `
      import { defineNode, definePlugin } from '@octonodes/sdk/plugin';
      import { nodes } from './octonode.nodes.js';
      export default definePlugin({ id: 'alpha', name: 'Alpha', version: '1.0.0', nodes: [defineNode(nodes.run)] });
    `,
    );
    const result = await buildPlugins(undefined, root);
    assert.deepEqual(
      result.map((plugin) => plugin.manifest.id),
      ["alpha"],
    );
    await buildPlugins("octonode.plugin.ts", root);
    await assert.rejects(buildPlugins("plugins/alpha.plugin.ts", root), /octonode.plugin.ts/);
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
    const invoke = spawnSync(process.execPath, [cli, "plugin", "test", relocated, "run", "--input", '{"text":"cli"}'], {
      encoding: "utf8",
    });
    assert.equal(invoke.status, 0, invoke.stderr);
    assert.equal(JSON.parse(invoke.stdout).outputs.text, "CLI");
    const invalid = spawnSync(process.execPath, [cli, "plugin", "test", relocated, "run", "--input", '{"text":1}'], {
      encoding: "utf8",
    });
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
    await assert.rejects(publishPlugin(relocated, "https://registry.test", "fake-token"), /changed since build/);
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
    writeFileSync(join(root, "package.json"), JSON.stringify({ type: "module" }));
    symlinkSync(resolve("node_modules"), join(root, "node_modules"), "junction");
    writeFileSync(
      join(root, "ui/MessageForm.tsx"),
      `
      import { defineExtension, InputField, NodeForm, Section } from '@octonodes/ui-extensions/react';
      export default defineExtension('node.inspector.inputs', () => (
        <NodeForm><Section title="Message"><InputField name="text" appearance="multiline" /></Section></NodeForm>
      ));`,
    );
    writeFileSync(join(root, "action.ts"), "export function send(text: string) { return { text }; }");
    writeFileSync(join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { jsx: "react-jsx" } }));
    writeFileSync(
      join(root, "octonode.plugin.ts"),
      `
      import { defineNode, definePlugin } from '@octonodes/sdk/plugin';
      import { nodes } from './octonode.nodes.js';
      export default definePlugin({ id:'messages', name:'Messages', version:'1.0.0', nodes:[defineNode(nodes.send, {
        ui:{apiVersion:'1',renderers:{composer:{label:'Composer',targets:{'node.inspector.inputs':'ui/MessageForm.tsx'}}}},
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
    const source = (assets = []) => `import { definePlugin, defineNode } from '@octonodes/sdk/plugin';
      import { nodes } from './octonode.nodes.js';
      export default definePlugin({ id:'sample', name:'Sample', version:'1.0.0', assets: ${JSON.stringify(assets)},
      nodes:[defineNode(nodes.run)] });`;
    writeFileSync(join(root, "action.ts"), "export function run() { return { ok: true }; }");
    const entry = join(root, "octonode.plugin.ts");
    writeFileSync(entry, source());
    const [built] = await buildPlugins(undefined, root);
    const original = readFileSync(join(built.directory, "octonode.yml"), "utf8");
    writeFileSync(join(root, "plugins/b.plugin.ts"), source());
    await assert.rejects(buildPlugins(undefined, root), /only allowed/);
    assert.equal(readFileSync(join(built.directory, "octonode.yml"), "utf8"), original);
    rmSync(join(root, "plugins/b.plugin.ts"));
    for (const asset of ["../secret", ".env", "keys/service.key", "dist/index.js"]) {
      writeFileSync(entry, source([asset]));
      await assert.rejects(buildPlugins(undefined, root), /Unsafe plugin file|overwrites a generated/);
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
