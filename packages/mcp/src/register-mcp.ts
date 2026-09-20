import { McpServer, fromJsonSchema } from "@modelcontextprotocol/server";
import { OctonodeClient } from "@octonodes/sdk";
import {
  DEFAULT_RESPONSE_LIMIT_BYTES,
  MCP_SERVER_INFO,
  MCP_TOOLS,
  PROJECT_RESPONSE_LIMIT_BYTES,
} from "./constants.js";
import { CODE_AUTHOR_GUIDANCE, MCP_RESOURCES } from "./guidance.js";
import type { McpEnv, ToolArguments, ToolDefinition } from "./types.js";

class ApiClient extends OctonodeClient {
  request(options: Parameters<typeof this.client.request>[0]) {
    return this.client.request(options);
  }
}

function result(value: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    ...(isError ? { isError: true } : {}),
  };
}

export function bearerToken(request: Request): string | undefined {
  return request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || undefined;
}

function selectedProject(args: ToolArguments, request: Request): string | undefined {
  const project =
    typeof args.projectId === "string"
      ? args.projectId
      : request.headers.get("x-octonode-project") || undefined;
  const authorized = request.headers.get("x-octonode-projects");
  if (!project || !authorized) return project;

  let projects: unknown;
  try {
    projects = JSON.parse(authorized);
  } catch {
    throw new Error("x-octonode-projects must be a JSON array");
  }
  if (!Array.isArray(projects) || !projects.every((value) => typeof value === "string")) {
    throw new Error("x-octonode-projects must be a JSON array of project IDs");
  }
  if (!projects.includes(project)) throw new Error(`Unauthorized projectId: ${project}`);
  return project;
}

function resolvePath(definition: ToolDefinition, args: ToolArguments, project?: string): string {
  return definition.path.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = key === "projectId" ? project : args[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing required path argument: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

function parseEvents(text: string): unknown[] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return line;
      }
    });
}

function base64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

async function boundedFetch(input: RequestInfo | URL, init: RequestInit | undefined, limit: number) {
  const response = await fetch(input, init);
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) {
    throw new Error("Octonode API response exceeds the MCP limit");
  }
  if (!response.body) return response;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new Error("Octonode API response exceeds the MCP limit");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Response(bytes, response);
}

function apiError(value: unknown, status = 500) {
  const payload = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    message:
      typeof payload.error === "string"
        ? payload.error
        : typeof payload.message === "string"
          ? payload.message
          : `HTTP ${status}`,
    status,
    ...(typeof payload.code === "string" ? { code: payload.code } : {}),
    ...(Number.isInteger(payload.retryAfter) ? { retryAfter: Number(payload.retryAfter) } : {}),
    ...(Number.isInteger(payload.currentVersion)
      ? { currentVersion: Number(payload.currentVersion) }
      : {}),
    ...(typeof payload.currentHeadSha === "string"
      ? { currentHeadSha: payload.currentHeadSha }
      : {}),
  };
}

async function callTool(
  api: ApiClient,
  definition: ToolDefinition,
  args: ToolArguments,
  request: Request,
) {
  const workspace = request.headers.get("x-octonode-workspace");
  if (!workspace) throw new Error("x-octonode-workspace header is required");
  const project = selectedProject(args, request);
  if (definition.projectScoped && !project) {
    throw new Error("projectId argument or x-octonode-project header is required");
  }

  const url = new URL(resolvePath(definition, args, project), "https://octonode.invalid");
  url.searchParams.set("workspace", workspace);
  if (definition.projectScoped) url.searchParams.set("project", project!);
  for (const key of definition.query ?? []) {
    if (args[key] !== undefined) url.searchParams.set(key, String(args[key]));
  }

  const body = Object.fromEntries(
    (definition.body ?? []).filter((key) => args[key] !== undefined).map((key) => [key, args[key]]),
  );
  const headers = new Headers();
  if (definition.method !== "GET") headers.set("idempotency-key", crypto.randomUUID());

  const response = await api.request({
    method: definition.method,
    url: `${url.pathname}${url.search}`,
    headers,
    ...(definition.body ? { body } : {}),
    parseAs: definition.stream
      ? "text"
      : definition.name === "profile_avatar_get"
        ? "arrayBuffer"
        : "auto",
    responseStyle: "fields",
    throwOnError: false,
    fetch: (input, init) =>
      boundedFetch(
        input,
        init,
        definition.projectScoped ? PROJECT_RESPONSE_LIMIT_BYTES : DEFAULT_RESPONSE_LIMIT_BYTES,
      ),
  });
  if ("error" in response && response.error !== undefined) {
    return result(
      { ok: false, error: apiError(response.error, response.response?.status) },
      true,
    );
  }

  let data: unknown = response.data;
  if (definition.stream && typeof data === "string") data = { events: parseEvents(data) };
  if (definition.name === "profile_avatar_get" && data instanceof ArrayBuffer) {
    data = { contentType: response.response?.headers.get("content-type"), base64: base64(data) };
  }
  return result({ ok: true, status: response.response?.status, data });
}

export function registerMcp(request: Request, env: McpEnv): McpServer {
  const headers: HeadersInit = { "x-client-name": "octonode-mcp" };
  const worktree = request.headers.get("x-octonode-worktree");
  if (worktree) headers["x-octonode-worktree"] = worktree;
  const api = new ApiClient(bearerToken(request)!, env.OCTONODE_API_URL, headers);
  const server = new McpServer(MCP_SERVER_INFO, { instructions: CODE_AUTHOR_GUIDANCE });

  for (const definition of MCP_TOOLS) {
    server.registerTool(
      definition.name,
      {
        description: definition.description,
        inputSchema: fromJsonSchema(definition.inputSchema),
        annotations: {
          readOnlyHint: definition.risk === "read",
          destructiveHint: definition.destructive ?? false,
        },
      },
      async (args) => {
        try {
          return await callTool(api, definition, args as ToolArguments, request);
        } catch (error) {
          return result(
            {
              ok: false,
              error: { message: error instanceof Error ? error.message : String(error) },
            },
            true,
          );
        }
      },
    );
  }

  for (const resource of MCP_RESOURCES) {
    server.registerResource(
      resource.name,
      resource.uri,
      { description: resource.description, mimeType: resource.mimeType },
      async () => ({
        contents: [{ uri: resource.uri, mimeType: resource.mimeType, text: resource.text }],
      }),
    );
  }

  return server;
}
