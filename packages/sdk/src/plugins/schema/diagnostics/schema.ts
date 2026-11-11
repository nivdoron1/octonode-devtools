// Generated from packages/schema/src/diagnostics/schema.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import {
  DIAGNOSTIC_ACTIONS,
  DIAGNOSTIC_KINDS,
  DIAGNOSTIC_MAX_RELATED,
  DIAGNOSTIC_MAX_MESSAGES,
  DIAGNOSTIC_MAX_MESSAGE_LENGTH,
  DIAGNOSTIC_MAX_DEPTH,
  DIAGNOSTIC_MAX_CAUSES,
} from "./constants";

export const DiagnosticExplanation = z.object({
  kind: z.enum(DIAGNOSTIC_KINDS),
  coverage: z.enum(["specific", "family", "fallback", "internal"]).optional(),
  action: z.enum(DIAGNOSTIC_ACTIONS).optional(),
  input: z.string().optional(),
  expected: z.string().optional(),
  provided: z.string().optional(),
  targets: z
    .array(
      z.object({
        workflowId: z.string(),
        workflowName: z.string(),
        nodeId: z.string().optional(),
        nodeName: z.string().optional(),
        port: z.string().optional(),
        revision: z.string().optional(),
        producerNodeId: z.string().optional(),
        producerName: z.string().optional(),
        outputPort: z.string().optional(),
      }),
    )
    .max(100),
});
export const DiagnosticRelated = z.object({
  message: z.string().max(DIAGNOSTIC_MAX_MESSAGE_LENGTH),
  code: z.string().optional(),
  path: z.string().optional(),
  line: z.number().int().positive().optional(),
  column: z.number().int().positive().optional(),
  start: z.number().int().nonnegative().optional(),
  end: z.number().int().nonnegative().optional(),
  revision: z.string().optional(),
});
export const DiagnosticMessage = z.object({
  message: z.string().max(DIAGNOSTIC_MAX_MESSAGE_LENGTH),
  code: z.string(),
  depth: z.number().int().min(0).max(DIAGNOSTIC_MAX_DEPTH),
  category: z.number().int().optional(),
});
export const DiagnosticContext = z.object({
  phase: z.enum(["parse", "typecheck", "lint", "compile", "runtime", "analysis"]).optional(),
  related: z.array(DiagnosticRelated).max(DIAGNOSTIC_MAX_RELATED).optional(),
  messages: z.array(DiagnosticMessage).max(DIAGNOSTIC_MAX_MESSAGES).optional(),
  truncated: z.boolean().optional(),
});
export const RuntimeErrorIdentity = z.object({
  name: z.string().max(200).optional(),
  systemCode: z.string().max(200).optional(),
  causes: z
    .array(z.object({ name: z.string().max(200).optional(), code: z.string().max(200).optional() }))
    .max(DIAGNOSTIC_MAX_CAUSES)
    .optional(),
});
export type DiagnosticExplanation = z.infer<typeof DiagnosticExplanation>;
export type DiagnosticRelated = z.infer<typeof DiagnosticRelated>;
export type DiagnosticMessage = z.infer<typeof DiagnosticMessage>;
export type RuntimeErrorIdentity = z.infer<typeof RuntimeErrorIdentity>;
