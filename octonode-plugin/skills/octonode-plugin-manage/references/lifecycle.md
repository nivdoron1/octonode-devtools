# Octonode Plugin Manage

For live hosted plugin inspection or node insertion, use the [shared MCP contract](../../octonode-connect/references/mcp-calling.md)
and [plugin operation schemas](../../octonode-connect/references/mcp/plugins.md). The commands below
operate on local workflow dependencies, not AI-client extensions.

Run `octonodes plugin --help` and inspect the target project's `package.json`, native package-manager
lockfile, and `octonode.lock`. Run commands from that project, or pass `--cwd PATH` to consumer commands.
Use `octonodes plugin list` to inspect installed aliases before changing them.

| Task | Command |
| --- | --- |
| Install a registry plugin | `octonodes plugin install ID --version VERSION --alias ALIAS --registry URL` |
| Install a local build | `octonodes plugin install ./dist/plugins/ID --alias ALIAS` |
| Preview an update | `octonodes plugin update ALIAS --version VERSION --dry-run` |
| Apply an update | `octonodes plugin update ALIAS --version VERSION` |
| Remove a dependency | `octonodes plugin remove ALIAS` |
| Restore pinned artifacts | `octonodes install --frozen --artifacts-only` |
| Restore from cache | `octonodes install --frozen --artifacts-only --offline` |
| Recover an interrupted install | `octonodes plugin recover` |

Registry operations use `OCTONODE_MARKETPLACE_TOKEN`, or the saved CLI login / `OCTONODE_TOKEN`.
Keep credentials out of files and output. For discovery beyond installed dependencies, use
`octonodes operations marketplace` and inspect the selected operation's help and SDK input types.

Apply the requested lifecycle operation within the user's authorized project and scope. Updates
preserve registry identity; do not replace a registry silently. Use `--migrate` only when the user
intends to replace an unmanaged `@octonodes/plugin` dependency.

Frozen artifact restoration runs before the project's native frozen dependency install (for example,
`npm ci`). Offline restoration needs cached artifacts; private plugins may require online authorization.
If recovery is needed, first verify no installer is still running. Keep journals and backups intact
and use the recovery command instead of deleting locks to bypass the transaction.

After a change, inspect `octonodes plugin list`, review manifest and lockfile changes, and run the
affected project's existing validation. Do not hand-edit generated plugin artifacts or `octonode.lock`.
For creating, building, testing, or publishing a plugin, use the bundled `octonode-plugin-author` skill.
