// Generated from packages/schema/src/diagnostics/messages.ts. Do not edit; run the Octonode SDK sync.
import { DIAGNOSTIC_MAX_DEPTH, DIAGNOSTIC_MAX_MESSAGES, DIAGNOSTIC_MAX_MESSAGE_LENGTH } from "./constants";
import type { CompilerMessage } from "./types";
import type { DiagnosticMessage } from "./schema";

export function diagnosticMessages(message: string | CompilerMessage, code: number) {
  const messages: DiagnosticMessage[] = [];
  const pending = [{ message: typeof message === "string" ? { code, messageText: message } : message, depth: 0 }];
  let truncated = false;
  while (pending.length && messages.length < DIAGNOSTIC_MAX_MESSAGES) {
    const current = pending.pop()!;
    messages.push({
      message: current.message.messageText.slice(0, DIAGNOSTIC_MAX_MESSAGE_LENGTH),
      code: `TS${current.message.code}`,
      depth: current.depth,
      category: current.message.category,
    });
    truncated ||= current.message.messageText.length > DIAGNOSTIC_MAX_MESSAGE_LENGTH;
    if (current.message.next?.length) {
      if (current.depth === DIAGNOSTIC_MAX_DEPTH) truncated = true;
      else {
        const available = DIAGNOSTIC_MAX_MESSAGES - messages.length;
        truncated ||= current.message.next.length > available;
        for (let index = Math.min(current.message.next.length, available) - 1; index >= 0; index--)
          pending.push({ message: current.message.next[index], depth: current.depth + 1 });
      }
    }
  }
  return { messages, truncated: truncated || pending.length > 0 };
}
