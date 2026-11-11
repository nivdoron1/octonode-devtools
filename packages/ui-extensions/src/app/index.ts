// Generated from packages/ui-extensions/src/app/index.ts. Do not edit; run the Octonode SDK sync.
import { UI_EXTENSION_API_VERSION } from "../constants";
import { getAppSession } from "..";
import { INDEX_RETRY_INTERVAL_MS, INDEX_TIMEOUT_DELAY_MS } from "./constants";
import { appContext } from "./project";

import type {
  AppBridgeRequest,
  AppBridgeResponse,
  AppContext,
  AppContextVerified as ConnectAppVerifiedRecord,
} from "./types";

export { HOSTED_APP_PROTOCOL } from "./constants";
export { appRoute, connectHostedApp } from "./hosted";
export type {
  AppBridgeRequest,
  AppBridgeResponse,
  AppContext,
  AppExecution,
  AppGrant,
  AppProject,
  HostedApp,
  HostedAppNavigationItem,
  HostedAppState,
} from "./types";

export function request<T>(operation: AppBridgeRequest["operation"], body?: unknown): Promise<T> {
  const apiVersion = getAppSession().protocolVersion ?? UI_EXTENSION_API_VERSION;
  if (parent === window) throw new Error("App actions require an installed extension");
  const requestId = crypto.randomUUID();
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => finish(new Error("App action timed out")), INDEX_TIMEOUT_DELAY_MS);
    const retry = operation === "context" ? setInterval(send, INDEX_RETRY_INTERVAL_MS) : undefined;
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
  const verified = await request<ConnectAppVerifiedRecord>("context");
  return appContext(session, verified, request);
}

export type { AppContextVerified, ConnectAppServerOptions } from "./types";
