// Generated from packages/schema/src/plugin/execution.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { InvokeRequest } from "../ipc/envelope";
import { PluginManifest, PluginPermission } from "./plugin";
import { PLUGIN_EXECUTION_TIMEOUT_MS, PREPARED_RUNTIME_ARCHIVE } from "./execution.constants";

export const PreparedPluginRuntime = z
  .object({
    format: z.literal(1),
    nodeMajor: z.literal(24),
    platform: z.enum(["portable", "linux", "darwin"]),
    arch: z.string().max(32).optional(),
    libc: z.string().max(64).optional(),
    dependencies: z.literal(PREPARED_RUNTIME_ARCHIVE).optional(),
  })
  .strict();
export type PreparedPluginRuntime = z.infer<typeof PreparedPluginRuntime>;

const executionIdentity = {
  sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  nodeId: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i),
};
export const PluginExecutionReference = z.union([
  z.object({ ...executionIdentity, installId: z.string().uuid() }).strict(),
  z
    .object({
      ...executionIdentity,
      workspaceArchiveSha256: z.string().regex(/^[a-f0-9]{64}$/),
      grantId: z.string().uuid(),
    })
    .strict(),
]);
export type PluginExecutionReference = z.infer<typeof PluginExecutionReference>;

export const PluginExecutionRequest = z
  .object({
    plugin: PluginExecutionReference,
    request: InvokeRequest,
    environment: z
      .record(
        z.string().regex(/^[a-z_][a-z0-9_]*$/i),
        z
          .string()
          .max(65_536)
          .refine((value) => !value.includes("\0")),
      )
      .default({}),
    timeoutMs: z.number().int().positive().max(PLUGIN_EXECUTION_TIMEOUT_MS).default(PLUGIN_EXECUTION_TIMEOUT_MS),
  })
  .strict();
export type PluginExecutionRequest = z.infer<typeof PluginExecutionRequest>;

export const AuthorizedPluginRelease = z.object({
  manifest: PluginManifest,
  archiveSha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type AuthorizedPluginRelease = z.infer<typeof AuthorizedPluginRelease>;

export const WorkspacePluginExecutionGrant = AuthorizedPluginRelease.extend({
  sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  permissions: z.array(PluginPermission),
});
export type WorkspacePluginExecutionGrant = z.infer<typeof WorkspacePluginExecutionGrant>;
