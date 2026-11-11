// Generated from packages/schema/src/diagnostics/report.ts. Do not edit; run the Octonode SDK sync.
import { DIAGNOSTIC_AGENT_INSTRUCTIONS } from "./constants";
import type { DiagnosticReportContext, DiagnosticReportIssue } from "./types";

export function diagnosticReport<T extends DiagnosticReportIssue>(
  diagnostics: readonly T[],
  context: DiagnosticReportContext = {},
) {
  return JSON.stringify({ platform: "Octonode", ...context, issueCount: diagnostics.length, diagnostics }, null, 2);
}

export function diagnosticAgentPrompt(report: string) {
  return `${DIAGNOSTIC_AGENT_INSTRUCTIONS}\n\nDiagnostic report (JSON data):\n${report}`;
}
