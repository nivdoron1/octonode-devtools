// Generated from packages/schema/src/project/analysis.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { DiagnosticContext, DiagnosticExplanation } from "../diagnostics";

export const ProjectAnalysisInput = z
  .object({
    drafts: z
      .array(
        z
          .object({
            path: z.string().min(1).max(500),
            content: z.string().max(262144),
            baseRevision: z.string().regex(/^[a-f0-9]{64}$/),
          })
          .strict(),
      )
      .max(20)
      .default([]),
    declaration: z
      .object({
        symbolId: z.string().min(1).max(1000),
        sourceRevision: z.string().regex(/^[a-f0-9]{64}$/),
        replacement: z.string().max(262144).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
export type ProjectAnalysisInput = z.infer<typeof ProjectAnalysisInput>;

export const ProjectAnalysisDiagnostic = z
  .object({
    tool: z.enum(["typescript", "oxlint", "eslint", "analysis"]),
    severity: z.enum(["error", "warning", "info", "hint"]),
    code: z.string().max(200),
    message: z.string().max(8000),
    path: z.string().max(1000).optional(),
    line: z.number().int().positive().optional(),
    column: z.number().int().positive().optional(),
    start: z.number().int().nonnegative().optional(),
    end: z.number().int().nonnegative().optional(),
    revision: z.string().optional(),
    introduced: z.boolean().optional(),
    explanation: DiagnosticExplanation.optional(),
  })
  .merge(DiagnosticContext);
export type ProjectAnalysisDiagnostic = z.infer<typeof ProjectAnalysisDiagnostic>;

export const ProjectAnalysisResult = z.object({
  revision: z.string(),
  status: z.enum(["complete", "incomplete", "unavailable"]),
  linter: z.enum(["oxlint", "eslint", "none"]),
  origin: z.enum(["default", "repository", "browser"]),
  diagnostics: z.array(ProjectAnalysisDiagnostic).max(200),
  truncated: z.boolean(),
  usages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        kind: z.string(),
        path: z.string(),
        line: z.number().int().positive(),
        column: z.number().int().positive(),
        direct: z.boolean(),
      }),
    )
    .max(200),
  usageCount: z.number().int().nonnegative(),
});
export type ProjectAnalysisResult = z.infer<typeof ProjectAnalysisResult>;
