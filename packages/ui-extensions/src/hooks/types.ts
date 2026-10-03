// Generated from packages/ui-extensions/src/hooks/types.ts. Do not edit; run the Octonode SDK sync.
import type { OctonodeAppContext } from "../app/OctonodeAppProvider/OctonodeAppProvider.types.js";

export interface VerifiedHostedContext {
  token: string;
  workspace: OctonodeAppContext["workspace"];
}

export interface HostedContextResponse {
  workspace?: OctonodeAppContext["workspace"];
}
