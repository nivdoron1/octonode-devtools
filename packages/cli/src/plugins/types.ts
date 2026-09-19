import type { PluginManifest } from "@octonodes/sdk/plugins";

export interface PluginBuild {
  manifest: PluginManifest;
  directory: string;
}

export interface PluginBuildRecord {
  format: 1;
  files: Record<string, string>;
}
