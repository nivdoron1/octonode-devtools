// Generated from packages/plugin-runtime/src/runner.ts. Do not edit; run the Octonode SDK sync.
import { Console } from "node:console";
import {
  RequestEnvelope,
  makeErrorResult,
  makeManifestError,
  makeManifestResult,
  makeOkResult,
  type ErrorResult,
  type ManifestError,
  type ManifestResult,
  type NodeManifest,
  type OkResult,
} from "../schema/plugin-sdk";
import type { NodeDefinition, ServiceDefinition, ServiceMethodSpec } from "./define-node";
import { validate } from "./json-schema";

/** The language tag reported in this SDK's manifests. */
const LANGUAGE = "typescript";

type Envelope = OkResult | ErrorResult | ManifestResult | ManifestError;

/**
 * A deliberate, terminal failure a node author can raise. The runner converts
 * it into a `NON_RETRYABLE` error envelope instead of a generic RUNTIME_ERROR.
 */
export class NodeError extends Error {
  readonly retryable: boolean;
  readonly code: "RUNTIME_ERROR" | "NON_RETRYABLE";
  constructor(message: string, opts?: { retryable?: boolean }) {
    super(message);
    this.name = "NodeError";
    this.retryable = opts?.retryable ?? false;
    this.code = this.retryable ? "RUNTIME_ERROR" : "NON_RETRYABLE";
  }
}

function manifestOf(node: NodeDefinition, requestedNode?: string): NodeManifest {
  if (isExplicitService(node)) {
    const methodName = requestedServiceMethod(node, requestedNode);
    if (methodName) {
      const method = node.service.methods[methodName];
      return {
        id: `${node.id}.${methodName}`,
        language: LANGUAGE,
        inputs: method.inputs,
        outputs: method.outputs,
        icon: node.icon as any,
      };
    }
  }
  return {
    id: node.id,
    ...(node.workflowId ? { workflowId: node.workflowId } : {}),
    language: LANGUAGE,
    label: node.label,
    description: node.description,
    symbol: node.symbol,
    defaults: node.defaults,
    inputs: node.inputs,
    outputs: node.outputs,
    kind: node.kind,
    setup: node.setup,
    icon: node.icon as any,
    config: node.config,
    service: isExplicitService(node)
      ? {
          lifecycle: node.service.lifecycle,
          methods: Object.entries(node.service.methods).map(([name, spec]) => ({
            name,
            params: spec.params ?? [],
            inputs: spec.inputs,
            outputs: spec.outputs,
          })),
        }
      : undefined,
  };
}

const workerServiceInstances = new WeakMap<ServiceDefinition, Promise<object>>();
const runServiceInstances = new WeakMap<ServiceDefinition, Map<string, Promise<object>>>();

const isExplicitService = (node: NodeDefinition): node is ServiceDefinition =>
  node.kind === "service" && "service" in node && !!(node as Partial<ServiceDefinition>).service;

function requestedServiceMethod(node: ServiceDefinition, requested?: string): string | undefined {
  if (!requested || requested === node.id) return undefined;
  const prefix = `${node.id}.`;
  const method = requested.startsWith(prefix) ? requested.slice(prefix.length) : requested;
  return method in node.service.methods ? method : undefined;
}

async function serviceInstance(
  node: ServiceDefinition,
  context: import("../schema/plugin-sdk").InvocationContext,
  invocationId: string,
): Promise<object> {
  if (node.service.lifecycle === "invocation") return node.service.create(context);
  if (node.service.lifecycle === "worker") {
    let instance = workerServiceInstances.get(node);
    if (!instance) {
      instance = Promise.resolve(node.service.create(context));
      workerServiceInstances.set(node, instance);
    }
    return instance;
  }
  let runs = runServiceInstances.get(node);
  if (!runs) {
    runs = new Map();
    runServiceInstances.set(node, runs);
  }
  const key = context.runId ?? invocationId;
  let instance = runs.get(key);
  if (!instance) {
    instance = Promise.resolve(node.service.create(context));
    runs.set(key, instance);
    if (runs.size > 100) runs.delete(runs.keys().next().value as string);
  }
  return instance;
}

async function invokeServiceMethod(
  node: ServiceDefinition,
  methodName: string,
  spec: ServiceMethodSpec,
  inputs: unknown,
  context: import("../schema/plugin-sdk").InvocationContext,
  invocationId: string,
): Promise<unknown> {
  const instance = (await serviceInstance(node, context, invocationId)) as Record<string, unknown>;
  const method = instance[methodName];
  if (typeof method !== "function")
    throw new Error(`service "${node.id}" does not implement exposed method "${methodName}"`);
  const record = inputs && typeof inputs === "object" ? (inputs as Record<string, unknown>) : { value: inputs };
  const args = spec.params?.length ? spec.params.map((name) => record[name]) : [inputs];
  return (method as (...args: unknown[]) => unknown).apply(instance, args);
}

/**
 * Handle one request line and produce one response envelope. This is shared by
 * both transport modes: one-shot (a single line then EOF) and worker (many
 * newline-delimited lines on a long-lived process).
 */
export async function processRequest(node: NodeDefinition, raw: string): Promise<Envelope> {
  let request: RequestEnvelope;
  let invocationId = "unknown";
  try {
    request = RequestEnvelope.parse(JSON.parse(raw.trim()));
    invocationId = request.invocationId;
  } catch (err) {
    return makeErrorResult(invocationId, {
      code: "VALIDATION_ERROR",
      message: `Invalid request envelope on stdin: ${describe(err)}`,
      retryable: false,
    });
  }

  if (request.type === "describe") {
    try {
      return makeManifestResult(invocationId, manifestOf(node, request.node));
    } catch (err) {
      return makeManifestError(invocationId, {
        code: "RUNTIME_ERROR",
        message: `Failed to build manifest: ${describe(err)}`,
        retryable: false,
      });
    }
  }

  const serviceMethod = isExplicitService(node) ? requestedServiceMethod(node, request.node) : undefined;
  if (isExplicitService(node) && request.node && request.node !== node.id && !serviceMethod) {
    return makeErrorResult(invocationId, {
      code: "VALIDATION_ERROR",
      message: `service method not exposed: ${request.node}`,
      retryable: false,
    });
  }
  const methodSpec = serviceMethod && isExplicitService(node) ? node.service.methods[serviceMethod] : undefined;
  const inputs =
    node.defaults && request.inputs && typeof request.inputs === "object" && !Array.isArray(request.inputs)
      ? { ...node.defaults, ...request.inputs }
      : request.inputs;
  const inputErrors = validate(methodSpec?.inputs ?? node.inputs, inputs);
  if (inputErrors.length > 0) {
    return makeErrorResult(invocationId, {
      code: "VALIDATION_ERROR",
      message: `Inputs failed schema validation: ${inputErrors[0].path} ${inputErrors[0].message}`,
      retryable: false,
      details: { errors: inputErrors },
    });
  }

  let outputs: unknown;
  try {
    outputs =
      serviceMethod && isExplicitService(node)
        ? await invokeServiceMethod(node, serviceMethod, methodSpec ?? {}, inputs, request.context, invocationId)
        : await node.run(inputs, request.context);
  } catch (err) {
    if (err instanceof NodeError) {
      return makeErrorResult(invocationId, {
        code: err.code,
        message: err.message,
        retryable: err.retryable,
        stack: err.stack,
      });
    }
    return makeErrorResult(invocationId, {
      code: "RUNTIME_ERROR",
      message: describe(err),
      retryable: false,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  const outputErrors = validate(methodSpec?.outputs ?? node.outputs, outputs);
  if (outputErrors.length > 0) {
    return makeErrorResult(invocationId, {
      code: "VALIDATION_ERROR",
      message: `Outputs failed schema validation: ${outputErrors[0].path} ${outputErrors[0].message}`,
      retryable: false,
      details: { errors: outputErrors },
    });
  }

  let serializationError: string | undefined;
  try {
    serializationError = jsonSafetyError(outputs);
  } catch (err) {
    serializationError = `output inspection failed: ${describe(err)}`;
  }
  if (serializationError) {
    return makeErrorResult(invocationId, {
      code: "VALIDATION_ERROR",
      message: `Outputs must be losslessly JSON-serializable: ${serializationError}`,
      retryable: false,
    });
  }

  return makeOkResult(invocationId, outputs);
}

export function jsonSafetyError(value: unknown, path = "$", ancestors = new Set<object>()): string | undefined {
  if (value === null || typeof value === "string" || typeof value === "boolean") return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? undefined : `${path} is not a finite number`;
  if (typeof value !== "object") return `${path} has type ${typeof value}`;
  if (ancestors.has(value)) return `${path} is cyclic`;
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        if (!(index in value)) return `${path}[${index}] is an array hole`;
        const error = jsonSafetyError(value[index], `${path}[${index}]`, ancestors);
        if (error) return error;
      }
      return undefined;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return `${path} is not a plain object`;
    if (Object.getOwnPropertySymbols(value).length) return `${path} has symbol keys`;
    for (const [key, item] of Object.entries(value)) {
      const error = jsonSafetyError(item, `${path}.${key}`, ancestors);
      if (error) return error;
    }
    return undefined;
  } finally {
    ancestors.delete(value);
  }
}

function write(envelope: Envelope): void {
  process.stdout.write(JSON.stringify(envelope) + "\n");
}

/**
 * Run a node over stdin until EOF, processing one newline-delimited request at a
 * time and emitting one response line each. A one-shot caller sends a single
 * line and closes stdin; a worker-mode caller streams many lines on the same
 * process — identical code path, so interpreter startup is paid once per process.
 */
export async function runNode(node: NodeDefinition): Promise<void> {
  const stdin = process.stdin;
  stdin.setEncoding("utf8");

  let buffer = "";
  const queue: string[] = [];
  let draining = false;
  let ended = false;
  let done: () => void;
  const finished = new Promise<void>((resolve) => (done = resolve));

  const drain = async () => {
    if (draining) return;
    draining = true;
    while (queue.length > 0) {
      const line = queue.shift()!;
      if (line.trim().length > 0) write(await processRequest(node, line));
    }
    draining = false;
    if (ended) done();
  };

  stdin.on("data", (chunk: string) => {
    buffer += chunk;
    let idx: number;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      queue.push(buffer.slice(0, idx));
      buffer = buffer.slice(idx + 1);
    }
    void drain();
  });

  stdin.on("end", () => {
    if (buffer.length > 0) queue.push(buffer);
    buffer = "";
    ended = true;
    void drain();
    if (!draining && queue.length === 0) done();
  });

  return finished;
}

function describe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Convenience entrypoint for a node module: run until stdin closes, then exit.
 * All node-level errors are reported as envelopes, so the process exits 0 even
 * on a handled node error — the envelope carries the failure.
 */
export function start(node: NodeDefinition): void {
  // stdout is the IPC channel. Give arbitrary user code a console whose every
  // method writes to stderr before the first request is handled.
  globalThis.console = new Console({ stdout: process.stderr, stderr: process.stderr });
  runNode(node)
    .then(() => {
      process.exitCode = 0;
    })
    .catch((err) => {
      process.stderr.write(`octonode runner failure: ${describe(err)}\n`);
      process.exitCode = 1;
    });
}
