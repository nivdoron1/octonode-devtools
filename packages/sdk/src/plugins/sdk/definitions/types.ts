// Generated from sdks/typescript/src/definitions/types.ts. Do not edit; run the Octonode SDK sync.
import type { PluginManifestInput, PluginNode } from "../../schema/plugin-sdk";

export type NodeCustomization = Partial<
  Pick<
    PluginNode,
    "id" | "label" | "symbol" | "icon" | "description" | "defaults" | "connections" | "env" | "trigger" | "ui"
  >
>;

export interface NodeReference {
  readonly implementation: ((...args: never[]) => unknown) | NpmNodeHandle | WorkflowNodeHandle;
  readonly customization: NodeCustomization;
}

export interface NpmNodeHandle {
  readonly kind: "npm";
  readonly packageName: string;
  readonly packageVersion: string;
  readonly installSpec?: string;
  readonly descriptor: {
    id: string;
    exportName: string;
    params: { name: string; required: boolean; rest: boolean; schema: Record<string, unknown> }[];
    inputsSchema: Record<string, unknown>;
    outputsSchema: Record<string, unknown>;
    description?: string;
    generic?: boolean;
    permissive?: boolean;
  };
}

export interface WorkflowNodeHandle {
  readonly kind: "workflow";
  readonly definition: PluginNode;
  readonly key: string;
  readonly files: Record<string, string>;
  readonly dependencies: Record<string, string>;
}

export interface ProjectDefinition {
  readonly nodes?: readonly NodeReference[];
}

export type PluginDefinition = Omit<PluginManifestInput, "nodes"> & {
  readonly nodes: readonly NodeReference[];
  readonly assets?: readonly string[];
};
