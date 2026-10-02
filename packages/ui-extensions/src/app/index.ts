// Generated from packages/ui-extensions/src/app/index.ts. Do not edit; run the Octonode SDK sync.
import { getAppSession, UI_EXTENSION_API_VERSION } from "../index.js";
import { appContext } from "./project.js";
import type { AppBridgeRequest, AppBridgeResponse, AppContext, AppGrant } from "./types.js";

export type { AppBridgeRequest, AppBridgeResponse, AppContext, AppExecution, AppGrant, AppProject } from "./types.js";
export type { HostedApp, HostedAppNavigationItem, HostedAppState } from "./types.js";
export { connectHostedApp, appRoute } from "./hosted.js";
export { HOSTED_APP_PROTOCOL } from "./constants.js";

export function request<T>(operation: AppBridgeRequest["operation"], body?: unknown): Promise<T> {
  const apiVersion = getAppSession().protocolVersion ?? UI_EXTENSION_API_VERSION;
  if (parent === window) throw new Error("App actions require an installed extension");
  const requestId = crypto.randomUUID();
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => finish(new Error("App action timed out")), 30_000);
    const retry = operation === "context" ? setInterval(send, 1_000) : undefined;
    const receive = (event: MessageEvent) => {
      const message = event.data as Partial<AppBridgeResponse> | null;
      if (
        event.source !== parent ||
        message?.octonode !== "ui-extension" ||
        message.type !== "app-response" ||
        message.apiVersion !== apiVersion ||
        message.requestId !== requestId
      )
        return;
      finish(message.ok ? undefined : new Error(message.error || "App action failed"), message.value as T);
    };
    function finish(error?: Error, value?: T) {
      clearTimeout(timeout);
      clearInterval(retry);
      removeEventListener("message", receive);
      if (error) reject(error);
      else resolve(value as T);
    }
    addEventListener("message", receive);
    function send() {
      parent.postMessage(
        {
          octonode: "ui-extension",
          apiVersion,
          type: "app-request",
          requestId,
          operation,
          body,
        } satisfies AppBridgeRequest,
        "*",
      );
    }
    send();
  });
}

/** Connects an installed extension to its live workspace and project grants. */
export async function connectApp(): Promise<AppContext> {
  const session = getAppSession();
  const verified = await request<{
    appId: string;
    installationId: string;
    userId: string;
    grants: AppGrant[];
    workspace: AppContext["workspace"];
  }>("context");
  return appContext(session, verified, request);
}
