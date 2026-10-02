// Generated from packages/schema/src/personal/layout.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
export const PersonalLayoutItems = z
  .array(
    z
      .object({
        id: z
          .string()
          .min(1)
          .max(240)
          .refine((id) => !["__proto__", "__all__"].includes(id)),
        label: z.string().trim().min(1).max(240).optional(),
        pinned: z.boolean().optional(),
      })
      .strict(),
  )
  .max(100)
  .refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Layout IDs must be unique");
export const SettingsLayout = z
  .record(
    z
      .string()
      .regex(/^[a-z][a-z0-9.-]*$/)
      .max(100),
    PersonalLayoutItems,
  )
  .refine((value) => Object.keys(value).length <= 64, "At most 64 layout groups");
