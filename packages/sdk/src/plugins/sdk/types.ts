// Generated from packages/plugin-runtime/src/types.ts. Do not edit; run the Octonode SDK sync.
import type {
  InvocationContext,
  IconValue,
  PluginManifest,
  PluginManifestInput,
  PluginNode,
  OkResult,
  ErrorResult,
  ManifestResult,
  ManifestError,
} from "../schema/plugin-sdk";

export type JsonSchema = Record<string, unknown>;

export interface ValidationError {
  path: string;
  message: string;
}

/**
 * What a node IS. `function` (default) is a data-flow node with inputs/outputs.
 * `class`/`service`/`const` are setup-time entities with no runtime I/O ports —
 * they're depended on by function nodes rather than feeding data into them.
 */
export type NodeKind = "function" | "class" | "service" | "const";

/**
 * The signature a node author writes: a plain (optionally async) function from
 * a JSON `inputs` payload to a JSON `outputs` payload. The second argument is
 * the invocation context (config, env, attempt, …). Nodes never touch stdin,
 * stdout, or the envelope — the runner harness owns the wire.
 */
export type NodeHandler<I = unknown, O = unknown> = (inputs: I, context: InvocationContext) => O | Promise<O>;

export interface NodeDefinition<I = unknown, O = unknown> {
  /** Stable node id — the discovery key used by `octonode scan`. */
  id: string;
  workflowId?: string;
  label?: string;
  description?: string;
  symbol?: string;
  defaults?: Record<string, unknown>;
  run(inputs: I, context: InvocationContext): O | Promise<O>;
  /** JSON Schema for the inputs payload. Validated by the runner before `run`. */
  inputs?: JsonSchema;
  /** JSON Schema for the outputs payload. Validated by the runner after `run`. */
  outputs?: JsonSchema;
  /** What this node is. Omitted → `function`. */
  kind?: NodeKind;
  /** Setup params (constructor/config shape) for non-`function` kinds. */
  setup?: JsonSchema;
  /** Advisory default icon (a one-time seed; `.octonode` owns it thereafter). */
  icon?: IconValue;
  /** Advisory default config (a one-time seed; `.octonode` owns it thereafter). */
  config?: Record<string, unknown>;
}

export interface DefineNodeArgs<I, O> {
  id?: string;
  workflowId?: string;
  label?: string;
  description?: string;
  symbol?: string;
  defaults?: Record<string, unknown>;
  run: NodeHandler<I, O>;
  inputs?: JsonSchema;
  outputs?: JsonSchema;
  kind?: NodeKind;
  setup?: JsonSchema;
  icon?: IconValue;
  config?: Record<string, unknown>;
}

/** Args for the setup-time helpers. These entities have setup params, not I/O ports. */
export interface DefineSetupArgs<I = unknown, O = unknown> {
  id: string;
  /** JSON Schema for the setup/constructor params — rendered as a form in the editor. */
  setup?: JsonSchema;
  /**
   * How the entity materializes at runtime (instantiate a client, read config…).
   * Optional: setup-time entities aren't part of the data DAG, so a missing run
   * defaults to a no-op that echoes the resolved setup config.
   */
  run?: NodeHandler<I, O>;
  icon?: IconValue;
  config?: Record<string, unknown>;
}

export interface ServiceMethodSpec {
  /** Object input keys mapped to positional class-method arguments. */
  params?: string[];
  inputs?: JsonSchema;
  outputs?: JsonSchema;
}

export interface DefineExplicitServiceArgs<T extends object> {
  id: string;
  /** Explicit class identity for container-resolved or indirect factories; never constructed by discovery. */
  class?: abstract new (...args: never[]) => T;
  create: (context: InvocationContext) => T | Promise<T>;
  /** Close owned resources when an invocation or service worker ends. */
  dispose?: (instance: T) => void | Promise<void>;
  expose: readonly (keyof T & string)[] | Record<string, ServiceMethodSpec>;
  lifecycle?: "invocation" | "workflow-run" | "worker";
  icon?: IconValue;
  setup?: JsonSchema;
  config?: Record<string, unknown>;
}

export interface ServiceDefinition<T extends object = object> extends NodeDefinition {
  kind: "service";
  service: {
    create: (context: InvocationContext) => T | Promise<T>;
    dispose?: (instance: T) => void | Promise<void>;
    lifecycle: "invocation" | "workflow-run" | "worker";
    methods: Record<string, ServiceMethodSpec>;
  };
}

export type SetupNodeDefinition<I, O> = NodeDefinition<I, O | Record<string, unknown>>;

export type Envelope = OkResult | ErrorResult | ManifestResult | ManifestError;

export interface NodeErrorOptions {
  retryable?: boolean;
}

export interface PluginDefinition {
  manifest: PluginManifest;
  nodes: Record<string, NodeDefinition>;
  /** Project-relative assets copied into the built plugin. Never credential files. */
  assets?: readonly string[];
}

export type PluginHandlers = Record<string, NodeDefinition["run"]>;

export type PluginOptions = Omit<PluginManifestInput, "nodes"> & {
  nodes: readonly (NodeDefinition & Pick<PluginNode, "connections" | "env" | "trigger">)[];
  assets?: readonly string[];
};
