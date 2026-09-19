// Generated from packages/plugin/src/npm/types.ts. Do not edit; run the Octonode SDK sync.
// packages/plugin/src/npm/types.ts
export interface NpmPackageMeta {
  /** Real npm package name (e.g. "@scope/pkg"). */
  name: string;
  /** Resolved, pinned version. */
  version: string;
  description?: string;
  /** Entry type-declaration file, or null when the package ships no types. */
  dtsPath: string | null;
  /** Fallback export names discovered at runtime when dtsPath is null. */
  runtimeExports?: string[];
  /** Exact package-manager spec; local fixtures retain their file: source. */
  installSpec?: string;
}

export interface NpmParam {
  name: string;
  required: boolean;
  rest: boolean;
  schema: Record<string, unknown>;
}

export interface NpmNodeDescriptor {
  id: string;
  /** Export name on the package; "default" for the default export; "" for the generic call node. */
  exportName: string;
  /** Declared parameter order — the emitted node maps named inputs to positional args in this order. */
  params: NpmParam[];
  inputsSchema: Record<string, unknown>;
  outputsSchema: Record<string, unknown>;
  description?: string;
  /** True for the generic `call` escape-hatch node. */
  generic?: boolean;
  /** True when params are unknown (untyped fallback): inputs are `{ args: any[] }`. */
  permissive?: boolean;
}

export interface CompiledNpmPlugin {
  /** A valid octonode.plugin.json object. */
  manifest: Record<string, unknown>;
  packageName: string;
  packageVersion: string;
  nodes: NpmNodeDescriptor[];
  warnings: string[];
}

export interface NpmGenerateOptions {
  cacheRoot?: string;
  /** Package spec: `name`, `name@version`, or a local folder path (tests/offline). */
  pkg: string;
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
  version?: string;
  include?: string[];
  exclude?: string[];
  dir?: string;
  force?: boolean;
}
