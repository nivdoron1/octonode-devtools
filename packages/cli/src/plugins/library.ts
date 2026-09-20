// Generated from engine plugin authoring. Do not edit.
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, join } from "node:path";
import { isBuiltin } from "node:module";
import { build } from "esbuild";
import ts from "typescript";
import { pluginFiles, safePath } from "./artifact";

/** A library is a normal ESM module, separate from the credential-injecting IPC runner. */
export async function buildPluginLibrary(root: string, entry: string, output: string): Promise<void> {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists);
  const config = configPath ? ts.readConfigFile(configPath, ts.sys.readFile) : { config: {} };
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const options: ts.CompilerOptions = {
    ...parsed.options,
    rootDir: root,
    outDir: join(output, "types"),
    declarationDir: join(output, "types"),
    noEmit: false,
    emitDeclarationOnly: true,
    declaration: true,
    declarationMap: false,
    composite: false,
    incremental: false,
    noEmitOnError: true,
    strict: true,
  };
  delete options.tsBuildInfoFile;
  delete options.outFile;
  const program = ts.createProgram([resolve(root, entry)], options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error))
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (file) => file,
        getCurrentDirectory: () => root,
        getNewLine: () => "\n",
      }),
    );
  const emitted = program.emit(undefined, (path, content) => {
    const local = relative(output, path).replaceAll("\\", "/");
    safePath(local);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  });
  if (emitted.emitSkipped) throw new Error("Cannot emit plugin library declarations");
  const typeEntry = entry
    .replace(/^\.\//, "")
    .replace(/\.mts$/, ".mjs")
    .replace(/\.cts$/, ".cjs")
    .replace(/\.ts$/, ".js");
  writeFileSync(join(output, "index.d.ts"), `export * from ${JSON.stringify(`./types/${typeEntry}`)};\n`);
  writeFileSync(join(output, "package.json"), '{"type":"module"}\n');
  const check = ts.createProgram([join(output, "index.d.ts")], {
    strict: true,
    noEmit: true,
    types: [],
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  });
  const reachable = new Set(check.getSourceFiles().map((file) => resolve(file.fileName)));
  if (
    check
      .getSourceFiles()
      .some(
        (file) => !check.isSourceFileDefaultLibrary(file) && !resolve(file.fileName).startsWith(resolve(output) + "/"),
      )
  )
    throw new Error("Library declarations reference files outside the packaged library");
  for (const file of pluginFiles(output).filter((file) => /\.d\.[cm]?ts$/.test(file))) {
    const path = join(output, file);
    if (!reachable.has(resolve(path))) {
      rmSync(path);
      continue;
    }
    const info = ts.preProcessFile(readFileSync(path, "utf8"), true, true);
    if (info.typeReferenceDirectives.length || info.importedFiles.some((item) => !item.fileName.startsWith(".")))
      throw new Error(`Library public types must be self-contained: ${file}`);
  }
  if (ts.getPreEmitDiagnostics(check).some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error))
    throw new Error("Library declarations are not self-contained; remove external public type dependencies");
  const result = await build({
    absWorkingDir: root,
    entryPoints: [entry],
    outfile: join(output, "index.js"),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    metafile: true,
    logLevel: "silent",
    legalComments: "eof",
    banner: {
      js: 'import { createRequire as __octonodeCreateRequire } from "node:module"; const require = __octonodeCreateRequire(import.meta.url);',
    },
    logOverride: { "unsupported-require-call": "warning", "unsupported-dynamic-import": "warning" },
  });
  if (result.warnings.length) throw new Error(result.warnings.map((warning) => warning.text).join("\n"));
  for (const input of Object.keys(result.metafile.inputs)) {
    const local = relative(root, resolve(root, input)).replaceAll("\\", "/");
    if (local.startsWith("../") && !local.includes("/node_modules/"))
      throw new Error("Library import escapes the plugin package");
  }
  for (const output of Object.values(result.metafile.outputs)) {
    if (output.imports.some((item) => item.external && !isBuiltin(item.path)))
      throw new Error("Library has an unbundled dependency; native addons and computed imports are unsupported");
  }
  const packages = new Set([root]);
  for (const input of Object.keys(result.metafile.inputs)) {
    let directory = dirname(resolve(root, input));
    if (!directory.includes("node_modules")) continue;
    while (!existsSync(join(directory, "package.json")) && dirname(directory) !== directory)
      directory = dirname(directory);
    if (existsSync(join(directory, "package.json"))) packages.add(directory);
  }
  for (const directory of packages) {
    const metadata = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
    const name = String(metadata.name ?? "plugin").replaceAll("/", "__");
    safePath(name);
    const destination = join(output, "licenses", name);
    mkdirSync(destination, { recursive: true });
    writeFileSync(
      join(destination, "package.json"),
      JSON.stringify({ name: metadata.name, version: metadata.version, license: metadata.license }, null, 2) + "\n",
    );
    for (const file of readdirSync(directory).filter((file) =>
      /^(?:licen[sc]e|notice|copying)(?:\..*)?$/i.test(file),
    )) {
      const path = join(directory, file);
      if (lstatSync(path).isFile()) writeFileSync(join(destination, file), readFileSync(path));
    }
  }
}
