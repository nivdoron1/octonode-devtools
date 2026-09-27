import { validateExtensionMessage, type UiExtensionTree } from "@octonodes/ui-extensions";

export function previewClient() {
  const token = new URLSearchParams(location.hash.slice(1)).get("preview");
  if (token) {
    sessionStorage.setItem("octonode-preview", token);
    history.replaceState(null, "", location.pathname);
  }
  const headers = { authorization: `Bearer ${sessionStorage.getItem("octonode-preview") ?? ""}` };
  let revision = "";
  let frames: HTMLIFrameElement[] = [];
  const error = document.getElementById("error")!;
  const host = document.getElementById("extensions")!;
  const field = (value: string) => {
    const text = document.createElement("span");
    text.textContent = value;
    return text;
  };
  function render(tree: UiExtensionTree, frame: HTMLIFrameElement): Node {
    if (tree.type === "text") return field(tree.value);
    const element = document.createElement(
      tree.type === "button" ? "button" : tree.type === "text-field" ? "label" : "section",
    );
    const send = (id: string, value?: string) =>
      frame.contentWindow?.postMessage(
        { octonode: "ui-extension", apiVersion: "1", type: "event", target: frame.dataset.target, id, value },
        "*",
      );
    if (tree.type === "button") {
      element.textContent = tree.label;
      (element as HTMLButtonElement).disabled = tree.disabled;
      element.onclick = () => send(tree.id);
    }
    if (tree.type === "text-field") {
      const input = document.createElement("input");
      input.value = tree.value;
      input.disabled = tree.disabled;
      input.oninput = () => send(tree.id, input.value);
      element.append(field(tree.label), input);
    }
    if (tree.type === "section") {
      const title = document.createElement("h2");
      title.textContent = tree.title;
      element.append(title);
    }
    if ("children" in tree) tree.children.forEach((child) => element.append(render(child, frame)));
    return element;
  }
  addEventListener("message", (event) => {
    const frame = frames.find((item) => item.contentWindow === event.source);
    if (!frame) return;
    const message = validateExtensionMessage(event.data, frame.dataset.target as "app.page" | "workspace.block");
    if (!message) return;
    const output = document.getElementById(frame.dataset.output!)!;
    if (message.message.type === "error") output.textContent = message.message.message;
    else output.replaceChildren(render(message.message.tree, frame));
  });
  async function refresh() {
    try {
      const response = await fetch("/_octonode/state", { headers });
      if (!response.ok) throw new Error("Open the preview URL printed by app dev to authorize this browser");
      const state = await response.json();
      error.textContent = state.error ?? "";
      if (state.revision === revision) return;
      revision = state.revision;
      host.replaceChildren();
      frames = [];
      for (const extension of state.extensions) {
        const output = document.createElement("div");
        output.id = `extension-${extension.id}`;
        host.append(output);
        const frame = document.createElement("iframe");
        frame.hidden = true;
        frame.sandbox.add("allow-scripts");
        frame.dataset.output = output.id;
        frame.dataset.target = extension.target;
        const context = JSON.stringify(state.session).replaceAll("<", "\\u003c");
        const code = extension.code.replace(/<\/script/gi, "<\\/script");
        frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; connect-src ${state.origin};"><body><script>globalThis.__octonodeApp=${context}</script><script>${code}</script>`;
        frames.push(frame);
        host.append(frame);
      }
    } catch (problem) {
      error.textContent = problem instanceof Error ? problem.message : "Preview unavailable";
    }
  }
  void refresh();
  setInterval(() => void refresh(), 1000);
}
