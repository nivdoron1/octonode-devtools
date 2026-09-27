export const APP_SOURCE = "octonode.app.json";
export const APP_HELP = `Usage:
  octonodes app create <name> [--template extension|full]
  octonodes app extension add <id> --target workspace.block|app.page [--cwd <directory>]
  octonodes app dev [directory] [--use-localhost | --tunnel-url <https-origin>] [--port <port>] [--no-open] [--workspace kind:id]
  octonodes app build [directory] [--app-url <https-origin>]
  octonodes app serve [directory] [--port <port>]
  octonodes app publish [directory] --workspace kind:id [--app-id <id> --revision <n>]
  octonodes app validate <artifact-directory>

Create defaults to a workspace block. Build compiles declared browser entries and generates
release hashes in dist/apps/<id>. Existing projects are never overwritten. No login is needed.
app dev uses cloudflared by default. --workspace opens an expiring Studio preview after login.
app publish creates an immutable release; full apps must deploy their backend separately.
Installation requires Studio consent.
`;
