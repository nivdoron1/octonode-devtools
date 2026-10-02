// Generated from packages/plugin-runtime/src/define/node.ts. Do not edit; run the Octonode SDK sync.
import type { InvocationContext } from "../../schema/plugin-sdk";
import type {
  DefineNodeArgs,
  DefineSetupArgs,
  DefineExplicitServiceArgs,
  NodeDefinition,
  ServiceDefinition,
  ServiceMethodSpec,
  SetupNodeDefinition,
} from "../types.js";

/**
 * Declare a node: package its handler, id, and the JSON Schema for its I/O. The
 * schemas are both enforced at runtime (the runner validates) and reported via
 * `describe` so the engine can populate `.octonode` and type-check edges.
 */
export function defineNode<I = unknown, O = unknown>(args: DefineNodeArgs<I, O>): NodeDefinition<I, O> {
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

const setupPassthrough = (_inputs: unknown, context: InvocationContext) => context.config ?? {};

/** Declare a service. Only the explicit create/expose form turns class methods into callable nodes. */
export function defineService<T extends object>(args: DefineExplicitServiceArgs<T>): ServiceDefinition<T>;
export function defineService<I = unknown, O = unknown>(args: DefineSetupArgs<I, O>): SetupNodeDefinition<I, O>;
export function defineService<T extends object, I = unknown, O = unknown>(
  args: DefineExplicitServiceArgs<T> | DefineSetupArgs<I, O>,
): ServiceDefinition<T> | SetupNodeDefinition<I, O> {
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
      service: { create: args.create, dispose: args.dispose, lifecycle: args.lifecycle ?? "invocation", methods },
    };
  }
  return defineNode<I, O | Record<string, unknown>>({ ...args, run: args.run ?? setupPassthrough, kind: "service" });
}

/** Declare a class: a class definition (constructor/config params, methods). */
export function defineClass<I = unknown, O = unknown>(args: DefineSetupArgs<I, O>): SetupNodeDefinition<I, O> {
  return defineNode<I, O | Record<string, unknown>>({ ...args, run: args.run ?? setupPassthrough, kind: "class" });
}

/** Declare a const: a configuration constant referenced by other nodes. */
export function defineConst<I = unknown, O = unknown>(args: DefineSetupArgs<I, O>): SetupNodeDefinition<I, O> {
  return defineNode<I, O | Record<string, unknown>>({ ...args, run: args.run ?? setupPassthrough, kind: "const" });
}
