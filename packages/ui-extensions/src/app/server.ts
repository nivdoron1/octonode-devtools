// Generated from packages/ui-extensions/src/app/server.ts. Do not edit; run the Octonode SDK sync.
import { SERVER_RESPONSE_TIMEOUT_MS } from "./constants";
import { getApiAppsRuntimeSession, postApiAppsRuntimeData, postApiAppsRuntimeExecutions } from "./gen";
import { createClient } from "./gen/client";
import { appContext } from "./project";
import type { AppContext, AppContextVerified, AppRequest, AppRequestBody, ConnectAppServerOptions } from "./types";

export type { AppContext, AppExecution, AppGrant, AppProject } from "./types";

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
export async function connectAppServer(token: string, options: ConnectAppServerOptions): Promise<AppContext> {
  if (!/^octo_app_[A-Za-z0-9_-]{43}$/.test(token)) throw new AppRequestError("Invalid app session", 401);
  const base = new URL(options.baseUrl);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
    throw new Error("Octonode API URL must use HTTPS");
  const client = createClient({
    baseUrl: base.origin,
    headers: { authorization: `Bearer ${token}` },
    redirect: "manual",
    parseAs: "json",
  });
  const request: AppRequest = async <T>(
    operation: "context" | "data" | "workflow.run",
    body?: AppRequestBody,
  ): Promise<T> => {
    const options = {
      client,
      signal: AbortSignal.timeout(SERVER_RESPONSE_TIMEOUT_MS),
    };
    const result =
      operation === "context"
        ? await getApiAppsRuntimeSession(options)
        : operation === "data" && body && "operation" in body
          ? await postApiAppsRuntimeData({ ...options, body })
          : operation === "workflow.run" && body && "workflowId" in body
            ? await postApiAppsRuntimeExecutions({ ...options, body })
            : undefined;
    if (!result) throw new AppRequestError("Invalid app request", 400);
    const { response } = result;
    if (!response) throw result.error;
    if (response.status >= 300 && response.status < 400)
      throw new AppRequestError("Octonode app API redirects are not allowed", 502);
    if (!response.ok) throw new AppRequestError(`Octonode app request failed (${response.status})`, response.status);
    if (result.error) throw result.error;
    return result.data as T;
  };
  const verified = await request<AppContextVerified>("context");
  if (verified.appId !== options.appId) throw new AppRequestError("App session belongs to another app", 403);
  return appContext({ ...verified, projectId: options.projectId }, verified, request);
}
