// Generated from packages/schema/src/diagnostics/types.ts. Do not edit; run the Octonode SDK sync.
import type { DIAGNOSTIC_ACTIONS, DIAGNOSTIC_KINDS } from "./constants";
import type { DiagnosticExplanation, RuntimeErrorIdentity } from "./schema";
import type { ProjectAnalysisResult } from "../project/analysis";

export type DiagnosticKind = (typeof DIAGNOSTIC_KINDS)[number];
export type DiagnosticAction = (typeof DIAGNOSTIC_ACTIONS)[number];
export interface DiagnosticRule {
  kind: DiagnosticKind;
  coverage: "specific" | "family" | "fallback" | "internal";
}
export interface RuntimeDiagnosticInput {
  code?: string;
  name?: string;
  systemCode?: string;
  retryable?: boolean;
  diagnostic?: DiagnosticExplanation;
  causes?: RuntimeErrorIdentity["causes"];
}
export interface CompilerMessage {
  code: number;
  category?: number;
  messageText: string;
  next?: readonly CompilerMessage[];
}

export interface DiagnosticReportIssue {
  code?: string;
  message: string;
}

export interface DiagnosticReportContext {
  projectId?: string;
  workflowId?: string;
  nodeId?: string;
  runId?: string;
  revision?: string;
  analysisStatus?: ProjectAnalysisResult["status"];
  truncated?: boolean;
}
