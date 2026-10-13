import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import { transformSync } from "esbuild";

const require = createRequire(import.meta.url);
const { welcomeHosted } = require("../packages/cli/dist/apps/welcome.js");
const script = transformSync(welcomeHosted(), { loader: "ts", format: "cjs" }).code;
const flush = () => new Promise(resolve => setImmediate(resolve));

function preview(fetch) {
  const elements = new Map();
  const element = () => ({ hidden: true, textContent: "", dataset: {}, children: [], listeners: {}, append(...children) { this.children.push(...children); }, replaceChildren() { this.children = []; }, addEventListener(type, handler) { this.listeners[type] = handler; } });
  for (const id of ["message", "workspace-content", "overview-view", "projects-view", "projects-status", "project-list", "explore", "return"]) elements.set(id, element());
  let state = { status: "connecting", path: "/" };
  let listener;
  const events = {};
  let disposed = false;
  const app = {
    getSnapshot: () => state,
    subscribe(callback) { listener = callback; return () => { listener = undefined; }; },
    setNavigation(items) { assert.equal(items.map(item => item.path).join(","), "/,/projects"); },
    navigate(path) { state = { ...state, path }; listener(); },
    fetch,
    dispose() { disposed = true; },
  };
  runInNewContext(script, {
    require: () => ({ connectHostedApp: () => app }),
    AbortController,
    document: { getElementById: id => elements.get(id), createElement: element },
    addEventListener: (type, callback) => { events[type] = callback; },
  });
  return { elements, events, update(patch) { state = { ...state, ...patch }; listener(); }, isDisposed: () => disposed };
}

test("plain starter verifies context, renders projects safely and mirrors route changes", async () => {
  const calls = [];
  const ui = preview(async path => {
    calls.push(path);
    return Response.json(path === "/api/context" ? { workspace: { kind: "user", id: "owner" } } : { projects: [{ id: "project", name: "<img src=x onerror=alert(1)>" }], failed: 0 });
  });
  assert.equal(ui.elements.get("workspace-content").hidden, true);
  ui.update({ status: "ready", token: "session" });
  await flush();
  assert.equal(ui.elements.get("workspace-content").hidden, false);
  assert.equal(ui.elements.get("project-list").children[0].children[0].textContent, "<img src=x onerror=alert(1)>");
  let prevented = false;
  ui.elements.get("explore").listeners.click({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(ui.elements.get("overview-view").hidden, true);
  assert.equal(ui.elements.get("projects-view").hidden, false);
  assert.deepEqual(calls, ["/api/context", "/api/projects"]);
  ui.update({ status: "expired", token: undefined });
  assert.equal(ui.elements.get("workspace-content").hidden, true);
  assert.match(ui.elements.get("message").textContent, /Session expired/);
  ui.events.pagehide({ persisted: true });
  assert.equal(ui.isDisposed(), false);
  ui.events.pagehide({ persisted: false });
  assert.equal(ui.isDisposed(), true);
});

test("plain starter ignores late project results from a replaced session", async () => {
  let releaseFirst;
  let firstSignal;
  let projectRequests = 0;
  const ui = preview((path, options) => {
    if (path === "/api/context") return Promise.resolve(Response.json({ workspace: { kind: "user", id: "owner" } }));
    if (projectRequests++ === 0) {
      firstSignal = options.signal;
      return new Promise(resolve => { releaseFirst = resolve; });
    }
    return Promise.resolve(Response.json({ projects: [{ id: "current", name: "Current project" }], failed: 0 }));
  });
  ui.update({ status: "ready", token: "session-a" });
  await flush();
  ui.update({ token: "session-b" });
  assert.equal(firstSignal.aborted, true);
  await flush();
  releaseFirst(Response.json({ projects: [{ id: "old", name: "Previous project" }], failed: 0 }));
  await flush();
  assert.deepEqual(ui.elements.get("project-list").children.map(item => item.children[0].textContent), ["Current project"]);
  assert.equal(ui.elements.get("workspace-content").hidden, false);
});

test("plain starter keeps rejected and late verification responses behind the access screen", async () => {
  const rejected = preview(async () => Response.json({}, { status: 403 }));
  rejected.update({ status: "ready", token: "session" });
  await flush();
  assert.equal(rejected.elements.get("workspace-content").hidden, true);
  assert.match(rejected.elements.get("message").textContent, /could not be verified/);
  let resolve;
  let signal;
  const late = preview((path, options) => { signal = options.signal; return new Promise(done => { resolve = done; }); });
  late.update({ status: "ready", token: "session" });
  late.update({ status: "expired", token: undefined });
  assert.equal(signal.aborted, true);
  resolve(Response.json({ workspace: { kind: "user", id: "owner" } }));
  await flush();
  assert.equal(late.elements.get("workspace-content").hidden, true);
  assert.match(late.elements.get("message").textContent, /Session expired/);
});
