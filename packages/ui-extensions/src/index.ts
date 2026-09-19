// Generated from sdks/ui-extensions/src/index.ts. Do not edit; run the Octonode SDK sync.
export const UI_EXTENSION_API_VERSION = "1" as const;
export const UI_EXTENSION_TARGETS = ["node.inspector.inputs"] as const;

export type UiExtensionTarget = (typeof UI_EXTENSION_TARGETS)[number];

export type UiExtensionTree =
  | { type: "text"; value: string }
  | { type: "node-form"; children: UiExtensionTree[] }
  | { type: "section"; title: string; children: UiExtensionTree[] }
  | { type: "input-field"; name: string; appearance?: "single-line" | "multiline" };

export interface UiExtensionRenderMessage {
  octonode: "ui-extension";
  apiVersion: typeof UI_EXTENSION_API_VERSION;
  type: "render";
  target: UiExtensionTarget;
  tree: UiExtensionTree;
}

export interface UiExtensionErrorMessage {
  octonode: "ui-extension";
  apiVersion: typeof UI_EXTENSION_API_VERSION;
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
): { message: UiExtensionMessage; inputNames: string[] } | null {
  if (!value || typeof value !== "object") return null;
  const message = value as Partial<UiExtensionMessage>;
  if (
    message.octonode !== "ui-extension" ||
    message.apiVersion !== UI_EXTENSION_API_VERSION ||
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
    if (!node || typeof node !== "object" || depth > MAX_DEPTH || ++count > MAX_NODES) return false;
    const candidate = node as Partial<UiExtensionTree>;
    if (candidate.type === "text") return typeof candidate.value === "string" && candidate.value.length <= MAX_TEXT;
    if (candidate.type === "input-field") {
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
