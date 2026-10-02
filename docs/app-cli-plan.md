# App CLI: extensions, full apps and tunnels

The CLI implements one app project with optional backend and optional app page. The
source descriptor is `octonode.app.json`, not an additional TOML file. Existing engine
contracts and artifact verification remain authoritative.

## Developer loop

```sh
octonodes app create my-app
cd my-app
npm install
npm run dev
```

Use `--template extension` for a navbar launcher and `shell.panel` without a backend.
Use `octonodes app targets` to discover native view/action/launcher targets. Add a page explicitly with
`octonodes app extension add overview --target app.page`.
The default is a full Vite app, identical to `--platform vite`. Use
`--platform next` for Next.js or `--platform plain` for an HTML welcome page and
Fetch API backend without a frontend framework. Vite and Next.js provide a native
React welcome page; full-app contributions start empty. The CLI builds the framework's static output into the
verified web artifact while `src/server.ts` handles authenticated API requests.
The Next.js variant uses static export; server-only Next.js features require a
different deployment adapter.

`app dev` starts the HTTP adapter, builds declared extensions/backend, automatically prepares a
Cloudflare Quick Tunnel, waits for public reachability, and opens the local preview. The public `trycloudflare.com` address is the current default for signed-in and signed-out developers.
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
In a terminal, development displays Octonode's mark, build steps, tunnel state,
and separate app and Studio/preview links. Redirected stdout retains the JSON
line for scripts and tests.

The terminal uses the real Octonode charcoal and coral palette: an octagonal
mark, short progress lines, a ready state, the app URL, the Studio or local
preview URL, and a Ctrl-C hint. Login shows the same mark and clear completion
state. Colors are automatic in interactive terminals, including environments
that set `NO_COLOR`. Redirected output remains plain JSON.

The starter welcome page uses the Octonode logo and a connection map to explain
the handoff from Studio to the app backend. It clears the session token from the
URL before calling `/api/context`, then shows the verified workspace or a useful
reopen instruction. It works at mobile widths and keeps keyboard focus visible.

For Studio rendering, run `octonodes login`, then
`octonodes app dev --workspace user:<id>` (also `team:<id>` and `org:<id>`).
`--base-url` and `--studio-url` select a development platform deployment. The publisher
must have workspace publish permission. Private drafts rotate tokens, expire after ten
minutes, and heartbeat every minute. Only their owner can access them. Preview tokens
start without project data or workflow grants; the local-only preview uses read-only context.
Native-contribution previews supply protocol v2 and translations, start actions only
from a Run button, and reject commands that need native resources.
Studio preview requires the matching development API/UI. Branded tunnel registration is paused until the private preview gateway has wildcard TLS and passes its live smoke test. The lease client remains in `tunnel-lease.ts`; enable `BRANDED_APP_PREVIEWS_ENABLED` in `dev.ts` after the private rollout. Branded previews use signed-in user sessions (not API tokens), expire after ten minutes without renewal, and support bearer authentication. Cookie-based sessions, WebSockets and SSE are not supported by this preview relay.

## Project and release structure

```text
my-app/
  octonode.app.json
  src/extensions/assistant.tsx # extension template only
  src/server.ts                 # full template only
  tests/app.test.cjs
  package.json
  tsconfig.json
  dist/apps/<app-id>/           # immutable registration artifact
  dist/web/<app-id>/            # full template only: deployable Node output
    server.cjs
    start.cjs
    extensions/<content-hash>.js
    extensions/<extension-id>.js # when explicitly declared
    octonode-web.json
```

The descriptor owns `apiVersion`, `id`, `name`, `version`, settings and extension entries.
Native contributions use `octonode.app/v2`, with launchers, title translations and
conditions, and compile to app manifest v3. Existing v1 descriptors remain supported.
Use branch-built packages and a matching host until these changes are published.
Full apps add `web.entry` and a permanent HTTPS `web.applicationUrl` for release builds.
The backend default-exports a Fetch API handler. Only declared extension assets are
served statically; source/configuration/secrets are never exposed. Builds generate hashes
and verify exact files, stage changes and retain previous output on build failure.

## Publication

Set `web.applicationUrl` before full-app release builds. Then:

```sh
npm test
octonodes app validate dist/apps/<app-id>
octonodes app publish --workspace user:<id>
# The first publish returns <app-id>. For full apps, deploy dist/web/<app-id>
# to a Node 24 host, then run there with the returned registered ID:
cd dist/web/<app-id>
PORT=3000 OCTONODE_APP_ID=<app-id> OCTONODE_API_URL=https://octonodes.com node start.cjs
# Back in the source project, after incrementing the source version:
octonodes app publish --workspace user:<id> --app-id <id> --revision <revision>
```

Publication always rebuilds production configuration and uses the existing publisher
API. Static releases upload their verified bundles; full releases register metadata and
remote asset hashes. Temporary branded preview and Quick Tunnel URLs cannot be published. Backend hosting
is developer-managed; publication does not deploy a backend or change installation pins.
An administrator installs/updates the release through Studio consent.

## Scope and validation

Implemented: scaffold, add contribution, tunnel/local dev, backend reload, isolated local
preview, private Studio preview, verified release build/serve and revision-safe publication.
OAuth integrations, platform webhooks, managed hosting, payments and installed agent-provider
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
