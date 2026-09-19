// Generated from sdks/typescript/src/plugin.types.ts. Do not edit; run the Octonode SDK sync.
import type { PluginManifest } from "../schema/plugin-sdk";
import type { NodeDefinition, NodeHandler } from "./define-node";
import type { PluginManifestInput, PluginNode } from "../schema/plugin-sdk";

export interface PluginDefinition {
  manifest: PluginManifest;
  nodes: Record<string, NodeDefinition>;
  /** Project-relative assets copied into the built plugin. Never credential files. */
  assets?: readonly string[];
}

export type PluginHandlers = Record<string, NodeHandler>;

export type PluginOptions = Omit<PluginManifestInput, "nodes"> & {
  nodes: readonly (NodeDefinition & Pick<PluginNode, "connections" | "env" | "trigger">)[];
  assets?: readonly string[];
};
