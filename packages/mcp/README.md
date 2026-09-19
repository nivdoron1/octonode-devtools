# Octonode MCP

Remote Octonode tools over MCP Streamable HTTP, deployed as a stateless Cloudflare Worker.
Each request forwards the caller's Octonode bearer token through `@octonodes/sdk`; the Worker
does not store a shared API credential.

## Run locally

```sh
yarn install
yarn workspace @octonodes/mcp types
yarn mcp:dev
```

Connect an MCP client to `http://localhost:8787/mcp` and send its Octonode token as an
`Authorization: Bearer ...` header plus `x-octonode-workspace`. Set `x-octonode-project` as the
default project; callers can override it with a tool's `projectId` argument. Optionally send
`x-octonode-worktree` to target a managed checkout. Set the Worker variable `OCTONODE_API_URL`
only when using a self-hosted API; otherwise the SDK default is used.

The Worker exposes the same 43 collaboration and project-authoring tools as Octonode's canonical
hosted MCP catalog, including the original descriptions, JSON Schemas, risk annotations, server
instructions, and authoring/reference resources.

Clients that only support local stdio servers can use `mcp-remote`:

```json
{
  "mcpServers": {
    "octonode": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.octonode.dev/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}",
        "--header",
        "x-octonode-workspace:${OCTONODE_WORKSPACE}",
        "--header",
        "x-octonode-project:${OCTONODE_PROJECT}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer <octonode-token>",
        "OCTONODE_WORKSPACE": "org:<workspace-id>",
        "OCTONODE_PROJECT": "<project-id>"
      }
    }
  }
}
```

Use a personal token while developing, then switch automation to a project-scoped agent or
service token with only the required read/write/run scopes. Add OAuth only when the endpoint must
support interactive third-party users who should not configure tokens themselves.

## Deploy

```sh
yarn workspace @octonodes/mcp deploy:check
yarn mcp:deploy
```

The deployed endpoint is `https://mcp.octonode.dev/mcp`. Use a personal token
for interactive clients or a narrowly scoped agent/service token for automation.
