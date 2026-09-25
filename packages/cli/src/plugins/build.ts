// Generated from engine plugin authoring. Do not edit.
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { isBuiltin } from "node:module";
import { build } from "esbuild";
import { stringify } from "yaml";
import { PLUGIN_UI_BUNDLE_MAX_BYTES, PluginManifest, SETTINGS_API_VERSION, pluginReleaseScope } from "@octonodes/sdk/plugins";
import { compileDefinition, generateNodeCatalog, PLUGIN_FILENAME } from "@octonodes/sdk/definitions/compiler";
import { emitNpmJsFiles } from "@octonodes/sdk/definitions/npm";
import { BUILD_RECORD, RESERVED_ASSETS } from "./constants";
import { fileHash, pluginFiles, safePath, verifyBuild } from "./artifact";
import type { PluginBuild } from "./types";
import { readPluginRelease } from "./release";
import { buildPluginLibrary } from "./library";

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

function assertBundledInputs(root: string, inputs: string[]): void {
  const sdkRoot = dirname(require.resolve("@octonodes/sdk"));
  for (const input of inputs) {
    const path = resolve(root, input);
    const within = (directory: string) => {
      const local = relative(directory, path);
      return !isAbsolute(local) && !local.startsWith("..");
    };
    if (within(root) || within(sdkRoot) || /[\\/]node_modules[\\/]/.test(path)) continue;
    throw new Error("A bundled import escapes the selected package. Move shared implementations into a dependency.");
  }
}

export async function buildPlugins(entry?: string, root = process.cwd()): Promise<PluginBuild[]> {
  root = resolve(root);
  if (entry && resolve(root, entry) !== resolve(root, PLUGIN_FILENAME))
    throw new Error("Plugin definitions must be in octonode.plugin.ts; arbitrary entry files are not supported");
  generateNodeCatalog(root);
  const definition = compileDefinition(root, [], "plugin");
  if (!definition || definition.kind !== "plugin" || !definition.manifest)
    throw new Error("Default-export definePlugin({...}) from octonode.plugin.ts");
  const entries = [resolve(root, PLUGIN_FILENAME)];
  const release = readPluginRelease(root)?.config;
  if (release && release.id !== definition.manifest.id)
    throw new Error("Plugin release id must match octonode.plugin.ts");
  const manifestDefinition = PluginManifest.parse({
    ...definition.manifest,
    ...(release
      ? {
          version: release.version,
          scope: [pluginReleaseScope(release)],
          ...(release.contributors ? { contributors: release.contributors } : {}),
        }
      : {}),
  });
  const workflowNodes = definition.nodes.filter((node) => node.workflow);
  if (workflowNodes.length && workflowNodes.length !== definition.nodes.length)
    throw new Error("Keep exported workflows in their own plugin package");
  const workflow = workflowNodes[0]?.workflow;
  if (workflowNodes.some((node) => JSON.stringify(node.workflow!.files) !== JSON.stringify(workflow!.files)))
    throw new Error("Workflow handles must come from the same generated export");
  const npmNodes = definition.nodes.filter((node) => node.npm);
  const npmGroups = [...new Set(npmNodes.map((node) => node.npm!.packageName))].map((packageName) =>
    npmNodes.filter((node) => node.npm!.packageName === packageName),
  );
  const npmAdapters = new Map(
    npmGroups.flatMap((nodes, index) =>
      nodes.map((node) => [node, `../nodes/npm${npmGroups.length === 1 ? "" : `-${index}`}.cjs`] as const),
    ),
  );
  const npmFiles: Record<string, string> = Object.assign(
    {},
    ...npmGroups.map((nodes, index) => {
      const npm = nodes[0].npm!;
      return Object.fromEntries(
        Object.entries(
          emitNpmJsFiles({
            manifest: manifestDefinition,
            packageName: npm.packageName,
            packageVersion: npm.packageVersion,
            warnings: [],
            nodes: nodes.map((node) => ({
              ...node.npm!.descriptor,
              id: node.customization.id ?? node.symbol,
              bindings: node.customization.bindings,
            })),
          }),
        ).map(([path, content]) => [
          path === "nodes/npm.cjs" && npmGroups.length > 1 ? `nodes/npm-${index}.cjs` : path,
          content,
        ]),
      );
    }),
  );
  const imports = definition.nodes
    .map((node, index) =>
      node.npm
        ? ""
        : `import { ${node.exportName} as implementation${index} } from ${JSON.stringify(resolve(root, node.path))};`,
    )
    .join("\n");
  const handlers = definition.nodes
    .map((node, index) =>
      node.npm
        ? `${JSON.stringify(manifestDefinition.nodes[index].id)}: inputs => require(${JSON.stringify(npmAdapters.get(node))}).invokeNode(${JSON.stringify(manifestDefinition.nodes[index].id)}, inputs)`
        : `${JSON.stringify(manifestDefinition.nodes[index].id)}: async (inputs) => (await implementation${index}(${node.parameters.map((name) => `inputs[${JSON.stringify(name)}]`).join(", ")})) ?? null`,
    )
    .join(",\n");
  const workflowSource = `import { execFileSync } from "node:child_process"; import { join } from "node:path";
    const invokeWorkflow = (key, inputs, context) => {
      const result = JSON.parse(execFileSync(process.execPath, ["workflow.cjs", key], {
        cwd: join(__dirname, "../workflow-runtime"), encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
        input: JSON.stringify({octonode:"1",type:"invoke",invocationId:"workflow",inputs,context})
      }));
      if (result.status !== "ok") throw new Error(result.error?.message ?? "Workflow failed");
      return result.outputs;
    };`;
  const runnerSource = `${workflow ? workflowSource : imports}
    import { definePlugin, startPlugin } from ${JSON.stringify(require.resolve("@octonodes/sdk/plugins"))};
    export { startPlugin };
    export const plugin = definePlugin(${JSON.stringify(manifestDefinition)}, {${workflow ? workflowNodes.map((node, index) => `${JSON.stringify(manifestDefinition.nodes[index].id)}: (inputs, context) => invokeWorkflow(${JSON.stringify(node.workflow!.key)}, inputs, context)`).join(",") : handlers}});`;
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
      if (workflow) {
        for (const [path, hash] of Object.entries(workflow.files)) {
          safePath(path);
          let source = root;
          for (const part of path.split("/")) {
            source = join(source, part);
            if (lstatSync(source).isSymbolicLink()) throw new Error(`Workflow runtime cannot be a symlink: ${path}`);
          }
          if (fileHash(source) !== hash) throw new Error(`Workflow runtime changed: ${path}; export again`);
          const destination = join(staged, "workflow-runtime", path);
          mkdirSync(dirname(destination), { recursive: true });
          cpSync(source, destination);
        }
      }
      if (npmFiles) {
        for (const [path, content] of Object.entries(npmFiles)) {
          mkdirSync(dirname(join(staged, path)), { recursive: true });
          writeFileSync(join(staged, path), content);
        }
      }
      const result = await build({
        absWorkingDir: root,
        stdin: {
          contents: runnerSource,
          resolveDir: root,
          sourcefile: "octonode-entry.ts",
          loader: "ts",
        },
        outfile: runner,
        bundle: true,
        preserveSymlinks: true,
        external: [...new Set(npmAdapters.values())],
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
      if (result.warnings.length) throw new Error(result.warnings.map((warning) => warning.text).join("\n"));
      assertBundledInputs(root, Object.keys(result.metafile.inputs));
      for (const info of Object.values(result.metafile.outputs)) {
        for (const dependency of info.imports) {
          if (
            dependency.external &&
            !isBuiltin(dependency.path) &&
            ![...npmAdapters.values()].some((path) => path === dependency.path)
          )
            throw new Error(`Unbundled dependency: ${dependency.path}`);
        }
      }
      const metadata = { manifest: manifestDefinition, assets: definition.assets };
      const manifest = PluginManifest.parse(metadata.manifest);
      if (definition.library) await buildPluginLibrary(root, definition.library.entry, join(staged, "library"));
      if (!manifest.nodes.length) throw new Error(`Plugin ${manifest.id} must expose at least one node`);
      if (prepared.some((plugin) => plugin.manifest.id === manifest.id))
        throw new Error(`Duplicate plugin id: ${manifest.id}`);
      const uiDeclarations = manifest.nodes.flatMap((node) =>
        Object.entries(node.ui?.renderers ?? {}).flatMap(([renderer, definition]) =>
          Object.entries(definition.targets).map(([target, path]) => ({
            nodeId: node.id,
            apiVersion: node.ui!.apiVersion,
            renderer,
            target: target as "node.inspector.inputs",
            path,
          })),
        ),
      );
      const uiEntries = [...new Set(uiDeclarations.map(({ path }) => path))];
      for (const entry of uiEntries) {
        safePath(entry);
        if (RESERVED_ASSETS.has(entry.split("/")[0])) throw new Error(`UI entry overwrites a generated file: ${entry}`);
      }
      if (!Array.isArray(metadata.assets) || metadata.assets.some((path: unknown) => typeof path !== "string"))
        throw new Error("assets must be an array of file paths");
      for (const asset of metadata.assets as string[]) {
        safePath(asset);
        if (uiEntries.includes(asset)) throw new Error(`Asset duplicates a UI entry: ${asset}`);
        if (RESERVED_ASSETS.has(asset.split("/")[0])) throw new Error(`Asset overwrites a generated file: ${asset}`);
        let current = root;
        for (const part of asset.split("/")) {
          current = join(current, part);
          if (lstatSync(current).isSymbolicLink()) throw new Error(`Asset cannot be a symbolic link: ${asset}`);
        }
        if (!lstatSync(current).isFile()) throw new Error(`Declare individual asset files: ${asset}`);
        mkdirSync(dirname(join(staged, asset)), { recursive: true });
        cpSync(current, join(staged, asset));
      }
      for (const entry of uiEntries) {
        let current = root;
        for (const part of entry.split("/")) {
          current = join(current, part);
          if (lstatSync(current).isSymbolicLink()) throw new Error(`UI entry cannot be a symbolic link: ${entry}`);
        }
        if (!lstatSync(current).isFile()) throw new Error(`UI entry must be a file: ${entry}`);
        directory(staged, dirname(entry));
        const ui = await build({
          absWorkingDir: root,
          stdin: {
            contents: `import extension from ${JSON.stringify(current)}; import { startExtension } from "@octonodes/ui-extensions/react"; startExtension(extension);`,
            resolveDir: root,
            sourcefile: "octonode-ui-entry.ts",
            loader: "ts",
          },
          outfile: join(staged, entry),
          bundle: true,
          preserveSymlinks: true,
          platform: "browser",
          format: "iife",
          target: "es2021",
          minify: true,
          metafile: true,
          logLevel: "silent",
          legalComments: "eof",
        });
        if (ui.warnings.length) throw new Error(ui.warnings.map((warning) => warning.text).join("\n"));
        assertBundledInputs(root, Object.keys(ui.metafile.inputs));
        if (
          Object.values(ui.metafile.outputs).some((output) => output.imports.some((dependency) => dependency.external))
        )
          throw new Error(`UI entry has an unbundled dependency: ${entry}`);
        if (statSync(join(staged, entry)).size > PLUGIN_UI_BUNDLE_MAX_BYTES)
          throw new Error(`UI entry exceeds 512 KiB: ${entry}`);
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
      writeFileSync(join(staged, "octonode.yml"), stringify({ apiVersion: SETTINGS_API_VERSION, plugin: manifest }));
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
            ...(workflow ? { dependencies: workflow.dependencies } : {}),
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
            files: Object.fromEntries(pluginFiles(staged).map((file) => [file, fileHash(join(staged, file))])),
            ui: uiDeclarations.map((declaration) => ({
              ...declaration,
              size: statSync(join(staged, declaration.path)).size,
              sha256: fileHash(join(staged, declaration.path)),
            })),
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
