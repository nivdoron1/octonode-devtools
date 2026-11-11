// Generated from packages/schema/src/diagnostics/index.ts. Do not edit; run the Octonode SDK sync.
export {
  DiagnosticExplanation,
  DiagnosticRelated,
  DiagnosticMessage,
  DiagnosticContext,
  RuntimeErrorIdentity,
} from "./schema";
export { diagnosticExplanation, lintDiagnosticExplanation, runtimeDiagnosticExplanation } from "./registry";
export { runtimeErrorIdentity } from "./runtime";
export { diagnosticMessages } from "./messages";
export { diagnosticOffset } from "./location";
export { diagnosticReport, diagnosticAgentPrompt } from "./report";
export {
  DIAGNOSTIC_KINDS,
  DIAGNOSTIC_ACTIONS,
  DIAGNOSTIC_DEFAULT_ACTIONS,
  DIAGNOSTIC_MAX_RELATED,
  DIAGNOSTIC_MAX_MESSAGES,
  DIAGNOSTIC_MAX_MESSAGE_LENGTH,
  DIAGNOSTIC_MAX_DEPTH,
} from "./constants";
export type {
  DiagnosticKind,
  DiagnosticAction,
  DiagnosticRule,
  RuntimeDiagnosticInput,
  DiagnosticReportContext,
  DiagnosticReportIssue,
} from "./types";
