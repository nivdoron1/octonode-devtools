# CLI installation infrastructure

This is for `@octonodes/cli` and its `octonodes` command, as described in agent
`01a10086-2ca2-7a43-bafc-0318d9e72e9b`. It is independent of the Octonode desktop app.
Package-manager listings, download hosting, repositories, and registry submissions
are operator publication steps. This change creates none of them.

## Node runtime compatibility

The npm CLI and SDK support Node 20.19+, 22.12+, and newer
(`^20.19.0 || >=22.12.0`), including plugin source parsing and app/plugin builds.
Node 22.12 or newer is recommended for new projects. The contributor toolchain,
OpenAPI generation and installer packaging use Node 24. CI installs public
package tarballs with `--engine-strict` and exercises them on all three runtime
versions on Linux, macOS and Windows. External project dependencies may require
a newer Node version.

## Channels

| Channel | Prepared artifact | Publication destination |
| --- | --- | --- |
| npm / npx | Existing public npm packages and publishing workflow | npm; existing `publish.yml` |
| Yarn / pnpm / Bun | The same npm package | No separate registry or package is needed |
| Homebrew, macOS and Linux | `Formula/octonodes.rb` using the verified npm tarball | `nivdoron1/homebrew-tap`, or your chosen public tap |
| WinGet, Windows x64 | MSI and three versioned manifests | `microsoft/winget-pkgs`, after native installer qualification |
| Scoop, Windows x64 | Portable ZIP and `scoop/bucket/octonodes.json` | Your public Scoop bucket |
| Chocolatey, Windows x64 | NuSpec, install/uninstall scripts, verified portable ZIP | Your feed or the Chocolatey community repository |
| Debian / Ubuntu, x64 and arm64 | `.deb`, package pool and APT indexes/Release | Download host or your signed APT repository |
| Fedora / RHEL, x64 and arm64 | `.rpm` and DNF `repodata/` | Download host or your signed DNF repository |
| Arch, x64 and arm64 | `arch/PKGBUILD` for `octonodes-bin` | AUR, after `makepkg` qualification |
| Snap, x64 and arm64 | `snap/snapcraft.yaml` | Snap Store, after building and obtaining classic-confinement approval |
| Docker | `docker/Dockerfile` and the verified npm tarball | Your container registry, after building and testing |
| Direct, macOS and Linux x64/arm64 | Checksummed portable archives and `install.sh` | Your HTTPS download host |
| Direct, Windows x64 | Checksummed portable ZIP and `install.ps1` | Your HTTPS download host |

Portable packages, MSI, DEB, RPM, Scoop and Chocolatey include their own Node 24
runtime and the CLI's production dependencies. Native dependencies such as esbuild
are installed and exercised on the target OS/architecture. Homebrew installs
`node@24`; its wrapper selects that runtime even if another Node version is on PATH.
App and plugin projects still need their own project dependencies and package
manager. Installing the CLI does not install Git or a global npm toolchain.

macOS bundles target the Node 24 baseline of macOS 13.5+. Linux bundles target
glibc 2.28+ and libstdc++; Alpine/musl and 32-bit machines are outside this build
matrix. Windows packages target x64 Windows 10 or later. Other Windows
architectures are not advertised. Flatpak and GUI app stores would package the
desktop application and are outside this CLI's distribution infrastructure.

## Prepare a release without publishing

Publishing is an explicit owner action. No merge, push, tag, or installer build publishes npm.
The repository's `publish.yml` is currently disabled in GitHub. After merging this change,
enable it in **Actions → Publish npm packages → Enable workflow** when you want to use it.
Enabling it will not publish anything; it now accepts manual requests only. Keep the trusted
publisher configuration for all three npm packages pointed at `publish.yml` and `npm-publish`.
The publish job uses OIDC and automatically generated npm provenance, without stored npm tokens.
See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

The **Octonodes CLI releases** comment appears on PRs once the panel workflow is on main.
Its controls become available only after merging into main, while that merge commit is still
the current main commit:

1. Check **Publish npm packages** to run verification and publish missing stable workspace
   versions in dependency order. Already-published versions are skipped without changing them.
2. Wait for publishing to succeed, then check **Prepare installer artifacts**. It uses the
   CLI version at that merged commit, downloads that exact npm release, and plans download URLs
   under `https://github.com/nivdoron1/octonode-devtools/releases/download/cli-v<VERSION>`.
3. Follow the run link for status and artifacts, then publish your chosen channels manually.

Requests and re-runs are restricted to GitHub account ID `102235711` (`nivdoron1`). Other
accounts' checkbox edits cannot authorize either action. GitHub public-repository comments
cannot be visible only to one account; the panel and workflow results remain public.
GitHub may require enabling `pull_request_target` under repository Actions policies for the panel;
manual **Run workflow** remains available independently. No PR code runs in the panel job.
If main has moved, use Run workflow with the new exact main SHA. A stale SHA is rejected,
never silently replaced. Package versions are never bumped by these workflows.

After merging the infrastructure, select **Actions → Prepare CLI installation
packages → Run workflow**. Supply:

- `sha`: the exact current main commit SHA (40 characters), selecting main in the branch picker.
- `version`: an exact stable CLI version that already exists on npm, such as
  `0.2.16`. This is explicit; the workflow never substitutes `latest`, changes a
  package version, or publishes an unpublished local package.
- `asset_base_url`: the planned immutable HTTPS directory, for example
  `https://github.com/nivdoron1/octonode-devtools/releases/download/cli-v0.2.16`.
  The host must be publicly accessible when you publish; private GitHub releases
  will not work as package-manager download URLs.

The workflow downloads the owned npm tarball once, verifies npm SHA-512 integrity,
and builds on five native runners: macOS arm64/x64, Linux arm64/x64, Windows x64.
Every runner uses the same resolved Node 24 patch version. Linux builds DEB/RPM;
Windows builds an MSI using pinned WiX 6.0.2. Package construction does not need
this checkout's workspace dependencies, an npm publishing token, signing secrets,
or a package-manager account.

Build checks exercise the CLI version/help and esbuild. Linux jobs install and
remove the DEB, then install and remove the RPM in Fedora. Windows checks MSI
installation, version, PATH registration and removal. The final job verifies all
asset hashes and rejects missing targets, version drift, npm checksum drift,
mixed Node patches, duplicate targets and unsafe filenames before generating
`installation-review-bundle`.

The final job also builds APT and DNF repository snapshots under `repositories/`.
Their metadata is generated locally and awaits operator signing and hosting.

Download that Actions artifact to review everything. `distribution.json` records
the source npm integrity, Node version, target, URL and SHA-256 of every native
artifact. `assets/SHA256SUMS` covers the files intended for hosting. This workflow
has read-only repository permissions, owner-authorized manual requests and artifact uploads; it cannot push
releases, taps, containers or registry submissions. The separate npm workflow publishes
only when you explicitly request it.

For Homebrew alone, prepare a formula locally using Node 24:

```sh
mkdir -p artifacts
node scripts/distribution/source.mjs 0.2.16 artifacts/source-0.2.16
node scripts/distribution/manifests.mjs formula artifacts/source-0.2.16 artifacts/tap-0.2.16
ruby -c artifacts/tap-0.2.16/Formula/octonodes.rb
```

For a native portable bundle, on the matching OS/architecture:

```sh
node scripts/distribution/bundle.mjs artifacts/source-0.2.16 artifacts/bundle-0.2.16
# Linux only, with dpkg-deb and rpmbuild installed:
node scripts/distribution/linux.mjs artifacts/bundle-0.2.16
```

Windows additionally needs .NET and `dotnet tool install --global wix --version 6.0.2`.
Use an official Node 24 distribution containing npm; packaging deliberately refuses
other Node major versions. Output directories must be new; remove a failed build's
output or choose a new directory before retrying. Release source preparation makes
no changes to this repository's public package versions.

After obtaining all five native bundle directories, generate a complete local
review bundle:

```sh
node scripts/distribution/manifests.mjs all artifacts/source-0.2.16 artifacts/review-0.2.16 \
  https://downloads.example.com/cli/0.2.16 \
  artifacts/darwin-arm64 artifacts/darwin-x64 \
  artifacts/linux-arm64 artifacts/linux-x64 artifacts/win32-x64
```

## Operator publication

1. Publish the matching SDK, UI extensions and CLI to npm using the existing
   release procedure, if they are not already published.
2. Run preparation against that exact version. Review the artifact and perform
   native app/plugin creation and build smoke tests, including paths with spaces.
   Inspect the bundled dependencies and licenses. Rebuild for Node security updates;
   native packages carry their own runtime and do not inherit system Node updates.
3. Sign and qualify customer-facing native installers as appropriate. The generated
   MSI is unsigned. If you sign or otherwise modify any artifact, update its hash
   in the corresponding `bundle.json` and regenerate all manifests and checksums
   from those final bytes before submission. This infrastructure does not configure
   code signing, Apple notarization, repository signing keys or publisher accounts.
4. Upload the exact files in `assets/` and the direct installer scripts to the planned
   immutable asset directory. Verify public-download hashes. Retain old versions;
   do not replace files under an already-submitted version URL.
5. Copy `Formula/` into your tap and run `brew audit --strict`, `brew install
   --build-from-source <owner>/tap/octonodes` and `brew test <owner>/tap/octonodes`
   on macOS and Linux. Test a sample `octonodes app build` with the installed command.
   [Homebrew Node packaging](https://docs.brew.sh/Language-Specific-Formulae) and
   [tap setup](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap) describe the upstream requirements.
6. Copy `scoop/bucket/` into your Scoop repository and test install, upgrade and
   uninstall. Run `choco pack` in `chocolatey/`, test the local `.nupkg`, then submit
   it to your feed. [Scoop manifests](https://github.com/ScoopInstaller/Scoop/wiki/App-Manifests)
   and [Chocolatey ZIP packaging](https://docs.chocolatey.org/en-us/create/functions/install-chocolateyzippackage/)
   document these formats.
7. Run `winget validate --manifest <version-directory>` against the three generated
   WinGet files and test `winget install --manifest <version-directory>`. Submit
   `winget/manifests/` through a reviewed PR after the MSI is public and qualified.
   [WinGet manifest requirements](https://learn.microsoft.com/en-us/windows/package-manager/package/manifest)
   apply; generation is not community acceptance.
8. DEB/RPM files support direct `apt install ./file.deb` and `dnf install ./file.rpm`.
   To offer installation by name, sign and host the prepared APT/DNF snapshots;
   see the procedure below. Publishing host configuration and signing keys belong
   to the operator.
9. Qualify the PKGBUILD with `makepkg --cleanbuild`, create its `.SRCINFO` with
   `makepkg --printsrcinfo`, and submit to AUR. Build the Snap recipe with Snapcraft
   8+ and obtain approval for classic confinement, which is needed for arbitrary
   app/project access. [Snap packaging](https://ubuntu.com/docs/snapcraft/8/common/craft-parts/reference/plugins/dump_plugin/)
   and [classic confinement](https://snapcraft.io/docs/reference/administration/reviewing-classic-confinement-snaps/)
   describe those requirements. Snap and AUR recipes are generated here but require
   their own native qualification before publication.
10. Build `docker/` with `docker buildx build --platform linux/amd64,linux/arm64 ...`
    and test before pushing. The image uses the same verified npm tarball and
    installs platform-specific dependencies within each build. Pin the base image
    digest for your publication if you require byte-for-byte build reproducibility.

Example future customer commands, after you have published those channels:

```sh
brew install nivdoron1/tap/octonodes
winget install --id Octonode.CLI --exact
scoop bucket add octonode https://github.com/<owner>/<bucket>
scoop install octonode/octonodes
choco install octonodes
npm install --global @octonodes/cli
pnpm add --global @octonodes/cli
yarn global add @octonodes/cli # Yarn Classic; Yarn 4 uses yarn dlx for one-off runs
bun add --global @octonodes/cli
npx --yes @octonodes/cli@latest --help
```

For direct installers, download and inspect the script before running it. Unix
installation uses `~/.local/share/octonodes/<version>-<target>` and a managed link
in `~/.local/bin`; set `OCTONODES_INSTALL_DIR` / `OCTONODES_BIN_DIR` to change those
locations. The installer only replaces its own managed link. Windows installation
uses `%LOCALAPPDATA%\Octonodes\<version>-win32-x64` and adds that version's `bin`
directory to the current user's PATH; set `OCTONODES_INSTALL_DIR` to change it.
Same-version installation refuses to overwrite an existing version directory.
To uninstall a direct installation, remove its command link/PATH entry and its
version directory. Login credentials under `~/.octonode` are separate and retained.

## APT and DNF repositories

The review bundle contains `repositories/apt/pool/`, per-architecture package indexes,
`repositories/apt/dists/stable/Release`, and `repositories/rpm/repodata/`.
Install `apt-utils`, `dpkg-dev` and `createrepo-c` to regenerate a local snapshot:

```sh
node scripts/distribution/repository.mjs artifacts/review artifacts/repositories
```

Use your release signing key to sign RPM packages first if you require package
signatures (`rpmsign --addsign <file.rpm>`), then update bundle hashes and regenerate
the review/repository metadata. Sign the final repository metadata:

```sh
gpg --local-user "$RELEASE_KEY" --clearsign \
  --output repositories/apt/dists/stable/InRelease repositories/apt/dists/stable/Release
gpg --local-user "$RELEASE_KEY" --armor --detach-sign \
  --output repositories/apt/dists/stable/Release.gpg repositories/apt/dists/stable/Release
gpg --local-user "$RELEASE_KEY" --armor --detach-sign repositories/rpm/repodata/repomd.xml
gpg --export "$RELEASE_KEY" > octonodes-archive-keyring.gpg
gpg --armor --export "$RELEASE_KEY" > octonodes-repository.asc
```

Upload the complete APT and RPM directories and public keys to your chosen package
host. Publish APT metadata last, with short cache lifetimes for `InRelease`, `Release`
and package indexes; publish RPM `repomd.xml` and its signature last. Package files
remain immutable. The prepared snapshot includes this release only; retain prior
packages in your operator-owned repository pool and regenerate metadata over that
pool when promoting later releases. Test with a client using your scoped signing key
before advertising the repository. Do not disable signature checks to activate it.

After installing the public key as `/etc/apt/keyrings/octonodes.gpg`, a customer APT
source would use `deb [signed-by=/etc/apt/keyrings/octonodes.gpg] <public-apt-url> stable main`.
DNF uses your public RPM URL as `baseurl`, your public ASCII-armored key as `gpgkey`,
and `gpgcheck=1` / `repo_gpgcheck=1` after signing the packages and repository metadata.
No signing keys or repository credentials are included in generated artifacts.

## Verification

```sh
yarn check
node --test tests/distribution.test.mjs
```

The tests verify source integrity, unsafe input rejection, all manifest outputs,
cross-platform/version/runtime matching, checksum validation, and Unix direct
installation success/tampering without network access. Native package qualification
is provided by the manually dispatched preparation workflow. Homebrew, WinGet,
Scoop, Chocolatey, AUR, Snap and container release checks remain operator steps.
