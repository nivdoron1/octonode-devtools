import assert from "node:assert/strict";
import { test } from "node:test";
import { connectHostedApp } from "../packages/ui-extensions/dist/app/hosted.js";
import { HOSTED_APP_PROTOCOL } from "../packages/ui-extensions/dist/app/constants.js";

test("hosted navigation waits for a trusted session, updates, clears, and validates routes", (t) => {
  const messages = [];
  const events = new EventTarget();
  const host = { postMessage: (message, origin) => messages.push({ message, origin }) };
  const url = new URL("https://app.example/#octonode_parent=https%3A%2F%2Fstudio.example&octonode_channel=test");
  const browserHistory = { state: null, pushState() {}, replaceState() {} };
  const globals = {
    window: {}, parent: host, location: url, history: browserHistory,
    sessionStorage: { getItem: () => null, setItem() {} },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
  const originals = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  let app;
  t.after(() => {
    app?.dispose();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const originalPush = browserHistory.pushState;
  app = connectHostedApp();
  const items = [{ label: "Projects", path: "/projects?sort=name" }];
  app.setNavigation(items);
  assert.ok(messages.every(({ message }) => message.type !== "navigation"));
  const session = (overrides = {}, source = host, origin = "https://studio.example") => {
    const event = new Event("message");
    Object.assign(event, { source, origin, data: {
      octonode: HOSTED_APP_PROTOCOL, channel: "test", type: "session",
      token: `octo_app_${"a".repeat(43)}`, expiresAt: Date.now() + 60_000, ...overrides,
    } });
    events.dispatchEvent(event);
  };
  session({ channel: "wrong" });
  session({}, {}, "https://studio.example");
  session({}, host, "https://evil.example");
  session({ token: "invalid" });
  session({ expiresAt: Date.now() - 1 });
  assert.equal(app.getSnapshot().status, "connecting");
  session();
  assert.equal(app.getSnapshot().status, "ready");
  assert.deepEqual(messages.at(-1), {
    message: { type: "navigation", items, octonode: HOSTED_APP_PROTOCOL, channel: "test" },
    origin: "https://studio.example",
  });
  app.setNavigation([]);
  assert.deepEqual(messages.at(-1).message.items, []);
  for (const invalid of [
    Array.from({ length: 13 }, () => items[0]),
    [{ label: " ", path: "/" }], [{ label: "a".repeat(41), path: "/" }],
    [{ label: "External", path: "//evil.example" }],
    [{ label: "Token", path: "/#octonode_session=secret" }],
  ]) assert.throws(() => app.setNavigation(invalid), /app-relative navigation/);
  app.dispose();
  assert.equal(browserHistory.pushState, originalPush);
  const count = messages.length;
  session();
  assert.equal(messages.length, count);
});
