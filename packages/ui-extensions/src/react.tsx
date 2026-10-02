// Generated from packages/ui-extensions/src/react.tsx. Do not edit; run the Octonode SDK sync.
import { useId, useEffect, useMemo, createElement, type ComponentType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { UI_EXTENSION_API_VERSION, getAppSession, type UiExtensionTarget, type UiExtensionTree } from "./index";
import { extensionApi } from "./contributions.js";
import type { AppExtensionTarget } from "./contributions.types.js";
export function useExtension(target: AppExtensionTarget) {
  return useMemo(() => extensionApi(target), [target]);
}

export interface UiExtensionDefinition {
  apiVersion: typeof UI_EXTENSION_API_VERSION;
  target: UiExtensionTarget;
  component: ComponentType;
}

export function defineExtension(target: UiExtensionTarget, component: ComponentType): UiExtensionDefinition {
  return { apiVersion: UI_EXTENSION_API_VERSION, target, component };
}

export function NodeForm({ children }: { children?: ReactNode }) {
  return createElement("octonode-node-form", null, children);
}

export function Section({ title, children }: { title: string; children?: ReactNode }) {
  return createElement("octonode-section", { title }, children);
}

export function InputField({ name, appearance }: { name: string; appearance?: "single-line" | "multiline" }) {
  return createElement("octonode-input-field", { name, appearance });
}

const callbacks = new Map<string, (value?: string) => void>();
export function Button({
  children,
  onPress,
  disabled = false,
}: {
  children: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const id = useId();
  useEffect(() => {
    callbacks.set(id, onPress);
    return () => {
      callbacks.delete(id);
    };
  }, [id, onPress]);
  return createElement("octonode-button", { "data-id": id, "data-disabled": String(disabled) }, children);
}
export function TextField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  useEffect(() => {
    callbacks.set(id, (value) => onChange(value ?? ""));
    return () => {
      callbacks.delete(id);
    };
  }, [id, onChange]);
  return createElement("octonode-text-field", { "data-id": id, label, value, "data-disabled": String(disabled) });
}

function serialize(node: Node): UiExtensionTree | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.textContent?.trim();
    return value ? { type: "text", value } : null;
  }
  if (!(node instanceof Element)) return null;
  const children = Array.from(node.childNodes).flatMap((child) => {
    const serialized = serialize(child);
    return serialized ? [serialized] : [];
  });
  if (node.localName === "octonode-button")
    return {
      type: "button",
      id: node.getAttribute("data-id") ?? "",
      label: node.textContent ?? "",
      disabled: node.getAttribute("data-disabled") === "true",
    };
  if (node.localName === "octonode-text-field")
    return {
      type: "text-field",
      id: node.getAttribute("data-id") ?? "",
      label: node.getAttribute("label") ?? "",
      value: node.getAttribute("value") ?? "",
      disabled: node.getAttribute("data-disabled") === "true",
    };
  if (node.localName === "octonode-node-form") return { type: "node-form", children };
  if (node.localName === "octonode-section")
    return { type: "section", title: node.getAttribute("title") ?? "", children };
  if (node.localName === "octonode-input-field") {
    const appearance = node.getAttribute("appearance");
    return {
      type: "input-field",
      name: node.getAttribute("name") ?? "",
      ...(appearance === "single-line" || appearance === "multiline" ? { appearance } : {}),
    };
  }
  return null;
}

export function startExtension(extension: UiExtensionDefinition): void {
  let apiVersion: "1" | "2" = UI_EXTENSION_API_VERSION;
  try {
    apiVersion = getAppSession().protocolVersion ?? "1";
  } catch {
    /* Plugin renderers have no app session. */
  }
  addEventListener("message", (event) => {
    if (
      event.source !== parent ||
      event.data?.octonode !== "ui-extension" ||
      event.data?.apiVersion !== apiVersion ||
      event.data?.type !== "event" ||
      event.data?.target !== extension.target
    )
      return;
    const { id, value } = event.data;
    if (typeof id !== "string" || (value !== undefined && (typeof value !== "string" || value.length > 4000))) return;
    callbacks.get(id)?.(value);
  });
  const root = document.createElement("div");
  document.body.append(root);
  let queued = false;
  const publish = () => {
    queued = false;
    const tree = Array.from(root.childNodes).flatMap((node) => {
      const serialized = serialize(node);
      return serialized ? [serialized] : [];
    });
    parent.postMessage(
      {
        octonode: "ui-extension",
        apiVersion,
        type: "render",
        target: extension.target,
        tree: { type: "node-form", children: tree },
      },
      "*",
    );
  };
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(publish);
  });
  observer.observe(root, { subtree: true, childList: true, attributes: true, characterData: true });
  addEventListener("error", (event) =>
    parent.postMessage(
      {
        octonode: "ui-extension",
        apiVersion,
        type: "error",
        target: extension.target,
        message: event.message,
      },
      "*",
    ),
  );
  createRoot(root).render(createElement(extension.component));
  queueMicrotask(publish);
}
