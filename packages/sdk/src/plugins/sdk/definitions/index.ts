// Generated from packages/plugin-runtime/src/definitions/index.ts. Do not edit; run the Octonode SDK sync.
import type { NodeCustomization, NodeReference, ProjectDefinition, PluginDefinition } from "./types";

/** Compile-time declarations. Octonode reads these only in the reserved project and plugin files. */
export function defineNode(
  implementation: NodeReference["implementation"],
  customization: NodeCustomization = {},
): NodeReference {
  return { implementation, customization };
}

export function defineProject(definition: ProjectDefinition = {}): ProjectDefinition {
  return definition;
}

export function definePlugin(definition: PluginDefinition): PluginDefinition {
  return definition;
}

export type { NodeCustomization, NodeReference, ProjectDefinition, PluginDefinition } from "./types";
