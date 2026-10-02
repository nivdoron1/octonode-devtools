// Generated from packages/ui-extensions/src/index.ts. Do not edit; run the Octonode SDK sync.
import { APP_EXTENSION_TARGETS } from "./targets.js";
export { APP_EXTENSION_TARGETS } from "./targets.js";
export { defineAction, startAction, extensionApi } from "./contributions.js";
export type {
  ActionApi,
  ActionDefinition,
  AppExtensionTarget,
  ExtensionApi,
  ExtensionContext,
  ExtensionEnvironment,
} from "./contributions.types.js";
export const UI_EXTENSION_API_VERSION = "1" as const;
export const APP_EXTENSION_API_VERSION = "2" as const;
export const UI_EXTENSION_TARGETS = ["node.inspector.inputs", ...APP_EXTENSION_TARGETS] as const;

export type UiExtensionTarget = (typeof UI_EXTENSION_TARGETS)[number];

export type UiExtensionTree =
  | { type: "text"; value: string }
  | { type: "button"; id: string; label: string; disabled: boolean }
  | { type: "text-field"; id: string; label: string; value: string; disabled: boolean }
  | { type: "node-form"; children: UiExtensionTree[] }
  | { type: "section"; title: string; children: UiExtensionTree[] }
  | { type: "input-field"; name: string; appearance?: "single-line" | "multiline" };

export interface UiExtensionRenderMessage {
  octonode: "ui-extension";
  apiVersion: "1" | "2";
  type: "render";
  target: UiExtensionTarget;
  tree: UiExtensionTree;
}

export interface UiExtensionErrorMessage {
  octonode: "ui-extension";
  apiVersion: "1" | "2";
  type: "error";
  target: UiExtensionTarget;
  message: string;
}

export type UiExtensionMessage = UiExtensionRenderMessage | UiExtensionErrorMessage;

const MAX_NODES = 100;
const MAX_DEPTH = 10;
const MAX_TEXT = 4_000;
const INPUT_NAME = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;

export function validateExtensionMessage(
  value: unknown,
  expectedTarget: UiExtensionTarget,
  expectedVersion: "1" | "2" = "1",
): { message: UiExtensionMessage; inputNames: string[] } | null {
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

export interface AppSession {
  protocolVersion?: "2";
  configuration: Readonly<Record<string, string>>;
  token: string;
  expiresAt: number;
  appId: string;
  installationId: string;
  workspace: { kind: "user" | "team" | "org"; id: string };
  projectId?: string;
  version: string;
}
/** Available only inside an installed app extension. Send this bearer to your own backend for verification. */
export function getAppSession(): AppSession {
  const session = (globalThis as typeof globalThis & { __octonodeApp?: AppSession }).__octonodeApp;
  if (!session || session.expiresAt <= Date.now()) throw new Error("App session expired; reopen the app");
  return session;
}
