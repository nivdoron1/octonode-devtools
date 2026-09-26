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

export const PluginPublisherOperation = z.enum(["create", "update", "delete"]);
export const PluginPublisherReviewItem = z.object({
  configPath: PluginConfigPath,
  config: PluginReleaseConfig,
  sha256: z.string(),
  connectionId: z.string().nullable(),
  missing: z.boolean(),
});
export const PluginPublisherReview = z.object({
  repositoryId: z.number(),
  repository: z.string(),
  branch: z.string(),
  headSha: z.string(),
  revision: z.string(),
  items: z.array(PluginPublisherReviewItem),
});
export const PluginPublisherApply = z
  .object({
    repositoryId: z.number().int().positive(),
    revision: z.string().regex(/^[a-f0-9]{64}$/),
    operations: z
      .array(z.object({ configPath: PluginConfigPath, operation: PluginPublisherOperation }).strict())
      .min(1)
      .max(100),
  })
  .strict();
export const PluginPublisherApplied = z.object({
  ok: z.boolean(),
  sha: z.string(),
  repositoryId: z.number(),
  buildId: z.number(),
});
export const PluginPublisherBuildQuery = z.object({
  repositoryId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  search: z.string().max(200).default(""),
  status: z.enum(["", "queued", "in_progress", "success", "failure"]).default(""),
  sort: z.enum(["newest", "oldest", "name"]).default("newest"),
});
export const PluginPublisherBuilds = z.object({
  total: z.number(),
  page: z.number(),
  hasMore: z.boolean(),
  items: z.array(
    z.object({
      id: z.number(),
      repositoryId: z.number(),
      number: z.number(),
      attempt: z.number(),
      title: z.string(),
      sha: z.string(),
      branch: z.string(),
      status: z.string(),
      conclusion: z.string().nullable(),
      url: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});
export const PluginPublisherBuildDetail = z.object({
  repository: z.string(),
  sha: z.string(),
  branch: z.string(),
  status: z.string(),
  createdAt: z.string(),
  items: z.array(
    z.object({
      configPath: PluginConfigPath,
      name: z.string(),
      version: z.string(),
      scope: z.enum(["user", "team", "organization", "public"]),
      operation: PluginPublisherOperation,
      status: z.string(),
      url: z.string().nullable(),
      error: z.string().nullable(),
    }),
  ),
  log: z.string(),
});
export type PluginPublisherReview = z.infer<typeof PluginPublisherReview>;
export type PluginPublisherApply = z.infer<typeof PluginPublisherApply>;
export type PluginPublisherReviewItem = z.infer<typeof PluginPublisherReviewItem>;
export type PluginPublisherBuilds = z.infer<typeof PluginPublisherBuilds>;
export type PluginPublisherBuildDetail = z.infer<typeof PluginPublisherBuildDetail>;

export const PluginCloudBuild = z.object({
  id: z.number().int().positive(),
  sha: z.string().regex(/^[a-f0-9]{40}$/),
  active: z.boolean(),
  items: z
    .array(
      z.object({
        configPath: PluginConfigPath,
        config: PluginReleaseConfig,
        operation: PluginPublisherOperation,
        status: z.string(),
      }),
    )
    .max(100),
});
