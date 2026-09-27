import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

export function startTunnel(port: number, executable = "cloudflared") {
  const process = spawn(executable, ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${port}`], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let settled = false;
  const url = new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      process.kill();
      reject(new Error("Tunnel startup timed out"));
    }, 30_000);
    const finish = (error?: Error, origin?: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) {
        process.kill();
        reject(error);
      } else resolve(origin!);
    };
    let buffer = "";
    const receive = (chunk: Buffer) => {
      buffer = (buffer + chunk.toString()).slice(-16_384);
      const found = buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com\b/);
      if (found && buffer.includes("Registered tunnel connection")) finish(undefined, found[0]);
    };
    process.stdout.on("data", receive);
    process.stderr.on("data", receive);
    process.on("error", () =>
      finish(new Error("Install cloudflared (brew install cloudflared), use --tunnel-url, or pass --use-localhost")),
    );
    process.on("exit", () => finish(new Error("Tunnel exited before becoming ready")));
  });
  // Registration precedes public DNS propagation; avoid caching an early negative lookup.
  const ready = url.then(async (origin) => {
    await delay(10_000);
    if (process.exitCode !== null || process.signalCode !== null) throw new Error("Tunnel stopped during startup");
    return origin;
  });
  return {
    process,
    url: ready,
    stop: () => {
      process.kill("SIGTERM");
    },
  };
}

export function publicOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/")
    throw new Error("Tunnel URL must be an HTTPS origin");
  return url.origin;
}
