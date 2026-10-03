// Generated from packages/ui-extensions/src/hooks/general/useOctonodeApp.ts. Do not edit; run the Octonode SDK sync.
import { useContext } from "react";
import type { OctonodeAppContext } from "../../app/OctonodeAppProvider/OctonodeAppProvider.types.js";
import { Context } from "../../app/OctonodeAppProvider/context.js";

export function useOctonodeApp(): OctonodeAppContext {
  const context = useContext(Context);
  if (!context) throw new Error("useOctonodeApp requires OctonodeAppProvider");
  return context;
}
