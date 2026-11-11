// Generated from packages/schema/src/plugin/contents.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import type { PluginManifest } from "./plugin";

/** Display names only; definitions and runtime artifacts are stored separately. */
export const PluginContents = z
  .object({
    types: z.array(z.string().min(1).max(240)).max(10000),
    services: z.array(z.string().min(1).max(240)).max(10000),
    constants: z.array(z.string().min(1).max(240)).max(10000),
    classes: z.array(z.string().min(1).max(240)).max(10000),
  })
  .strict();

/** Older npm releases keep their inventory in SDK contracts instead of contents. */
export function pluginContents(manifest: Pick<PluginManifest, "contents" | "clients" | "sdkExports">) {
  if (manifest.contents) return manifest.contents;
  if (!manifest.sdkExports && !manifest.clients) return undefined;
  const exports = manifest.sdkExports ?? [];
  const clients = Object.values(manifest.clients ?? {});
  return {
    types: exports.filter((item) => item.kind === "type").map((item) => item.name),
    services: [...new Set(clients.map((client) => client.export))],
    constants: exports.filter((item) => item.kind === "constant").map((item) => item.name),
    classes: [
      ...new Set([
        ...exports
          .filter(
            (item) =>
              item.kind === "client" &&
              !clients.some((client) => client.export === item.name && client.construction === "call"),
          )
          .map((item) => item.name),
        ...clients.filter((client) => client.construction === "new").map((client) => client.export),
      ]),
    ],
  };
}
