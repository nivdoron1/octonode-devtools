// Generated from sdks/ui-extensions/src/react.tsx. Do not edit; run the Octonode SDK sync.
import { createElement, type ComponentType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { UI_EXTENSION_API_VERSION, type UiExtensionTarget, type UiExtensionTree } from "./index";

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
        apiVersion: UI_EXTENSION_API_VERSION,
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
        apiVersion: UI_EXTENSION_API_VERSION,
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
