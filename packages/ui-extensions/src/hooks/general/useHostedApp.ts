// Generated from packages/ui-extensions/src/hooks/general/useHostedApp.ts. Do not edit; run the Octonode SDK sync.
import { useEffect, useState } from "react";
import { connectHostedApp } from "../../app/hosted.js";
import type { HostedApp, HostedAppNavigationItem, HostedAppState } from "../../app/types.js";
import type { HostedContextResponse, VerifiedHostedContext } from "../types.js";

export function useHostedApp(navigation: HostedAppNavigationItem[]) {
  const [bridge, setBridge] = useState<HostedApp>();
  const [session, setSession] = useState<HostedAppState>();
  const [verified, setVerified] = useState<VerifiedHostedContext>();
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
        const context = (await response.json()) as HostedContextResponse;
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

  return { bridge, session, verified, error };
}
