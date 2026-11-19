// Generated from packages/schema/src/plugin/discovery.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

const identifier = z
  .string()
  .regex(/^[$A-Z_a-z][$\w]*$/)
  .max(128);
const imported = z
  .object({
    module: z
      .string()
      .regex(/^(?:node:|@)?[a-zA-Z0-9_-][a-zA-Z0-9_./-]*$/)
      .max(256),
    export: identifier,
    member: identifier.optional(),
  })
  .strict();
const call = z.union([imported, z.object({ factory: imported, member: identifier }).strict()]);
const argument = z
  .object({
    argument: z.number().int().min(0).max(31),
    property: identifier.optional(),
  })
  .strict();

export const PluginServiceMethod = z.enum(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "ALL"]);
export const PluginServiceDiscoveryRule = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("listener"), call }).strict(),
  z
    .object({ kind: z.literal("route"), call, method: z.union([PluginServiceMethod, argument]), path: argument })
    .strict(),
]);
export type PluginServiceDiscoveryRule = z.infer<typeof PluginServiceDiscoveryRule>;
