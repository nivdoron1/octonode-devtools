# Octonode Plugin Author

Read [plugin contracts](contracts.md) before implementation. For live project work, first read the
[shared MCP contract](../../octonode-connect/references/mcp-calling.md).

Build workflow-runtime plugins with the typed devtools SDK. This is separate from the AI-client plugin
that packages this skill and the hosted MCP connection.

## Workflow

1. Inspect the project and run `octonodes plugin --help` to check the installed CLI's commands.
   In the devtools checkout, read `packages/sdk/PLUGINS.md`; elsewhere, read the installed
   `@octonodes/sdk/PLUGINS.md` when available.
2. Start a local plugin with `octonodes plugin create NAME`, or use the existing package root.
3. Keep discovered handles in generated `octonode.nodes.ts` and authored distribution metadata in
   the root `octonode.plugin.ts`.
4. Implement handlers in ordinary source files and select them with `defineNode` from
   `@octonodes/sdk/plugin`.
5. Run:

   ```bash
   octonodes plugin nodes
   octonodes plugin build
   octonodes plugin validate dist/plugins/PLUGIN_ID
   octonodes plugin test dist/plugins/PLUGIN_ID NODE_ID --input '{}'
   ```

6. When the user requests publishing, use
   `octonodes plugin publish dist/plugins/PLUGIN_ID --registry URL`.
