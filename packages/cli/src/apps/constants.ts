export const APP_SOURCE = "octonode.app.json";
export const APP_HELP = `Usage:
  octonodes app create <name> [--template extension|full]
  octonodes app extension add <id> --target workspace.block|app.page [--cwd <directory>]
  octonodes app dev [directory] [--use-localhost | --tunnel-url <https-origin>] [--port <port>] [--no-open] [--workspace kind:id]
  octonodes app build [directory] [--app-url <https-origin>]
  octonodes app serve [directory] [--port <port>]
  octonodes app publish [directory] --workspace kind:id [--app-id <id> --revision <n>]
  octonodes app validate <artifact-directory>

Create defaults to a workspace block. Build compiles declared browser entries and generates
release hashes in dist/apps/<id>. Existing projects are never overwritten. No login is needed.
app dev automatically downloads and caches its tunnel helper. No Cloudflare account or install is needed. --workspace opens an expiring Studio preview after login.
app publish creates an immutable release; full apps must deploy their backend separately.
Installation requires Studio consent.
`;

// Pinned official release: https://github.com/cloudflare/cloudflared/releases/tag/2026.9.3
export const CLOUDFLARED_VERSION = "2026.9.3";
export const CLOUDFLARED_ASSETS: Record<string, import("./types").CloudflaredAsset> = {
  "darwin-x64": {
    file: "cloudflared-darwin-amd64.tgz",
    sha256: "d1155d0837487f261183b15c1eab6c4ebcad9dc49b94675f1524c3564cea3977",
    binarySha256: "ab588b3b4db9cdb4476c30a3db2a72635b1d8327d44741fee6799a0f37b0ec07",
  },
  "darwin-arm64": {
    file: "cloudflared-darwin-arm64.tgz",
    sha256: "587c2cfb1c230fe36c7fa7727da78be459dae028cabe8c001291999350f07095",
    binarySha256: "5472c1a01c84bc31b3021056a73b4e5774ddddefc572124ea8fdf6c340639f32",
  },
  "linux-x64": {
    file: "cloudflared-linux-amd64",
    sha256: "77e26d8d900e0b8469f416239d14b5f296525fdf79fee6f511ef55609e3fbac2",
  },
  "linux-arm64": {
    file: "cloudflared-linux-arm64",
    sha256: "aaeb2d7d0da3614634c7e03ab13487a1522c2e79165ed2929cfe23d5e95b326d",
  },
  "win32-x64": {
    file: "cloudflared-windows-amd64.exe",
    sha256: "f096265ec2fcbe9bb6e2d64268db167ced3fcbb83d894bdb9e2fcdb26f2ea7e2",
  },
};
