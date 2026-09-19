// Generated from packages/schema/src/ipc-envelope.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { IconName } from "./icons";

/**
 * The IPC protocol version. Every envelope carries this in its `octonode`
 * field so the wire format can evolve without ambiguity. Bump only on a
 * breaking change to the envelope shape.
 */
export const PROTOCOL_VERSION = "1" as const;

/**
 * A JSON Schema object, kept deliberately loose. It is the lowest common
 * denominator every language can emit and validate against, which is what
 * makes "a node in any language" tractable: contracts travel as plain JSON
 * Schema, not as language-specific type objects.
 */
export const JsonSchema = z.record(z.unknown());
export type JsonSchema = Record<string, unknown>;

/**
 * Structured error codes a node (or the engine) can report. `retryable` on the
 * error object — not the code alone — is what the DAG executor consults in
 * later phases, but the code gives callers a stable taxonomy.
 */
export const ErrorCode = z.enum([
  "VALIDATION_ERROR", // inputs/outputs failed schema validation
  "RUNTIME_ERROR", // the node threw, crashed, or emitted garbage
  "TIMEOUT", // the node exceeded its deadline
  "NON_RETRYABLE", // a deliberate, terminal failure the node raised
]);
export type ErrorCode = z.infer<typeof ErrorCode>;

/**
 * Per-invocation context handed to the node. In Phase 1/2 only `config`/`attempt`
 * are meaningful; `runId`/`env`/`deadlineMs` are populated once the config and
 * DAG layers land, but they are part of the contract from day one.
 */
export const InvocationContext = z.object({
  runId: z.string().optional(),
  env: z.string().optional(),
  config: z.record(z.unknown()).default({}),
  attempt: z.number().int().positive().default(1),
  deadlineMs: z.number().int().positive().optional(),
});
export type InvocationContext = z.infer<typeof InvocationContext>;

/** Engine → node: a request to execute the node with the given inputs. */
export const InvokeRequest = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("invoke"),
  invocationId: z.string(),
  /** Optional node id — useful once one process can host multiple nodes. */
  node: z.string().optional(),
  inputs: z.unknown(),
  context: InvocationContext.default({}),
});
export type InvokeRequest = z.infer<typeof InvokeRequest>;

/**
 * Engine → node: a request for the node to self-report its manifest instead of
 * executing. This is the universal discovery mechanism — every language that
 * can answer `describe` can be scanned into `.octonode`, no AST tooling needed.
 */
export const DescribeRequest = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("describe"),
  invocationId: z.string(),
  node: z.string().optional(),
});
export type DescribeRequest = z.infer<typeof DescribeRequest>;

/** Any engine → node request. */
export const RequestEnvelope = z.discriminatedUnion("type", [InvokeRequest, DescribeRequest]);
export type RequestEnvelope = z.infer<typeof RequestEnvelope>;

/** Errors are data, not just exceptions — they cross the process boundary as JSON. */
export const NodeError = z.object({
  code: ErrorCode,
  message: z.string(),
  retryable: z.boolean().default(false),
  details: z.unknown().optional(),
  stack: z.string().optional(),
});
export type NodeError = z.infer<typeof NodeError>;

// ---- Invoke results ----

const ResultOk = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("result"),
  invocationId: z.string(),
  status: z.literal("ok"),
  outputs: z.unknown(),
});

const ResultErr = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("result"),
  invocationId: z.string(),
  status: z.literal("error"),
  error: NodeError,
});

/** Node → engine: the outcome of an invocation. */
export const ResultEnvelope = z.discriminatedUnion("status", [ResultOk, ResultErr]);
export type ResultEnvelope = z.infer<typeof ResultEnvelope>;

export type OkResult = z.infer<typeof ResultOk>;
export type ErrorResult = z.infer<typeof ResultErr>;

// ---- Manifests (describe results) ----

/**
 * What a node declares about itself: a stable id, its language, the JSON Schema
 * for its inputs and outputs, and optional presentation/runtime seeds. This is
 * the payload `octonode scan` collects (Phase 3) to populate `.octonode`.
 */
export const NodeManifest = z.object({
  id: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  symbol: z.string().max(16).optional(),
  defaults: z.record(z.unknown()).optional(),
  /** A workflow wrapper receives the current execution config through its invocation context. */
  workflowId: z.string().min(1).optional(),
  language: z.string(),
  inputs: JsonSchema.optional(),
  outputs: JsonSchema.optional(),
  /**
   * What this node is: `function` (default), `class`, `service`, or `const`.
   * Set by the setup-time SDK helpers (defineService/defineClass/defineConst)
   * so `scan` writes it to `.octonode`.
   */
  kind: z.enum(["function", "class", "service", "const"]).optional(),
  /** Setup params for non-function kinds (constructor/config shape). */
  setup: JsonSchema.optional(),
  /** Advisory default icon — a one-time seed; config owns it thereafter. */
  icon: IconName.optional(),
  /** Advisory default config — a one-time seed; config owns it thereafter. */
  config: z.record(z.unknown()).optional(),
  /** Explicit service exposure. Plain classes never populate this field. */
  service: z
    .object({
      lifecycle: z.enum(["invocation", "workflow-run", "worker"]),
      methods: z.array(
        z.object({
          name: z.string(),
          params: z.array(z.string()).default([]),
          inputs: JsonSchema.optional(),
          outputs: JsonSchema.optional(),
        }),
      ),
    })
    .optional(),
});
export type NodeManifest = z.infer<typeof NodeManifest>;

const ManifestOk = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("manifest"),
  invocationId: z.string(),
  status: z.literal("ok"),
  manifest: NodeManifest,
});

const ManifestErr = z.object({
  octonode: z.literal(PROTOCOL_VERSION),
  type: z.literal("manifest"),
  invocationId: z.string(),
  status: z.literal("error"),
  error: NodeError,
});

/** Node → engine: the response to a `describe` request. */
export const ManifestEnvelope = z.discriminatedUnion("status", [ManifestOk, ManifestErr]);
export type ManifestEnvelope = z.infer<typeof ManifestEnvelope>;

export type ManifestResult = z.infer<typeof ManifestOk>;
export type ManifestError = z.infer<typeof ManifestErr>;

// ---- Constructors: the one blessed way to build envelopes, used by SDK + engine ----

export function makeInvokeRequest(args: {
  invocationId: string;
  inputs: unknown;
  node?: string;
  context?: Partial<InvocationContext>;
}): InvokeRequest {
  return InvokeRequest.parse({
    octonode: PROTOCOL_VERSION,
    type: "invoke",
    invocationId: args.invocationId,
    node: args.node,
    inputs: args.inputs,
    context: args.context ?? {},
  });
}

export function makeDescribeRequest(args: { invocationId: string; node?: string }): DescribeRequest {
  return DescribeRequest.parse({
    octonode: PROTOCOL_VERSION,
    type: "describe",
    invocationId: args.invocationId,
    node: args.node,
  });
}

export function makeOkResult(invocationId: string, outputs: unknown): OkResult {
  return {
    octonode: PROTOCOL_VERSION,
    type: "result",
    invocationId,
    status: "ok",
    outputs,
  };
}

export function makeErrorResult(invocationId: string, error: NodeError): ErrorResult {
  return {
    octonode: PROTOCOL_VERSION,
    type: "result",
    invocationId,
    status: "error",
    error: NodeError.parse(error),
  };
}

export function makeManifestResult(invocationId: string, manifest: NodeManifest): ManifestResult {
  return {
    octonode: PROTOCOL_VERSION,
    type: "manifest",
    invocationId,
    status: "ok",
    manifest: NodeManifest.parse(manifest),
  };
}

export function makeManifestError(invocationId: string, error: NodeError): ManifestError {
  return {
    octonode: PROTOCOL_VERSION,
    type: "manifest",
    invocationId,
    status: "error",
    error: NodeError.parse(error),
  };
}
