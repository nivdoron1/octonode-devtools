// Generated from packages/plugin/src/npm/emit/js.ts. Do not edit; run the Octonode SDK sync.
// packages/plugin/src/npm/emit/js.ts
import type { CompiledNpmPlugin, NpmNodeDescriptor } from "../types";

/** Render the single IPC adapter used by every node extracted from a package. */
function runner(plan: CompiledNpmPlugin): string {
  const descriptors = Object.fromEntries(plan.nodes.map((node) => [node.id, node]));
  const cases = plan.nodes.map((node) => `    case ${JSON.stringify(node.id)}: {\n${nodeBody(node)}\n    }`).join("\n");
  return `// Generated npm adapter: the original package remains the implementation.
const { createRequire, register } = require("node:module");
const { existsSync, realpathSync } = require("node:fs");
const { dirname, join } = require("node:path");
const { pathToFileURL } = require("node:url");
const OCTONODE_PROJECT_ROOT = process["env"].OCTONODE_PROJECT_ROOT;
class NodeError extends Error {
  constructor(message, code = "NON_RETRYABLE", retryable = false) {
    super(message);
    this.name = "NodeError";
    this.code = code;
    this.retryable = retryable;
  }
}
function send(envelope) {
  process.stdout.write(JSON.stringify(envelope) + "\\n");
}
function resolveExport(pkg, name) {
  if (name === "default") {
    if (typeof pkg === "function") return pkg;
    return pkg && pkg.default !== undefined ? pkg.default : pkg;
  }
  return pkg ? pkg[name] : undefined;
}
function toJson(value) {
  if (value === undefined) return null;
  try {
    const json = JSON.stringify(value);
    if (json === undefined) throw new Error();
    return JSON.parse(json);
  } catch {
    throw new NodeError("npm export returned a value that is not JSON-serializable", "VALIDATION_ERROR");
  }
}
const NODES = ${JSON.stringify(descriptors, null, 2)};
const node = NODES[process.argv[2]];
if (require.main === module && !node) throw new Error('unknown generated npm node "' + process.argv[2] + '"');
const projectRoot = realpathSync(OCTONODE_PROJECT_ROOT || process.cwd());
for (let root = projectRoot; ; root = dirname(root)) {
  const pnp = join(root, ".pnp.cjs");
  if (existsSync(pnp)) {
    require(pnp).setup();
    const loader = join(root, ".pnp.loader.mjs");
    if (existsSync(loader)) register(pathToFileURL(loader));
    break;
  }
  if (existsSync(join(root, ".git")) || dirname(root) === root) break;
}
const projectRequire = createRequire(join(projectRoot, "package.json"));
let packagePromise;
async function loadPkg() {
  if (!packagePromise) packagePromise = (async () => {
    let entry;
    try { entry = projectRequire.resolve(${JSON.stringify(plan.packageName)}); }
    catch {
      const { resolvePackage } = await import("./npm-resolve.mjs");
      entry = resolvePackage(${JSON.stringify(plan.packageName)}, pathToFileURL(join(projectRoot, "package.json")).href);
      return import(entry);
    }
    try { return projectRequire(entry); }
    catch (error) {
      if (error.code !== "ERR_REQUIRE_ESM" && error.code !== "ERR_REQUIRE_ASYNC_MODULE") throw error;
      return import(pathToFileURL(entry).href);
    }
  })();
  return packagePromise;
}
async function invoke(inputs, node = NODES[process.argv[2]]) {
  if (!node) throw new NodeError("unknown npm node", "VALIDATION_ERROR");
  const pkg = await loadPkg();
  switch (node.id) {
${cases}
    default: throw new NodeError('unknown generated npm node "' + node.id + '"', "VALIDATION_ERROR");
  }
}
function start() {
  let buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (buf += c));
  process.stdin.on("end", async () => {
    let rid = "unknown";
    try {
      const req = JSON.parse(buf || "{}");
      rid = req.invocationId || "unknown";
      if (req.type === "describe") {
        send({ octonode: "1", type: "manifest", invocationId: rid, status: "ok", manifest: {
          id: node.id, language: "javascript", description: node.description,
          inputs: node.inputsSchema, outputs: node.outputsSchema,
        } });
      } else if (req.type === "invoke") {
        const outputs = await invoke(req.inputs || {}, node);
        send({ octonode: "1", type: "result", invocationId: rid, status: "ok", outputs });
      } else {
        throw new NodeError(\`unsupported request type "\${req.type}"\`, "VALIDATION_ERROR");
      }
    } catch (err) {
      send({
        octonode: "1", type: "result", invocationId: rid, status: "error",
        error: { code: err.code || "RUNTIME_ERROR", message: String(err && err.message), retryable: Boolean(err.retryable) },
      });
    }
  });
}
module.exports.invokeNode = (id, inputs) => invoke(inputs, NODES[id]);
if (require.main === module) start();
`;
}

function nodeBody(node: NpmNodeDescriptor): string {
  if (node.generic) {
    return `  if (typeof inputs.export !== "string" || !inputs.export) {
    throw new NodeError("\`export\` is required", "VALIDATION_ERROR");
  }
  const target = resolveExport(pkg, inputs.export);
  if (target === undefined) {
    throw new NodeError(\`unknown export "\${inputs.export}"\`, "VALIDATION_ERROR");
  }
  if (typeof target !== "function") return { result: toJson(target), dryRun: false };
  const args = Array.isArray(inputs.args) ? inputs.args : [];
  return { result: toJson(await target(...args)), dryRun: false };`;
  }

  const positional = node.params.filter((p) => !p.rest).map((p) => p.name);
  const rest = node.params.find((p) => p.rest);
  const argsLines = node.permissive
    ? `  const args = Array.isArray(inputs.args) ? inputs.args : [];`
    : `  const args = ${JSON.stringify(positional)}.map((n) => inputs[n]);
  while (args.length && args[args.length - 1] === undefined) args.pop();${
    rest
      ? `
  if (Array.isArray(inputs[${JSON.stringify(rest.name)}])) args.push(...inputs[${JSON.stringify(rest.name)}]);`
      : ""
  }`;

  return `  const fn = resolveExport(pkg, ${JSON.stringify(node.exportName)});
  if (typeof fn !== "function") {
    throw new NodeError('export ${node.exportName} is not a function', "VALIDATION_ERROR");
  }
${argsLines}
  return { result: toJson(await fn(...args)), dryRun: false };`;
}

/** Render every generated file for the plugin (paths relative to the plugin folder). */
export function emitNpmJsFiles(plan: CompiledNpmPlugin): Record<string, string> {
  return {
    "nodes/npm.cjs": runner(plan),
    "nodes/npm-resolve.mjs": "export const resolvePackage = (name, parent) => import.meta.resolve(name, parent);\n",
  };
}
