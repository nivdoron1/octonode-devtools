# AGENTS.md

## Hosted MCP synchronization

When the generated SDK or `packages/sdk/openapi.json` adds, removes, or changes an operation that
belongs in the hosted MCP surface, update the MCP registration in the same change:

1. Add or update its canonical definition in `packages/mcp/src/constants.ts`, including the tool
   name, description, input schema, HTTP method/path, query/body mapping, scope, and risk metadata.
2. Keep all registration inside `registerMcp` in `packages/mcp/src/register-mcp.ts`; do not register
   tools directly in the Worker entrypoint.
3. Update `tests/mcp.test.mjs` so the expected hosted tool list and request forwarding stay exact.
4. Run `yarn gen`, `yarn build`, and `yarn test`. Also run
   `yarn workspace @octonodes/mcp deploy:check` when the MCP package changes.

Keep shared declarations in `types.ts`, shared constants in `constants.ts`, and the Worker routing
only in `index.ts`.
