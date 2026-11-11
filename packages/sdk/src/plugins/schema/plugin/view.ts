// Generated from packages/schema/src/plugin/view.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

/** Bounded display fields, without executable source or expanded runtime schemas. */
export const PluginTypeView = z
  .object({
    kind: z.enum(["interface", "type", "enum"]),
    fields: z
      .array(
        z
          .object({
            path: z.array(z.string().max(1024)).min(1).max(6),
            typeName: z.string().max(1024),
            optional: z.boolean().optional(),
            typeId: z.string().uuid().optional(),
          })
          .strict(),
      )
      .max(200),
  })
  .strict();
export type PluginTypeView = z.infer<typeof PluginTypeView>;
