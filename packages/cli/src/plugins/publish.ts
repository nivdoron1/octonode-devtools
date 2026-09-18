import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { verifyBuild } from "./artifact";

export async function publishPlugin(
  directory: string,
  registry: string,
  token: string,
  orgId?: string,
  teamId?: string,
): Promise<unknown> {
  const url = new URL(registry);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
  ) {
    throw new Error("Registry must use HTTPS (HTTP is allowed only on loopback)");
  }
  const temp = mkdtempSync(join(tmpdir(), "octonodes-publish-"));
  try {
    const verified = verifyBuild(directory);
    const snapshot = join(temp, "plugin");
    mkdirSync(snapshot);
    for (const file of verified.files) {
      mkdirSync(dirname(join(snapshot, file)), { recursive: true });
      cpSync(join(directory, file), join(snapshot, file));
    }
    const { manifest, files } = verifyBuild(snapshot);
    const bundle = join(temp, "bundle.tar.gz");
    execFileSync("tar", ["-czf", bundle, "-C", snapshot, "--", ...files]);
    const form = new FormData();
    form.set("manifest", JSON.stringify(manifest));
    form.set(
      "bundle",
      new Blob([readFileSync(bundle)], { type: "application/gzip" }),
      "bundle.tar.gz",
    );
    if (orgId) form.set("orgId", orgId);
    if (teamId) form.set("teamId", teamId);
    const response = await fetch(
      `${registry.replace(/\/$/, "")}/marketplace/plugins/${encodeURIComponent(manifest.id)}/versions`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
        redirect: "error",
        signal: AbortSignal.timeout(120_000),
      },
    );
    if (!response.ok)
      throw new Error(
        `Plugin publish failed (HTTP ${response.status}): ${(await response.text()).slice(0, 1000)}`,
      );
    return response.json();
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
