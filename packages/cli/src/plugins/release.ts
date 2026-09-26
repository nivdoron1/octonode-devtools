// Generated from engine plugin authoring. Do not edit.
import { parseDocument, visit } from "yaml";
import type { PluginReleaseUpdate } from "./types";
import { existsSync, lstatSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  PLUGIN_RELEASE_FILES,
  PLUGIN_CONFIG_MAX_BYTES,
  PluginReleaseConfig,
  bumpPluginVersion,
} from "@octonodes/sdk/plugins";

export function readPluginRelease(root: string) {
  const files = PLUGIN_RELEASE_FILES.filter((file) => existsSync(join(root, file)));
  if (!files.length) return undefined;
  if (files.length !== 1) throw new Error("Keep exactly one octonode.plugin.json release file");
  const path = join(root, files[0]);
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > PLUGIN_CONFIG_MAX_BYTES)
    throw new Error("Invalid plugin release file");
  const document = parseDocument(readFileSync(path, "utf8"), { uniqueKeys: true, version: "1.2" });
  visit(document, {
    Alias() {
      throw new Error("Plugin release files cannot contain YAML aliases");
    },
  });
  if (document.errors.length || document.warnings.length) throw new Error("Invalid plugin release JSON/YAML");
  const data = document.toJS({ maxAliasCount: 0 });
  if (files[0] === "octonode.plugin.json" && data?.schemaVersion === "1") return undefined;
  return { path, document, config: PluginReleaseConfig.parse(data) };
}

/** Explicit release edits preserve YAML comments; builds never rewrite source. */
export function updatePluginRelease(root: string, release: PluginReleaseUpdate) {
  const current = readPluginRelease(root);
  if (!current) return undefined;
  const version = release.bump
    ? bumpPluginVersion(current.config.version, release.bump)
    : (release.version ?? current.config.version);
  const scope =
    release.scope === "group"
      ? "team"
      : release.scope === "org"
        ? "organization"
        : (release.scope ?? current.config.scope);
  const config = PluginReleaseConfig.parse({
    ...current.config,
    version,
    scope,
    teamId: scope === "team" ? (release.teamId ?? current.config.teamId) : undefined,
    orgId: scope === "organization" ? (release.orgId ?? current.config.orgId) : undefined,
  });
  for (const key of ["version", "scope", "orgId", "teamId"] as const) {
    if (config[key] === undefined) current.document.delete(key);
    else current.document.set(key, config[key]);
  }
  const source = current.path.endsWith(".json") ? JSON.stringify(config, null, 2) + "\n" : String(current.document);
  writeFileSync(current.path, source);
  return { ...current, config, source };
}
