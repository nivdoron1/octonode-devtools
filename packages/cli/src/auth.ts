import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { chmodSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { createClient, type Session } from "@supabase/supabase-js";

interface AuthConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

interface StoredSession extends AuthConfig {
  accessToken: string;
  refreshToken: string;
}

export interface LoginOptions {
  token?: string;
  email?: string;
  code?: string;
  openBrowser?: (url: string) => Promise<void>;
}

function configPath(name: string): string {
  return join(process.env.OCTONODE_CONFIG_DIR ?? join(homedir(), ".octonode"), name);
}

function readFile(name: string): string | undefined {
  try {
    return readFileSync(configPath(name), "utf8").trim() || undefined;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

function writePrivateFile(name: string, value: string): void {
  const path = configPath(name);
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  chmodSync(dirname(path), 0o700);
  writeFileSync(path, value, { encoding: "utf8", mode: 0o600 });
  chmodSync(path, 0o600);
}

function removeFile(name: string): boolean {
  try {
    unlinkSync(configPath(name));
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

function readSession(): StoredSession | undefined {
  const value = readFile("session.json");
  if (!value) return undefined;
  try {
    const session = JSON.parse(value) as Partial<StoredSession>;
    if (
      typeof session.supabaseUrl !== "string" ||
      typeof session.supabasePublishableKey !== "string" ||
      typeof session.accessToken !== "string" ||
      typeof session.refreshToken !== "string"
    ) {
      throw new Error("missing session fields");
    }
    return session as StoredSession;
  } catch {
    throw new Error("saved login is invalid; run \"octonodes login\" again");
  }
}

function saveSession(config: AuthConfig, session: Session): void {
  writePrivateFile(
    "session.json",
    `${JSON.stringify({
      supabaseUrl: config.supabaseUrl,
      supabasePublishableKey: config.supabasePublishableKey,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    })}\n`,
  );
}

function authClient(config: AuthConfig, flowType: "implicit" | "pkce" = "implicit") {
  return createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false, flowType },
  });
}

async function fetchAuthConfig(apiUrl: string): Promise<AuthConfig> {
  const response = await fetch(new URL("/api/auth/config", apiUrl), { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`could not load login configuration (HTTP ${response.status})`);
  const config = (await response.json()) as Partial<AuthConfig>;
  if (typeof config.supabaseUrl !== "string" || typeof config.supabasePublishableKey !== "string") {
    throw new Error("Octonode returned an invalid login configuration");
  }
  return config as AuthConfig;
}

async function promptLine(message: string): Promise<string> {
  const reader = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await reader.question(message)).trim();
  } finally {
    reader.close();
  }
}

async function promptSecret(message: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) throw new Error("verification code is required on stdin");
  process.stdout.write(message);
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";
    const finish = (error?: Error) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value.trim());
    };
    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u0003") return finish(new Error("login cancelled"));
        if (character === "\u007f" || character === "\b") {
          if (value) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else if (character >= " ") {
          value += character;
          process.stdout.write("*");
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

async function openBrowser(url: string): Promise<void> {
  const [command, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["explorer.exe", [url]]
        : ["xdg-open", [url]];
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { detached: true, stdio: "ignore" });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

async function oauthCallback(): Promise<{ url: string; code: Promise<string>; close: () => void }> {
  const path = `/auth/callback/${randomBytes(18).toString("base64url")}`;
  let resolveCode!: (code: string) => void;
  let rejectCode!: (error: Error) => void;
  let finished = false;
  const code = new Promise<string>((resolve, reject) => {
    resolveCode = resolve;
    rejectCode = reject;
  });
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method !== "GET" || requestUrl.pathname !== path) {
      response.writeHead(404).end("Not found");
      return;
    }
    const authCode = requestUrl.searchParams.get("code");
    const authError = requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
    response.writeHead(authCode ? 200 : 400, {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'",
      "content-type": "text/html; charset=utf-8",
    });
    response.end(
      authCode
        ? "<!doctype html><title>Octonode login complete</title><h1>Login complete</h1><p>You can close this window.</p>"
        : "<!doctype html><title>Octonode login failed</title><h1>Login failed</h1><p>Return to the terminal for details.</p>",
    );
    finish(authCode ?? undefined, new Error(authError ?? "GitHub login did not return an authorization code"));
  });
  const timer = setTimeout(() => finish(undefined, new Error("browser login timed out")), 5 * 60_000);
  const finish = (value?: string, error?: Error) => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    server.close();
    if (value) resolveCode(value);
    else rejectCode(error ?? new Error("browser login cancelled"));
  };
  try {
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      server.once("error", onError);
      server.listen(0, "127.0.0.1", () => {
        server.off("error", onError);
        resolve();
      });
    });
  } catch (error) {
    finished = true;
    clearTimeout(timer);
    server.close();
    throw error;
  }
  server.once("error", (error) => finish(undefined, error));
  const address = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${address.port}${path}`,
    code,
    close: () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        server.close();
      }
    },
  };
}

async function browserLogin(config: AuthConfig, launch: (url: string) => Promise<void>): Promise<string> {
  const callback = await oauthCallback();
  try {
    const supabase = authClient(config, "pkce");
    const started = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callback.url, skipBrowserRedirect: true },
    });
    if (started.error) throw new Error(started.error.message);
    if (!started.data.url) throw new Error("Supabase did not return a GitHub login URL");
    process.stdout.write(`Opening GitHub login in your browser.\nIf it does not open, visit:\n${started.data.url}\n`);
    void launch(started.data.url).catch((error) => {
      process.stderr.write(`Could not open a browser: ${error instanceof Error ? error.message : String(error)}\n`);
    });
    const exchanged = await supabase.auth.exchangeCodeForSession(await callback.code);
    if (exchanged.error) throw new Error(exchanged.error.message);
    if (!exchanged.data.session) throw new Error("Supabase did not return a session");
    saveSession(config, exchanged.data.session);
    removeFile("access-token");
    return `Finished octonodes login as ${exchanged.data.user?.email ?? "a Studio user"}.`;
  } finally {
    callback.close();
  }
}

export async function login(apiUrl: string, options: LoginOptions = {}): Promise<string> {
  const token = options.token?.trim();
  if (token) {
    writePrivateFile("access-token", `${token}\n`);
    removeFile("session.json");
    return "Finished octonodes login with an API token.";
  }

  const config = await fetchAuthConfig(apiUrl);
  if (!options.email) return browserLogin(config, options.openBrowser ?? openBrowser);

  const piped = process.stdin.isTTY || options.code ? [] : readFileSync(0, "utf8").split(/\r?\n/);
  const email =
    options.email.trim() || piped.shift()?.trim() || (process.stdin.isTTY ? await promptLine("Email: ") : "");
  if (!email) throw new Error("email is required");

  const supabase = authClient(config);
  const sent = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (sent.error) throw new Error(sent.error.message);
  process.stdout.write(`Verification code sent to ${email}.\n`);

  const code =
    options.code?.trim() ||
    piped.shift()?.trim() ||
    (process.stdin.isTTY ? await promptSecret("Verification code: ") : "");
  if (!code) throw new Error("verification code is required");
  const verified = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (verified.error) throw new Error(verified.error.message);
  if (!verified.data.session) throw new Error("Supabase did not return a session");

  saveSession(config, verified.data.session);
  removeFile("access-token");
  return `Finished octonodes login as ${verified.data.user?.email ?? email}.`;
}

export async function accessToken(): Promise<string | undefined> {
  const environmentToken = process.env.OCTONODE_TOKEN?.trim();
  if (environmentToken) return environmentToken;

  const apiToken = readFile("access-token");
  if (apiToken) return apiToken;

  const stored = readSession();
  if (!stored) return undefined;
  const supabase = authClient(stored);
  const result = await supabase.auth.setSession({
    access_token: stored.accessToken,
    refresh_token: stored.refreshToken,
  });
  if (result.error || !result.data.session) {
    throw new Error(`saved login expired${result.error ? `: ${result.error.message}` : ""}; run "octonodes login" again`);
  }
  if (
    result.data.session.access_token !== stored.accessToken ||
    result.data.session.refresh_token !== stored.refreshToken
  ) {
    saveSession(stored, result.data.session);
  }
  return result.data.session.access_token;
}

export async function logout(): Promise<{ removed: boolean; warning?: string }> {
  const stored = readSession();
  let warning: string | undefined;
  if (stored) {
    const supabase = authClient(stored);
    const restored = await supabase.auth.setSession({
      access_token: stored.accessToken,
      refresh_token: stored.refreshToken,
    });
    if (restored.error) warning = `Supabase session could not be revoked: ${restored.error.message}`;
    else {
      const signedOut = await supabase.auth.signOut({ scope: "local" });
      if (signedOut.error) warning = `Supabase session could not be revoked: ${signedOut.error.message}`;
    }
  }
  const removedSession = removeFile("session.json");
  const removedToken = removeFile("access-token");
  return { removed: removedSession || removedToken, ...(warning ? { warning } : {}) };
}
