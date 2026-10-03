// Generated from packages/ui-extensions/src/app/server.ts. Do not edit; run the Octonode SDK sync.
import { appContext } from "./project.js";
import type { AppContext, AppGrant, AppRequest } from "./types.js";

export type { AppContext, AppExecution, AppGrant, AppProject } from "./types.js";

export class AppRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AppRequestError";
  }
}

/** Verify the browser's app bearer before using it from a developer-hosted backend. */
export async function connectAppServer(
  token: string,
  options: { appId: string; baseUrl: string; projectId?: string },
): Promise<AppContext> {
  if (!/^octo_app_[A-Za-z0-9_-]{43}$/.test(token)) throw new AppRequestError("Invalid app session", 401);
  const base = new URL(options.baseUrl);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
    throw new Error("Octonode API URL must use HTTPS");
  const request: AppRequest = async <T>(operation: "context" | "data" | "workflow.run", body?: unknown): Promise<T> => {
    const path =
      operation === "context"
        ? "/api/apps/runtime/session"
        : operation === "data"
          ? "/api/apps/runtime/data"
          : "/api/apps/runtime/executions";
    const response = await fetch(new URL(path, base), {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      method: operation === "context" ? "GET" : "POST",
      headers: {
        authorization: `Bearer ${token}`,
        ...(operation === "context" ? {} : { "content-type": "application/json" }),
      },
      ...(operation === "context" ? {} : { body: JSON.stringify(body) }),
    });
    if (response.status >= 300 && response.status < 400)
      throw new AppRequestError("Octonode app API redirects are not allowed", 502);
    if (!response.ok) throw new AppRequestError(`Octonode app request failed (${response.status})`, response.status);
    return response.json() as Promise<T>;
  };
  const verified = await request<{
    appId: string;
    installationId: string;
    userId: string;
    workspace: AppContext["workspace"];
    grants: AppGrant[];
  }>("context");
  if (verified.appId !== options.appId) throw new AppRequestError("App session belongs to another app", 403);
  return appContext({ ...verified, projectId: options.projectId }, verified, request);
}
