import type { ExtensionOnlyApp, AppAction } from "@octonodes/sdk/plugins";
export interface AppSource {
  apiVersion: "octonode.app/v1";
  id: string;
  name: string;
  version: string;
  description?: string;
  web?: { entry: string; applicationUrl?: string; requestedActions?: AppAction[] };
  settings?: ExtensionOnlyApp["settings"];
  extensions: Array<{ id: string; target: "workspace.block" | "app.page"; entry: string }>;
}

export interface DevOptions {
  port?: number;
  localhost?: boolean;
  tunnelUrl?: string;
  open?: boolean;
  workspace?: string;
  baseUrl?: string;
  studioUrl?: string;
}
