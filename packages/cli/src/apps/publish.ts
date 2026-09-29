import { readFileSync } from "node:fs";
import { join } from "node:path";
import { APP_STUDIO_URL } from "./constants";
import { accessToken } from "../auth";
import { buildAppProject } from "./build";
export async function publishApp(
  directory: string,
  options: { workspace: string; appId?: string; revision?: number; baseUrl?: string; distribution?: string },
) {
  const workspace = options.workspace.match(/^(user|team|org):([^:]{1,128})$/);
  if (!workspace) throw new Error("--workspace must be user:<id>, team:<id> or org:<id>");
  if (
    options.appId &&
    (!/^[a-f0-9-]{36}$/.test(options.appId) || !Number.isSafeInteger(options.revision) || options.revision! < 1)
  )
    throw new Error("Updates require --app-id <id> and --revision <current-revision>");
  const base = new URL(options.baseUrl ?? APP_STUDIO_URL);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
    throw new Error("API origin must use HTTPS");
  const token = await accessToken();
  if (!token) throw new Error("Run octonodes login before publishing");
  const built = await buildAppProject(directory);
  const app = built.manifest.app!;
  if (
    app.hosting === "self-hosted" &&
    /(?:\.trycloudflare\.com|\.example|localhost)$/.test(new URL(app.applicationUrl).hostname)
  )
    throw new Error("Configure a permanent production app URL before publishing");
  const body = {
    workspace: { kind: workspace[1], id: workspace[2] },
    distribution: options.distribution ?? workspace[1],
    slug: built.manifest.id,
    name: built.manifest.name,
    description: built.manifest.description,
    version: built.manifest.version,
    app,
    expectedRevision: options.appId ? options.revision : 0,
    ...(app.hosting === "extension-only"
      ? {
          bundles: app.extensions.map((extension) => ({
            id: extension.id,
            code: readFileSync(join(built.directory, extension.path), "utf8"),
          })),
        }
      : {}),
  };
  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized) > 4 * 1024 * 1024) throw new Error("App publication exceeds 4 MiB");
  const response = await fetch(
    new URL(`/api/marketplace/publisher/apps${options.appId ? `/${options.appId}/versions` : ""}`, base),
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: serialized,
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok)
    throw new Error(`App publication failed (${response.status}); check publisher access, version and revision`);
  return response.json();
}
