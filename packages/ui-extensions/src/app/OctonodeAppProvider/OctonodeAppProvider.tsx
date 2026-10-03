// Generated from packages/ui-extensions/src/app/OctonodeAppProvider/OctonodeAppProvider.tsx. Do not edit; run the Octonode SDK sync.
import { useHostedApp } from "../../hooks/general/useHostedApp.js";
import { AppAccessScreen } from "./AppAccessScreen/index.js";
import { DEFAULT_NAVIGATION } from "./constants.js";
import { Context } from "./context.js";
import type { OctonodeAppProviderProps } from "./OctonodeAppProvider.types.js";

/** Render app content only after the hosted backend verifies the workspace session. */
export function OctonodeAppProvider({ children, navigation = DEFAULT_NAVIGATION }: OctonodeAppProviderProps) {
  const { bridge, session, verified, error } = useHostedApp(navigation);
  if (session?.status === "expired") return <AppAccessScreen status="expired" />;
  if (error) return <AppAccessScreen status="error" />;
  if (session?.status === "standalone") return <AppAccessScreen status="standalone" />;
  if (!bridge || !session || !verified || verified.token !== session.token)
    return <AppAccessScreen status="connecting" />;
  return <Context.Provider value={{ bridge, session, workspace: verified.workspace }}>{children}</Context.Provider>;
}
