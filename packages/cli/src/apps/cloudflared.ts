import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile, chmod, rename, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { x } from "tar";
import { CLOUDFLARED_ASSETS, CLOUDFLARED_VERSION } from "./constants";

export async function ensureCloudflared(
  signal?: AbortSignal,
  cache = join(process.env.OCTONODE_CONFIG_DIR ?? join(homedir(), ".octonode"), "cache", "cloudflared"),
  platform = `${process.platform}-${process.arch}`,
): Promise<string> {
  const asset = CLOUDFLARED_ASSETS[platform];
  if (!asset) throw new Error(`Automatic tunnels are unsupported on ${platform}; use --tunnel-url or --use-localhost`);
  const directory = join(cache, CLOUDFLARED_VERSION, platform);
  const executable = join(directory, platform.startsWith("win32-") ? "cloudflared.exe" : "cloudflared");
  const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
  const binaryHash = asset.binarySha256 ?? asset.sha256;
  try {
    if (digest(await readFile(executable)) === binaryHash) return executable;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const stage = await mkdtemp(join(directory, ".download-"));
  try {
    process.stderr.write("Preparing development tunnel (first download may take a moment)…\n");
    const response = await fetch(
      `https://github.com/cloudflare/cloudflared/releases/download/${CLOUDFLARED_VERSION}/${asset.file}`,
      {
        signal: AbortSignal.any([AbortSignal.timeout(120_000), ...(signal ? [signal] : [])]),
      },
    );
    if (!response.ok) throw new Error(`Download returned HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (digest(bytes) !== asset.sha256) throw new Error("Tunnel download checksum mismatch");
    const staged = join(stage, platform.startsWith("win32-") ? "cloudflared.exe" : "cloudflared");
    if (asset.file.endsWith(".tgz")) {
      const archive = join(stage, "download.tgz");
      await writeFile(archive, bytes);
      await x({
        file: archive,
        cwd: stage,
        filter: (path) => path === "cloudflared",
      });
    } else await writeFile(staged, bytes);
    if (digest(await readFile(staged)) !== binaryHash) throw new Error("Tunnel executable checksum mismatch");
    signal?.throwIfAborted();
    await chmod(staged, 0o700);
    await rename(staged, executable);
    return executable;
  } catch (error) {
    throw new Error(
      `Could not prepare the development tunnel: ${error instanceof Error ? error.message : String(error)}. Retry, use --tunnel-url, or pass --use-localhost`,
      { cause: error },
    );
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}
