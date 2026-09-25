// Generated from packages/schema/src/plugin.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { JsonSchema } from "./ipc-envelope";
import { IconName } from "./icons";
import { PLUGIN_SCHEMA_VERSION } from "./constants";

/**
 * A plugin's distribution scope — who may discover and install it. `user` is
 * private to its publisher in the hosted marketplace; group/org/public widen
 * visibility. Local folder installs do not publish and remain local.
 */
export const PluginScope = z.enum(["user", "group", "org", "public"]);
export type PluginScope = z.infer<typeof PluginScope>;

export const PluginUiTarget = z.enum(["node.inspector.inputs"]);
export type PluginUiTarget = z.infer<typeof PluginUiTarget>;
export const PLUGIN_UI_BUNDLE_MAX_BYTES = 512 * 1024;

const pluginUiEntry = z
  .string()
  .min(1)
  .max(1_024)
  .refine(
    (value) =>
      !value.startsWith("/") &&
      !value.includes("\\") &&
      !value.split("/").includes("..") &&
      /\.[cm]?[jt]sx?$/.test(value),
    "UI entries must be relative JavaScript/TypeScript module paths",
  );

export const PluginNodeUi = z
  .object({
    apiVersion: z.literal("1"),
    renderers: z
      .record(
        z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "renderer id must be alphanumeric/dash/underscore"),
        z
          .object({
            label: z.string().min(1).max(240),
            targets: z.record(PluginUiTarget, pluginUiEntry),
          })
          .strict(),
      )
      .refine((renderers) => Object.keys(renderers).length > 0, "UI needs at least one renderer"),
  })
  .strict();
export type PluginNodeUi = z.infer<typeof PluginNodeUi>;

/**
 * Scopes supported by the hosted marketplace.
 */
export type MarketplaceScope = PluginScope;

/** Build an upstream SDK client from connection fields, never from public node inputs. */
export const NpmClientBinding = z
  .object({
    module: z
      .string()
      .regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+(?:\/[a-zA-Z0-9~._-]+)*$/)
      .refine((value) => !value.split("/").some((part) => part === "." || part === ".."), "Unsafe npm module path"),
    export: z.string().regex(/^[$A-Z_a-z][$\w]*$/),
    options: z.record(z.unknown()).optional(),
    env: z
      .record(
        z
          .string()
          .regex(/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/)
          .refine(
            (path) => !path.split(".").some((key) => ["__proto__", "prototype", "constructor"].includes(key)),
            "Unsafe option path",
          ),
        z.string().regex(/^[A-Z_][A-Z0-9_]*$/),
      )
      .optional(),
  })
  .strict();
export type NpmClientBinding = z.infer<typeof NpmClientBinding>;

export const PluginImplementationSource = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("plugin") }).strict(),
  z
    .object({
      kind: z.literal("npm"),
      package: z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/),
      version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/),
    })
    .strict(),
]);
export type PluginImplementationSource = z.infer<typeof PluginImplementationSource>;

export const PluginNpmDependency = z.object({ package: z.string(), version: z.string(), spec: z.string() }).strict();

/**
 * One node contributed by a plugin. Unlike a project node (whose signature is
 * discovered by `octonode scan`), a plugin node declares its contract directly
 * in the manifest — the plugin author owns it. `command` is resolved relative
 * to the plugin folder, so a plugin is a self-contained, relocatable bundle.
 */
export const PluginNode = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "node id must be alphanumeric/dash/underscore"),
  /** The command the engine spawns, relative to the plugin folder. */
  command: z.string(),
  language: z.string().optional(),
  label: z.string().min(1).max(240).optional(),
  symbol: z.string().min(1).max(16).optional(),
  description: z.string().optional(),
  icon: IconName.optional(),
  trigger: z.boolean().optional(),
  inputs: JsonSchema.optional(),
  outputs: JsonSchema.optional(),
  /** Names of environment variables / secrets this node expects to be injected. */
  env: z.array(z.string()).optional(),
  connections: z.array(z.string().min(1)).optional(),
  defaults: z.record(z.unknown()).optional(),
  bindings: z.record(z.string().regex(/^[A-Za-z_$][\w$]*$/), NpmClientBinding).optional(),
  ui: PluginNodeUi.optional(),
  source: PluginImplementationSource.optional(),
  /** Explicit mapping to the library export; workflow adapters keep their own argument convention. */
  libraryExport: z
    .string()
    .regex(/^[$A-Z_a-z][$\w]*$/)
    .optional(),
  /** Compiler-owned original import identity, never a presentation override. */
  implementation: z
    .object({
      module: z.string(),
      export: z.string(),
      parameters: z.array(z.string()),
    })
    .strict()
    .optional(),
});
export type PluginNode = z.infer<typeof PluginNode>;

/**
 * A coarse capability the plugin needs at runtime. Shown on the install
 * consent screen and enforced before a node is handed the resource.
 */
export const PluginPermission = z.object({
  resource: z.enum(["project_data", "secrets", "network"]),
  access: z.enum(["read", "write", "outbound"]),
});
export type PluginPermission = z.infer<typeof PluginPermission>;

/** Discovery/marketplace metadata (used by the Studio Marketplace in Phase 14). */
export const PluginIntegration = z.object({
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** Secrets/env the integration needs to authenticate (e.g. ["JIRA_TOKEN"]). */
  auth: z.array(z.string()).optional(),
  /** Original npm dependency used by generated npm nodes. */
  npm: PluginNpmDependency.optional(),
  npmDependencies: z.array(PluginNpmDependency).optional(),
});
export type PluginIntegration = z.infer<typeof PluginIntegration>;

/** Credential metadata only. Values are supplied by the installing user at runtime. */
export const PluginConnection = z
  .object({
    label: z.string().min(1).max(240),
    description: z.string().max(4_000).optional(),
    fields: z.record(
      z.string().regex(/^[A-Z_][A-Z0-9_]*$/, "credential fields must be environment variable names"),
      z
        .object({
          label: z.string().min(1).max(240),
          description: z.string().max(4_000).optional(),
          secret: z.boolean().default(true),
          required: z.boolean().default(true),
        })
        .strict(),
    ),
  })
  .strict();
export type PluginConnection = z.infer<typeof PluginConnection>;

/** The shared plugin contract used by the SDK, generators, and marketplace. */
export const PluginManifest = z
  .object({
    schemaVersion: z.string().default(PLUGIN_SCHEMA_VERSION),
    /** Stable plugin id; namespaces its nodes as `<id>/<nodeId>`. */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "plugin id must be lowercase alphanumeric/dash"),
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    /** Implementation authority; absent on legacy artifacts. */
    source: PluginImplementationSource.optional(),
    library: z
      .object({
        format: z.literal(1),
        entry: z.literal("library/index.js"),
        types: z.literal("library/index.d.ts"),
        exports: z.array(z.string().regex(/^[$A-Z_a-z][$\w]*$/)).min(1),
      })
      .strict()
      .optional(),
    icon: IconName.optional(),
    author: z.string().optional(),
    contributors: z.array(z.string().trim().min(1).max(240)).max(100).optional(),
    repository: z
      .string()
      .url()
      .regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/)
      .optional(),
    homepage: z.string().optional(),
    license: z.string().optional(),
    /** Distribution tiers this plugin may be discovered/installed from. Private by default. */
    scope: z.array(PluginScope).default(["user"]),
    /** Coarse runtime capabilities the plugin requests; consented to at install. */
    permissions: z.array(PluginPermission).default([]),
    integration: PluginIntegration.optional(),
    connections: z.record(z.string().regex(/^[a-z0-9][a-z0-9-]*$/), PluginConnection).optional(),
    nodes: z.array(PluginNode).default([]),
  })
  .superRefine((manifest, ctx) => {
    const npm = manifest.integration?.npm;
    const dependencies = manifest.integration?.npmDependencies ?? (npm ? [npm] : []);
    if (new Set(dependencies.map((item) => item.package)).size !== dependencies.length)
      ctx.addIssue({
        code: "custom",
        path: ["integration"],
        message: "npm dependencies must have unique package names",
      });
    if (
      (manifest.source?.kind === "plugin" && npm) ||
      (manifest.source?.kind === "npm" &&
        (npm?.package !== manifest.source.package || npm?.version !== manifest.source.version))
    )
      ctx.addIssue({ code: "custom", path: ["source"], message: "source authority must match integration.npm" });
    const ids = new Set<string>();
    manifest.nodes.forEach((node, index) => {
      if (ids.has(node.id))
        ctx.addIssue({ code: "custom", path: ["nodes", index, "id"], message: "node IDs must be unique" });
      ids.add(node.id);
      const nodeSource = node.source;
      const nodeNpm =
        nodeSource?.kind === "npm"
          ? dependencies.find((item) => item.package === nodeSource.package && item.version === nodeSource.version)
          : nodeSource?.kind === "plugin"
            ? undefined
            : npm;
      if (node.source?.kind === "npm" && !nodeNpm)
        ctx.addIssue({
          code: "custom",
          path: ["nodes", index, "source"],
          message: "npm source must match a declared dependency",
        });
      if (
        node.libraryExport &&
        (node.source?.kind === "npm" || !manifest.library?.exports.includes(node.libraryExport))
      )
        ctx.addIssue({
          code: "custom",
          path: ["nodes", index, "libraryExport"],
          message: "custom export must exist in the plugin library",
        });
      for (const binding of Object.values(node.bindings ?? {})) {
        if (!nodeNpm || (binding.module !== nodeNpm.package && !binding.module.startsWith(`${nodeNpm.package}/`)))
          ctx.addIssue({
            code: "custom",
            path: ["nodes", index, "bindings"],
            message: "SDK factories must belong to the original npm package",
          });
        const credentialFields = new Set(
          (node.connections ?? []).flatMap((name) => Object.keys(manifest.connections?.[name]?.fields ?? {})),
        );
        for (const name of Object.values(binding.env ?? {}))
          if (!credentialFields.has(name))
            ctx.addIssue({
              code: "custom",
              path: ["nodes", index, "bindings"],
              message: `SDK binding requires connection field "${name}"`,
            });
      }
      for (const connection of node.connections ?? []) {
        if (!Object.hasOwn(manifest.connections ?? {}, connection))
          ctx.addIssue({
            code: "custom",
            path: ["nodes", index, "connections"],
            message: `unknown connection "${connection}"`,
          });
      }
    });
    if (
      Object.keys(manifest.connections ?? {}).length &&
      !manifest.permissions.some((permission) => permission.resource === "secrets" && permission.access === "read")
    )
      ctx.addIssue({
        code: "custom",
        path: ["permissions"],
        message: "credential connections require secrets:read permission",
      });
  });
export type PluginManifest = z.infer<typeof PluginManifest>;
export type PluginManifestInput = z.input<typeof PluginManifest>;
