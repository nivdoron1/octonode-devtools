# AGENTS.md

## Hosted services

This public repository ships client tooling only: the SDK, CLI, UI extensions, installers, and the
AI-client plugin bundle. Cloudflare Workers and other hosted services, including the MCP server at
`https://mcp.octonode.dev/mcp`, live in the private Octonode repository. Do not add Worker or
deployment configuration here.

`octonode-plugin/skills/octonode-connect/references/mcp/` is generated from the hosted MCP
registrations by the Octonode SDK sync workflow. Do not edit it by hand.
