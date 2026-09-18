// Generated from sdks/typescript/src/define-node.ts. Do not edit; run the Octonode SDK sync.
import type { InvocationContext } from "../schema/plugin-sdk";
import type { JsonSchema } from "./json-schema";

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
export type NodeHandler<I = any, O = any> = (inputs: I, context: InvocationContext) => O | Promise<O>;

export interface NodeDefinition<I = any, O = any> {
  /** Stable node id — the discovery key used by `octonode scan`. */
  id: string;
  workflowId?: string;
  label?: string;
  description?: string;
  symbol?: string;
  defaults?: Record<string, unknown>;
  run: NodeHandler<I, O>;
  /** JSON Schema for the inputs payload. Validated by the runner before `run`. */
  inputs?: JsonSchema;
  /** JSON Schema for the outputs payload. Validated by the runner after `run`. */
  outputs?: JsonSchema;
  /** What this node is. Omitted → `function`. */
  kind?: NodeKind;
  /** Setup params (constructor/config shape) for non-`function` kinds. */
  setup?: JsonSchema;
  /** Advisory default icon (a one-time seed; `.octonode` owns it thereafter). */
  icon?: any;
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
  icon?: any;
  config?: Record<string, unknown>;
}

/**
 * Declare a node: package its handler, id, and the JSON Schema for its I/O. The
 * schemas are both enforced at runtime (the runner validates) and reported via
 * `describe` so the engine can populate `.octonode` and type-check edges.
 */
export function defineNode<I = any, O = any>(args: DefineNodeArgs<I, O>): NodeDefinition<I, O> {
  return {
    id: args.id ?? "node",
    ...(args.workflowId ? { workflowId: args.workflowId } : {}),
    run: args.run,
    label: args.label,
    description: args.description,
    symbol: args.symbol,
    defaults: args.defaults,
    inputs: args.inputs,
    outputs: args.outputs,
    kind: args.kind,
    setup: args.setup,
    icon: args.icon,
    config: args.config,
  };
}

/** Args for the setup-time helpers. These entities have setup params, not I/O ports. */
export interface DefineSetupArgs<I = any, O = any> {
  id: string;
  /** JSON Schema for the setup/constructor params — rendered as a form in the editor. */
  setup?: JsonSchema;
  /**
   * How the entity materializes at runtime (instantiate a client, read config…).
   * Optional: setup-time entities aren't part of the data DAG, so a missing run
   * defaults to a no-op that echoes the resolved setup config.
   */
  run?: NodeHandler<I, O>;
  icon?: any;
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
  create: (context: InvocationContext) => T | Promise<T>;
  expose: readonly (keyof T & string)[] | Record<string, ServiceMethodSpec>;
  lifecycle?: "invocation" | "workflow-run" | "worker";
  icon?: any;
  setup?: JsonSchema;
  config?: Record<string, unknown>;
}

export interface ServiceDefinition<T extends object = object> extends NodeDefinition {
  kind: "service";
  service: {
    create: (context: InvocationContext) => T | Promise<T>;
    lifecycle: "invocation" | "workflow-run" | "worker";
    methods: Record<string, ServiceMethodSpec>;
  };
}

const setupPassthrough: NodeHandler = (_inputs, context) => (context?.config ?? {}) as any;

/** Declare a service. Only the explicit create/expose form turns class methods into callable nodes. */
export function defineService<T extends object>(args: DefineExplicitServiceArgs<T>): ServiceDefinition<T>;
export function defineService<I = any, O = any>(args: DefineSetupArgs<I, O>): NodeDefinition<I, O>;
export function defineService<T extends object, I = any, O = any>(
  args: DefineExplicitServiceArgs<T> | DefineSetupArgs<I, O>,
): ServiceDefinition<T> | NodeDefinition<I, O> {
  if ("create" in args && "expose" in args) {
    const methods = Array.isArray(args.expose)
      ? Object.fromEntries(args.expose.map((name) => [String(name), {}]))
      : (args.expose as Record<string, ServiceMethodSpec>);
    return {
      ...defineNode({
        id: args.id,
        run: setupPassthrough,
        kind: "service",
        setup: args.setup,
        icon: args.icon,
        config: args.config,
      }),
      kind: "service",
      service: { create: args.create, lifecycle: args.lifecycle ?? "invocation", methods },
    } as ServiceDefinition<T>;
  }
  return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "service" });
}

/** Declare a class: a class definition (constructor/config params, methods). */
export function defineClass<I = any, O = any>(args: DefineSetupArgs<I, O>): NodeDefinition<I, O> {
  return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "class" });
}

/** Declare a const: a configuration constant referenced by other nodes. */
export function defineConst<I = any, O = any>(args: DefineSetupArgs<I, O>): NodeDefinition<I, O> {
  return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "const" });
}
