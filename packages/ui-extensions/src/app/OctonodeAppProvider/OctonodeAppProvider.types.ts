// Generated from packages/ui-extensions/src/app/OctonodeAppProvider/OctonodeAppProvider.types.ts. Do not edit; run the Octonode SDK sync.
import type { ReactNode } from "react";
import type { AppContext, HostedApp, HostedAppNavigationItem, HostedAppState } from "../types.js";

export type OctonodeAppProviderProps = {
  children: ReactNode;
  navigation?: HostedAppNavigationItem[];
};

export type OctonodeAppContext = {
  bridge: HostedApp;
  session: HostedAppState;
  workspace: AppContext["workspace"];
};
