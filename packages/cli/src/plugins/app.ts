// Generated from engine plugin authoring. Do not edit.
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SETTINGS_API_VERSION, type PluginManifest } from "@octonodes/sdk/plugins";
import { BUILD_RECORD } from "./constants";
import { fileHash, safePath, pluginFiles, verifyBuild } from "./artifact";
import type { PluginBuild } from "./types";

/** Package declared static browser assets; apps never include a backend runtime. */
export function buildApp(manifest: PluginManifest, output: string, root: string): PluginBuild {
  const stage = mkdtempSync(join(output, ".app-"));
  const artifact = join(stage, "artifact");
  const destination = join(output, manifest.id);
  const backup = join(stage, "previous");
  try {
    mkdirSync(artifact);
    if (manifest.app?.hosting === "extension-only") {
      mkdirSync(join(artifact, "extensions"));
      for (const extension of manifest.app.extensions) {
        safePath(extension.path);
        let source = root;
        for (const part of extension.path.split("/")) {
          source = join(source, part);
          if (lstatSync(source).isSymbolicLink()) throw new Error("App assets cannot be symbolic links");
        }
        if (
          !lstatSync(source).isFile() ||
          lstatSync(source).size > 2 * 1024 * 1024 ||
          `sha256:${fileHash(source)}` !== extension.sha256
        )
          throw new Error(`Invalid app bundle: ${extension.path}`);
        cpSync(source, join(artifact, extension.path));
      }
    }
    writeFileSync(
      join(artifact, "octonode.json"),
      JSON.stringify({ apiVersion: SETTINGS_API_VERSION, plugin: manifest }, null, 2) + "\n",
    );
    writeFileSync(
      join(artifact, BUILD_RECORD),
      JSON.stringify(
        {
          format: 1,
          files: Object.fromEntries(pluginFiles(artifact).map((file) => [file, fileHash(join(artifact, file))])),
        },
        null,
        2,
      ) + "\n",
    );
    verifyBuild(artifact);
    if (existsSync(destination)) {
      verifyBuild(destination);
      renameSync(destination, backup);
    }
    try {
      renameSync(artifact, destination);
    } catch (error) {
      if (existsSync(backup)) renameSync(backup, destination);
      throw error;
    }
    return { manifest, directory: destination };
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}
