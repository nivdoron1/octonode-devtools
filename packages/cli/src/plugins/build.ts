import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  globSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { isBuiltin } from "node:module";
import { build } from "esbuild";
import { stringify } from "yaml";
import { PluginManifest, SETTINGS_API_VERSION } from "@octonodes/sdk/plugins";
import { BUILD_RECORD, RESERVED_ASSETS } from "./constants";
import { fileHash, pluginFiles, safePath, verifyBuild } from "./artifact";
import type { PluginBuild } from "./types";

function directory(root: string, path: string): string {
  let current = root;
  for (const part of path.split("/")) {
    current = join(current, part);
    if (!existsSync(current)) mkdirSync(current);
    const stat = lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory())
      throw new Error(`Build directory must be a real directory: ${current}`);
  }
  return current;
}

export async function buildPlugins(entry?: string, root = process.cwd()): Promise<PluginBuild[]> {
  root = resolve(root);
  const entries = entry
    ? [resolve(root, entry)]
    : globSync("plugins/**/*.plugin.ts", { cwd: root })
        .sort()
        .map((file) => resolve(root, file));
  if (!entries.length) throw new Error("No plugins found in plugins/**/*.plugin.ts");
  const output = directory(root, "dist/plugins");
  const staging = mkdtempSync(join(output, ".build-"));
  const prepared: Array<PluginBuild & { staged: string }> = [];
  try {
    // Inspect CommonJS bundles independently of the author's package module type.
    writeFileSync(join(staging, "package.json"), '{"type":"commonjs"}\n');
    for (const [index, source] of entries.entries()) {
      const sourcePath = relative(root, source).replaceAll("\\", "/");
      safePath(sourcePath);
      const staged = join(staging, String(index));
      mkdirSync(join(staged, "dist"), { recursive: true });
      const runner = join(staged, "dist/index.js");
      const result = await build({
        absWorkingDir: root,
        stdin: {
          contents: `export { default as plugin } from ${JSON.stringify(source)}; export { startPlugin } from "@octonodes/sdk/plugins";`,
          resolveDir: root,
          sourcefile: "octonode-entry.ts",
          loader: "ts",
        },
        outfile: runner,
        bundle: true,
        platform: "node",
        format: "cjs",
        target: "node24",
        metafile: true,
        logLevel: "silent",
        legalComments: "eof",
        banner: {
          js: 'globalThis.console = new (require("node:console").Console)({ stdout: process.stderr, stderr: process.stderr });',
        },
        logOverride: {
          "unsupported-require-call": "warning",
          "unsupported-dynamic-import": "warning",
          "empty-import-meta": "error",
        },
      });
      // esbuild cannot make computed imports or native modules portable. Fail instead of shipping a broken bundle.
      if (result.warnings.length)
        throw new Error(result.warnings.map((warning) => warning.text).join("\n"));
      for (const info of Object.values(result.metafile.outputs)) {
        for (const dependency of info.imports) {
          if (dependency.external && !isBuiltin(dependency.path))
            throw new Error(`Unbundled dependency: ${dependency.path}`);
        }
      }
      const metadata = JSON.parse(
        execFileSync(
          process.execPath,
          [
            "-e",
            `
        console = new (require('node:console').Console)({ stdout: process.stderr, stderr: process.stderr });
        const { plugin } = require(process.argv[1]);
        process.stdout.write(JSON.stringify({ manifest: plugin.manifest, assets: plugin.assets ?? [] }));
      `,
            runner,
          ],
          { cwd: root, encoding: "utf8", timeout: 30_000, maxBuffer: 2 * 1024 * 1024 },
        ),
      );
      const manifest = PluginManifest.parse(metadata.manifest);
      if (!manifest.nodes.length)
        throw new Error(`Plugin ${manifest.id} must expose at least one node`);
      if (prepared.some((plugin) => plugin.manifest.id === manifest.id))
        throw new Error(`Duplicate plugin id: ${manifest.id}`);
      if (
        !Array.isArray(metadata.assets) ||
        metadata.assets.some((path: unknown) => typeof path !== "string")
      )
        throw new Error("assets must be an array of file paths");
      for (const asset of metadata.assets as string[]) {
        safePath(asset);
        if (RESERVED_ASSETS.has(asset.split("/")[0]))
          throw new Error(`Asset overwrites a generated file: ${asset}`);
        let current = root;
        for (const part of asset.split("/")) {
          current = join(current, part);
          if (lstatSync(current).isSymbolicLink())
            throw new Error(`Asset cannot be a symbolic link: ${asset}`);
        }
        if (!lstatSync(current).isFile())
          throw new Error(`Declare individual asset files: ${asset}`);
        mkdirSync(dirname(join(staged, asset)), { recursive: true });
        cpSync(current, join(staged, asset));
      }
      const serialized = JSON.stringify(manifest);
      writeFileSync(
        runner,
        readFileSync(runner, "utf8") +
          `\nif (require.main === module) {
        if (JSON.stringify(module.exports.plugin.manifest) !== ${JSON.stringify(serialized)}) throw new Error("Plugin definition changed at runtime; keep metadata independent of the environment");
        module.exports.startPlugin(module.exports.plugin);
      }\n`,
      );
      writeFileSync(
        join(staged, "octonode.yml"),
        stringify({ apiVersion: SETTINGS_API_VERSION, plugin: manifest }),
      );
      writeFileSync(
        join(staged, "package.json"),
        JSON.stringify(
          {
            name: `octonode-plugin-${manifest.id}`,
            version: manifest.version,
            private: true,
            type: "commonjs",
            engines: { node: ">=24" },
            license: manifest.license,
          },
          null,
          2,
        ) + "\n",
      );
      writeFileSync(
        join(staged, "README.md"),
        `# ${manifest.name}\n\n${manifest.description ?? ""}\n\n${manifest.nodes
          .map(
            (node) =>
              `## ${node.label ?? node.id}\n\n${node.description ?? ""}\n\nNode: \`${manifest.id}/${node.id}\`\n\nInputs:\n\`\`\`json\n${JSON.stringify(node.inputs ?? {}, null, 2)}\n\`\`\`\n\nOutputs:\n\`\`\`json\n${JSON.stringify(node.outputs ?? {}, null, 2)}\n\`\`\`\n`,
          )
          .join(
            "\n",
          )}\nCredentials (supplied by each installer):\n\`\`\`json\n${JSON.stringify(manifest.connections ?? {}, null, 2)}\n\`\`\`\n`,
      );
      writeFileSync(
        join(staged, BUILD_RECORD),
        JSON.stringify(
          {
            format: 1,
            files: Object.fromEntries(
              pluginFiles(staged).map((file) => [file, fileHash(join(staged, file))]),
            ),
          },
          null,
          2,
        ) + "\n",
      );
      verifyBuild(staged);
      const destination = join(output, manifest.id);
      // Only replace a complete, unchanged artifact produced by this builder.
      if (existsSync(destination)) verifyBuild(destination);
      prepared.push({ manifest, directory: destination, staged });
    }
    for (const [index, plugin] of prepared.entries()) {
      const backup = join(staging, `previous-${index}`);
      if (existsSync(plugin.directory)) renameSync(plugin.directory, backup);
      try {
        renameSync(plugin.staged, plugin.directory);
      } catch (error) {
        if (existsSync(backup)) renameSync(backup, plugin.directory);
        throw error;
      }
    }
    return prepared.map(({ manifest, directory }) => ({ manifest, directory }));
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}
