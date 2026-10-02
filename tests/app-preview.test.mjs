import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { previewClient } from "../packages/cli/dist/apps/preview.mjs";

test("local preview boots v2 context, gates actions, binds messages and denies native resource calls", async (t) => {
  const elements = [];
  const messages = [];
  const events = new EventTarget();
  let refresh;
  const element = (tag) => {
    const value = {
      tag, children: [], dataset: {}, sandbox: { add() {} }, textContent: "",
      contentWindow: { postMessage: (message) => messages.push(message) },
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
      remove() { this.removed = true; },
    };
    elements.push(value);
    return value;
  };
  const host = element("div");
  host.id = "extensions";
  const error = element("p");
  error.id = "error";
  const state = {
    revision: "1", origin: "'none'", translations: { title: "Preview title" },
    session: { protocolVersion: "2", token: "development-preview", expiresAt: Date.now() + 60_000 },
    extensions: [
      { id: "panel", target: "shell.panel", action: false, code: "" },
      { id: "action", target: "node.action", action: true, code: "" },
    ],
  };
  const globals = {
    document: { createElement: element, getElementById: (id) => elements.find((value) => value.id === id) },
    location: new URL("http://127.0.0.1/_octonode/"),
    sessionStorage: { getItem: () => "test-preview" },
    fetch: async () => ({ ok: true, json: async () => state }),
    addEventListener: events.addEventListener.bind(events), setInterval(callback) { refresh = callback; },
  };
  const originals = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  t.after(() => {
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  previewClient();
  await new Promise((resolve) => setImmediate(resolve));
  const frames = () => elements.filter((value) => value.tag === "iframe" && !value.removed);
  assert.equal(frames().length, 1, "action must not run on preview load");
  const frame = frames()[0];
  const sandbox = {};
  runInNewContext(frame.srcdoc.match(/<script>(.*?)<\/script>/s)[1], sandbox);
  assert.equal(sandbox.__octonodeApp.protocolVersion, "2");
  assert.equal(sandbox.__octonodeExtension.target, "shell.panel");
  assert.equal(sandbox.__octonodeExtension.context.readOnly, true);
  assert.equal(sandbox.__octonodeExtension.translations.title, "Preview title");
  const send = (data, source = frame.contentWindow) => {
    const event = new Event("message");
    Object.assign(event, { source, data: { octonode: "ui-extension", apiVersion: "2", target: "shell.panel", ...data } });
    events.dispatchEvent(event);
  };
  const output = elements.find((value) => value.id === "extension-panel");
  send({ type: "render", tree: { type: "text", value: "forged" } }, {});
  assert.equal(output.textContent, "Loading preview…");
  send({ type: "render", apiVersion: "1", tree: { type: "text", value: "wrong protocol" } });
  assert.equal(output.textContent, "Loading preview…");
  send({ type: "render", tree: { type: "button", id: "open", label: "Open assistant", disabled: false } });
  assert.equal(output.children[0].textContent, "Open assistant");
  output.children[0].onclick();
  assert.equal(messages.at(-1).apiVersion, "2");
  send({ type: "app-request", requestId: "read", operation: "host", body: { command: "layout.list" } });
  assert.equal(messages.at(-1).ok, true);
  assert.deepEqual(messages.at(-1).value, []);
  send({ type: "app-request", requestId: "denied", operation: "host", body: { command: "assistant.open" } });
  assert.equal(messages.at(-1).ok, false);
  assert.match(error.textContent, /no resource permissions/);
  refresh();
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(error.textContent, /no resource permissions/, "polling must not erase command feedback");
  elements.find((value) => value.tag === "button" && value.textContent.startsWith("Run action")).onclick();
  const action = frames()[1];
  assert.ok(action.dataset.invocation);
  send({ type: "action-complete", target: "node.action", invocationId: "wrong" }, action.contentWindow);
  assert.equal(frames().length, 2);
  send({ type: "action-complete", target: "node.action", invocationId: action.dataset.invocation }, action.contentWindow);
  assert.equal(frames().length, 1);
  assert.match(elements.find((value) => value.id === "extension-action").textContent, /Action completed/);
});
