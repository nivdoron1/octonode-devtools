// Generated from packages/schema/src/plugin/members.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

export const PluginMemberKind = z.enum(["constructor", "method", "property"]);
export const PluginMemberType = z.object({
  typeName: z.string().min(1).max(256),
  namedType: z.boolean().optional(),
});
export const NpmSdkMember = z.object({
  path: z.array(z.string().min(1).max(240)).min(1).max(8),
  kind: PluginMemberKind,
  overload: z.number().int().min(0).max(49).default(0),
  parameters: z
    .array(PluginMemberType.extend({ name: z.string().min(1).max(240), optional: z.boolean(), rest: z.boolean() }))
    .max(50),
  ...PluginMemberType.shape,
  optional: z.boolean().default(false),
  static: z.boolean().default(false),
});
export type NpmSdkMember = z.infer<typeof NpmSdkMember>;
export const PluginExportMember = z
  .object({
    id: z.string().uuid(),
    exportId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
    name: z.string().min(1).max(240),
    kind: PluginMemberKind,
    overload: z.number().int().min(0).max(49),
    parameters: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string().min(1).max(240),
          typeName: z.string().min(1).max(256),
          typeId: z.string().uuid().optional(),
          optional: z.boolean(),
          rest: z.boolean(),
        }),
      )
      .max(50),
    typeName: z.string().min(1).max(256),
    typeId: z.string().uuid().optional(),
    optional: z.boolean(),
    static: z.boolean(),
    memberCount: z.number().int().nonnegative().optional(),
  })
  .strict();
export type PluginExportMember = z.infer<typeof PluginExportMember>;
export const PluginExportMembersPage = z.object({
  items: z.array(PluginExportMember).max(50),
  total: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().min(1).max(50),
});
