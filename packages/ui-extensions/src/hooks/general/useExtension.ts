// Generated from packages/ui-extensions/src/hooks/general/useExtension.ts. Do not edit; run the Octonode SDK sync.
import { useMemo } from "react";
import { extensionApi } from "../../contributions.js";
import type { AppExtensionTarget } from "../../contributions.types.js";

export function useExtension(target: AppExtensionTarget) {
  return useMemo(() => extensionApi(target), [target]);
}
