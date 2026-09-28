import { OCTONODE_API_URL } from "@octonodes/sdk";
import { accessToken } from "../auth";
import { publicOrigin } from "./tunnel";

export async function registerTunnel(upstream: string, previewToken: string, workspace?: string, baseUrl = OCTONODE_API_URL) {
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
    throw new Error("API origin must use HTTPS");
  const scope = workspace?.match(/^(user|team|org):([^:]{1,128})$/);
  if (workspace && !scope) throw new Error("--workspace must be user:<id>, team:<id> or org:<id>");
  const request = async (path: string, method: string, body?: unknown) => {
    const token = await accessToken();
    if (!token) throw new Error("Run octonodes login to use branded tunnels, or pass --quick-tunnel");
    const response = await fetch(new URL(`/api/marketplace/publisher/app-tunnels${path}`, base), {
      method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}), redirect: "error", signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Branded tunnel ${method} failed (${response.status}); check login and service availability, or use --quick-tunnel`);
    return response.json();
  };
  const lease = await request("", "POST", { upstream, previewToken, ...(scope ? { workspace: { kind: scope[1], id: scope[2] } } : {}) }) as { id: string; url: string; expiresAt: number };
  if (!lease || !/^[a-z]+(?:-[a-z]+){2}$/.test(lease.id)) throw new Error("Invalid tunnel lease response");
  let pending = Promise.resolve();
  let stopped = false;
  try {
    const url = publicOrigin(lease.url);
    if (!Number.isSafeInteger(lease.expiresAt) || lease.expiresAt <= Date.now()) throw new Error("Invalid tunnel expiry");
    return {
      url,
      renew() {
        pending = pending.then(async () => {
          if (stopped) return;
          const next = await request(`/${lease.id}`, "POST") as typeof lease;
          if (next.id !== lease.id || next.url !== lease.url || !Number.isSafeInteger(next.expiresAt) || next.expiresAt <= Date.now())
            throw new Error("Invalid renewed tunnel lease");
        });
        return pending;
      },
      async close() {
        if (stopped) return;
        stopped = true;
        await pending.catch(() => {});
        await request(`/${lease.id}`, "DELETE");
      },
    };
  } catch (error) {
    await request(`/${lease.id}`, "DELETE").catch(() => {});
    throw error;
  }
}
