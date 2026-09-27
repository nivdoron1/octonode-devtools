import { createServer, type IncomingMessage } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import type { AddressInfo } from "node:net";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { AppSource } from "./types";

export async function bodyBytes(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_048_576) throw new Error("Request exceeds 1 MiB");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
export function createAppServer(options: {
  port: number;
  previewScript?: string;
  source: AppSource;
  development: boolean;
}) {
  const challenge = randomBytes(16).toString("hex");
  const secret = randomBytes(32).toString("base64url");
  let revision = 0;
  let error: string | undefined;
  let origin = "";
  let immutable = new Map<string, string>();
  let extensions: Array<{ id: string; target: string; code: string }> = [];
  let handler: ((request: Request) => Response | Promise<Response>) | undefined;
  const allowed = (request: IncomingMessage) => {
    const value = request.headers.authorization?.replace(/^Bearer /, "") ?? "";
    return (
      Buffer.byteLength(value) === Buffer.byteLength(secret) && timingSafeEqual(Buffer.from(value), Buffer.from(secret))
    );
  };
  const server = createServer(async (request, response) => {
    try {
      if (!origin) {
        response.writeHead(503).end();
        return;
      }
      const host = request.headers.host ?? "";
      if (
        ![
          new URL(origin).host,
          `127.0.0.1:${(server.address() as AddressInfo).port}`,
          `localhost:${(server.address() as AddressInfo).port}`,
        ].includes(host)
      ) {
        response.writeHead(403).end();
        return;
      }
      const url = new URL(request.url ?? "/", origin);
      response.setHeader("cache-control", "no-store");
      response.setHeader("x-content-type-options", "nosniff");
      if (url.pathname.startsWith("/_octonode")) {
        if (!options.development) {
          response.writeHead(404).end();
          return;
        }
        if (url.pathname === "/_octonode/ping") {
          response.writeHead(200, { "content-type": "text/plain" }).end(challenge);
          return;
        }
        if (url.pathname === "/_octonode/" || url.pathname === "/_octonode") {
          response.writeHead(200, {
            "content-type": "text/html; charset=utf-8",
            "referrer-policy": "no-referrer",
            "content-security-policy":
              "default-src 'self'; script-src 'self' 'unsafe-inline'; frame-src 'self' about:; style-src 'unsafe-inline'; connect-src 'self'",
          });
          response.end(
            '<!doctype html><html><head><meta charset="utf-8"><title>Octonode app preview</title><style>body{font:16px system-ui;max-width:900px;margin:40px auto;padding:20px}section{padding:16px;border:1px solid #ddd;margin:12px 0}label{display:block}#error{color:#b42318;white-space:pre-wrap}</style></head><body><h1>App development preview</h1><p>Local development context. No customer data or permissions.</p><p id="error" role="alert"></p><div id="extensions"></div><script src="/_octonode/preview.js"></script></body></html>',
          );
          return;
        }
        if (url.pathname === "/_octonode/preview.js") {
          response.writeHead(200, { "content-type": "text/javascript" }).end(options.previewScript);
          return;
        }
        if (!allowed(request)) {
          response.writeHead(401).end();
          return;
        }
        if (url.pathname === "/_octonode/state") {
          response.writeHead(200, { "content-type": "application/json" }).end(
            JSON.stringify({
              revision: String(revision),
              error,
              origin: options.source.web ? origin : "'none'",
              extensions,
              session: {
                token: "development-preview",
                appId: options.source.id,
                installationId: "development",
                workspace: { kind: "user", id: "development" },
                version: options.source.version,
                expiresAt: Date.now() + 3600_000,
                configuration: Object.fromEntries(
                  (options.source.settings ?? []).map((setting) => [setting.id, setting.defaultValue]),
                ),
              },
            }),
          );
          return;
        }
        response.writeHead(404).end();
        return;
      }
      const asset = immutable.get(url.pathname);
      if (asset !== undefined && ["GET", "HEAD"].includes(request.method ?? "")) {
        response
          .writeHead(200, {
            "content-type": "text/javascript",
            "access-control-allow-origin": "*",
            "cache-control": "public, max-age=31536000, immutable",
          })
          .end(request.method === "HEAD" ? undefined : asset);
        return;
      }
      const extension = extensions.find((item) => url.pathname === `/extensions/${item.id}.js`);
      if (extension && ["GET", "HEAD"].includes(request.method ?? "")) {
        response
          .writeHead(200, { "content-type": "text/javascript", "access-control-allow-origin": "*" })
          .end(request.method === "HEAD" ? undefined : extension.code);
        return;
      }
      if (!handler) {
        response.writeHead(302, { location: "/_octonode/" }).end();
        return;
      }
      const bytes = ["GET", "HEAD"].includes(request.method ?? "GET") ? undefined : await bodyBytes(request);
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers))
        if (value && !["host", "connection", "transfer-encoding", "content-length"].includes(key))
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      const result = await handler(new Request(url, { method: request.method, headers, body: bytes }));
      response.writeHead(result.status, {
        ...Object.fromEntries(result.headers),
        ...(result.headers.has("set-cookie") ? { "set-cookie": result.headers.getSetCookie() } : {}),
      });
      if (result.body && request.method !== "HEAD")
        await pipeline(Readable.fromWeb(result.body as import("node:stream/web").ReadableStream<Uint8Array>), response);
      else {
        await result.body?.cancel();
        response.end();
      }
    } catch {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response
        .writeHead(500, { "content-type": "text/plain" })
        .end("App request failed; check the development terminal");
    }
  });
  return {
    server,
    secret,
    challenge,
    async listen() {
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(options.port, options.development ? "127.0.0.1" : "0.0.0.0", () => {
          server.off("error", reject);
          resolve();
        });
      });
      const port = (server.address() as AddressInfo).port;
      origin = `http://127.0.0.1:${port}`;
      return port;
    },
    setOrigin(value: string) {
      origin = value;
    },
    update(source: AppSource, directory: string, backend?: (request: Request) => Response | Promise<Response>) {
      options.source = source;
      handler = backend;
      extensions = source.extensions.map((item) => ({
        id: item.id,
        target: item.target,
        code: readFileSync(join(directory, `extensions/${item.id}.js`), "utf8"),
      }));
      immutable = new Map(
        readdirSync(join(directory, "extensions"))
          .filter((file) => /^[a-f0-9]{64}\.js$/.test(file))
          .map((file) => [`/extensions/${file}`, readFileSync(join(directory, "extensions", file), "utf8")]),
      );
      error = undefined;
      revision++;
    },
    fail(message: string) {
      error = message;
    },
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}
