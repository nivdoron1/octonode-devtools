export const PLUGIN_HELP = `Usage:
  octonodes plugin deploy [source-directory] [--github]
  octonodes plugin deploy-all --github
  octonodes plugin version <patch|minor|major|version> [--cwd <directory>]
  octonodes plugin create <name>
  octonodes plugin nodes [--check]
  octonodes plugin build [octonode.plugin.ts]
  octonodes plugin validate <built-directory>
  octonodes plugin test <built-directory> [node-id] --input <json>
  octonodes plugin publish <built-directory> --registry <url> [--org <id>] [--team <id>]
  octonodes plugin install <id|built-directory> [--version <version>] [--alias <alias>] [--migrate]
  octonodes plugin update <alias> [--version <version>] [--dry-run]
  octonodes plugin remove <alias>
  octonodes plugin list
  octonodes install --frozen --artifacts-only [--offline]
  octonodes plugin recover

Deploy reads plugin.octonode.json/.yml and builds, hashes and publishes to plugins.octonodes.com.
GitHub publishing uses the connected repository and short-lived Actions identity, with no marketplace secret.
Deploy-all scans tracked release files and legacy manifests after the repository build.
Build reads octonode.plugin.ts and writes dist/plugins/<id>.
Node inventories are generated in octonode.nodes.ts. Metadata is inspected without execution.
Publishing uses OCTONODE_MARKETPLACE_URL and OCTONODE_MARKETPLACE_TOKEN when set,
or the saved octonodes login / OCTONODE_TOKEN. It never publishes to npm.
Consumer commands accept --cwd <project>. Restore artifacts before npm ci (or your native frozen install).
Custom imports live in a private generated @octonodes/plugin package; upstream npm imports stay unchanged.
`;
