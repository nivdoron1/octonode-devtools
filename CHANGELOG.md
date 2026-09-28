# Changelog

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
