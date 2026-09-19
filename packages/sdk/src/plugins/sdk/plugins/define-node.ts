// Generated from sdks/typescript/src/plugins/define-node.ts. Do not edit; run the Octonode SDK sync.
import { defineNode as defineRuntimeNode } from "../define-node";
import type { JsonSchema } from "../json-schema";
import type { PluginNodeOptions } from "./types";

/** Plugin authoring keeps the portable contract beside its typed handler. */
export function defineNode<const I extends JsonSchema, const O extends JsonSchema>(args: PluginNodeOptions<I, O>) {
  return {
    ...defineRuntimeNode(args),
    connections: args.connections,
    env: args.env,
    trigger: args.trigger,
    ui: args.ui,
  };
}
