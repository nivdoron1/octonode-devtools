import { OCTONODE_MCP_URL } from "@octonodes/sdk";
import { accessToken } from "./auth.js";

export const CONNECT_HELP = `Usage:
  octonodes connect codex --workspace <kind:id> --project <id> [--project <id>] [--worktree <id>]
  octonodes connect claude --workspace <kind:id> --project <id> [--project <id>] [--worktree <id>]
  octonodes connect cursor --workspace <kind:id> --project <id> [--project <id>] [--worktree <id>]
  octonodes connect headers --workspace <kind:id> --project <id> [--project <id>] [--worktree <id>]

"codex" prints config.toml and uses your saved "octonodes login" or OCTONODE_TOKEN.
"claude" prints a claude mcp command; "cursor" prints .cursor/mcp.json.
For Claude and Cursor, set OCTONODE_TOKEN in the client's environment before starting it.
"headers" is the credential helper used by Codex. Configuration is printed, never installed.
`;

interface Scope {
  workspace: string;
  projects: string[];
  worktree?: string;
}

function parseScope(args: string[]): Scope {
  const values = new Map<string, string[]>();
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--workspace", "--project", "--worktree"].includes(name) || !value?.trim()) {
      throw new Error(`invalid connect option near "${name ?? ""}"`);
    }
    values.set(name, [...(values.get(name) ?? []), value]);
  }

  const workspace = values.get("--workspace")?.[0];
  const projects = values.get("--project") ?? [];
  const worktrees = values.get("--worktree") ?? [];
  if (!workspace || projects.length === 0) throw new Error("--workspace and at least one --project are required");
  if ((values.get("--workspace")?.length ?? 0) > 1 || worktrees.length > 1) {
    throw new Error("--workspace and --worktree may be provided only once");
  }
  if (!/^(?:user|org|team):[A-Za-z0-9_.-]{1,128}$/.test(workspace)) {
    throw new Error('--workspace must use "user:<id>", "org:<id>", or "team:<id>"');
  }
  const safe = /^[A-Za-z0-9_./:-]{1,160}$/;
  for (const value of [workspace, ...projects, ...worktrees]) {
    if (!safe.test(value)) throw new Error(`invalid scope value "${value}"`);
  }
  return { workspace, projects: [...new Set(projects)], ...(worktrees[0] ? { worktree: worktrees[0] } : {}) };
}

function scopeHeaders(scope: Scope, token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "x-octonode-workspace": scope.workspace,
    "x-octonode-project": scope.projects[0],
    "x-octonode-projects": JSON.stringify(scope.projects),
    ...(scope.worktree ? { "x-octonode-worktree": scope.worktree } : {}),
  };
}

function helperCommand(scope: Scope): string {
  return [
    "octonodes connect headers",
    `--workspace ${scope.workspace}`,
    ...scope.projects.map((project) => `--project ${project}`),
    ...(scope.worktree ? [`--worktree ${scope.worktree}`] : []),
  ].join(" ");
}

export async function connectCommand(args: string[]): Promise<string> {
  const target = args[0];
  if (!target || target === "--help" || target === "-h") return CONNECT_HELP;
  if (!["codex", "claude", "cursor", "headers"].includes(target)) {
    throw new Error(`unknown connect target "${target}"; use codex, claude, cursor, or headers`);
  }
  const scope = parseScope(args.slice(1));

  if (target === "codex") {
    return `[mcp_servers.octonode]\nurl = ${JSON.stringify(OCTONODE_MCP_URL)}\nhttp_headers_helper = ${JSON.stringify(helperCommand(scope))}\n`;
  }
  if (target === "claude") {
    const headers = scopeHeaders(scope, "${OCTONODE_TOKEN}");
    const config = JSON.stringify({ type: "http", url: OCTONODE_MCP_URL, headers });
    return `claude mcp add-json --scope user octonode '${config}'\n`;
  }
  if (target === "cursor") {
    const headers = scopeHeaders(scope, "${env:OCTONODE_TOKEN}");
    return `${JSON.stringify({ mcpServers: { octonode: { url: OCTONODE_MCP_URL, headers } } }, null, 2)}\n`;
  }
  if (target === "headers") {
    const token = await accessToken();
    if (!token) throw new Error('run "octonodes login" or set OCTONODE_TOKEN');
    return `${JSON.stringify(scopeHeaders(scope, token))}\n`;
  }
  throw new Error("unreachable connect target");
}
