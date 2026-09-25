# Octonode Connect plugin

One agent plugin with shared skills for Claude Code, Codex, Cursor, and Agent Plugins-compatible hosts:

| Skill | Use |
| --- | --- |
| `octonode-connect` | Connect MCP and inspect, edit, and run authorized projects. |
| `octonode-plugin-author` | Create, build, validate, test, and publish workflow plugins. |
| `octonode-plugin-manage` | List, install, update, remove, restore, and recover workflow plugins. |

`plugin.json` is the portable manifest; `.codex-plugin/plugin.json` and
`.claude-plugin/plugin.json` provide host compatibility. Every host reads the same `skills/` directory.
This bundle contains instructions. The CLI performs local plugin operations; the hosted MCP server
in `packages/mcp` performs live project operations. No additional runtime ships here.

Each `SKILL.md` is a router. Detailed procedures live in that skill's `references/` directory.
Shared [MCP calling rules](skills/octonode-connect/references/mcp-calling.md) and the
[complete operation index](skills/octonode-connect/references/mcp/index.md) live under `octonode-connect`
and are linked from the authoring and management routers. Read only the references needed for a task.
Copy all three skill folders together, preserving their names and reference files, so sibling links work.

The MCP index leads to short category routers; each tool has its own reference page with input
schema, example call, scope, risk, and argument routing. They are generated from `packages/mcp/src/constants.ts` by
`yarn gen:mcp-skills` (also included in `yarn gen`). `yarn test` checks reference drift and local links.

## Load the skills

- **Claude Code:** from this repository, run `claude --plugin-dir ./connect-skill-plugin`.
  Skills are namespaced, for example `/connect-skill-plugin:octonode-plugin-author`.
- **Codex:** install this directory through your local plugin marketplace. For skills-only local use,
  copy the three directories under `skills/` to your project's `.agents/skills/` or `~/.agents/skills/`.
- **Cursor:** distribute this directory as an Agent Plugin through your plugin marketplace.
  For local use without publishing, copy the three skill directories to `.cursor/skills/`.
- **Other hosts:** load the root Agent Plugins manifest or copy the skills into the host's supported
  Agent Skills directory. MCP-only hosts need their native MCP configuration and do not load skills.

Preserve existing skill directories when copying. Marketplace publication is a separate distribution
step; this source change does not publish or install the bundle into your clients.

## Connect live project tools

Install `@octonodes/cli` and ensure `octonodes` is on PATH. Generate the configuration for your host:

```sh
octonodes connect codex --workspace org:WORKSPACE_ID --project PROJECT_ID
octonodes connect claude --workspace org:WORKSPACE_ID --project PROJECT_ID
octonodes connect cursor --workspace org:WORKSPACE_ID --project PROJECT_ID
```

Run only the command for your host. Codex output goes in `~/.codex/config.toml` and uses
`octonodes login` or `OCTONODE_TOKEN` through a credential helper. Claude prints an MCP registration
command. Cursor prints JSON to merge into `.cursor/mcp.json` or `~/.cursor/mcp.json`.
Claude and Cursor require `OCTONODE_TOKEN` in their environment when launched; they do not read
the CLI's saved login. Generated configuration contains placeholders, never the token.

Repeat `--project` for multiple projects; add `--worktree` to target a managed checkout. Preserve
other configured servers, restart the host, and verify `octonode` connects before using project tools.

MCP is configured separately because portable HTTP headers are literal and do not provide secret
interpolation. This avoids shipping an unauthenticated connection or registering a duplicate server.
Other hosts should configure `https://mcp.octonode.dev/mcp` with their native credential mechanism
and the same workspace/project headers. ChatGPT requires a registered hosted connection and mapping
before distribution. Otto already supplies its connection and built-in guidance.

Host references: [Claude plugins](https://code.claude.com/docs/en/plugins-reference),
[Codex packaging](https://developers.openai.com/plugins/build/plugins),
[Cursor plugins](https://cursor.com/docs/reference/plugins),
[Cursor MCP](https://cursor.com/docs/mcp), and
[portable placeholder rules](https://agent-plugins.org/specification#9-environment-variables-and-placeholder-expansion).
