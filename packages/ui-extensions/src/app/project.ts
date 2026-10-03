// Generated from packages/ui-extensions/src/app/project.ts. Do not edit; run the Octonode SDK sync.
import type { AppSession } from "../types.js";
import type { AppContext, AppExecution, AppGrant, AppProject, AppRequest } from "./types.js";

function project(id: string, request: AppRequest): AppProject {
  return {
    id,
    get: () => request("data", { operation: "project.get", projectId: id }),
    tables: {
      list: () => request("data", { operation: "tables.list", projectId: id }),
      rows: {
        list: (tableId, input = {}) => request("data", { operation: "rows.list", projectId: id, tableId, input }),
        insert: (tableId, data) =>
          request("data", { operation: "rows.insert", projectId: id, tableId, input: { data } }),
        update: (tableId, rowId, data, expectedVersion) =>
          request("data", {
            operation: "rows.update",
            projectId: id,
            tableId,
            rowId,
            input: { data, expectedVersion },
          }),
        delete: (tableId, rowId) => request("data", { operation: "rows.delete", projectId: id, tableId, rowId }),
      },
    },
    wf: {
      run: (workflowId, input = {}, options = {}) =>
        request<AppExecution>("workflow.run", {
          projectId: id,
          workflowId,
          input,
          idempotencyKey: options.idempotencyKey ?? crypto.randomUUID(),
          ...(options.env ? { env: options.env } : {}),
        }),
    },
  };
}

export function appContext(
  session: Pick<AppSession, "appId" | "installationId" | "workspace" | "projectId">,
  verified: {
    appId: string;
    installationId: string;
    userId: string;
    workspace: AppContext["workspace"];
    grants: AppGrant[];
  },
  request: AppRequest,
): AppContext {
  if (
    session.appId !== verified.appId ||
    session.installationId !== verified.installationId ||
    session.workspace.kind !== verified.workspace.kind ||
    session.workspace.id !== verified.workspace.id
  )
    throw new Error("App session identity changed");
  const projects = [...new Set(verified.grants.map((grant) => grant.projectId))];
  if (session.projectId && !projects.includes(session.projectId))
    throw new Error("Current project is not granted to this app");
  const currentProjectId = session.projectId ?? (projects.length === 1 ? projects[0] : undefined);
  return {
    appId: verified.appId,
    installationId: verified.installationId,
    userId: verified.userId,
    workspace: verified.workspace,
    grants: verified.grants,
    projects,
    project: currentProjectId ? project(currentProjectId, request) : undefined,
    forProject(projectId) {
      if (!projects.includes(projectId)) throw new Error("Project is not granted to this app");
      return project(projectId, request);
    },
  };
}
