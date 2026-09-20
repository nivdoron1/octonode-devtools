# Octonode Connect plugin

Portable client-extension bundle for Codex, ChatGPT, and compatible agent hosts. It packages the
`octonode-connect` and `octonode-plugin-author` skills plus the hosted
`https://mcp.octonode.dev/mcp` dependency. It is not an Octonode workflow plugin and does not contain
the MCP implementation.

Use `octonodes connect --help` to generate scoped Codex or Claude Code configuration. ChatGPT requires
the hosted MCP connection to be registered and mapped to this plugin before distribution.
