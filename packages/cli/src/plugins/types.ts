// Generated from engine plugin authoring. Do not edit.
import type { PluginManifest, PreparedPluginRuntime } from "@octonodes/sdk/plugins";

export interface PluginBuild {
  manifest: PluginManifest;
  directory: string;
}

export interface PluginBuildRecord {
  format: 1;
  runtime?: PreparedPluginRuntime;
  files: Record<string, string>;
  ui?: Array<{
    nodeId: string;
    apiVersion: "1";
    renderer: string;
    target: "node.inspector.inputs";
    path: string;
    size: number;
    sha256: string;
  }>;
}
