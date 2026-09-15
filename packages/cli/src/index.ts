#!/usr/bin/env node
import { createClient, OCTONODE_API_URL, OctonodeClient } from "@octonodes/sdk";
import { accessToken, login, logout } from "./auth";

const VERSION = (require("../package.json") as { version: string }).version;
const argv = process.argv.slice(2);
const command = argv[0];
const helpRequested = argv.some((value) => value === "-h" || value === "--h" || value === "--help");

function listOperations(target: object, path: string[] = []): string[] {
  const operations: string[] = [];
  for (let prototype = Object.getPrototypeOf(target); prototype && prototype !== Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (name === "constructor") continue;
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (descriptor?.get) operations.push(...listOperations(descriptor.get.call(target), [...path, name]));
      else if (typeof descriptor?.value === "function" && /^(delete|get|head|options|patch|post|put|trace)$/.test(name)) {
        operations.push([...path, name].join("."));
      }
    }
  }
  return operations;
}

function resolveOperation(target: object, path: string): ((input: Record<string, unknown>) => Promise<unknown>) | undefined {
  const segments = path.split(".");
  let owner = target as Record<string, unknown>;
  for (const segment of segments.slice(0, -1)) {
    const next = owner[segment];
    if (!next || typeof next !== "object") return undefined;
    owner = next as Record<string, unknown>;
  }
  const operation = owner[segments.at(-1)!];
  return typeof operation === "function" ? operation.bind(owner) : undefined;
}

function isEventStream(value: unknown): value is { stream: AsyncIterable<unknown> } {
  if (!value || typeof value !== "object") return false;
  const stream = (value as { stream?: unknown }).stream;
  return !!stream && typeof stream === "object" && Symbol.asyncIterator in stream;
}

const operations = listOperations(new OctonodeClient("unused")).sort();

function flag(name: string): string | undefined {
  const index = argv.indexOf(name);
  if (index < 0) return undefined;
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

function usage(topic?: string): void {
  if (topic === "login") {
    process.stdout.write(`Usage:\n  octonodes login [--base-url <url>]\n  octonodes login --email <email> [--base-url <url>]\n  octonodes login --token <api-token>\n\nOpens GitHub login in your browser and signs in as the same user as Octonode Studio. Use --email for terminal email-code login, or --token for a personal, service, public, or agent API token.\n`);
    return;
  }
  if (topic === "operations") {
    process.stdout.write("Usage:\n  octonodes operations [filter]\n");
    return;
  }
  if (topic === "logout") {
    process.stdout.write("Usage:\n  octonodes logout\n\nRemoves the locally saved access token.\n");
    return;
  }
  if (topic && operations.includes(topic)) {
    process.stdout.write(`Usage:\n  octonodes ${topic} [--input <json>] [--base-url <url>]\n`);
    return;
  }
  process.stdout.write(`octonodes v${VERSION}\n\nUsage:\n  octonodes login [--base-url <url>]\n  octonodes login --email <email> [--base-url <url>]\n  octonodes login --token <api-token>\n  octonodes logout\n  octonodes operations [filter]\n  octonodes <operation> [--input <json>] [--base-url <url>]\n\nFlags:\n  -h, --h, --help  Show help\n  -v, --version     Show version\n\nEnvironment:\n  OCTONODE_TOKEN       Overrides the saved login\n  OCTONODE_URL         Overrides ${OCTONODE_API_URL}\n  OCTONODE_CONFIG_DIR  Overrides ~/.octonode\n`);
}

async function main(): Promise<void> {
  if (!command) return usage();
  if (command === "--version" || command === "-v") {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  if (helpRequested) return usage(command.startsWith("-") ? undefined : command);
  if (command === "login") {
    const baseUrl = flag("--base-url") ?? process.env.OCTONODE_URL ?? OCTONODE_API_URL;
    process.stdout.write(`${await login(baseUrl, { token: flag("--token"), email: flag("--email") })}\n`);
    return;
  }
  if (command === "logout") {
    const result = await logout();
    process.stdout.write(result.removed ? "Logged out.\n" : "No saved login found.\n");
    if (result.warning) process.stderr.write(`${result.warning}\n`);
    if (process.env.OCTONODE_TOKEN) {
      process.stdout.write("OCTONODE_TOKEN is still set and will continue to authenticate commands.\n");
    }
    return;
  }
  if (command === "operations") {
    const filter = argv[1]?.toLowerCase();
    process.stdout.write(
      operations
        .filter((name) => !filter || name.toLowerCase().includes(filter))
        .join("\n") + "\n",
    );
    return;
  }

  if (!operations.includes(command)) throw new Error(`unknown operation "${command}"; run "octonodes operations"`);

  const baseUrl = flag("--base-url") ?? process.env.OCTONODE_URL;
  const token = await accessToken();
  if (!token) throw new Error("run \"octonodes login\" or set OCTONODE_TOKEN");
  const operation = resolveOperation(createClient(token, { url: baseUrl }), command)!;

  const input = JSON.parse(flag("--input") ?? "{}") as unknown;
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("--input must be a JSON object");
  const result = await operation(input as Record<string, unknown>);
  if (isEventStream(result)) {
    for await (const event of result.stream) process.stdout.write(`${JSON.stringify(event)}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`octonodes: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
