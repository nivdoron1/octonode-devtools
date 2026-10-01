// Generated from packages/schema/src/app.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";
import { IconName } from "./icons.js";

export const AppAction = z.enum(["projects:read", "data:read", "data:write", "workflows:run"]);
export type AppAction = z.infer<typeof AppAction>;

/** Registration validation only; outbound callers must also enforce DNS/redirect SSRF policy. */
const appUrl = z
  .string()
  .max(2_048)
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        value === value.trim() &&
        /^https:\/\//i.test(value) &&
        !/[\p{Cc}\s\\?#]/u.test(value) &&
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        url.hostname.includes(".") &&
        !url.hostname.endsWith(".") &&
        !url.hostname.includes(":") &&
        !/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) &&
        !/\.(localhost|local|internal)$/.test(url.hostname)
      );
    } catch {
      return false;
    }
  }, "App URLs must use public HTTPS hostnames without credentials, query strings or fragments");

export const AppIconUrl = appUrl;

export const SelfHostedAppExtension = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9][a-z0-9-]*$/)
      .max(100),
    target: z.enum(["app.page", "workspace.block"]),
    url: appUrl,
    sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  })
  .strict();
export type SelfHostedAppExtension = z.infer<typeof SelfHostedAppExtension>;

/** Legacy releases retain their original validation and serialized defaults. */
export const SelfHostedApp = z
  .object({
    apiVersion: z.literal("1"),
    hosting: z.literal("self-hosted"),
    applicationUrl: appUrl,
    icon: IconName.optional(),
    iconUrl: appUrl.optional(),
    privacyUrl: appUrl.optional(),
    supportUrl: appUrl.optional(),
    redirectUrls: z.array(appUrl).min(1).max(10),
    webhookUrl: appUrl.optional(),
    requestedActions: z
      .array(AppAction)
      .max(4)
      .default([])
      .refine((actions) => new Set(actions).size === actions.length, "App actions must be unique"),
    extensions: z.array(SelfHostedAppExtension).max(32).default([]),
  })
  .strict()
  .superRefine((app, ctx) => {
    if (!URL.canParse(app.applicationUrl)) return;
    const origin = new URL(app.applicationUrl).origin;
    for (const [path, url] of [
      ...app.redirectUrls.map((url, index) => [["redirectUrls", index], url] as const),
      ...(app.iconUrl ? [[["iconUrl"], app.iconUrl] as const] : []),
      ...(app.webhookUrl ? [[["webhookUrl"], app.webhookUrl] as const] : []),
      ...app.extensions.map((extension, index) => [["extensions", index, "url"], extension.url] as const),
    ]) {
      if (URL.canParse(url) && new URL(url).origin !== origin)
        ctx.addIssue({
          code: "custom",
          path: [...path],
          message: "App endpoints and assets must share the application origin",
        });
    }
    if (new Set(app.redirectUrls).size !== app.redirectUrls.length)
      ctx.addIssue({ code: "custom", path: ["redirectUrls"], message: "App redirect URLs must be unique" });
    if (new Set(app.extensions.map((extension) => extension.id)).size !== app.extensions.length)
      ctx.addIssue({ code: "custom", path: ["extensions"], message: "App extension IDs must be unique" });
  });
export type SelfHostedApp = z.infer<typeof SelfHostedApp>;

/** Static browser extensions use the existing artifact store, never backend compute. */
export const ExtensionOnlyApp = z
  .object({
    apiVersion: z.literal("2"),
    hosting: z.literal("extension-only"),
    icon: IconName.optional(),
    iconUrl: appUrl.optional(),
    settings: z
      .array(
        z
          .object({
            id: z
              .string()
              .regex(/^[a-z][a-zA-Z0-9_]*$/)
              .max(100),
            label: z.string().trim().min(1).max(240),
            defaultValue: z.string().max(4000).default(""),
          })
          .strict(),
      )
      .max(32)
      .default([]),
    privacyUrl: appUrl.optional(),
    supportUrl: appUrl.optional(),
    requestedActions: z
      .array(AppAction)
      .max(0)
      .default([])
      .refine((actions) => new Set(actions).size === actions.length, "App actions must be unique"),
    extensions: z
      .array(
        z
          .object({
            id: SelfHostedAppExtension.shape.id,
            target: SelfHostedAppExtension.shape.target,
            path: z
              .string()
              .regex(/^extensions\/[a-z0-9][a-z0-9-]*\.js$/)
              .max(150),
            sha256: SelfHostedAppExtension.shape.sha256,
          })
          .strict(),
      )
      .min(1)
      .max(32),
  })
  .strict()
  .superRefine((app, ctx) => {
    if (new Set(app.settings.map((setting) => setting.id)).size !== app.settings.length)
      ctx.addIssue({ code: "custom", path: ["settings"], message: "App setting IDs must be unique" });
    for (const field of ["id", "path"] as const) {
      if (new Set(app.extensions.map((extension) => extension[field])).size !== app.extensions.length)
        ctx.addIssue({ code: "custom", path: ["extensions"], message: `App extension ${field}s must be unique` });
    }
  });
export type ExtensionOnlyApp = z.infer<typeof ExtensionOnlyApp>;
export const AppDefinition = z.union([SelfHostedApp, ExtensionOnlyApp]);
export type AppDefinition = z.infer<typeof AppDefinition>;

export const appTunnelRegistrationSchema = z
  .object({
    upstream: z.string().url().max(2048),
    previewToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
    workspace: z
      .object({ kind: z.enum(["user", "team", "org"]), id: z.string().min(1).max(128) })
      .strict()
      .optional(),
  })
  .strict();
