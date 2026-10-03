# @octonodes/cli

Command-line access to the public [Octonode cloud API](https://octonodes.com/api/docs). The CLI
wraps `@octonodes/sdk`, so every generated SDK operation is available without writing TypeScript.

## Installation

The npm package is `@octonodes/cli`; the installed command is `octonodes`.
It creates apps and plugins and calls the Octonode API. The separate `octonode`
workflow engine uses a different executable.

**Available now:** npm, npx, pnpm, Yarn and Bun use the published npm package.
**Pending publication:** Homebrew, WinGet, Scoop, Chocolatey, DEB/APT, RPM/DNF,
Arch/AUR, Snap, Docker and direct installers have prepared distribution recipes.
Their commands below become usable when the corresponding channel is published.
An npm release does not automatically make those channels available.

### Prerequisites

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

### npm, pnpm, Yarn and Bun

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

### Homebrew — macOS and Linux

**Pending tap publication.** Install [Homebrew](https://brew.sh/) first.
The planned tap is `nivdoron1/homebrew-tap`:

```sh
brew install nivdoron1/tap/octonodes
octonodes --version
```

The equivalent two-step setup is `brew tap nivdoron1/tap`, then
`brew install octonodes`. The formula selects its Node 24 dependency automatically.

### Windows — WinGet, Scoop, Chocolatey or MSI

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

### Linux — DEB/APT, RPM/DNF, Arch/AUR and Snap

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

### Direct installation — macOS, Linux and Windows

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

### Docker

**Pending image publication.** Install [Docker](https://docs.docker.com/get-started/get-docker/)
and replace `PUBLISHED_IMAGE:VERSION` with the announced image and immutable tag:

```sh
docker run --rm PUBLISHED_IMAGE:VERSION --help
docker run --rm PUBLISHED_IMAGE:VERSION --version
```

The image uses `octonodes` as its entrypoint and includes Node 24. Pass CLI
arguments after the image name. Bind-mount your project to a working directory
for file-based commands; interactive login state is not retained by `--rm`.

### Verify and sign in

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

### Update or uninstall

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
for signed APT/DNF repository setup.

## Create an app

Use Node 24 and a CLI release containing `octonodes app`. The default scaffold
is a full Vite app with one hosted page and a backend. Contributions are optional.
Use `--template extension` for a navbar launcher and panel inside Octonode.
Run `octonodes app targets` to list supported view/action/launcher targets; add a
contextual entry with `octonodes app extension add explain-node --target node.action`.
The extension starter uses `octonode.app/v2` and builds an app manifest v3 release.
These targets require the branch-built SDK/CLI and a matching host until publication;
see the [native extension API guide](../ui-extensions/README.md#native-app-contributions-v3).

```sh
octonodes app create workspace-notice
cd workspace-notice
npm install
npm test
npm run dev
```

Edit `octonode.app.json`, `src/web/App.tsx`, and `src/server.ts`. `npm test`
checks types and verifies build hashes. `npm run dev` watches changes and starts
a verified public HTTPS Quick Tunnel automatically. Branded Octonode preview URLs
are planned for a later rollout.
Use `--use-localhost` to skip the
tunnel; `--tunnel-url <https-origin> --port <port>` uses your own. Preview
in Studio with `octonodes login` followed by
`octonodes app dev --workspace user:<id>`.
Octonode colors are enabled automatically in interactive terminals.
Redirected output stays plain for scripts.
For extension-only projects, edit `octonode.app.json` and `src/extensions/assistant.tsx`.
Local preview supplies read-only context and starts actions from an explicit Run button;
commands requiring native resources need Studio preview or an installed app.

```sh
octonodes app extension add overview --target app.page
octonodes app publish --workspace user:<id>
```

The default app opens its hosted page inside Studio. The command above adds an optional app-page contribution.
Install through Studio → Apps; the extension starter adds a navbar button that opens
its panel. A declared workspace block appears on workspace home; page-capable apps open from Apps. An administrator can
configure or disable an installation. The first publication returns the app ID
and revision. Increment the source version and publish an update with
`--app-id <id> --revision <current-revision>`; existing installs remain pinned
until their administrator approves an update.

Full apps include a connected backend. Set `web.applicationUrl` in `octonode.app.json` to a permanent HTTPS
origin, add only necessary `web.requestedActions`, and run `npm test`. The CLI
publishes release metadata; deploy `dist/web/<app-id>` to a Node 24
host yourself, set `OCTONODE_APP_ID` and `OCTONODE_API_URL`, and run
`node start.cjs`. Keep prior content-hashed assets for pinned installations.
The [Playbook app guide](https://playbook.octonodes.com/docs/apps) covers the
project file, SDKs, hosting, consent, publishing and updates.

Choose the web platform (Vite is the default):

```sh
octonodes app create my-app                     # Vite
octonodes app create my-vite-app --platform vite
octonodes app create my-next-app --platform next
octonodes app create my-plain-app --platform plain
```

Vite and Next.js create a full app with a real framework page in `src/web/App.tsx`,
verified workspace content, a Projects route registered in Studio, and the verified `/api/context` and `/api/projects` backend routes. The CLI
builds Vite or a Next.js static export into the same verified web artifact and
serves it through the development tunnel. Next.js server features are outside
this static export; add backend routes in `src/server.ts`.
Plain uses `src/welcome.html`, `src/hosted.ts`, and the same backend without Vite or Next.js.

Generated workspaces include `installConfig.hoistingLimits: workspaces` for Yarn 4.
The hosted SDK keeps normal browser history and mirrors embedded routes into Studio’s
`appPath` query parameter. Development starts with no grants; approve temporary,
selected-project access in Studio to load project data. See the
[Apps development guide](https://playbook.octonodes.com/docs/apps/development).

## Create and publish plugins

```sh
octonodes plugin create my-integrations
cd my-integrations
npm install
npm test
octonodes plugin validate dist/plugins/my-integrations
```

Define one plugin in `octonode.plugin.ts` using `@octonodes/sdk/plugin`.
`octonodes plugin nodes` generates typed handles in `octonode.nodes.ts`; add
`--check` to detect drift. `octonodes plugin build` regenerates local handles,
type-checks definitions, and creates `dist/plugins/<id>`. `octonodes plugin test <directory> <node-id> --input
'{...}'` invokes a built node and reports failures with a nonzero exit code.

The scaffold includes `octonode.plugin.json`. Set `scope: "public"` in that release
file for community discovery; use `"user"` for a private plugin, `"team"` with
`teamId`, or `"organization"` with `orgId`. The release file overrides version,
scope, and optional contributors from `octonode.plugin.ts` during builds.

```sh
octonodes login
octonodes plugin version patch
octonodes plugin deploy .
```

SDK/CLI `0.2.0` adds these release commands. Deployment builds, validates, hashes,
and uploads to `https://plugins.octonodes.com` using your saved Octonode login.
Use `OCTONODE_MARKETPLACE_URL` or `--registry` to override the registry. Publishing
never publishes your plugin to npm; existing versions cannot be overwritten.

For automatic publication, connect your repository and release-file path in
**Partner → GitHub publishing**, review its destination, and commit the downloaded
workflow. A version bump merged to the default branch runs `plugin deploy . --github`
with GitHub Actions identity; no marketplace secret is required. See
[release-file setup](../sdk/PLUGINS.md#release-files-and-github-publishing).

Existing built artifacts can still use `plugin publish dist/plugins/my-integrations`.
For definitions without a release file, set `scope: ["public"]` in TypeScript and
rebuild first. Artifact publication accepts `--org` and `--team`; the optional
`OCTONODE_MARKETPLACE_TOKEN` overrides normal CLI authentication.

## Sign in

The default login opens GitHub authentication in your browser and signs in as the same user as
Octonode Studio:

```sh
octonodes login
```

If the browser cannot open, visit the URL printed by the command. The CLI receives the result on a
temporary loopback callback, stores the refreshable session in `~/.octonode/session.json`, and
refreshes expired access tokens automatically.

For terminal-only login, request an email code:

```sh
octonodes login --email you@example.com
```

You can also save an existing personal, service, public, or agent API token:

```sh
octonodes login --token octo_pat_...
```

For CI and temporary shell sessions, set `OCTONODE_TOKEN` instead of saving a login:

```sh
export OCTONODE_TOKEN=octo_svc_...
octonodes projects api get
```

Authentication is resolved in this order: `OCTONODE_TOKEN`, a saved API token, then a saved Studio
session.

## Connect an AI client

Use `octonodes connect <codex|claude|cursor> --workspace org:WORKSPACE_ID --project PROJECT_ID`
to print scoped MCP configuration. Repeat `--project` for multiple projects and optionally pass
`--worktree`. Codex uses the saved CLI login; Claude and Cursor need `OCTONODE_TOKEN` in their
environment. Configuration generation does not install it. See the shared
[agent plugin](../../octonode-plugin/README.md) for setup and plugin operation skills.

## Find operations

List every operation or filter by name:

```sh
octonodes operations
octonodes operations projects
octonodes operations workflows
```

Operation commands follow the SDK property path and HTTP method. For example,
`GET /api/projects/{projectId}` becomes `projects api projectId get`. Run
`octonodes projects --help` or `octonodes projects api --help` to browse each level. Use the
[API reference](https://octonodes.com/api/docs) to find endpoints and their parameters.

## Call the API

Pass path parameters, query parameters, and request bodies together as JSON through `--input`:

```sh
# List projects
octonodes projects api get

# Read one project
octonodes projects api projectId get \
  --input '{"path":{"projectId":"project_123"}}'

# List runs with query parameters
octonodes runs api get \
  --input '{"query":{"workflowId":"daily-report","limit":20}}'

# Search project knowledge
octonodes knowledge api search post \
  --input '{"query":{"workspace":"acme","project":"support"},"body":{"query":"refund policy","topK":5}}'

# Cancel an execution
octonodes executions api runId cancel post \
  --input '{"path":{"runId":"run_123"}}'
```

Normal responses are printed as formatted JSON. Server-sent event operations print one JSON value
per line, which works well with `jq` and shell pipelines:

```sh
octonodes workflows api workflowId run post \
  --input '{"path":{"workflowId":"daily-report"},"body":{"input":{"date":"2026-09-18"}}}' \
  | jq -c .
```

Run `octonodes <resource> <command> --help` for the accepted flags. The exact input shape for each operation
is defined by the exported TypeScript types in `@octonodes/sdk`. For workflow behavior and setup,
see the [Playbook documentation](https://playbook.octonodes.com/docs); for shared examples, browse
the [Octonode community](https://community.octonodes.com/community).

## Configuration

| Variable | Purpose |
| --- | --- |
| `OCTONODE_TOKEN` | Overrides every saved login. |
| `OCTONODE_URL` | Overrides `https://api.octonode.dev`. |
| `OCTONODE_CONFIG_DIR` | Overrides the default `~/.octonode` directory. |

Use `--base-url <url>` to override the API URL for one login or API command:

```sh
octonodes projects api get --base-url http://localhost:4000
```

## Log out

```sh
octonodes logout
```

Logout revokes a saved Studio refresh session and removes saved CLI credentials. Static API tokens
must still be revoked in Studio. The command cannot unset `OCTONODE_TOKEN` from your shell.

Saved files and their parent directory use user-only permissions. Keep service and personal tokens
out of shell history, logs, and source control.

## Documentation

- [API reference](https://octonodes.com/api/docs)
- [Playbook documentation](https://playbook.octonodes.com/docs)
- [Octonode community](https://community.octonodes.com/community)

## SDK

Use [`@octonodes/sdk`](https://www.npmjs.com/package/@octonodes/sdk) for typed application code and
direct access to the same API operations.
