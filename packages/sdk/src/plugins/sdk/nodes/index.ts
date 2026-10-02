// Generated from packages/plugin-runtime/src/nodes/index.ts. Do not edit; run the Octonode SDK sync.
import type { NpmNodeHandle, WorkflowNodeHandle } from "../definitions/types.js";
export { defineService, defineClass, defineConst } from "../define/node.js";
export type { DefineExplicitServiceArgs, ServiceDefinition, ServiceMethodSpec } from "../types.js";

/** Generated inventory declaration; the compiler reads its literal argument. */
export function npmNode(handle: Omit<NpmNodeHandle, "kind">): NpmNodeHandle {
  return { kind: "npm", ...handle };
}

export function workflowNode(handle: Omit<WorkflowNodeHandle, "kind">): WorkflowNodeHandle {
  return { kind: "workflow", ...handle };
}
