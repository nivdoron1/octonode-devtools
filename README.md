# Octonode Devtools

Type-safe access to the public Octonode API through the `@octonodes/sdk` package and the
`octonodes` command-line client. Both are generated from the same developer OpenAPI contract,
use `https://api.octonode.dev` by default, and enforce the permissions of the supplied user or
API token.

Requires Node.js 24 or newer.

## Plugin development

The same SDK also supports offline plugin authoring through `@octonodes/sdk/plugin`.
Define plugins and their nodes in TypeScript; the CLI generates `octonode.yml` and
a standalone artifact from each package root’s `octonode.plugin.ts`. Import generated
handles from `octonode.nodes.ts`; use `octonode.config.ts` for project appearance.

```sh
octonodes plugin create my-integrations
cd my-integrations
npm install
npm test
```

See the [plugin SDK guide](packages/sdk/PLUGINS.md) for typed definitions,
credentials, assets, testing, and marketplace publishing. The plugin contract and
runtime are synced from the main Octonode repository; generated API client files
remain separate.

## Create an app

`octonodes` creates a complete app project. The default is a full Vite app with a hosted page and backend. Use `--template extension`
for a navbar launcher and panel inside Octonode without a backend. Contributions are optional for full apps.
Run `octonodes app targets` to list supported views, actions, and launcher placements;
add a contextual entry with `octonodes app extension add explain-node --target node.action`.
The extension starter uses source descriptor `octonode.app/v2` and builds app manifest v3.
Use the branch-built packages and a matching host until this support is published.

```sh
npm install --global @octonodes/cli
octonodes app create workspace-notice
cd workspace-notice
npm install
npm test
npm run dev
```

The project contains `octonode.app.json`, a React page, a backend, a Projects route, and a
build check. The React page verifies the workspace session before showing content and registers its navigation in Studio. Yarn workspaces use the generated `installConfig.hoistingLimits: workspaces`. `app dev` runs a live preview and automatically provisions a
verified HTTPS tunnel. It needs no Cloudflare account or separate tunnel install.
Use `octonodes app dev --use-localhost` for offline UI work. To preview in a real
workspace, run `octonodes login` and `octonodes app dev --workspace user:<id>`.

```sh
# From the app directory, after signing in:
octonodes app publish --workspace user:<id>
# Install the release in Studio → Apps; extension starters add a navbar button.
```

For a hosted app, start with `octonodes app create inventory-labels --template
full`, set `web.applicationUrl` to a permanent HTTPS origin, build and publish,
then deploy the complete `dist/web/<app-id>` directory to a Node 24
host. The first publish returns `OCTONODE_APP_ID`; set it and
`OCTONODE_API_URL` on the host before inviting installations. Publication does
not deploy the backend. Read the [end-to-end Playbook](https://playbook.octonodes.com/docs/apps),
[CLI app commands](packages/cli/README.md#create-an-app),
[app SDK guide](packages/ui-extensions/README.md#hosted-pages-and-routing),
[native extension API guide](packages/ui-extensions/README.md#native-app-contributions-v3),
[CLI implementation notes](docs/app-cli-plan.md), and
[Shopify CLI comparison](docs/app-cli-shopify-comparison.md).

## Packages

| Package                                                        | Use it when                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`@octonodes/sdk`](packages/sdk/README.md)                     | A TypeScript or JavaScript application needs typed Octonode API calls.                |
| [`@octonodes/cli`](packages/cli/README.md)                     | A developer, script, or CI job needs the same API from a terminal.                    |
| [`@octonodes/mcp`](packages/mcp/README.md)                     | An MCP client needs remote Octonode tools hosted on Cloudflare Workers.               |
| [`@octonodes/ui-extensions`](packages/ui-extensions/README.md) | Plugin inspector layouts and installed app launchers, panels, tabs, views, and actions. |

Only compiled `dist` files, package metadata, and package README files are published. Source,
tests, generation scripts, and repository configuration are not included in the npm packages.

## SDK

### Install

```sh
npm install @octonodes/sdk
```

### Create a client

```ts
import { createClient } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!);
const projects = await octonode.projects.api.get();
```

`createClient` is the short form. The class can also be constructed directly:

```ts
import { OctonodeClient } from "@octonodes/sdk";

const octonode = new OctonodeClient(process.env.OCTONODE_TOKEN!);
```

The client stores the base URL, bearer token, and shared headers once. Every generated operation
under that instance uses the same configuration.

### URL and headers

The default API URL is exported as `OCTONODE_API_URL`. Override it for self-hosting or local
development and add headers when an integration needs request metadata:

```ts
import { createClient, OCTONODE_API_URL } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!, {
  url: process.env.OCTONODE_URL ?? OCTONODE_API_URL,
  headers: {
    "x-client-name": "my-integration",
  },
});
```

The equivalent constructor is:

```ts
const octonode = new OctonodeClient(token, "http://localhost:4000", {
  "x-client-name": "local-development",
});
```

### Call operations

Operations follow the API path and finish with the HTTP method. Path, query, and body values use
the generated `path`, `query`, and `body` objects:

```ts
// GET /api/store/projects
await octonode.projects.api.get();

// GET /api/projects/{projectId}
await octonode.projects.api.projectId.get({
  path: { projectId: "project-id" },
});

// POST /api/workflows/{workflowId}/run
await octonode.workflows.api.workflowId.run.post({
  path: { workflowId: "daily-report" },
  body: {},
});
```

TypeScript checks required inputs and response types from the OpenAPI contract. HTTP failures are
thrown, so applications can handle them with normal `try`/`catch` logic:

```ts
try {
  const identity = await octonode.identity.api.get();
  console.log(identity);
} catch (error) {
  console.error("Octonode request failed", error);
}
```

The package also exports all generated request, response, and schema types.

### Authentication and token types

The SDK does not bypass Octonode authentication or authorization. The API validates the bearer
token, its scopes, workspace membership, optional project binding, expiration, and revocation on
every request.

| Credential                   | Intended use                                                        |
| ---------------------------- | ------------------------------------------------------------------- |
| Supabase user access token   | Interactive calls as the signed-in Studio user.                     |
| Personal token (`octo_pat_`) | Local developer tools acting as one account.                        |
| Service token (`octo_svc_`)  | Trusted backend or CI access to one workspace.                      |
| Public token (`octo_pub_`)   | Intentionally public browser data-table reads from allowed origins. |
| Agent token (`octo_agent_`)  | Scoped headless collaboration or agent access.                      |

Never put a personal, service, or agent token in browser code. A public token is intentionally
limited, but its allowed-origin check is not a replacement for keeping private data private.

## CLI

The CLI is a thin wrapper over the same generated SDK. It needs no local Octonode checkout.
For Claude Code, Codex, Cursor, and compatible agents, see the [agent plugin](octonode-plugin/README.md)
for shared skills and MCP setup.

### Installation

The npm package is `@octonodes/cli`; the installed command is `octonodes`.
It creates apps and plugins and calls the Octonode API. The separate `octonode`
workflow engine uses a different executable.

**Available now:** npm, npx, pnpm, Yarn and Bun use the published npm package.
**Pending publication:** Homebrew, WinGet, Scoop, Chocolatey, DEB/APT, RPM/DNF,
Arch/AUR, Snap, Docker and direct installers have prepared distribution recipes.
Their commands below become usable when the corresponding channel is published.
An npm release does not automatically make those channels available.

#### Prerequisites

For npm-based installation, install [Node.js 24](https://nodejs.org/en/download)
and your chosen package manager. Check the runtime before installing:

```sh
node --version
npm --version
```

Node should report `v24.x.x`. Homebrew will install `node@24` as a dependency;
the planned portable, MSI, DEB, RPM, Scoop, Chocolatey, Arch and Snap packages
include their own Node 24 runtime. App and plugin projects still need a separate
Node 24 development toolchain and a package manager to install project dependencies.

#### npm, pnpm, Yarn and Bun

Choose one global installation method:

| Package manager | Install globally | Run once without a global install |
| --- | --- | --- |
| npm | `npm install --global @octonodes/cli` | `npx --yes @octonodes/cli@latest --help` |
| pnpm | `pnpm add --global @octonodes/cli` | `pnpm dlx @octonodes/cli --help` |
| Yarn Classic (1.x) | `yarn global add @octonodes/cli` | Use npm's `npx` command above |
| Yarn 2+ / 4 | Use npm or pnpm for global installation | `yarn dlx @octonodes/cli --help` |
| Bun | `bun add --global @octonodes/cli` | `bunx @octonodes/cli --help` |

One-off commands do not add `octonodes` permanently to your PATH. To run another
command once, replace `--help`, for example `npx --yes @octonodes/cli@latest login`.
To pin a release, replace `@latest` with an exact published version, such as
`npx --yes @octonodes/cli@0.2.16 --help`.

If pnpm reports no global bin directory, run [pnpm setup](https://pnpm.io/cli/setup)
and open a new terminal. For [Yarn Classic](https://classic.yarnpkg.com/en/docs/cli/global),
ensure the directory from `yarn global bin` is on PATH. Bun's global binaries
normally live in `~/.bun/bin`; see [Bun installation](https://bun.com/docs/installation).
Keep Node 24 on PATH even when using Bun as the package manager.

#### Homebrew — macOS and Linux

**Pending tap publication.** Install [Homebrew](https://brew.sh/) first.
The planned tap is `nivdoron1/homebrew-tap`:

```sh
brew install nivdoron1/tap/octonodes
octonodes --version
```

The equivalent two-step setup is `brew tap nivdoron1/tap`, then
`brew install octonodes`. The formula selects its Node 24 dependency automatically.

#### Windows — WinGet, Scoop, Chocolatey or MSI

**Pending channel publication; Windows x64.** Install your chosen package manager
first: [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/),
[Scoop](https://scoop.sh/) or [Chocolatey](https://chocolatey.org/install).

```powershell
# WinGet, after the manifest is published to its community source
winget install --id Octonode.CLI --exact --source winget

# Chocolatey, in an administrator terminal after community publication
choco install octonodes --yes
```

For Scoop, add the published bucket before installing. The bucket URL has not
been assigned yet; replace `PUBLISHED_BUCKET_URL` with the announced Git URL:

```powershell
scoop bucket add octonode PUBLISHED_BUCKET_URL
scoop install octonode/octonodes
```

Alternatively, download `octonodes-X.Y.Z-win32-x64.msi` and `SHA256SUMS` from the
published release. Compare `Get-FileHash .\octonodes-X.Y.Z-win32-x64.msi -Algorithm SHA256`
with the matching checksum, then run the MSI. It installs for all users, requires
administrator permission and registers the command on the system PATH.
Open a new terminal after any Windows installation.

#### Linux — DEB/APT, RPM/DNF, Arch/AUR and Snap

**Pending package or repository publication.** DEB/RPM/Arch/Snap target Linux x64
and arm64. Portable Linux packages need glibc 2.28+ and libstdc++; Alpine/musl
is outside the prepared portable build matrix.

Download a matching package and `SHA256SUMS` from the published release and
verify it with `sha256sum --check --ignore-missing SHA256SUMS` before installing:

```sh
# Debian / Ubuntu: use amd64 for x64, or arm64 for ARM64
sudo apt install ./octonodes_X.Y.Z_amd64.deb

# Fedora / RHEL: use x86_64 for x64, or aarch64 for ARM64
sudo dnf install ./octonodes-X.Y.Z-1.x86_64.rpm
```

After configuring the publisher's signed APT or DNF repository, installation
and updates use the package manager directly:

```sh
# Debian / Ubuntu, after adding the published APT URL and signing key
sudo apt update
sudo apt install octonodes

# Fedora / RHEL, after adding the published DNF URL and signing key
sudo dnf install octonodes
```

Repository URLs and signing-key fingerprints will be announced when those
repositories are published. Do not disable signature verification.

For Arch, review the published AUR recipe before building. With Git and
`base-devel` installed:

```sh
git clone https://aur.archlinux.org/octonodes-bin.git
cd octonodes-bin
less PKGBUILD
makepkg -si
```

If you already use an AUR helper, `yay -S octonodes-bin` is an alternative.
For Snap, install [snapd](https://snapcraft.io/docs/installing-snapd) first;
the listing also requires publisher approval for classic confinement:

```sh
sudo snap install octonodes --classic
```

#### Direct installation — macOS, Linux and Windows

**Pending release-asset hosting.** Choose an installer release from
[GitHub Releases](https://github.com/nivdoron1/octonode-devtools/releases).
Replace `X.Y.Z` with its exact published installer version; the commands assume
the planned GitHub release asset location.

On macOS or Linux, download and inspect the installer before running it:

```sh
CLI_VERSION=X.Y.Z
RELEASE_URL="https://github.com/nivdoron1/octonode-devtools/releases/download/cli-v${CLI_VERSION}"
curl --fail --location --proto '=https' "$RELEASE_URL/install.sh" -o install-octonodes.sh
less install-octonodes.sh
sh install-octonodes.sh
export PATH="$HOME/.local/bin:$PATH"
octonodes --version
```

Add the PATH line to your shell profile for future terminals. The installer
detects macOS/Linux x64 or arm64, verifies the archive checksum, and installs
under `~/.local/share/octonodes`, with a command link in `~/.local/bin`.
Set `OCTONODES_INSTALL_DIR` and `OCTONODES_BIN_DIR` before running it to choose
different locations. The macOS portable runtime requires macOS 13.5 or later.

On Windows x64, download and inspect the PowerShell installer:

```powershell
$CliVersion = 'X.Y.Z'
$ReleaseUrl = "https://github.com/nivdoron1/octonode-devtools/releases/download/cli-v$CliVersion"
Invoke-WebRequest "$ReleaseUrl/install.ps1" -OutFile install-octonodes.ps1
Get-Content .\install-octonodes.ps1
& .\install-octonodes.ps1
```

Use your organization's PowerShell execution policy for downloaded scripts.
The installer verifies the ZIP checksum, installs under `%LOCALAPPDATA%\Octonodes`
and updates your user PATH. Open a new terminal afterwards. Set
`OCTONODES_INSTALL_DIR` beforehand to choose a different installation directory.
Installing the same version again refuses to overwrite its directory.

#### Docker

**Pending image publication.** Install [Docker](https://docs.docker.com/get-started/get-docker/)
and replace `PUBLISHED_IMAGE:VERSION` with the announced image and immutable tag:

```sh
docker run --rm PUBLISHED_IMAGE:VERSION --help
docker run --rm PUBLISHED_IMAGE:VERSION --version
```

The image uses `octonodes` as its entrypoint and includes Node 24. Pass CLI
arguments after the image name. Bind-mount your project to a working directory
for file-based commands; interactive login state is not retained by `--rm`.

#### Verify and sign in

After a global, native or direct installation:

```sh
octonodes --version
octonodes --help
octonodes login
```

Login opens browser authentication. For a terminal-only session, use
`octonodes login --email you@example.com`. If the command is not found, open a
new terminal and check your package manager's global bin directory or the direct
installer PATH. Use `command -v octonodes` on macOS/Linux or
`Get-Command octonodes` in PowerShell to see which installation is selected.

#### Update or uninstall

Use the same channel that installed the CLI:

| Channel | Update | Uninstall |
| --- | --- | --- |
| npm | `npm install --global @octonodes/cli@latest` | `npm uninstall --global @octonodes/cli` |
| pnpm | `pnpm add --global @octonodes/cli@latest` | `pnpm remove --global @octonodes/cli` |
| Yarn Classic | `yarn global add @octonodes/cli@latest` | `yarn global remove @octonodes/cli` |
| Bun | `bun add --global @octonodes/cli@latest` | `bun remove --global @octonodes/cli` |
| Homebrew | `brew update` then `brew upgrade octonodes` | `brew uninstall octonodes` |
| WinGet | `winget upgrade --id Octonode.CLI --exact` | `winget uninstall --id Octonode.CLI --exact` |
| Scoop | `scoop update octonodes` | `scoop uninstall octonodes` |
| Chocolatey | `choco upgrade octonodes --yes` | `choco uninstall octonodes --yes` |
| APT repository | `sudo apt update` then `sudo apt install --only-upgrade octonodes` | `sudo apt remove octonodes` |
| DNF repository | `sudo dnf upgrade octonodes` | `sudo dnf remove octonodes` |
| Arch / AUR helper | `yay -S octonodes-bin` | `sudo pacman -R octonodes-bin` |
| Snap | `sudo snap refresh octonodes` | `sudo snap remove octonodes` |

For a downloaded DEB/RPM/MSI, download and verify the newer package and install
it with the same tool. Remove an MSI through Windows Installed apps. For direct
installations, run the newer version's installer; to uninstall, remove its managed
command link or PATH entry and its version directory. For Docker, pull the newer
tag and recreate the container, or remove the image with `docker image rm`.
Login data under `~/.octonode` is separate from installed binaries; use
`octonodes logout` before uninstalling to remove the saved login and revoke a
saved Studio session. Static API tokens must be revoked separately in Studio.

See the [full installation guide](https://playbook.octonodes.com/docs/installation)
for signed APT/DNF repository setup, and the [maintainer infrastructure guide](docs/cli-installation.md)
for preparing and publishing these channels.

### Login

For an interactive user, browser login is the default:

```sh
octonodes login
```

The command loads the public Supabase configuration from Octonode, opens the existing Studio
GitHub provider, completes a PKCE exchange through a temporary `127.0.0.1` callback, and stores
the refreshable session in `~/.octonode/session.json`. The browser never receives the saved CLI
session. If it cannot open automatically, the CLI prints the URL.

Supabase must allow this redirect pattern:

```text
http://127.0.0.1:*/auth/callback/**
```

For a remote terminal or email-code login:

```sh
octonodes login --email you@example.com
```

For a personal, service, public, or agent API token:

```sh
octonodes login --token "$OCTONODE_TOKEN"
```

Saved credentials use user-only filesystem permissions. Supabase sessions refresh automatically.
For non-interactive automation, set `OCTONODE_TOKEN`; it overrides saved credentials.

### Discover and call operations

List every command or narrow the list with a filter:

```sh
octonodes operations
octonodes operations projects
```

Use `--help` at each level to browse commands, then pass the generated input as JSON:

```sh
octonodes projects --help
octonodes projects api --help
octonodes projects api projectId --help
```

Call an operation by its SDK path:

```sh
octonodes projects api get

octonodes projects api projectId get \
  --input '{"path":{"projectId":"project-id"}}'

octonodes workflows api workflowId run post \
  --input '{"path":{"workflowId":"daily-report"},"body":{}}'
```

Normal responses are formatted JSON. Streaming operations, including workflow runs and execution
events, are consumed to completion and printed as one JSON value per line.

Use a different API deployment with either form:

```sh
octonodes projects api get --base-url http://localhost:4000
OCTONODE_URL=http://localhost:4000 octonodes projects api get
```

### Logout

```sh
octonodes logout
```

Logout revokes the saved Supabase refresh session and removes local credentials. Static API
tokens must still be revoked in Studio. The command cannot unset `OCTONODE_TOKEN` in the parent
shell.

### CLI environment variables

| Variable              | Behavior                                                  |
| --------------------- | --------------------------------------------------------- |
| `OCTONODE_TOKEN`      | Overrides all saved login credentials.                    |
| `OCTONODE_URL`        | Overrides the default `https://api.octonode.dev`.         |
| `OCTONODE_CONFIG_DIR` | Overrides the default `~/.octonode` credential directory. |

Use `-h`, `--h`, or `--help` globally or after a command.

## Development

Install dependencies and verify generated code, types, SDK behavior, authentication, and CLI
behavior:

```sh
corepack enable
yarn install --immutable
yarn check
```

Regenerate the client after replacing `packages/sdk/openapi.json`:

```sh
yarn gen
```

The main Octonode repository filters its internal OpenAPI document to developer-safe operations.
When that contract changes, its sync workflow opens an automated PR here, regenerates the SDK,
and bumps both public packages together.

## Publishing

Publishing is manual and restricted to `nivdoron1`. After merging, use the PR's CLI release
control comment, or **Actions → Publish npm packages → Run workflow** on `main` with its exact
40-character commit SHA. New pushes and merges never publish automatically. The workflow verifies
the repo and publishes missing stable versions of `@octonodes/sdk`, `@octonodes/ui-extensions`,
then `@octonodes/cli`, using short-lived OIDC credentials and npm provenance. Each package must trust
`nivdoron1/octonode-devtools`, workflow `publish.yml`, environment `npm-publish`.
The currently disabled npm workflow must be enabled manually after this change lands.
See [CLI installation and release controls](docs/cli-installation.md) for preparing Homebrew and
other installation channels; those submissions remain manual.

The Octonode repository also needs `DEVTOOLS_REPO_TOKEN` so its OpenAPI sync workflow can open and
auto-merge generated PRs here.

See the [changelog](CHANGELOG.md) for release history.

## License

MIT
