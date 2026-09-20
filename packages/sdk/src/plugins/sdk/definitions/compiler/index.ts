// Generated from sdks/typescript/src/definitions/compiler/index.ts. Do not edit; run the Octonode SDK sync.
import * as ts from "typescript";
import { existsSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { PluginManifest, PluginNode } from "../../../schema/plugin-sdk";
import {
  DEFINITION_FILENAME,
  PLUGIN_FILENAME,
  NODES_FILENAME,
  DEFINITION_FILES,
  DEFINITION_MODULES,
} from "./constants";
import { literal, properties } from "./literals";
import { schemaFor } from "./schemas";
import type { CompiledDefinition, CompiledNode } from "./types";
import type { NpmNodeHandle, WorkflowNodeHandle } from "../types";
import { generateNodeCatalog } from "./catalog";

export { DEFINITION_FILENAME, PLUGIN_FILENAME, NODES_FILENAME, DEFINITION_FILES } from "./constants";
export { generateNodeCatalog } from "./catalog";
export type { CompiledDefinition, CompiledNode } from "./types";

/** Build-time TypeScript config checking only; workflow lowering remains in the Rust parser. */
export function compileDefinition(
  root: string,
  extraFiles: readonly string[] = [],
  kind: "project" | "plugin" = "project",
): CompiledDefinition | undefined {
  root = realpathSync(root);
  const filename = kind === "project" ? DEFINITION_FILENAME : PLUGIN_FILENAME;
  const entry = resolve(root, filename);
  const configPath = existsSync(resolve(root, "tsconfig.json")) ? resolve(root, "tsconfig.json") : undefined;
  const config = configPath ? ts.readConfigFile(configPath, ts.sys.readFile) : { config: {} };
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, configPath ? dirname(configPath) : root);
  const configError = parsed.errors.find((diagnostic) => diagnostic.code !== 18003);
  if (configError) throw new Error(ts.flattenDiagnosticMessageText(configError.messageText, "\n"));
  const options: ts.CompilerOptions = {
    ...parsed.options,
    target: parsed.options.target ?? ts.ScriptTarget.ES2022,
    module: parsed.options.module ?? ts.ModuleKind.Node16,
    moduleResolution: parsed.options.moduleResolution ?? ts.ModuleResolutionKind.Node16,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    composite: false,
    incremental: false,
    rootDir: root,
  };
  const roots = [
    ...new Set([
      ...parsed.fileNames,
      ...extraFiles.map((file) => resolve(root, file)),
      ...(existsSync(entry) ? [entry] : []),
    ]),
  ];
  if (!existsSync(entry)) {
    for (const file of roots) {
      const text = ts.sys.readFile(file);
      if (
        !DEFINITION_FILES.includes(relative(root, file)) &&
        text &&
        ts.preProcessFile(text, true, true).importedFiles.some((item) => DEFINITION_MODULES.includes(item.fileName))
      )
        throw new Error(`${relative(root, file)}: SDK definitions are only allowed in reserved Octonode files`);
    }
    return undefined;
  }
  const program = ts.createProgram(roots, options);
  const catalog = program.getSourceFile(resolve(root, NODES_FILENAME));
  if (catalog) generateNodeCatalog(root, roots, true);
  for (const file of program.getSourceFiles()) {
    if (file.isDeclarationFile || file.fileName.includes("/node_modules/")) continue;
    if (
      !DEFINITION_FILES.includes(relative(root, file.fileName)) &&
      ts.preProcessFile(file.text, true, true).importedFiles.some((item) => DEFINITION_MODULES.includes(item.fileName))
    )
      throw new Error(`${relative(root, file.fileName)}: SDK definitions are only allowed in reserved Octonode files`);
  }
  if (realpathSync(entry) !== entry) throw new Error(`${DEFINITION_FILENAME} must not be a symlink`);
  const source = program.getSourceFile(entry)!;
  const checker = program.getTypeChecker();
  const sdk = new Map<string, string>();
  const imports = new Map<string, { module: string; name: string }>();
  let definition: ts.ExportAssignment | undefined;
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const module = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (!clause || clause.isTypeOnly) throw new Error("Definition imports must be named value imports");
      if (clause.name) imports.set(clause.name.text, { module, name: "default" });
      if (clause.namedBindings) {
        if (!ts.isNamedImports(clause.namedBindings)) throw new Error(`Use named imports in ${filename}`);
        for (const item of clause.namedBindings.elements) {
          if (item.isTypeOnly) throw new Error("Use value imports for node functions");
          const name = (item.propertyName ?? item.name).text;
          if (DEFINITION_MODULES.includes(module)) {
            if (!["defineNode", "defineProject", "definePlugin"].includes(name))
              throw new Error(`Unknown definition helper: ${name}`);
            sdk.set(item.name.text, name);
          } else imports.set(item.name.text, { module, name });
        }
      }
    } else if (ts.isExportAssignment(statement) && !statement.isExportEquals && !definition) definition = statement;
    else
      throw new Error(`${DEFINITION_FILENAME} accepts imports and one default defineProject/definePlugin export only`);
  }
  const call = definition?.expression;
  if (!call || !ts.isCallExpression(call) || !ts.isIdentifier(call.expression) || call.arguments.length !== 1)
    throw new Error(`Default-export ${kind === "project" ? "defineProject" : "definePlugin"}({...}) from ${filename}`);
  const wrapper = sdk.get(call.expression.text);
  if (wrapper !== "defineProject" && wrapper !== "definePlugin")
    throw new Error("The default export must use the SDK defineProject or definePlugin helper");
  if (wrapper !== (kind === "project" ? "defineProject" : "definePlugin"))
    throw new Error(
      `${filename} must default-export ${kind === "project" ? "defineProject" : "definePlugin"}; plugins belong in ${PLUGIN_FILENAME}`,
    );
  const fields = new Map(properties(call.arguments[0]));
  const nodesExpression = fields.get("nodes");
  if (nodesExpression && !ts.isArrayLiteralExpression(nodesExpression))
    throw new Error("nodes must be an inline array of defineNode calls");
  const nodes: CompiledNode[] = [];
  const identities = new Set<string>();
  for (const item of nodesExpression ? (nodesExpression as ts.ArrayLiteralExpression).elements : []) {
    if (
      !ts.isCallExpression(item) ||
      !ts.isIdentifier(item.expression) ||
      sdk.get(item.expression.text) !== "defineNode" ||
      item.arguments.length < 1 ||
      item.arguments.length > 2
    )
      throw new Error("Each node must be defineNode(importedFunction, optionalOverrides)");
    const handle = item.arguments[0];
    if (
      (!ts.isPropertyAccessExpression(handle) && !ts.isElementAccessExpression(handle)) ||
      !ts.isIdentifier(handle.expression)
    )
      throw new Error(`defineNode requires a nodes.name handle imported from ${NODES_FILENAME}`);
    const handleName = ts.isPropertyAccessExpression(handle) ? handle.name : handle.argumentExpression;
    if (
      (!ts.isIdentifier(handleName) && !ts.isStringLiteral(handleName)) ||
      (ts.isElementAccessExpression(handle) && !ts.isStringLiteral(handleName))
    )
      throw new Error("Node handles require a literal name");
    const catalogImport = imports.get(handle.expression.text);
    const catalogPath =
      catalogImport &&
      ts.resolveModuleName(catalogImport.module, entry, options, ts.sys).resolvedModule?.resolvedFileName;
    if (!catalogPath || resolve(catalogPath) !== resolve(root, NODES_FILENAME) || catalogImport?.name !== "nodes")
      throw new Error(`Import nodes directly from ./${NODES_FILENAME}`);
    if (realpathSync(catalogPath) !== resolve(catalogPath)) throw new Error(`${NODES_FILENAME} must not be a symlink`);
    const property = checker.getTypeAtLocation(handle.expression).getProperty(handleName.text)?.valueDeclaration;
    if (!property || !ts.isPropertyAssignment(property))
      throw new Error(`Unknown generated node: ${handleName.text}; regenerate ${NODES_FILENAME}`);
    if (ts.isCallExpression(property.initializer)) {
      if (kind !== "plugin") throw new Error("Generated adapter handles are only supported in octonode.plugin.ts");
      const call = property.initializer;
      if (ts.isIdentifier(call.expression) && call.expression.text === "workflowNode" && call.arguments.length === 1) {
        const workflow = {
          kind: "workflow",
          ...(literal(call.arguments[0]) as Omit<WorkflowNodeHandle, "kind">),
        } as WorkflowNodeHandle;
        const original = PluginNode.parse(workflow.definition);
        if (
          typeof workflow.key !== "string" ||
          !/^[a-f0-9]{24}$/.test(workflow.key) ||
          !workflow.files ||
          !workflow.dependencies
        )
          throw new Error("Invalid workflow inventory; export the workflow again");
        if (identities.has(workflow.key)) throw new Error(`Duplicate workflow: ${workflow.key}`);
        identities.add(workflow.key);
        const customization = PluginNode.omit({ command: true, language: true, inputs: true, outputs: true })
          .partial()
          .strict()
          .parse(item.arguments[1] ? literal(item.arguments[1]) : {});
        const { command: _, language: __, inputs, outputs, ...defaults } = original;
        if (customization.bindings) throw new Error("SDK client bindings require npm handles");
        nodes.push({
          path: NODES_FILENAME,
          exportName: workflow.key,
          symbol: original.id,
          parameters: [],
          customization: { ...defaults, ...customization },
          inputs,
          outputs,
          workflow,
        });
        continue;
      }
      if (!ts.isIdentifier(call.expression) || call.expression.text !== "npmNode" || call.arguments.length !== 1)
        throw new Error("Invalid generated npm node");
      const npm = { kind: "npm", ...(literal(call.arguments[0]) as Omit<NpmNodeHandle, "kind">) } as NpmNodeHandle;
      if (!npm.packageName || !npm.packageVersion || !npm.descriptor || !Array.isArray(npm.descriptor.params))
        throw new Error("Invalid npm inventory; regenerate from the package");
      const moduleSpecifier = npm.descriptor.moduleSpecifier ?? npm.packageName;
      if (
        (moduleSpecifier !== npm.packageName && !moduleSpecifier.startsWith(`${npm.packageName}/`)) ||
        moduleSpecifier.split("/").some((part) => part === "." || part === "..") ||
        /[\\%:]/.test(moduleSpecifier)
      )
        throw new Error("npm module must belong to the original package");
      const identity = `${moduleSpecifier}:${npm.descriptor.generic ? "<call>" : npm.descriptor.exportName}`;
      if (identities.has(identity)) throw new Error(`Duplicate node function: ${identity}`);
      identities.add(identity);
      const customization = PluginNode.omit({ command: true, language: true, inputs: true, outputs: true })
        .partial()
        .strict()
        .parse(item.arguments[1] ? literal(item.arguments[1]) : {});
      const bound = new Set(Object.keys(customization.bindings ?? {}));
      for (const name of bound) {
        if (
          npm.descriptor.generic ||
          npm.descriptor.permissive ||
          !npm.descriptor.params.some((param) => param.name === name && !param.rest)
        )
          throw new Error(`SDK binding must name a declared non-rest parameter: ${name}`);
        if (Object.hasOwn(customization.defaults ?? {}, name))
          throw new Error(`Bound SDK parameter cannot have a public default: ${name}`);
      }
      const inputs = bound.size
        ? {
            ...npm.descriptor.inputsSchema,
            properties: Object.fromEntries(
              Object.entries((npm.descriptor.inputsSchema.properties ?? {}) as Record<string, unknown>).filter(
                ([name]) => !bound.has(name),
              ),
            ),
            required: ((npm.descriptor.inputsSchema.required ?? []) as string[]).filter((name) => !bound.has(name)),
            additionalProperties: false,
          }
        : npm.descriptor.inputsSchema;
      nodes.push({
        path: NODES_FILENAME,
        exportName: npm.descriptor.exportName,
        symbol: npm.descriptor.id,
        parameters: [],
        customization: { description: npm.descriptor.description, ...customization },
        inputs,
        outputs: npm.descriptor.outputsSchema,
        npm,
      });
      continue;
    }
    if (!ts.isIdentifier(property.initializer)) throw new Error("Generated nodes must reference imported functions");
    const reference = property.initializer;
    const binding = checker.getSymbolAtLocation(reference)?.declarations?.[0];
    if (!binding || !ts.isImportSpecifier(binding))
      throw new Error("Generated nodes must reference imported functions");
    const importDeclaration = binding.parent.parent.parent;
    if (!ts.isImportDeclaration(importDeclaration) || !ts.isStringLiteral(importDeclaration.moduleSpecifier))
      throw new Error("Invalid generated node import");
    const imported = {
      module: importDeclaration.moduleSpecifier.text,
      name: (binding.propertyName ?? binding.name).text,
    };
    if (!imported || !imported.module.startsWith("."))
      throw new Error(`Import ${reference.text} from a local implementation file`);
    const local = checker.getSymbolAtLocation(reference);
    const symbol = local && (local.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(local) : local);
    const declaration = symbol?.valueDeclaration;
    if (!symbol || !declaration) throw new Error(`Cannot resolve function ${reference.text}`);
    const file = realpathSync(declaration.getSourceFile().fileName);
    const path = relative(root, file).replaceAll("\\", "/");
    if (
      path.startsWith("../") ||
      isAbsolute(path) ||
      path.split("/").includes("node_modules") ||
      declaration.getSourceFile().isDeclarationFile ||
      path === DEFINITION_FILENAME ||
      !/\.[cm]?ts$/.test(path)
    )
      throw new Error(`Node implementation must be a TypeScript file inside the project: ${path}`);
    const sourceName =
      (ts.isFunctionDeclaration(declaration) || ts.isVariableDeclaration(declaration)) &&
      declaration.name &&
      ts.isIdentifier(declaration.name)
        ? declaration.name.text
        : symbol.name;
    const identity = `${path}:${sourceName}`;
    if (identities.has(identity)) throw new Error(`Duplicate node function: ${identity}`);
    identities.add(identity);
    const signatures = checker.getTypeAtLocation(reference).getCallSignatures();
    if (!signatures.length || (kind === "plugin" && (signatures.length !== 1 || signatures[0].typeParameters?.length)))
      throw new Error(`Node ${reference.text} needs one non-generic function signature`);
    const signature = signatures[0];
    const params = kind === "plugin" ? signature.getParameters() : [];
    const parameters = params.map((parameter) => {
      const declaration = parameter.valueDeclaration;
      if (
        !declaration ||
        !ts.isParameter(declaration) ||
        !ts.isIdentifier(declaration.name) ||
        declaration.dotDotDotToken
      )
        throw new Error(
          `Node ${reference.text} needs named parameters; destructuring and rest parameters are not supported`,
        );
      return declaration.name.text;
    });
    const overrides = item.arguments[1] ? literal(item.arguments[1]) : {};
    const customization = PluginNode.omit({ command: true, language: true, inputs: true, outputs: true })
      .partial()
      .strict()
      .parse(overrides);
    if (
      kind === "project" &&
      Object.keys(customization).some((key) => !["label", "symbol", "description", "icon"].includes(key))
    )
      throw new Error(
        "Project node customization supports label, symbol, description and icon; identity and execution remain source-owned",
      );
    const node: CompiledNode = { path, exportName: imported.name, symbol: sourceName, parameters, customization };
    if (customization.bindings) throw new Error("SDK client bindings require npm handles");
    // Require direct imports so runtime exports and source identities refer to the same file.
    const resolvedImport = ts.resolveModuleName(imported.module, entry, options, ts.sys).resolvedModule;
    if (!resolvedImport) throw new Error(`Cannot resolve ${imported.module}`);
    if (resolve(resolvedImport.resolvedFileName) !== file)
      throw new Error("Import node functions directly from their implementation file, not a re-export barrel");
    if (kind === "plugin") {
      const required: string[] = [];
      const inputProperties = Object.fromEntries(
        params.map((parameter, index) => {
          const declaration = parameter.valueDeclaration as ts.ParameterDeclaration;
          const type = checker.getTypeOfSymbolAtLocation(parameter, declaration);
          const optional = !!declaration.questionToken || !!declaration.initializer;
          if (!optional) required.push(parameters[index]);
          return [parameters[index], schemaFor(checker, type, new Set(), optional)];
        }),
      );
      node.inputs = { type: "object", properties: inputProperties, required };
      const result = checker.getAwaitedType(signature.getReturnType()) ?? signature.getReturnType();
      node.outputs = result.flags & ts.TypeFlags.Void ? { type: "null" } : schemaFor(checker, result);
    }
    nodes.push(node);
  }
  const metadata = Object.fromEntries(
    [...fields].filter(([key]) => key !== "nodes").map(([key, value]) => [key, literal(value)]),
  );
  if (kind === "project" && Object.keys(metadata).length) throw new Error("defineProject accepts only nodes");
  const { assets = [], ...pluginMetadata } = metadata;
  const npm = nodes.find((node) => node.npm)?.npm;
  if (kind === "plugin") {
    const source = PluginManifest.innerType().shape.source.parse(pluginMetadata.source);
    if (
      source &&
      (source.kind === "npm"
        ? !npm || source.package !== npm.packageName || source.version !== npm.packageVersion
        : !!npm)
    )
      throw new Error("Plugin source authority must match the generated node inventory");
    pluginMetadata.source =
      source ?? (npm ? { kind: "npm", package: npm.packageName, version: npm.packageVersion } : { kind: "plugin" });
    if (
      nodes.some((node) =>
        npm
          ? !node.npm || node.npm.packageName !== npm.packageName || node.npm.packageVersion !== npm.packageVersion
          : !!node.npm,
      )
    )
      throw new Error("A plugin must use one implementation source and package version");
  }
  if (npm) {
    const integration =
      pluginMetadata.integration && typeof pluginMetadata.integration === "object" ? pluginMetadata.integration : {};
    pluginMetadata.integration = {
      ...integration,
      category: "npm",
      npm: {
        package: npm.packageName,
        version: npm.packageVersion,
        spec: npm.installSpec ?? `${npm.packageName}@${npm.packageVersion}`,
      },
    };
  }
  if (!Array.isArray(assets) || assets.some((asset) => typeof asset !== "string"))
    throw new Error("assets must contain literal paths");
  const manifest =
    kind === "plugin"
      ? PluginManifest.parse(
          PluginManifest.innerType()
            .strict()
            .parse({
              ...pluginMetadata,
              nodes: nodes.map((node) => ({
                id: node.customization.id ?? node.symbol,
                ...node.customization,
                inputs: node.inputs,
                outputs: node.outputs,
                language: "typescript",
                command: `node ${node.npm ? "--experimental-import-meta-resolve " : ""}dist/index.js ${node.customization.id ?? node.symbol}`,
              })),
            }),
        )
      : undefined;
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length)
    throw new Error(
      ts.formatDiagnostics(diagnostics, {
        getCanonicalFileName: (file) => file,
        getCurrentDirectory: () => root,
        getNewLine: () => "\n",
      }),
    );
  return { kind, nodes, manifest, assets: assets as string[] };
}
