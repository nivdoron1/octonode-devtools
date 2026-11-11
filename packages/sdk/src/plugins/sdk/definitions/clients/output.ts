// Generated from packages/plugin/src/clients/output.ts. Do not edit; run the Octonode SDK sync.
import { CLIENT_OUTPUT_SOURCE } from "../../clients/constants";
import ts from "typescript";

/** Standalone JavaScript adapters use the shared stream collector. */
export function clientOutputSource() {
  return ts.transpileModule(CLIENT_OUTPUT_SOURCE, { compilerOptions: { target: ts.ScriptTarget.ESNext } }).outputText;
}
