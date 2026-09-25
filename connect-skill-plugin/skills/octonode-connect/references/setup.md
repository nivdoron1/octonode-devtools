# Octonode Connect

Use `https://mcp.octonode.dev/mcp` for live Octonode project state. Documentation and skills explain
how to work; MCP tools read or change the authorized project. This client plugin packages shared
skills; configure MCP separately for the host. Octonode workflow plugins contribute executable nodes.

## Connect

1. Ensure `octonodes` is installed (`npm install --global @octonodes/cli` when requested).
   For Codex, run `octonodes login` or set `OCTONODE_TOKEN`. For Claude Code and Cursor,
   set `OCTONODE_TOKEN` to a scoped token in the client's environment; saved CLI login is not read by them.
2. Generate client configuration:
   - Codex: `octonodes connect codex --workspace org:WORKSPACE_ID --project PROJECT_ID`
   - Claude Code: `octonodes connect claude --workspace org:WORKSPACE_ID --project PROJECT_ID`
   - Cursor: `octonodes connect cursor --workspace org:WORKSPACE_ID --project PROJECT_ID`
3. Merge Codex output into `~/.codex/config.toml`, run the printed Claude command, or merge Cursor
   output into `.cursor/mcp.json` (or `~/.cursor/mcp.json`). Preserve existing servers.
   Restart the client and verify the `octonode` server is connected. Generation alone does not install it.

For other MCP hosts, configure the same HTTP endpoint using their native secret settings. Use the
scope headers from the generated Cursor JSON, replacing its token placeholder with the host's secret
mechanism. `connect headers` emits a real credential and is only for a trusted credential helper.

For multiple authorized projects, repeat `--project`. Add `--worktree WORKTREE_ID` only when the
session must target a managed checkout. Never commit a token or generated authorization header.
