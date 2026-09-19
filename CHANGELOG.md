# Changelog

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
