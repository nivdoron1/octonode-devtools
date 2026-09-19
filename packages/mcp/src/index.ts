import { createMcpHandler } from "agents/mcp/server";
import { bearerToken, registerMcp } from "./register-mcp.js";
import type { McpEnv } from "./types.js";

export default {
  fetch(request: Request, env: McpEnv, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ ok: true });
    if (url.pathname !== "/mcp") return new Response("Octonode MCP: connect a client to /mcp\n");
    if (!bearerToken(request)) {
      return new Response("Octonode bearer token required", {
        status: 401,
        headers: { "www-authenticate": "Bearer" },
      });
    }
    return createMcpHandler(({ requestInfo }) => registerMcp(requestInfo ?? request, env))(
      request,
      env,
      ctx,
    );
  },
} satisfies ExportedHandler<McpEnv>;
