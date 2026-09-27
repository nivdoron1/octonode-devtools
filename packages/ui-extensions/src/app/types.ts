// Generated from packages/ui-extensions/src/app/types.ts. Do not edit; run the Octonode SDK sync.
import type { AppSession } from "../index.js";

export type AppGrant = {
  action: "projects:read" | "data:read" | "data:write" | "workflows:run";
  projectId: string;
};

export type AppExecution = {
  requestHash: string;
  dispatchPending: boolean;
  runId: string;
  workflowId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled" | "interrupted";
  submittedAt: number;
  startedAt?: number;
  finishedAt?: number;
  result?: unknown;
  error?: string;
};

export type AppProject = {
  id: string;
  get(): Promise<{ id: string; name: string }>;
  tables: {
    list(): Promise<unknown>;
    rows: {
      list(tableId: string, input?: { cursor?: string; limit?: number }): Promise<unknown>;
      insert(tableId: string, data: Record<string, unknown>): Promise<unknown>;
      update(tableId: string, rowId: string, data: Record<string, unknown>, expectedVersion: number): Promise<unknown>;
      delete(tableId: string, rowId: string): Promise<unknown>;
    };
  };
  wf: {
    run(
      workflowId: string,
      input?: Record<string, unknown>,
      options?: { idempotencyKey?: string; env?: string },
    ): Promise<AppExecution>;
  };
};

export type AppContext = {
  appId: AppSession["appId"];
  installationId: AppSession["installationId"];
  userId: string;
  workspace: AppSession["workspace"];
  grants: readonly AppGrant[];
  projects: readonly string[];
  project: AppProject | undefined;
  forProject(projectId: string): AppProject;
};

export type AppBridgeRequest = {
  octonode: "ui-extension";
  apiVersion: "1";
  type: "app-request";
  requestId: string;
  operation: "context" | "data" | "workflow.run";
  body?: unknown;
};

export type AppBridgeResponse = {
  octonode: "ui-extension";
  apiVersion: "1";
  type: "app-response";
  requestId: string;
  ok: boolean;
  value?: unknown;
  error?: string;
};
