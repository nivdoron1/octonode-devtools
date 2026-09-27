# App CLI: extensions, full apps and tunnels

The CLI implements one app project with optional backend and optional app page. The
source descriptor is `octonode.app.json`, not an additional TOML file. Existing engine
contracts and artifact verification remain authoritative.

## Developer loop

```sh
octonodes app create my-app --template full
cd my-app
npm install
npm run dev
```

Omit `--template full` for a static extension-only app. Both templates start with a
workspace block. Add a page explicitly with
`octonodes app extension add overview --target app.page`.

`app dev` starts the HTTP adapter, builds declared extensions/backend, automatically prepares a
Cloudflare Quick Tunnel, waits for public reachability, and opens the local preview.
No Cloudflare account, Homebrew, administrator privileges or separate installation is needed.
The CLI downloads the pinned official helper on first use, verifies SHA-256 before execution,
and reuses its verified cache under `~/.octonode/cache/cloudflared` (or `OCTONODE_CONFIG_DIR`).
macOS and Linux support x64/arm64; Windows supports x64. The first run needs access to GitHub
release downloads. Unsupported platforms can use a custom tunnel. Use
`--use-localhost` for offline development, `--no-open` for terminal-only startup, or
`--port 3000 --tunnel-url https://your-tunnel-host` with your existing tunnel.
The descriptor never receives the temporary URL. Source changes rebuild automatically;
build errors preserve the working version. Preview refresh uses polling because Quick
Tunnels do not support SSE. Ctrl-C cleans up resources.

For Studio rendering, run `octonodes login`, then
`octonodes app dev --workspace user:<id>` (also `team:<id>` and `org:<id>`).
`--base-url` and `--studio-url` select a development platform deployment. The publisher
must have workspace publish permission. Private drafts rotate tokens, expire after ten
minutes, and heartbeat every minute. Only their owner can access them. Preview tokens
have no project data or workflow grants; the local-only preview uses mock context.
The server deployment needs control migration 0023 and matching development API/UI.

## Project and release structure

```text
my-app/
  octonode.app.json
  src/extensions/notice.tsx
  src/server.ts                 # full template only
  tests/app.test.cjs
  package.json
  tsconfig.json
  dist/apps/my-app/             # immutable registration artifact
  dist/web/my-app/              # full template only: deployable Node output
    server.cjs
    start.cjs
    extensions/<content-hash>.js
    extensions/notice.js
    octonode-web.json
```

The descriptor owns `apiVersion`, `id`, `name`, `version`, settings and extension entries.
Full apps add `web.entry` and a permanent HTTPS `web.applicationUrl` for release builds.
The backend default-exports a Fetch API handler. Only declared extension assets are
served statically; source/configuration/secrets are never exposed. Builds generate hashes
and verify exact files, stage changes and retain previous output on build failure.

## Publication

Set `web.applicationUrl` before full-app release builds. Then:

```sh
npm test
octonodes app validate dist/apps/my-app
octonodes app publish --workspace user:<id>
# The first publish returns <app-id>. For full apps, deploy dist/web/my-app
# to a Node 24 host, then run there with the returned registered ID:
cd dist/web/my-app
PORT=3000 OCTONODE_APP_ID=<app-id> OCTONODE_API_URL=https://octonodes.com node start.cjs
# Back in the source project, after incrementing the source version:
octonodes app publish --workspace user:<id> --app-id <id> --revision <revision>
```

Publication always rebuilds production configuration and uses the existing publisher
API. Static releases upload their verified bundles; full releases register metadata and
remote asset hashes. Temporary Quick Tunnel URLs cannot be published. Backend hosting
is developer-managed; publication does not deploy a backend or change installation pins.
An administrator installs/updates the release through Studio consent.

## Scope and validation

Implemented: scaffold, add contribution, tunnel/local dev, backend reload, isolated local
preview, private Studio preview, verified release build/serve and revision-safe publication.
OAuth integrations, platform webhooks, managed hosting, payments and new command/agent
contribution targets are separate work. Tunnel transport alone supplies none of them.

Run `yarn gen`, `yarn build`, `yarn test`. App tests exercise scaffolds, bundle integrity,
unsafe paths, backend rebuild/failure recovery, preview authentication and publisher calls.
A real Quick Tunnel and browser rendering are also checked during development. Engine
integration tests cover authorization, expiry, revocation and grants.

Design follows [Shopify networking options](https://shopify.dev/docs/apps/build/cli-for-apps/networking-options)
and [Cloudflare Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/).

Full-app configuration also accepts `web.requestedActions` using existing app permissions
(`projects:read`, `data:read`, `data:write`, `workflows:run`). Production installation
requires explicit consent for those actions. Development previews deliberately replace
that list with no grants. Shared manifest settings are for extension-only apps; full apps
manage their configuration in their own backend. The generated `/api/context` route
verifies an app bearer using the existing SDK; production sets `OCTONODE_APP_ID` and
`OCTONODE_API_URL`, while workspace development provides them automatically.

## Production output and pinned releases

Run `node dist/web/<id>/start.cjs` on a Node 24 host with `PORT`, `OCTONODE_APP_ID`
and `OCTONODE_API_URL`. The standalone launcher validates its inventory. Configure HTTPS
on the host. Extension URLs are content-addressed; incremental builds retain previous
verified assets. Restore the previous complete web artifact before building in clean CI,
or retain old assets on the host. Deleting a pinned asset breaks that installation.
The hosted starter clears the session fragment and authenticates `/api/context`; expired
sessions instruct users to reopen from Studio.
