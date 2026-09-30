// Generated from packages/ui-extensions/src/app/OctonodeAppProvider/OctonodeAppProvider.tsx. Do not edit; run the Octonode SDK sync.
import { createContext, useContext, useEffect, useState } from "react";
import { AppAccessScreen } from "./AppAccessScreen/index.js";
import { connectHostedApp } from "../hosted.js";
import type { HostedApp, HostedAppState } from "../types.js";
import type { OctonodeAppContext, OctonodeAppProviderProps } from "./OctonodeAppProvider.types.js";

const Context = createContext<OctonodeAppContext | null>(null);
const defaultNavigation: NonNullable<OctonodeAppProviderProps["navigation"]> = [];

/** Render app content only after the hosted backend verifies the workspace session. */
export function OctonodeAppProvider({ children, navigation = defaultNavigation }: OctonodeAppProviderProps) {
  const [bridge, setBridge] = useState<HostedApp>();
  const [session, setSession] = useState<HostedAppState>();
  const [verified, setVerified] = useState<{ token: string; workspace: OctonodeAppContext["workspace"] }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const app = connectHostedApp();
      setBridge(app);
      setSession(app.getSnapshot());
      const unsubscribe = app.subscribe(() => setSession(app.getSnapshot()));
      return () => {
        unsubscribe();
        app.dispose();
      };
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    bridge?.setNavigation(navigation);
  }, [bridge, navigation]);

  useEffect(() => {
    if (!bridge || session?.status !== "ready" || !session.token) return;
    const token = session.token;
    const controller = new AbortController();
    bridge
      .fetch("/api/context", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Workspace access could not be verified");
        const context = (await response.json()) as { workspace?: OctonodeAppContext["workspace"] };
        if (!context.workspace?.kind || !context.workspace.id) throw new Error("Missing workspace scope");
        if (!controller.signal.aborted) {
          setVerified({ token, workspace: context.workspace });
          setError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [bridge, session?.status, session?.token]);

  if (session?.status === "expired") return <AppAccessScreen status="expired" />;
  if (error) return <AppAccessScreen status="error" />;
  if (session?.status === "standalone") return <AppAccessScreen status="standalone" />;
  if (!bridge || !session || !verified || verified.token !== session.token)
    return <AppAccessScreen status="connecting" />;
  return <Context.Provider value={{ bridge, session, workspace: verified.workspace }}>{children}</Context.Provider>;
}

export function useOctonodeApp(): OctonodeAppContext {
  const context = useContext(Context);
  if (!context) throw new Error("useOctonodeApp requires OctonodeAppProvider");
  return context;
}
