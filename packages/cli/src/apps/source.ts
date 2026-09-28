import { lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PluginManifest, AppAction } from "@octonodes/sdk/plugins";
import { safePath } from "../plugins/artifact";
import { APP_SOURCE } from "./constants";
import type { AppSource } from "./types";

export function sourceFile(root: string, path: string): string {
  if (lstatSync(root).isSymbolicLink()) throw new Error("App root cannot be a symlink");
  safePath(path);
  let current = root;
  for (const part of path.split("/")) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new Error(`Source cannot be a symlink: ${path}`);
  }
  if (!lstatSync(current).isFile()) throw new Error(`Source must be a file: ${path}`);
  return current;
}
export function appManifest(source: AppSource, hashes: string[] = []) {
  if (source.extensions.some(extension => /^[a-f0-9]{64}$/.test(extension.id))) throw new Error("64-character hexadecimal extension IDs are reserved for immutable assets");
  return PluginManifest.parse({
    id: source.id,
    name: source.name,
    version: source.version,
    description: source.description,
    nodes: [],
    app: {
      apiVersion: "2",
      hosting: "extension-only",
      settings: source.settings,
      requestedActions: [],
      extensions: source.extensions.map((extension, index) => ({
        id: extension.id,
        target: extension.target,
        path: `extensions/${extension.id}.js`,
        sha256: hashes[index] ?? `sha256:${"0".repeat(64)}`,
      })),
    },
  });
}
export function readAppSource(root: string): AppSource {
  const path = sourceFile(root, APP_SOURCE);
  if (lstatSync(path).size > 1_048_576) throw new Error("App source descriptor exceeds 1 MiB");
  const source = JSON.parse(readFileSync(path, "utf8")) as AppSource;
  if (!source || source.apiVersion !== "octonode.app/v1" || !Array.isArray(source.extensions))
    throw new Error("Expected an octonode.app/v1 source descriptor");
  if (
    Object.keys(source).some(
      (key) => !["apiVersion", "id", "name", "version", "description", "settings", "extensions", "web"].includes(key),
    )
  )
    throw new Error("Unknown app source field");
  for (const extension of source.extensions) {
    if (
      !extension ||
      Object.keys(extension).some((key) => !["id", "target", "entry"].includes(key)) ||
      typeof extension.entry !== "string" ||
      !/^src\/.+\.[jt]sx?$/.test(extension.entry)
    )
      throw new Error("Extensions require a JavaScript/TypeScript entry under src/");
    safePath(extension.entry);
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(source.version)) throw new Error("App version must be semver");
  if (source.web) {
    if (
      typeof source.web !== "object" ||
      Object.keys(source.web).some((key) => !["entry", "platform", "applicationUrl", "requestedActions"].includes(key)) ||
      typeof source.web.entry !== "string" ||
      (source.web.platform !== undefined && !["plain", "vite", "next"].includes(source.web.platform)) ||
      !/^src\/.+\.[cm]?[jt]s$/.test(source.web.entry)
    )
      throw new Error("web.entry must be a server module under src/");
    safePath(source.web.entry);
    AppAction.array()
      .max(4)
      .parse(source.web.requestedActions ?? []);
    if (source.settings?.length)
      throw new Error("Shared settings require an extension-only app; configure full apps in their backend");
    if (source.web.applicationUrl) {
      const url = new URL(source.web.applicationUrl);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/")
        throw new Error("web.applicationUrl must be a public HTTPS origin");
    }
  }
  appManifest(source);
  return source;
}
