import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OCTONODE_API_URL } from "@octonodes/sdk";
import type { PluginBuild } from "../plugins/types";
import { accessToken } from "../auth";
import type { AppSource } from "./types";

export async function createDevelopmentSession(
  workspace: string,
  baseUrl = OCTONODE_API_URL,
  studioUrl = "https://octonodes.com",
) {
  const match = workspace.match(/^(user|team|org):([^:]{1,128})$/);
  if (!match) throw new Error("--workspace must be user:<id>, team:<id> or org:<id>");
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
    throw new Error("API origin must use HTTPS");
  const studio = new URL(studioUrl);
  if (
    studio.protocol !== "https:" &&
    !(studio.protocol === "http:" && ["localhost", "127.0.0.1"].includes(studio.hostname))
  )
    throw new Error("Studio origin must use HTTPS");
  if (!(await accessToken())) throw new Error("Run octonodes login before starting a workspace preview");
  let id: string | undefined;
  let revision = 0;
  let body: Record<string, unknown> | undefined;
  let stopped = false;
  let queue = Promise.resolve();
  async function request(method: string, payload?: unknown) {
    const response = await fetch(new URL(`/api/marketplace/publisher/app-development${id ? `/${id}` : ""}`, base), {
      method,
      headers: { authorization: `Bearer ${await accessToken()}`, "content-type": "application/json" },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      signal: AbortSignal.timeout(15_000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(
        `Development session ${method} failed (${response.status}); check publisher access and server migration 0023`,
      );
    return response.json() as Promise<{ id: string; revision: number; expiresAt: number }>;
  }
  const sync = (source?: AppSource, built?: PluginBuild, bundleDirectory?: string) => {
    const operation = queue
      .catch(() => {})
      .then(async () => {
        if (stopped) return;
        if (source && built && bundleDirectory)
          body = {
            workspace: { kind: match![1], id: match![2] },
            slug: source.id,
            name: source.name,
            version: source.version,
            app: { ...built.manifest.app, requestedActions: [] },
            bundles: source.extensions.map((extension) => ({
              id: extension.id,
              code: readFileSync(join(bundleDirectory, `extensions/${extension.id}.js`), "utf8"),
            })),
          };
        if (!body) return;
        const result = await request("POST", { ...body, expectedRevision: revision });
        id = result.id;
        revision = result.revision;
        process.env.OCTONODE_APP_ID = id;
        process.env.OCTONODE_API_URL = base.origin;
      });
    queue = operation;
    return operation;
  };
  return {
    sync,
    get url() {
      return id ? new URL(`/studio/apps/development/${id}`, studio).href : undefined;
    },
    async close() {
      stopped = true;
      await queue.catch(() => {});
      if (id)
        await request("DELETE").catch((error) =>
          process.stderr.write(`Development session cleanup failed; it expires within ten minutes: ${error.message}\n`),
        );
    },
  };
}
