// Generated from packages/ui-extensions/src/contributions.ts. Do not edit; run the Octonode SDK sync.
import { getAppSession } from "./index.js";
import { request } from "./app/index.js";
import type {
  ActionDefinition,
  ActionApi,
  AppExtensionTarget,
  ExtensionApi,
  ExtensionEnvironment,
} from "./contributions.types.js";

function environment(target: AppExtensionTarget): ExtensionEnvironment {
  getAppSession();
  const value = (globalThis as typeof globalThis & { __octonodeExtension?: ExtensionEnvironment }).__octonodeExtension;
  if (!value || value.target !== target) throw new Error("Extension target context unavailable");
  return value;
}
export function extensionApi(target: AppExtensionTarget): ExtensionApi {
  const value = environment(target);
  return {
    target,
    context: value.context,
    i18n: { t: (key) => value.translations[key] ?? key },
    ui: {
      openPanel: (id) => request("host", { command: "panel.open", id }),
      openAssistant: (suggestion) => request("host", { command: "assistant.open", suggestion }),
    },
    tabs: {
      undo: (scope, revision) => request("host", { command: "layout.undo", scope, revision }) as Promise<void>,
      list: () => request("host", { command: "layout.list" }) as ReturnType<ExtensionApi["tabs"]["list"]>,
      update: (scope, revision, items) =>
        request("host", { command: "layout.update", scope, revision, items }) as Promise<void>,
    },
    edits: { propose: (input) => request("host", { command: "edit.propose", ...input }) as Promise<void> },
  };
}
export function defineAction(target: AppExtensionTarget, handler: ActionDefinition["handler"]): ActionDefinition {
  return { kind: "action", target, handler };
}
export function startAction(definition: ActionDefinition): void {
  const value = environment(definition.target);
  if (!value.invocationId) throw new Error("Actions require host invocation");
  const controller = new AbortController();
  addEventListener("pagehide", () => controller.abort(), { once: true });
  const api: ActionApi = {
    ...extensionApi(definition.target),
    signal: controller.signal,
    invocationId: value.invocationId,
  };
  parent.postMessage(
    {
      octonode: "ui-extension",
      apiVersion: "2",
      type: "render",
      target: definition.target,
      tree: { type: "node-form", children: [] },
    },
    "*",
  );
  Promise.resolve()
    .then(() => definition.handler(api))
    .then(() => {
      parent.postMessage(
        {
          octonode: "ui-extension",
          apiVersion: "2",
          type: "action-complete",
          target: definition.target,
          invocationId: value.invocationId,
        },
        "*",
      );
    })
    .catch(() => {
      parent.postMessage(
        {
          octonode: "ui-extension",
          apiVersion: "2",
          type: "error",
          target: definition.target,
          message: "Extension action failed",
        },
        "*",
      );
    });
}
