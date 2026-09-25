# Changelog

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
