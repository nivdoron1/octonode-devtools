// Generated from packages/schema/src/app-contributions.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { IconName } from "./icons.js";
import { PersonalLayoutItems } from "./personal-layout.js";

export const APP_VIEW_TARGETS = [
  "app.page",
  "workspace.block",
  "shell.panel",
  "shell.dock",
  "project.tab",
  "project.overview.block",
  "workflow.tab",
  "workflow.inspector.block",
  "node.view",
  "node.inspector.tab",
  "node.inspector.block",
  "task.space.view",
  "task.details.tab",
  "task.details.block",
  "task.card.badge",
  "document.tab",
  "document.panel",
  "editor.panel",
  "git.diff.panel",
  "table.view",
  "execution.details.block",
  "app.settings.section",
  "project.settings.section",
] as const;
export const APP_ACTION_TARGETS = [
  "project.action",
  "file.action",
  "editor.action",
  "editor.selection-action",
  "workflow.action",
  "workflow.canvas.action",
  "workflow.selection-action",
  "workflow.edge.action",
  "node.action",
  "task.space.action",
  "task.action",
  "document.action",
  "document.selection-action",
  "document.block.action",
  "document.slash-command",
  "document.review.action",
  "git.diff.action",
  "table.action",
  "execution.action",
] as const;
export const APP_LAUNCHER_TARGETS = ["shell.navbar.action", "shell.navigation.item", "shell.command"] as const;
export const AppViewTarget = z.enum(APP_VIEW_TARGETS);
export const AppActionTarget = z.enum(APP_ACTION_TARGETS);
export const AppContributionTarget = z.enum([...APP_VIEW_TARGETS, ...APP_ACTION_TARGETS]);
export type AppContributionTarget = z.infer<typeof AppContributionTarget>;
export const appContributionId = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/)
  .max(100);
export const appContributionTitle = z.string().trim().min(1).max(240);
export const appContributionWhen = z
  .object({
    hasProject: z.boolean().optional(),
    hasSelection: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    nodeKind: z.string().min(1).max(240).optional(),
    documentFormat: z.enum(["markdown", "html", "latex"]).optional(),
  })
  .strict();
export const appLauncherSchema = z
  .object({
    id: appContributionId,
    target: z.enum(APP_LAUNCHER_TARGETS),
    title: appContributionTitle,
    icon: IconName.optional(),
    opens: appContributionId,
  })
  .strict();
export const appContributionSchema = z
  .object({
    id: appContributionId,
    target: AppContributionTarget,
    title: appContributionTitle,
    icon: IconName.optional(),
    path: z
      .string()
      .regex(/^extensions\/[a-z0-9][a-z0-9-]*\.js$/)
      .max(150),
    sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    when: appContributionWhen.optional(),
  })
  .strict();
export const appContributionContextSchema = z
  .object({
    projectId: z.string().min(1).max(128).optional(),
    worktreeId: z.string().min(1).max(240).optional(),
    workflowId: z.string().min(1).max(240).optional(),
    nodeId: z.string().min(1).max(240).optional(),
    nodeKind: z.string().min(1).max(240).optional(),
    edgeId: z.string().min(1).max(500).optional(),
    executionId: z.string().min(1).max(128).optional(),
    taskSpaceId: z.string().min(1).max(128).optional(),
    itemId: z.string().min(1).max(128).optional(),
    documentId: z.string().min(1).max(128).optional(),
    documentFormat: z.enum(["markdown", "html", "latex"]).optional(),
    tableId: z.string().min(1).max(128).optional(),
    rowId: z.string().min(1).max(128).optional(),
    filePath: z.string().min(1).max(1024).optional(),
    revision: z.union([z.string().max(240), z.number().int().nonnegative()]).optional(),
    draftRevision: z.number().int().nonnegative().optional(),
    selection: z
      .object({ start: z.number().int().nonnegative(), end: z.number().int().nonnegative() })
      .strict()
      .refine((value) => value.end >= value.start)
      .optional(),
    selectedIds: z.array(z.string().min(1).max(500)).max(100).optional(),
    canvas: z.object({ x: z.number().finite(), y: z.number().finite() }).strict().optional(),
    readOnly: z.boolean().default(true),
    tasks: z
      .array(
        z
          .object({
            itemId: z.string().min(1).max(128),
            taskSpaceId: z.string().min(1).max(128),
            revision: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .max(100)
      .optional(),
    nodes: z
      .array(
        z
          .object({
            id: z.string().min(1).max(240),
            kind: z.string().max(240).optional(),
            label: z.string().max(240).optional(),
          })
          .strict(),
      )
      .max(100)
      .optional(),
  })
  .strict();
export type AppContributionContext = z.infer<typeof appContributionContextSchema>;
export type AppContribution = z.infer<typeof appContributionSchema>;
export type AppLauncher = z.infer<typeof appLauncherSchema>;
export const appHostRequestSchema = z.discriminatedUnion("command", [
  z.object({ command: z.literal("panel.open"), id: appContributionId }).strict(),
  z.object({ command: z.literal("assistant.open"), suggestion: z.string().max(8000).optional() }).strict(),
  z.object({ command: z.literal("layout.list") }).strict(),
  z
    .object({
      command: z.literal("layout.undo"),
      scope: z
        .string()
        .regex(/^[a-z][a-z0-9.-]*$/)
        .max(100),
      revision: z.string().min(1).max(240),
    })
    .strict(),
  z
    .object({
      command: z.literal("layout.update"),
      scope: z
        .string()
        .regex(/^[a-z][a-z0-9.-]*$/)
        .max(100),
      revision: z.string().min(1).max(240),
      items: PersonalLayoutItems,
    })
    .strict(),
  z
    .object({
      command: z.literal("edit.propose"),
      resource: z.enum(["file", "document"]),
      baseRevision: z.string().min(1).max(240),
      draftRevision: z.number().int().nonnegative(),
      content: z.string().max(12000),
      mode: z.enum(["append", "replace", "replace-selection"]),
    })
    .strict(),
]);
export type AppHostRequest = z.infer<typeof appHostRequestSchema>;
