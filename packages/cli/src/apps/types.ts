import type { ExtensionOnlyApp, ContributionApp, AppAction } from "@octonodes/sdk/plugins";
export interface AppSource {
  apiVersion: "octonode.app/v1" | "octonode.app/v2";
  id: string;
  name: string;
  version: string;
  description?: string;
  web?: { entry: string; platform?: "plain" | "vite" | "next"; applicationUrl?: string; requestedActions?: AppAction[] };
  settings?: ExtensionOnlyApp["settings"];
  requestedActions?: AppAction[];
  locales?: ContributionApp["locales"];
  launchers?: ContributionApp["launchers"];
  extensions: Array<{ id: string; target: ContributionApp["extensions"][number]["target"]; entry: string; title?:string; icon?:ContributionApp["extensions"][number]["icon"]; when?:ContributionApp["extensions"][number]["when"] }>;
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

export type CloudflaredAsset = { file: string; sha256: string; binarySha256?: string };
