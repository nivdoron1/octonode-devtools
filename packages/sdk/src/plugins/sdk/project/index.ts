// Generated from packages/plugin-runtime/src/project/index.ts. Do not edit; run the Octonode SDK sync.
import type { NodeReference, NodeCustomization } from "../definitions/types";
export { defineProject } from "../definitions";
export type { ProjectDefinition } from "../definitions/types";

export function defineNode(
  implementation: (...args: never[]) => unknown,
  customization: Pick<NodeCustomization, "label" | "symbol" | "icon" | "description"> = {},
): NodeReference {
  return { implementation, customization };
}
