// Generated from sdks/typescript/src/plugins/types.ts. Do not edit; run the Octonode SDK sync.
import type { InvocationContext, PluginNode } from "../../schema/plugin-sdk";
import type { JsonSchema } from "../json-schema";

/** Infer the JSON Schema subset enforced by the SDK runner. Other schemas stay unknown. */
export type SchemaValue<S> = S extends { enum: readonly (infer E)[] }
  ? E
  : S extends { type: "string" }
    ? string
    : S extends { type: "number" | "integer" }
      ? number
      : S extends { type: "boolean" }
        ? boolean
        : S extends { type: "null" }
          ? null
          : S extends { type: "array"; items: infer I }
            ? SchemaValue<I>[]
            : S extends { type: "object"; properties: infer P }
              ? { [K in keyof P as K extends RequiredKeys<S> ? K : never]: SchemaValue<P[K]> } & {
                  [K in keyof P as K extends RequiredKeys<S> ? never : K]?: SchemaValue<P[K]>;
                }
              : unknown;

type RequiredKeys<S> = S extends { required: readonly (infer K)[] } ? K : never;

export type PluginNodeOptions<I extends JsonSchema, O extends JsonSchema> = Omit<
  PluginNode,
  "command" | "language" | "inputs" | "outputs"
> & {
  inputs: I;
  outputs: O;
  run: (inputs: SchemaValue<I>, context: InvocationContext) => SchemaValue<O> | Promise<SchemaValue<O>>;
};
