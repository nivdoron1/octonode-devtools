// Generated from packages/ui-extensions/src/types.ts. Do not edit; run the Octonode SDK sync.
import { type ComponentType, type ReactNode } from "react";
import type { UI_EXTENSION_TARGETS } from "./constants.js";
import { UI_EXTENSION_API_VERSION } from "./constants.js";

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

export interface UiExtensionDefinition {
  apiVersion: typeof UI_EXTENSION_API_VERSION;
  target: UiExtensionTarget;
  component: ComponentType;
}

export type NodeFormProps = { children?: ReactNode };

export type SectionProps = { title: string; children?: ReactNode };

export type InputFieldProps = { name: string; appearance?: "single-line" | "multiline" };

export type ButtonProps = {
  children: string;
  onPress: () => void;
  disabled?: boolean;
};

export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};
