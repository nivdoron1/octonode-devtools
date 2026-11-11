// Generated from packages/ui-extensions/src/app/types.ts. Do not edit; run the Octonode SDK sync.
import type { AppSession } from "../types";
import type {
  GetApiAppsRuntimeSessionResponse,
  PostApiAppsRuntimeDataData,
  PostApiAppsRuntimeExecutionsData,
  PostApiAppsRuntimeExecutionsResponse,
} from "./gen";

export type HostedAppState = {
  embedded: boolean;
  status: "connecting" | "ready" | "standalone" | "expired";
  token?: string;
  expiresAt?: number;
  path: string;
};
export type HostedAppNavigationItem = { label: string; path: string };
export type HostedApp = {
  getSnapshot(): HostedAppState;
  subscribe(listener: () => void): () => void;
  navigate(path: string, options?: { replace?: boolean }): void;
  setNavigation(items: HostedAppNavigationItem[]): void;
  fetch(input: string, init?: RequestInit): Promise<Response>;
  dispose(): void;
};

export type AppGrant = GetApiAppsRuntimeSessionResponse["grants"][number];

export type AppExecution = PostApiAppsRuntimeExecutionsResponse;

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
  apiVersion: "1" | "2";
  type: "app-request";
  requestId: string;
  operation: "context" | "data" | "workflow.run" | "host";
  body?: unknown;
};

export type AppBridgeResponse = {
  octonode: "ui-extension";
  apiVersion: "1" | "2";
  type: "app-response";
  requestId: string;
  ok: boolean;
  value?: unknown;
  error?: string;
};

export type AppRequestBody = PostApiAppsRuntimeDataData["body"] | PostApiAppsRuntimeExecutionsData["body"];

export type AppRequest = <T>(
  operation: Exclude<AppBridgeRequest["operation"], "host">,
  body?: AppRequestBody,
) => Promise<T>;

export type AppContextVerified = Pick<
  GetApiAppsRuntimeSessionResponse,
  "appId" | "installationId" | "userId" | "workspace" | "grants"
>;

export type ConnectAppServerOptions = { appId: string; baseUrl: string; projectId?: string };
