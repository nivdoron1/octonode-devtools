# Changelog

## [0.2.40] - Unreleased candidate

### Added

- Declare independent `read:project` and `write:project` app scopes for explicitly selected projects.
- Opt into project-file consent with `octonodes app create <name> --project-access read|write`; ordinary apps request no new scopes.
- Carry both scopes in generated SDK app contracts and UI-extension grant types.
- Inspect the verified Studio user and personal workspace with `octonodes whoami`; login also prints the workspace.

### Changed

- Start new full apps with an animated Workspace overview, project navigation, responsive light/dark styling, and reduced-motion support. Vite and Next.js emit React JSX; the plain starter emits the same design as HTML.

### Fixed

- Render the Next.js starter through a page wrapper so optional app props pass the framework’s production page checks.
- Keep plain starter content hidden until workspace verification succeeds, cancel stale requests, and hide content on session expiry.
- Exclude unused private engine exports from the packaged plugin lifecycle.

These scopes prepare the contract for a later isolated execution environment. This
release does not provision a sandbox or add project-file/process APIs.

## [0.2.39] - Unreleased candidate

### Added

- Read project agent instructions through the generated SDK/CLI and scoped hosted MCP tool `project_instructions`.
- Discover the existing Octonode client plugin through Claude and Codex repository marketplace catalogs.
- Verify every generated CLI HTTP operation and final packed consumers before npm publication.

### Changed

- Align the public contract with engine main: capabilities use the version 2 client feature projection; workspace responses use compact access controls instead of per-team permission maps. Consumers using the former response types must update their access/capability handling.
- Include project-scoped search, conversation session scope, conditional notification requests, project dependency exports and Python runtime metadata in generated SDK types.

### Fixed

- Remove the internal Sandbox project catalog from the public SDK/CLI contract; project search and store listings remain available.
- Route public SDK/CLI and default hosted MCP requests to the Studio API gateway at `https://octonodes.com`; the control-plane origin does not serve generated `/api/*` operations.
- Install and import plugin libraries whose default UUID alias begins with a digit.
- Declare the CLI's TypeScript and Zod 3 runtime dependencies so fresh consumer plugin operations work without workspace hoisting.

## [0.2.38] - 2026-10-09

### Added

- Rename and delete project files through hosted MCP with exact revision checks and the selected project and worktree scope.

### Fixed

- Create and write empty text files through project authoring tools.
- Keep the public SDK and bundled MCP skill references aligned with the project file API.

## [0.2.37] - 2026-10-09

### Changed

- Sync the SDK with support attachment domains and the latest work-item limits.

### Fixed

- Restore toolkit plugins using their destination workspace for access checks and downloads.
- Keep merge checks stable across the Linux, macOS and Windows runtime matrix.
- Preserve the documented Node 20.19+ and 22.12+ support for app servers.

## [0.2.36] - 2026-10-04

### Fixed

- Install the npm CLI/SDK, parse plugin source, and build generated apps/plugins on Node 20.19+, 22.12+ and newer; see the [runtime requirements](README.md#prerequisites).
- Sign in and refresh CLI sessions on Node 20 without a WebSocket global by using the Supabase Auth client directly.

### For contributors

- Run consumer tests and strict-engine installation of public tarballs across Node 20, 22 and 24 on Linux, macOS and Windows; keep generation and installer packaging on Node 24.

## [0.2.28] - 2026-10-03

### Fixed

- Sign in with `octonodes login --email` without a base URL override by loading login configuration from Studio.

## [Unreleased]

### Added

- Prepare verified CLI installation artifacts for Homebrew, WinGet, Scoop, Chocolatey,
  DEB/APT, RPM/DNF, Arch/AUR, Snap, Docker and direct macOS/Linux/Windows installation.
- Add PR release controls restricted to the repository owner's account and exact merged main commit.

### Changed

- Publish npm packages only on an explicit owner request; pushes and merges no longer publish.

## [0.2.18] - 2026-09-30

### Fixed

- Replace plain hosted-app access messages with a responsive landing screen for standalone, expired, connecting, and verification-error states, translated into all five supported languages.
- Register Overview and Projects in the generated React app sidebar and provide an optional top navbar through `<App showNavbar />`.
- Recover verified app content after a refreshed session succeeds and keep the public React entry point importable in Node.

## [0.2.17] - 2026-09-30

### Added

- Bind data tables to a workspace or project for typed row CRUD, pagination, and read-only SQL.
- Verify hosted React app workspace sessions before rendering content and register navigation in Studio.

### Changed

- Generate React apps with verified workspace content and a Projects route.

## [0.2.15] - 2026-09-29

### Changed

- Browse SDK API operations with space-separated commands and help at each level; dotted paths remain supported.

## [0.2.14] - 2026-09-29

### Added

- Generate a full app with one hosted page, sample project rows, and browser routes; contributions can be added explicitly.
- Connect hosted pages to Studio sessions and route history through the UI extensions SDK.
- Reload the development page after a successful source rebuild while preserving the page across ordinary heartbeats.

### Changed

- Generate Yarn workspace settings that install and build cleanly in a monorepo.
- Keep requested actions in development manifests so Studio can request explicit, temporary consent.

### Fixed

- Use the Studio gateway for app development and publishing commands.
- Serve the app shell for HTML deep links while retaining normal API and asset 404 responses.
- Preserve authorization and upstream errors in generated app backends.

## [0.2.13] - 2026-09-28

### Changed

- Use the public Cloudflare Quick Tunnel for app development while branded preview TLS is deferred.

## [0.2.11] - 2026-09-28

### Added

- Create full Vite apps by default, with explicit Vite, Next.js, plain HTML, and extension-only scaffolds.
- Generate an Octonode welcome page and bundle static web output with the verified app backend and extensions.
- Show branded, colored progress, tunnel links, and login status in interactive terminals.

### Changed

- Point the default Studio development preview at `https://octonodes.com`.
- Document how Octonode app creation and configuration compare with Shopify CLI.

## [0.2.0] - 2026-09-26

### Added

- Define plugin releases with `plugin.octonode.json` or YAML and bump exact, patch, minor, or major versions from the CLI.
- Deploy plugins using the saved Octonode login or a connected GitHub Actions workflow with short-lived authentication.
- Publish to personal, team, organization, or public destinations with optional contributor metadata.

### Changed

- Default plugin publishing to `https://plugins.octonodes.com` and verify deterministic bundle hashes during deployment.

## Unreleased

### Added

- Explicit plugin-owned or upstream npm source authority, with exact package/version validation.
- Runtime SDK client factory bindings from declared connection fields, hidden client inputs, and sanitized SDK errors.
- Original npm subpath identities in generated adapters and typed node icon inheritance documentation.

## [0.1.13] - 2026-09-25

### Added

- Package Octonode connection, authoring, and plugin management skills together for Claude Code, Codex, Cursor, and compatible hosts, with focused linked references for all hosted MCP operations.
- Generate scoped Cursor MCP configuration with `octonodes connect cursor`.

### Changed

- Configure authenticated MCP connections in each client separately from the portable skill bundle.

## [0.1.0] - Unreleased

### Added

- Connect MCP clients to the hosted Octonode authoring and collaboration tools through the
  stateless Cloudflare Worker at `mcp.octonode.dev`.
- Generate typed node inventories in `octonode.nodes.ts` for local source, npm imports, and workflow exports.
- Configure local node presentation through optional `octonode.config.ts`.
- Define each artifact in root `octonode.plugin.ts`, then build the immutable YAML artifact.
- Preserve typed npm and plugin customizations across regeneration, and verify generated workflow runtime inputs at build time.

### Changed

- Use one root plugin definition instead of `plugins/**/*.plugin.ts` files.

## [0.0.3] - 2026-09-15

### Added

- Use the public Octonode API from TypeScript through a generated, typed `OctonodeClient`.
- Authenticate and call every public SDK operation from the `octonodes` command, including SSE streams as JSON Lines.
- Sign Studio users in through GitHub browser PKCE or terminal email verification, with refreshable local sessions and logout.
- Regenerate and publish both npm packages through GitHub Actions while keeping package contents limited to compiled output.
