// Generated from packages/ui-extensions/src/constants.ts. Do not edit; run the Octonode SDK sync.
export const UI_EXTENSION_API_VERSION = "1" as const;

export const APP_EXTENSION_API_VERSION = "2" as const;

export const MAX_NODES = 100;

export const MAX_DEPTH = 10;

export const MAX_TEXT = 4_000;

export const INPUT_NAME = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;

export const APP_EXTENSION_TARGETS = [
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

export const UI_EXTENSION_TARGETS = ["node.inspector.inputs", ...APP_EXTENSION_TARGETS] as const;
