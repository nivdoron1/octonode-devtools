// Generated from sdks/typescript/src/definitions/compiler/types.ts. Do not edit; run the Octonode SDK sync.
import type { PluginManifest } from "../../../schema/plugin-sdk";
import type { NodeCustomization, NpmNodeHandle, WorkflowNodeHandle } from "../types";

export interface CompiledNode {
  path: string;
  exportName: string;
  symbol: string;
  parameters: string[];
  customization: NodeCustomization;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  npm?: NpmNodeHandle;
  workflow?: WorkflowNodeHandle;
}

export interface CompiledDefinition {
  kind: "project" | "plugin";
  nodes: CompiledNode[];
  manifest?: PluginManifest;
  assets: string[];
}
