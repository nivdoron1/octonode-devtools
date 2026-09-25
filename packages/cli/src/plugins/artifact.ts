// Generated from engine plugin authoring. Do not edit.
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import {
  PLUGIN_UI_BUNDLE_MAX_BYTES,
  PluginManifest,
  PreparedPluginRuntime,
  SETTINGS_API_VERSION,
} from "@octonodes/sdk/plugins";
import { parseDocument, visit } from "yaml";
import { BUILD_RECORD, DEFINITION_FILES, FORBIDDEN_PART } from "./constants";
import type { PluginBuildRecord } from "./types";

export const fileHash = (path: string): string => createHash("sha256").update(readFileSync(path)).digest("hex");

export function safePath(path: string): void {
  if (
    !path ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path
      .split("/")
      .some((part) => !part || part === "." || part === ".." || part.includes(":") || FORBIDDEN_PART.test(part))
  ) {
    throw new Error(`Unsafe plugin file: ${path}`);
  }
}

export function pluginFiles(root: string, prefix = ""): string[] {
  if (!lstatSync(join(root, prefix)).isDirectory()) throw new Error(`Not a plugin directory: ${root}`);
  return readdirSync(join(root, prefix))
    .sort()
    .flatMap((name) => {
      const path = prefix ? `${prefix}/${name}` : name;
      safePath(path);
      const stat = lstatSync(join(root, path));
      if (stat.isSymbolicLink()) throw new Error(`Plugin files cannot be symbolic links: ${path}`);
      if (stat.isDirectory()) return pluginFiles(root, path);
      if (!stat.isFile()) throw new Error(`Plugin asset must be a regular file: ${path}`);
      return [path];
    });
}

export function loadManifest(directory: string): PluginManifest {
  if (lstatSync(directory).isSymbolicLink()) throw new Error("Plugin directory cannot be a symbolic link");
  const definitions = DEFINITION_FILES.filter((name) => existsSync(join(directory, name)));
  if (definitions.length !== 1) throw new Error("Keep exactly one plugin definition in the package");
  const path = join(directory, definitions[0]);
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1_048_576)
    throw new Error("Invalid plugin definition file");
  const document = parseDocument(readFileSync(path, "utf8"), { uniqueKeys: true, version: "1.2" });
  visit(document, {
    Alias() {
      throw new Error("Plugin definitions cannot contain YAML aliases");
    },
  });
  if (document.errors.length || document.warnings.length) throw new Error("Invalid plugin definition YAML/JSON");
  const data = document.toJS({ maxAliasCount: 0 });
  if (definitions[0] === "octonode.plugin.json") return PluginManifest.parse(data);
  if (data?.apiVersion !== SETTINGS_API_VERSION) throw new Error("Unsupported plugin apiVersion");
  return PluginManifest.parse(data.plugin);
}

/** Publishing is data-only: no contributor modules or lifecycle scripts are executed. */
export function verifyBuild(directory: string): { manifest: PluginManifest; files: string[] } {
  const manifest = loadManifest(directory);
  const files = pluginFiles(directory);
  if (!files.includes(BUILD_RECORD)) throw new Error("Missing build record; run octonodes plugin build first");
  const record = JSON.parse(readFileSync(join(directory, BUILD_RECORD), "utf8")) as PluginBuildRecord;
  if (record.runtime) {
    const runtime = PreparedPluginRuntime.parse(record.runtime);
    if ((manifest.integration?.npm || manifest.integration?.npmDependencies?.length) && !runtime.dependencies)
      throw new Error("Prepared npm plugins must include their dependency runtime");
    if (runtime.dependencies && !files.includes(runtime.dependencies))
      throw new Error("Missing prepared dependency archive");
    if (
      runtime.dependencies &&
      (runtime.platform === "portable" || !runtime.arch || (runtime.platform === "linux" && !runtime.libc))
    )
      throw new Error("Prepared dependencies require a platform, architecture and libc identity");
  }
  if (record.format !== 1 || !record.files || typeof record.files !== "object" || Array.isArray(record.files)) {
    throw new Error("Invalid plugin build record");
  }
  const expected = Object.keys(record.files).sort();
  if (JSON.stringify(expected) !== JSON.stringify(files.filter((name) => name !== BUILD_RECORD).sort())) {
    throw new Error("Plugin files changed since build; rebuild before publishing");
  }
  for (const file of expected) {
    if (record.files[file] !== fileHash(join(directory, file)))
      throw new Error(`Plugin file changed since build: ${file}`);
  }
  if (
    !expected.includes("dist/index.js") ||
    !manifest.nodes.length ||
    manifest.nodes.some(
      (node) =>
        node.command !== `node dist/index.js ${node.id}` &&
        !(
          (manifest.integration?.npm || manifest.integration?.npmDependencies?.length) &&
          node.command === `node --experimental-import-meta-resolve dist/index.js ${node.id}`
        ),
    )
  )
    throw new Error("Invalid built plugin runner");
  if (manifest.library && (!expected.includes(manifest.library.entry) || !expected.includes(manifest.library.types)))
    throw new Error("Missing built plugin library");
  const ui = manifest.nodes.flatMap((node) =>
    Object.entries(node.ui?.renderers ?? {}).flatMap(([renderer, definition]) =>
      Object.entries(definition.targets).map(([target, path]) => ({
        nodeId: node.id,
        apiVersion: node.ui!.apiVersion,
        renderer,
        target,
        path,
      })),
    ),
  );
  for (const entry of new Set(ui.map(({ path }) => path))) {
    if (!expected.includes(entry) || lstatSync(join(directory, entry)).size > PLUGIN_UI_BUNDLE_MAX_BYTES)
      throw new Error(`Invalid plugin UI bundle: ${entry}`);
  }
  if (
    JSON.stringify(record.ui ?? []) !==
    JSON.stringify(
      ui.map((declaration) => ({
        ...declaration,
        size: lstatSync(join(directory, declaration.path)).size,
        sha256: fileHash(join(directory, declaration.path)),
      })),
    )
  )
    throw new Error("Invalid plugin UI build record");
  return { manifest, files };
}
