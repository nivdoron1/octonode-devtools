import { validateExtensionMessage, type UiExtensionTarget, type UiExtensionTree } from "@octonodes/ui-extensions";

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
        { octonode: "ui-extension", apiVersion: frame.dataset.version, type: "event", target: frame.dataset.target, id, value },
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
    const output = document.getElementById(frame.dataset.output!)!;
    const data = event.data;
    if (data?.octonode !== "ui-extension" || data.apiVersion !== frame.dataset.version) return;
    if (data.type === "app-request" && typeof data.requestId === "string" && data.requestId.length <= 100) {
      // Local preview has no installation or native resources. Never forward its requests.
      const allowed = data.operation === "host" && data.body?.command === "layout.list";
      const problem = "This command needs an installed app or a Studio workspace preview; local preview has no resource permissions.";
      if (!allowed) error.textContent = problem;
      frame.contentWindow?.postMessage({
        octonode: "ui-extension", apiVersion: frame.dataset.version, type: "app-response",
        requestId: data.requestId, ok: allowed, ...(allowed ? { value: [] } : { error: problem }),
      }, "*");
      return;
    }
    if (data.type === "action-complete" && frame.dataset.invocation && data.target === frame.dataset.target && data.invocationId === frame.dataset.invocation) {
      output.textContent = "Action completed in read-only preview.";
      frame.remove();
      frames = frames.filter((item) => item !== frame);
      return;
    }
    const message = validateExtensionMessage(data, frame.dataset.target as UiExtensionTarget, frame.dataset.version as "1" | "2");
    if (!message) return;
    if (message.message.type === "error") output.textContent = message.message.message;
    else output.replaceChildren(render(message.message.tree, frame));
  });
  async function refresh() {
    try {
      const response = await fetch("/_octonode/state", { headers });
      if (!response.ok) throw new Error("Open the preview URL printed by app dev to authorize this browser");
      const state = await response.json();
      if (state.error) error.textContent = state.error;
      if (state.revision === revision) return;
      revision = state.revision;
      error.textContent = state.error ?? "";
      host.replaceChildren();
      frames = [];
      for (const extension of state.extensions) {
        const output = document.createElement("div");
        output.id = `extension-${extension.id}`;
        host.append(output);
        const mount = () => {
          for (const previous of frames.filter((item) => item.dataset.output === output.id)) previous.remove();
          frames = frames.filter((item) => item.dataset.output !== output.id);
          output.textContent = "Loading preview…";
          const frame = document.createElement("iframe");
          frame.hidden = true;
          frame.sandbox.add("allow-scripts");
          frame.dataset.output = output.id;
          frame.dataset.target = extension.target;
          frame.dataset.version = state.session.protocolVersion ?? "1";
          if (extension.action) frame.dataset.invocation = crypto.randomUUID();
          const context = JSON.stringify(state.session).replaceAll("<", "\\u003c");
          const environment = JSON.stringify({
            target: extension.target, context: { readOnly: true }, translations: state.translations ?? {},
            ...(extension.action ? { invocationId: frame.dataset.invocation } : {}),
          }).replaceAll("<", "\\u003c");
          const code = extension.code.replace(/<\/script/gi, "<\\/script");
          frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; connect-src ${state.origin};"><body><script>globalThis.__octonodeApp=${context};globalThis.__octonodeExtension=${environment}</script><script>${code}</script>`;
          frames.push(frame);
          host.append(frame);
        };
        if (extension.action) {
          const run = document.createElement("button");
          run.textContent = `Run ${extension.id} in read-only preview`;
          run.onclick = mount;
          host.append(run);
        } else mount();
      }
    } catch (problem) {
      error.textContent = problem instanceof Error ? problem.message : "Preview unavailable";
    }
  }
  void refresh();
  setInterval(() => void refresh(), 1000);
}
