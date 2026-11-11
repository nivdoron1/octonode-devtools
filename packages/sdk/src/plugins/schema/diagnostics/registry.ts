// Generated from packages/schema/src/diagnostics/registry.ts. Do not edit; run the Octonode SDK sync.
import { DIAGNOSTIC_DEFAULT_ACTIONS, LINT_DIAGNOSTICS, RUNTIME_DIAGNOSTICS, RUNTIME_ERROR_NAMES } from "./constants";
import type { DiagnosticKind, DiagnosticRule, RuntimeDiagnosticInput } from "./types";
import type { DiagnosticExplanation } from "./schema";

export function diagnosticExplanation(
  kind: DiagnosticKind,
  coverage: DiagnosticRule["coverage"] = "family",
): DiagnosticExplanation {
  return { kind, coverage, action: DIAGNOSTIC_DEFAULT_ACTIONS[kind], targets: [] };
}

export function lintDiagnosticExplanation(code: string): DiagnosticExplanation {
  const oxlint = /^([^()]+)\(([^()]+)\)$/.exec(code);
  const parts = code.split("/");
  const namespace = oxlint?.[1] ?? parts.slice(0, -1).join("/");
  const rule = oxlint?.[2] ?? parts[parts.length - 1];
  const registry: Readonly<Record<string, DiagnosticKind | undefined>> = LINT_DIAGNOSTICS;
  const kind =
    ["", "eslint", "typescript", "@typescript-eslint"].includes(namespace) && Object.hasOwn(registry, rule)
      ? registry[rule]
      : undefined;
  return diagnosticExplanation(kind ?? "lint", kind ? "family" : "fallback");
}

export function runtimeDiagnosticExplanation(error: RuntimeDiagnosticInput): DiagnosticExplanation {
  if (error.diagnostic) return error.diagnostic;
  const codes: Readonly<Record<string, DiagnosticKind | undefined>> = RUNTIME_DIAGNOSTICS;
  const names: Readonly<Record<string, DiagnosticKind | undefined>> = RUNTIME_ERROR_NAMES;
  const lookup = (code?: string) => (code && Object.hasOwn(codes, code) ? codes[code] : undefined);
  const kind = lookup(error.systemCode) ?? lookup(error.code);
  // The broad transport code must not obscure a known JavaScript exception class.
  const name = error.name && error.name !== "Error" && Object.hasOwn(names, error.name) ? names[error.name] : undefined;
  const cause = error.causes?.map((item) => lookup(item.code)).find((item) => item && item !== "runtimeError");
  const specific =
    kind && kind !== "runtimeError" ? kind : (cause ?? name ?? (error.code === "NON_RETRYABLE" ? kind : undefined));
  return diagnosticExplanation(specific ?? "runtimeError", specific ? "family" : "fallback");
}
