import { spawnSync } from "node:child_process";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const args = process.argv.slice(2);
if (args[0] !== "-b" && args[0] !== "--build") {
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")), ...args], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

const parsed = ts.parseBuildCommand(args.slice(1));
const report = ts.createDiagnosticReporter(ts.sys, true);
if (parsed.errors.length) {
  parsed.errors.forEach(report);
  process.exit(1);
}

const host = parsed.buildOptions.watch
  ? ts.createSolutionBuilderWithWatchHost(ts.sys, undefined, report)
  : ts.createSolutionBuilderHost(ts.sys, undefined, report);

// Resolve during emit so source imports stay short and published JS/declarations work in native Node.
host.getCustomTransformers = (project) => {
  const config = ts.getParsedCommandLineOfConfigFile(
    project,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: report,
    },
  );
  if (!config) throw new Error(`Cannot read TypeScript project ${project}`);
  const cache = ts.createModuleResolutionCache(process.cwd(), (file) => file, config.options);
  const transformer = (context) => (source) => {
    function specifier(node) {
      if (!node || !ts.isStringLiteral(node) || !node.text.startsWith(".")) return node;
      const resolved = ts.resolveModuleName(node.text, source.fileName, config.options, ts.sys, cache).resolvedModule;
      if (!resolved) return node;
      const resolvedFile = resolve(resolved.resolvedFileName);
      const requested = resolve(dirname(source.fileName), node.text);
      const stem = resolvedFile.replace(/(?:\.d)?\.[cm]?tsx?$/, "");
      if (requested !== stem && !(basename(stem) === "index" && requested === dirname(stem))) return node;
      const target = resolvedFile.replace(/(?:\.d)?\.([cm]?)tsx?$/, (_, kind) => `.${kind}js`);
      let path = relative(dirname(source.fileName), target).split(sep).join("/");
      if (!path.startsWith(".")) path = `./${path}`;
      if (path === node.text) return node;
      return ts.factory.createStringLiteral(path);
    }
    function visit(node) {
      if (ts.isImportDeclaration(node))
        return ts.factory.updateImportDeclaration(
          node,
          node.modifiers,
          node.importClause,
          specifier(node.moduleSpecifier),
          node.attributes,
        );
      if (ts.isExportDeclaration(node))
        return ts.factory.updateExportDeclaration(
          node,
          node.modifiers,
          node.isTypeOnly,
          node.exportClause,
          specifier(node.moduleSpecifier),
          node.attributes,
        );
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument))
        return ts.factory.updateImportTypeNode(
          node,
          ts.factory.updateLiteralTypeNode(node.argument, specifier(node.argument.literal)),
          node.attributes,
          node.qualifier,
          node.typeArguments,
          node.isTypeOf,
        );
      if (ts.isExternalModuleReference(node))
        return ts.factory.updateExternalModuleReference(node, specifier(node.expression));
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) && node.expression.text === "require"))
      )
        return ts.factory.updateCallExpression(
          node,
          node.expression,
          node.typeArguments,
          node.arguments.map((argument, index) => (index === 0 ? specifier(argument) : ts.visitNode(argument, visit))),
        );
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(source, visit);
  };
  return { before: [transformer], afterDeclarations: [transformer] };
};

const builder = parsed.buildOptions.watch
  ? ts.createSolutionBuilderWithWatch(host, parsed.projects, parsed.buildOptions, parsed.watchOptions)
  : ts.createSolutionBuilder(host, parsed.projects, parsed.buildOptions);
const status = parsed.buildOptions.clean ? builder.clean() : builder.build();
if (!parsed.buildOptions.watch) process.exitCode = status;
