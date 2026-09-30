import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { OctonodeAppProvider } from "@octonodes/ui-extensions/app/react";
import { AppAccessScreen } from "../packages/ui-extensions/dist/app/OctonodeAppProvider/AppAccessScreen/index.js";

test("the public React entry point imports in Node and keeps private content behind verification", () => {
  const html = renderToStaticMarkup(createElement(OctonodeAppProvider, null, "Private workspace content"));
  assert.match(html, /Connecting to your workspace/);
  assert.doesNotMatch(html, /Private workspace content/);
});

test("access screens render every session state with a workspace action when needed", () => {
  for (const status of ["standalone", "expired", "connecting", "error"]) {
    const html = renderToStaticMarkup(createElement(AppAccessScreen, { status }));
    assert.match(html, /<h1/);
    assert.equal(html.includes('href="https://octonodes.com/studio"'), status !== "connecting");
    assert.equal(html.includes('role="alert"'), status === "expired" || status === "error");
  }
});
