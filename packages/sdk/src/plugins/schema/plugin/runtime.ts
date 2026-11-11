// Generated from packages/schema/src/plugin/runtime.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

const identifier = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/);
const packageName = z.string().regex(/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i);
export const PypiPackageName = packageName.transform((name) => name.toLowerCase().replace(/[-_.]+/g, "-"));
export const PypiVersion = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[0-9][a-zA-Z0-9.!+_-]*$/);

/** Runtime versions use numeric ranges; package versions retain their registry's syntax. */
export const PluginRuntimeRequirement = z
  .object({
    runtime: identifier,
    versionConstraint: z.string().min(1).max(120),
    adapterApi: z.literal("1"),
    dependencyGroups: z.array(identifier).max(100).default([]),
  })
  .strict();
export type PluginRuntimeRequirement = z.infer<typeof PluginRuntimeRequirement>;

export const PluginDependencyGroup = z.discriminatedUnion("ecosystem", [
  z
    .object({
      ecosystem: z.literal("pypi"),
      packages: z
        .array(
          z
            .object({
              name: PypiPackageName,
              version: PypiVersion,
            })
            .strict(),
        )
        .min(1)
        .max(100),
    })
    .strict(),
  z
    .object({
      ecosystem: z.literal("npm"),
      packages: z
        .array(
          z
            .object({
              name: z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/),
              version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/),
            })
            .strict(),
        )
        .min(1)
        .max(100),
    })
    .strict(),
]);
export type PluginDependencyGroup = z.infer<typeof PluginDependencyGroup>;

export const PluginExecution = z
  .object({
    runtimeRef: identifier,
    entrypoint: z
      .object({
        kind: z.literal("file"),
        path: z
          .string()
          .min(1)
          .max(1024)
          .refine(
            (path) =>
              !path.includes("\\") &&
              !path.includes(":") &&
              !path.includes("\0") &&
              path.split("/").every((part) => !!part && part !== "." && part !== ".."),
            "Entrypoints must be safe relative file paths",
          ),
      })
      .strict(),
    args: z
      .array(
        z
          .string()
          .max(4096)
          .refine((arg) => !arg.includes("\0")),
      )
      .max(100)
      .default([]),
    /** Original SDK identity survives project aliases and canvas instance IDs. */
    invokeAs: z.string().min(1).max(300).optional(),
  })
  .strict();
export type PluginExecution = z.infer<typeof PluginExecution>;

/** Readiness is computed by the server; configuring a runtime never installs during invocation. */
export const PluginRuntimePlan = z.object({
  fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  ready: z.boolean(),
  canPrepare: z.boolean(),
  runtimes: z.array(
    z.object({
      runtime: z.string(),
      required: z.string(),
      version: z.string().optional(),
      status: z.enum(["ready", "setup", "blocked"]),
      message: z.string(),
    }),
  ),
  packages: z.array(z.object({ ecosystem: z.enum(["npm", "pypi"]), name: z.string(), version: z.string() })),
  files: z.array(z.string()),
});
export type PluginRuntimePlan = z.infer<typeof PluginRuntimePlan>;

/** Immutable artifact identity; interpreter distributions are never plugin artifacts. */
export const PluginArtifactTarget = z
  .object({
    sourceLanguage: identifier,
    runtime: identifier,
    runtimeVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    platform: z.enum(["portable", "linux", "darwin", "win32"]),
    arch: identifier,
    abi: identifier,
    libc: z.enum(["glibc", "musl", "none"]).optional(),
    archiveSha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict()
  .refine(
    (target) => target.platform !== "linux" || target.libc === "glibc" || target.libc === "musl",
    "Linux artifacts require their libc family",
  );
export type PluginArtifactTarget = z.infer<typeof PluginArtifactTarget>;
