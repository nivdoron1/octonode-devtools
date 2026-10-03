// Generated from packages/ui-extensions/src/index.ts. Do not edit; run the Octonode SDK sync.
import { INPUT_NAME, MAX_DEPTH, MAX_NODES, MAX_TEXT } from "./constants.js";
import type {
  AppSession,
  UiExtensionErrorMessage,
  UiExtensionMessage,
  UiExtensionRenderMessage,
  UiExtensionTarget,
  UiExtensionTree,
} from "./types.js";

export { APP_EXTENSION_TARGETS } from "./constants.js";
export { defineAction, extensionApi, startAction } from "./contributions.js";
export type {
  ActionApi,
  ActionDefinition,
  AppExtensionTarget,
  ExtensionApi,
  ExtensionContext,
  ExtensionEnvironment,
} from "./contributions.types.js";

export function validateExtensionMessage(
  value: unknown,
  expectedTarget: UiExtensionTarget,
  expectedVersion: "1" | "2" = "1",
) {
  if (!value || typeof value !== "object") return null;
  const message = value as Partial<UiExtensionMessage>;
  if (
    message.octonode !== "ui-extension" ||
    message.apiVersion !== expectedVersion ||
    message.target !== expectedTarget
  )
    return null;
  if (message.type === "error")
    return typeof message.message === "string" && message.message.length <= MAX_TEXT
      ? { message: message as UiExtensionErrorMessage, inputNames: [] }
      : null;
  if (message.type !== "render") return null;
  let count = 0;
  const inputNames: string[] = [];
  const visit = (node: unknown, depth: number): node is UiExtensionTree => {
    if (
      !node ||
      typeof node !== "object" ||
      depth > MAX_DEPTH ||
      ++count > (["node.view", "task.card.badge"].includes(expectedTarget) ? 500 : MAX_NODES)
    )
      return false;
    const candidate = node as Partial<UiExtensionTree>;
    if (candidate.type === "text") return typeof candidate.value === "string" && candidate.value.length <= MAX_TEXT;
    if (candidate.type === "button" || candidate.type === "text-field") {
      return (
        expectedTarget !== "node.inspector.inputs" &&
        !["node.view", "task.card.badge", "table.column.view"].includes(expectedTarget) &&
        typeof candidate.id === "string" &&
        candidate.id.length > 0 &&
        candidate.id.length <= 100 &&
        typeof candidate.label === "string" &&
        candidate.label.trim().length > 0 &&
        candidate.label.length <= 240 &&
        typeof candidate.disabled === "boolean" &&
        (candidate.type === "button" ||
          ("value" in candidate && typeof candidate.value === "string" && candidate.value.length <= MAX_TEXT))
      );
    }
    if (candidate.type === "input-field") {
      if (expectedTarget !== "node.inspector.inputs") return false;
      if (
        typeof candidate.name !== "string" ||
        !INPUT_NAME.test(candidate.name) ||
        (candidate.appearance !== undefined &&
          candidate.appearance !== "single-line" &&
          candidate.appearance !== "multiline")
      )
        return false;
      if (inputNames.includes(candidate.name)) return false;
      inputNames.push(candidate.name);
      return true;
    }
    if (candidate.type === "section") {
      if (typeof candidate.title !== "string" || candidate.title.length > 240) return false;
    } else if (candidate.type !== "node-form") return false;
    return Array.isArray(candidate.children) && candidate.children.every((child) => visit(child, depth + 1));
  };
  return visit(message.tree, 0)
    ? { message: message as UiExtensionRenderMessage, inputNames: [...new Set(inputNames)] }
    : null;
}

/** Available only inside an installed app extension. Send this bearer to your own backend for verification. */
export function getAppSession(): AppSession {
  const session = (globalThis as typeof globalThis & { __octonodeApp?: AppSession }).__octonodeApp;
  if (!session || session.expiresAt <= Date.now()) throw new Error("App session expired; reopen the app");
  return session;
}

export type { UiExtensionTarget } from "./types.js";

export type { UiExtensionTree } from "./types.js";

export type { UiExtensionRenderMessage } from "./types.js";

export type { UiExtensionErrorMessage } from "./types.js";

export type { UiExtensionMessage } from "./types.js";

export type { AppSession } from "./types.js";

export { UI_EXTENSION_API_VERSION } from "./constants.js";

export { APP_EXTENSION_API_VERSION } from "./constants.js";

export { UI_EXTENSION_TARGETS } from "./constants.js";
