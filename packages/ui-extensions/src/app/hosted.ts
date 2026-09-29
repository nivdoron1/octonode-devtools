// Generated from packages/ui-extensions/src/app/hosted.ts. Do not edit; run the Octonode SDK sync.
import type { HostedApp, HostedAppState } from "./types.js";
import { HOSTED_APP_PROTOCOL } from "./constants.js";

/** Only app-relative routes may cross the Studio boundary. */
export function appRoute(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 4096 || !value.startsWith("/") || /[\\\s\p{Cc}]/u.test(value))
    return null;
  try {
    const url = new URL(value, "https://app.invalid");
    if (url.origin !== "https://app.invalid" || url.username || url.password || url.hash.includes("octonode_session"))
      return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

/** Browser history remains the router. The bridge mirrors it into the Studio URL. */
export function connectHostedApp(): HostedApp {
  const fragment = new URLSearchParams(location.hash.slice(1));
  const embedded = parent !== window;
  // Only non-secret embedding coordinates survive a child reload.
  let saved: string | null = null;
  try {
    if (embedded) saved = sessionStorage.getItem("octonode.host");
  } catch {
    /* Storage can be disabled in embedded browsers. */
  }
  const coordinates = saved ? new URLSearchParams(saved) : new URLSearchParams();
  const origin = fragment.get("octonode_parent") ?? coordinates.get("origin");
  const nonce = fragment.get("octonode_channel") ?? coordinates.get("channel");
  if (
    embedded &&
    (!origin ||
      !nonce ||
      new URL(origin).origin !== origin ||
      !(origin.startsWith("https://") || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)))
  )
    throw new Error("Open this app from Studio to establish a trusted session");
  try {
    if (embedded)
      sessionStorage.setItem("octonode.host", new URLSearchParams({ origin: origin!, channel: nonce! }).toString());
  } catch {
    /* The launch coordinates still establish this session. */
  }
  const token = embedded ? undefined : (fragment.get("octonode_session") ?? undefined);
  if (fragment.has("octonode_parent") || token)
    history.replaceState(
      history.state,
      "",
      appRoute(fragment.get("octonode_path")) ?? location.pathname + location.search,
    );
  const listeners = new Set<() => void>();
  let state: HostedAppState = {
    embedded,
    status: token ? "ready" : embedded ? "connecting" : "standalone",
    token,
    path: location.pathname + location.search + location.hash,
  };
  let disposed = false;
  const publish = (patch: Partial<HostedAppState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  const send = (message: Record<string, unknown>) => {
    if (embedded && !disposed)
      parent.postMessage({ ...message, octonode: HOSTED_APP_PROTOCOL, channel: nonce }, origin!);
  };
  const push = history.pushState;
  const replace = history.replaceState;
  const routeChanged = (replaceRoute = false) => {
    const path = location.pathname + location.search + location.hash;
    publish({ path });
    send({ type: "navigate", path, replace: replaceRoute });
  };
  const pushRoute: History["pushState"] = function (...args) {
    push.apply(history, args);
    routeChanged();
  };
  const replaceRoute: History["replaceState"] = function (...args) {
    replace.apply(history, args);
    routeChanged(true);
  };
  history.pushState = pushRoute;
  history.replaceState = replaceRoute;
  const popped = () => routeChanged(true);
  const receive = (event: MessageEvent) => {
    const message = event.data;
    if (
      !embedded ||
      event.source !== parent ||
      event.origin !== origin ||
      message?.octonode !== HOSTED_APP_PROTOCOL ||
      message.channel !== nonce
    )
      return;
    if (
      message.type === "session" &&
      typeof message.token === "string" &&
      /^octo_app_[A-Za-z0-9_-]{43}$/.test(message.token) &&
      Number.isFinite(message.expiresAt) &&
      message.expiresAt > Date.now()
    ) {
      publish({ status: "ready", token: message.token, expiresAt: message.expiresAt });
      send({ type: "ack" });
    }
    if (message.type === "expired") publish({ status: "expired", token: undefined });
    if (message.type === "route") {
      const path = appRoute(message.path);
      if (path && path !== state.path) {
        replace.call(history, history.state, "", path);
        publish({ path });
        dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
      }
    }
  };
  addEventListener("message", receive);
  addEventListener("popstate", popped);
  addEventListener("hashchange", popped);
  const heartbeat = setInterval(() => {
    if (state.expiresAt && state.expiresAt <= Date.now()) publish({ status: "expired", token: undefined });
    send({ type: "ready" });
  }, 1000);
  send({ type: "ready" });
  return {
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    navigate(path, options = {}) {
      const route = appRoute(path);
      if (!route) throw new Error("Expected an app-relative route");
      history[options.replace ? "replaceState" : "pushState"](null, "", route);
      dispatchEvent(new PopStateEvent("popstate"));
    },
    async fetch(input, init) {
      const url = new URL(input, location.href);
      if (url.origin !== location.origin) throw new Error("App bearer may only be sent to the app's own backend");
      if (!state.token || (state.expiresAt && state.expiresAt <= Date.now()))
        throw new Error("App session expired. Reopen the app from Studio.");
      const headers = new Headers(init?.headers);
      headers.set("authorization", `Bearer ${state.token}`);
      const response = await fetch(url, { ...init, headers, redirect: "error" });
      if (response.status === 401) {
        publish({ status: "expired", token: undefined });
        send({ type: "ready" });
      }
      return response;
    },
    dispose() {
      disposed = true;
      clearInterval(heartbeat);
      removeEventListener("message", receive);
      removeEventListener("popstate", popped);
      removeEventListener("hashchange", popped);
      if (history.pushState === pushRoute) history.pushState = push;
      if (history.replaceState === replaceRoute) history.replaceState = replace;
      listeners.clear();
      state = { ...state, token: undefined };
    },
  };
}
