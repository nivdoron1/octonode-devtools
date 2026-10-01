// Generated from packages/schema/src/icons.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

export const ICON_NAMES = [
  "arrow-up-down",
  "binary",
  "bomb",
  "boxes",
  "braces",
  "calculator",
  "calendar",
  "camera",
  "clock",
  "code",
  "copy-x",
  "database",
  "dices",
  "filter",
  "flag",
  "flask",
  "function",
  "git-branch",
  "git-merge",
  "group",
  "hook",
  "list-filter",
  "merge",
  "octagon-x",
  "package",
  "package-x",
  "pencil",
  "play",
  "regex",
  "repeat",
  "replace",
  "ruler",
  "scan-eye",
  "scissors",
  "search",
  "server-cog",
  "settings",
  "sigma",
  "split",
  "terminal",
  "test-tube",
  "text-cursor-input",
  "ticket",
  "truck",
  "type",
  "typescript",
  "ungroup",
  "variable",
  "wand",
  "wave",
  "webhook",
  "workflow",
  "x",
] as const;

export const IconName = z.enum(ICON_NAMES);
export type IconName = z.infer<typeof IconName>;

/** Browser-rendered branding only; the server never downloads these images. */
export const HostedIconUrl = z
  .string()
  .max(2_048)
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        /^https:\/\//i.test(value) &&
        !/[\p{Cc}\s\\]/u.test(value) &&
        url.protocol === "https:" &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, "Icon images must use an HTTPS URL without credentials");

export const IconValue = z.union([IconName, HostedIconUrl]);
export type IconValue = z.infer<typeof IconValue>;
