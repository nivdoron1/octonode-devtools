// Generated from packages/schema/src/ipc/types.ts. Do not edit; run the Octonode SDK sync.
import type { InvocationContext } from "./envelope";

export type MakeInvokeRequestArgs = {
  invocationId: string;
  inputs: unknown;
  node?: string;
  context?: Partial<InvocationContext>;
};

export type MakeDescribeRequestArgs = { invocationId: string; node?: string };
