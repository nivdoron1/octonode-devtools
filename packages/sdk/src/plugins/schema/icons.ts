// Generated from packages/schema/src/icons.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { ICON_NAMES } from "./constants/constants";

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
