# App creation: Shopify and Octonode

Shopify's current CLI separates project creation (`app init`), extension creation
(`app generate extension`), development on a selected store (`app dev`), app
linking and environment configuration (`app config link/use`), and release
(`app deploy`). Its root app configuration holds the app URL, access scopes,
embedded behavior, and extension and web directories. Extensions have their own
configuration files. See the [CLI overview](https://shopify.dev/docs/apps/build/cli-for-apps/index),
[app configuration](https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration),
and [local testing](https://shopify.dev/docs/apps/build/cli-for-apps/test-apps-locally).

| Concern | Shopify CLI | Octonode CLI today |
| --- | --- | --- |
| Create a project | `app init` with a template | `app create`, defaulting to Vite; `--platform` accepts `plain`, `next`, or `vite`; `--template extension` creates an extension-only app |
| Add an extension | `app generate extension` | `app extension add` for `app.page` or `workspace.block` |
| Describe an app | `shopify.app.toml` | `octonode.app.json`: ID, name, version, description, entries, settings, optional web URL and requested actions |
| Preview | `app dev` selects a development store and creates a tunnel | `app dev` creates a tunnel; `--workspace kind:id` adds a Studio preview |
| Configure production access | App URL and scopes in app config | `web.applicationUrl` and `web.requestedActions` in app descriptor; Studio asks for installation consent |
| Release | `app deploy` releases app config and extensions | `app publish` registers a verified release; the developer deploys a full app's web artifact |

Configuration gaps worth addressing next:

1. **Saved workspace and environment selection.** Developers currently repeat
   `--workspace`, and may need `--base-url` and `--studio-url` for a different
   deployment. A named local configuration should keep these together without
   changing the versioned app descriptor. The default Studio link now points to
   the live `octonodes.com` Studio.
2. **Link an existing app for updates.** Developers must retain the registered
   app ID and current revision and pass both to `app publish`. A link command
   could fetch and save them, then check revision drift before release.
3. **Deployment configuration.** Full apps require a permanent HTTPS
   `web.applicationUrl`, hosted `OCTONODE_APP_ID` and `OCTONODE_API_URL`, and a
   deployment of `dist/web/<id>`. The generated README documents these steps,
   but the CLI does not provision hosting or pull environment variables.

Shopify's store selection, OAuth configuration, webhooks, and its many extension
targets depend on Shopify platform surfaces. Octonode should add comparable
controls only when the corresponding workspace API or extension target exists.
