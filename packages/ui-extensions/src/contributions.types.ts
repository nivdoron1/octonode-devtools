// Generated from packages/ui-extensions/src/contributions.types.ts. Do not edit; run the Octonode SDK sync.
import type { APP_EXTENSION_TARGETS } from "./constants.js";

export type AppExtensionTarget = (typeof APP_EXTENSION_TARGETS)[number];
export type ExtensionContext = Readonly<{
  projectId?: string;
  worktreeId?: string;
  workflowId?: string;
  nodeId?: string;
  nodeKind?: string;
  edgeId?: string;
  executionId?: string;
  taskSpaceId?: string;
  itemId?: string;
  documentId?: string;
  documentFormat?: "markdown" | "html" | "latex";
  tableId?: string;
  rowId?: string;
  filePath?: string;
  revision?: string | number;
  draftRevision?: number;
  selectedIds?: readonly string[];
  canvas?: { x: number; y: number };
  readOnly: boolean;
  tasks?: readonly { itemId: string; taskSpaceId: string; revision: number }[];
  nodes?: readonly { id: string; kind?: string; label?: string }[];
  selection?: { start: number; end: number };
}>;
export type ExtensionApi = {
  readonly target: AppExtensionTarget;
  readonly context: ExtensionContext;
  i18n: { t(key: string): string };
  ui: { openPanel(id: string): Promise<void>; openAssistant(suggestion?: string): Promise<void> };
  edits: {
    propose(input: {
      resource: "file" | "document";
      baseRevision: string;
      draftRevision: number;
      content: string;
      mode: "append" | "replace" | "replace-selection";
    }): Promise<void>;
  };
  tabs: {
    undo(scope: string, revision: string): Promise<void>;
    list(): Promise<{ scope: string; revision: string; items: { id: string; label?: string; pinned?: boolean }[] }[]>;
    update(scope: string, revision: string, items: { id: string; label?: string; pinned?: boolean }[]): Promise<void>;
  };
};
export type ActionApi = ExtensionApi & { signal: AbortSignal; invocationId: string };
export type ActionDefinition = {
  kind: "action";
  target: AppExtensionTarget;
  handler(api: ActionApi): Promise<void> | void;
};
export type ExtensionEnvironment = {
  target: AppExtensionTarget;
  context: ExtensionContext;
  translations: Readonly<Record<string, string>>;
  invocationId?: string;
};
