// Generated from packages/schema/src/plugin-publishing.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { PluginVersion } from "./plugin-version";

export const PluginConfigPath = z
  .string()
  .max(512)
  .refine(
    (path) =>
      /^(?:[a-zA-Z0-9_.-]+\/)*(?:plugin\.octonode\.(?:json|ya?ml)|octonode\.plugin\.json)$/.test(path) &&
      !path.split("/").some((part) => [".", "..", ".git", "node_modules"].includes(part)),
    "Select a repository-relative octonode.plugin.json file (older plugin.octonode release files also work)",
  );
export const PluginReleaseConfig = z
  .object({
    apiVersion: z.literal("octonode.plugin/v1"),
    id: z
      .string()
      .max(128)
      .regex(/^[a-z0-9][a-z0-9-]*$/),
    version: PluginVersion,
    scope: z.enum(["user", "team", "organization", "public"]),
    teamId: z.string().min(1).max(128).optional(),
    orgId: z.string().min(1).max(128).optional(),
    contributors: z.array(z.string().trim().min(1).max(240)).max(100).optional(),
    workflow: z
      .string()
      .regex(/^\.github\/workflows\/[a-zA-Z0-9_-]+\.ya?ml$/)
      .default(".github/workflows/octonode-publish.yml"),
  })
  .strict()
  .superRefine((config, ctx) => {
    if ((config.scope === "team") !== Boolean(config.teamId))
      ctx.addIssue({ code: "custom", path: ["teamId"], message: "teamId is required only for team scope" });
    if ((config.scope === "organization") !== Boolean(config.orgId))
      ctx.addIssue({ code: "custom", path: ["orgId"], message: "orgId is required only for organization scope" });
  });
export type PluginReleaseConfig = z.infer<typeof PluginReleaseConfig>;
export const pluginReleaseScope = (config: PluginReleaseConfig) =>
  config.scope === "team" ? ("group" as const) : config.scope === "organization" ? ("org" as const) : config.scope;

export const PluginPublisherInput = z
  .object({ repositoryId: z.number().int().positive(), configPath: PluginConfigPath })
  .strict();
export const PluginPublisherRepository = PluginPublisherInput.pick({ repositoryId: true });
export const PluginPublisherAutomatic = z.object({
  ok: z.boolean(),
  connected: z.number(),
  workflow: z.string(),
});
export const PluginPublisherConsent = PluginPublisherInput.extend({ sha256: z.string().regex(/^[a-f0-9]{64}$/) });
export const PluginPublisherPreview = z.object({
  config: PluginReleaseConfig,
  sha256: z.string(),
  repository: z.string(),
  branch: z.string(),
});
export const PluginPublisherConnection = PluginPublisherPreview.extend({
  id: z.string().uuid(),
  repositoryId: z.number(),
  configPath: PluginConfigPath,
  lastVersion: z.string().nullable(),
  lastSha: z.string().nullable(),
  lastPublishedAt: z.number().nullable(),
});
export const PluginPublisherConnections = z.object({ items: z.array(PluginPublisherConnection) });
