// Generated from packages/plugin-runtime/src/plugin.ts. Do not edit; run the Octonode SDK sync.
import { PROCESS_ENV } from "@octonode/common/environment.cjs";
import { PluginManifest } from "../schema/plugin-sdk";
import { defineNode } from "./define-node";
import { jsonSafetyError, NodeError, start } from "./runner";
import type { PluginDefinition, PluginHandlers, PluginOptions } from "./plugin.types";

/** One definition owns discovery, presentation, ports, and the SDK runtime contract. */
export function definePlugin(definition: PluginOptions): PluginDefinition;
export function definePlugin(definition: unknown, handlers: PluginHandlers): PluginDefinition;
export function definePlugin(definition: unknown, handlers?: PluginHandlers): PluginDefinition {
  const options = definition as PluginOptions;
  if (!handlers && (!options || !Array.isArray(options.nodes))) throw new Error("plugin needs a nodes array");
  if (!handlers) {
    for (const node of options.nodes) {
      if (typeof node.run !== "function") throw new Error(`plugin node "${node.id}" needs a handler`);
      if (node.kind && node.kind !== "function") throw new Error("plugin nodes must be functions");
    }
  }
  const manifest = PluginManifest.parse(
    handlers
      ? definition
      : {
          ...options,
          nodes: options.nodes.map(({ run: _run, ...node }) => ({
            ...node,
            command: `node dist/index.js ${node.id}`,
            language: "typescript",
          })),
        },
  );
  const nodeHandlers = handlers ?? Object.fromEntries(options.nodes.map((node) => [node.id, node.run]));
  for (const node of manifest.nodes) {
    for (const field of ["inputs", "outputs", "defaults"] as const) {
      const error = node[field] === undefined ? undefined : jsonSafetyError(node[field]);
      if (error) throw new Error(`plugin node "${node.id}" ${field} must be JSON-serializable: ${error}`);
    }
  }
  for (const id of Object.keys(nodeHandlers)) {
    if (!manifest.nodes.some((node) => node.id === id)) throw new Error(`handler "${id}" has no plugin node`);
  }
  return {
    manifest,
    ...(!handlers && options.assets ? { assets: options.assets } : {}),
    nodes: Object.fromEntries(
      manifest.nodes.map((node) => {
        if (!Object.hasOwn(nodeHandlers, node.id)) throw new Error(`plugin node "${node.id}" needs a handler`);
        const fields = (node.connections ?? []).flatMap((id) =>
          Object.entries(manifest.connections?.[id]?.fields ?? {}),
        );
        return [
          node.id,
          defineNode({
            ...node,
            run: (inputs, context) => {
              const missing = fields
                .filter(([name, field]) => field.required && !PROCESS_ENV[name])
                .map(([name]) => name);
              if (missing.length) throw new NodeError(`Missing connection credentials: ${missing.join(", ")}`);
              return nodeHandlers[node.id](inputs, context);
            },
          }),
        ];
      }),
    ),
  };
}

/** The manifest command selects a node: `node dist/index.js <node-id>`. */
export function startPlugin(plugin: PluginDefinition, nodeId = process.argv[2]): void {
  const id = nodeId ?? (plugin.manifest.nodes.length === 1 ? plugin.manifest.nodes[0].id : undefined);
  if (!id || !Object.hasOwn(plugin.nodes, id))
    throw new Error(`Choose a plugin node: ${Object.keys(plugin.nodes).join(", ")}`);
  start(plugin.nodes[id]);
}
