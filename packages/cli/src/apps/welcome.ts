// Static artwork is emitted as HTML or native JSX; it has no runtime fixture dependency.
const projectScene = `<svg class="scene" viewBox="0 0 480 400" fill="none" aria-hidden="true">
  <ellipse cx="240" cy="212" rx="188" ry="152" stroke="var(--line)" stroke-dasharray="2 10" />
  <path
    class="route"
    d="M100 100H175Q195 100 195 120V174M334 104V157Q334 177 314 177H286M312 265V307Q312 327 332 327H374"
  />
  <path class="signal" d="M100 100H175Q195 100 195 120V174" />
  <path class="signal" d="M334 104V157Q334 177 314 177H286" />
  <path class="signal" d="M312 265V307Q312 327 332 327H374" />
  <g class="satellite">
    <rect class="paper" x="48" y="72" width="88" height="66" rx="16" />
    <rect x="66" y="91" width="23" height="23" rx="6" fill="var(--paper)" />
    <path d="M72 102h11m-11 5h7" stroke="var(--soft)" stroke-width="2" stroke-linecap="round" />
    <path d="M98 98h20m-20 10h14" stroke="var(--line)" stroke-width="3" stroke-linecap="round" />
  </g>
  <g class="satellite">
    <rect class="paper" x="306" y="57" width="72" height="64" rx="16" />
    <path d="M327 84h9l5 6h16v14h-30V84Z" stroke="var(--soft)" stroke-width="1.5" stroke-linejoin="round" />
  </g>
  <g class="satellite">
    <rect class="paper" x="351" y="301" width="78" height="58" rx="16" />
    <circle cx="390" cy="330" r="13" stroke="var(--soft)" stroke-width="1.5" />
    <path
      d="m384 330 4 4 8-8"
      stroke="var(--soft)"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <g class="project project-back">
    <rect class="back" x="147" y="125" width="196" height="158" rx="20" transform="rotate(8 245 204)" />
  </g>
  <g class="project project-front">
    <rect class="paper" x="123" y="145" width="222" height="164" rx="20" />
    <path
      d="M145 173h19l9 10h28v29h-56v-39Z"
      fill="var(--paper)"
      stroke="var(--accent)"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <text class="ink" x="145" y="245" font-size="18" font-weight="600">Projects</text>
    <path d="M145 263h116m-116 14h79" stroke="var(--line)" stroke-width="4" stroke-linecap="round" />
    <rect x="293" y="173" width="29" height="29" rx="9" fill="var(--paper)" />
    <path
      d="m302 187 4 4 8-8"
      class="accent"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <circle cx="94" cy="252" r="5" fill="var(--soft)" opacity=".6" />
  <circle cx="396" cy="201" r="4" fill="var(--accent)" opacity=".65" />
  <circle cx="200" cy="356" r="3" fill="var(--soft)" opacity=".6" />
</svg>`;
const workspaceDetails = `<section class="details" aria-label="About your workspace">
  <div class="detail">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h6l3 3h9v10H3V7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M3 7V4h7l3 3h6v3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
    <div>
      <h2>Shared work, in one place</h2>
      <p>Open Projects to explore the work shared with this app.</p>
    </div>
  </div>
  <div class="detail">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="m8 12 3 3 5-6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div>
      <h2>Access you control</h2>
      <p>Only the projects and permissions granted to this app are available.</p>
    </div>
  </div>
</section>`;
const jsxAttributes: Record<string, string> = {
  class: "className", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray",
  "font-size": "fontSize", "font-weight": "fontWeight",
};
const asJsx = (markup: string) => markup.replace(/\b(class|stroke-width|stroke-linecap|stroke-linejoin|stroke-dasharray|font-size|font-weight)=/g, attribute => jsxAttributes[attribute.slice(0, -1)] + "=");

export const appCss = `:root {
  color-scheme: light;
  --canvas: #f8f9fc;
  --surface: #fff;
  --ink: #252c43;
  --muted: #647087;
  --line: #dfe3ed;
  --accent: #6158a6;
  --accent-ink: #fff;
  --paper: #eef0f8;
  --soft: #8192b6;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --canvas: #17191f;
    --surface: #20232d;
    --ink: #f2f3f8;
    --muted: #a5adbf;
    --line: #363b4c;
    --accent: #b7b2f0;
    --accent-ink: #242039;
    --paper: #292e3b;
    --soft: #8e99b4;
  }
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 0;
  background: var(--canvas);
  color: var(--ink);
  font:
    16px/1.6 ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.app-page {
  max-width: 1240px;
  margin: auto;
  padding: clamp(24px, 5vw, 72px);
}
.context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 13px;
}
.identity {
  display: flex;
  align-items: center;
  gap: 9px;
}
.identity svg {
  width: 20px;
  height: 20px;
  color: var(--accent);
}
.connection {
  display: flex;
  align-items: center;
  gap: 8px;
}
.connection::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8ebfb0;
}
.welcome {
  min-height: 520px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(24px, 5vw, 72px);
  padding: 56px 0;
}
.app-page h1 {
  margin: 0 0 24px;
  max-width: 9em;
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 1.08;
  letter-spacing: -0.045em;
  font-weight: 650;
  text-wrap: balance;
}
.intro {
  margin: 0;
  color: var(--muted);
  max-width: 32em;
  font-size: 17px;
  line-height: 1.75;
}
.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 32px;
  padding: 13px 20px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.action svg {
  width: 18px;
  height: 18px;
}
.action:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(--accent) 20%, transparent);
  transform: translateY(-2px);
}
.action:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 5px;
}
.scene {
  width: 100%;
  max-width: 480px;
  justify-self: center;
  overflow: visible;
}
.scene .paper {
  fill: var(--surface);
  stroke: var(--line);
}
.scene .back {
  fill: var(--paper);
  stroke: var(--line);
}
.scene .ink {
  fill: var(--ink);
}
.scene .muted {
  fill: var(--muted);
}
.scene .accent {
  stroke: var(--accent);
}
.scene .route {
  fill: none;
  stroke: var(--line);
  stroke-width: 1.5;
}
.scene .signal {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 18 240;
  animation: connect 1.5s ease-in-out 3;
}
.scene .project {
  transform-origin: 240px 210px;
  animation: unfold 1.1s cubic-bezier(0.2, 0.75, 0.25, 1) both;
}
.scene .project-back {
  animation-delay: 0.08s;
}
.scene .project-front {
  animation-delay: 0.18s;
}
.scene .satellite {
  animation: arrive 0.9s ease-out 0.35s both;
}
[hidden] {
  display: none !important;
}
.project-view {
  min-height: 520px;
  padding: 72px 0;
}
.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  border-top: 1px solid var(--line);
  padding-top: 32px;
}
.detail {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.detail svg {
  margin-top: 4px;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: var(--soft);
}
.app-page h2 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
}
.detail p {
  margin: 0;
  max-width: 30em;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}
@keyframes unfold {
  from {
    opacity: 0;
    transform: translateY(22px) rotate(-4deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}
@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes connect {
  from {
    stroke-dashoffset: 250;
    opacity: 0;
  }
  20%,
  70% {
    opacity: 1;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}
@media (max-width: 760px) {
  .welcome {
    min-height: 0;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 48px 0 24px;
  }
  .app-page h1 {
    max-width: 12em;
  }
  .scene {
    max-width: 380px;
  }
  .details {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
@media (max-width: 380px) {
  .context {
    font-size: 12px;
  }
  .connection {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
  .signal {
    display: none;
  }
}
@media (forced-colors: active) {
  :root {
    --canvas: Canvas;
    --surface: Canvas;
    --paper: Canvas;
    --ink: CanvasText;
    --muted: CanvasText;
    --line: CanvasText;
    --accent: LinkText;
    --accent-ink: Canvas;
    --soft: CanvasText;
  }
  .action {
    border: 1px solid LinkText;
  }
}

.app-navbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 16px 24px; border-bottom: 1px solid var(--line); }
.app-navbar nav { display: flex; gap: 8px; flex-wrap: wrap; }
.app-navbar a { color: var(--muted); text-decoration: none; padding: 8px 12px; border-radius: 8px; }
.app-navbar a[aria-current="page"] { background: var(--paper); color: var(--ink); }
.app-navbar a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.project-list { list-style: none; margin: 28px 0 0; padding: 0; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
.project-list li { padding: 20px; background: var(--surface); border-bottom: 1px solid var(--line); }
.project-list li:last-child { border-bottom: 0; }
.project-list strong, .project-list small { display: block; overflow-wrap: anywhere; }
.project-list small { margin-top: 4px; color: var(--muted); }
.project-view p { color: var(--muted); }
.access-state { min-height: calc(100dvh - 144px); display: flex; align-items: center; justify-content: center; gap: 14px; margin: auto; text-align: center; }
.access-state[data-state="connecting"]::before { content: ""; width: 20px; height: 20px; flex-shrink: 0; border: 2px solid var(--line); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`;

export function welcomeHtml(name: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · Octonode</title><style>${appCss}</style></head><body>
  <main class="app-page">
    <p class="intro access-state" id="message" role="status" data-state="connecting">Connecting to your workspace…</p>
    <div id="workspace-content" hidden>
      <header class="context"><span class="identity">Your workspace</span><span class="connection">App connected</span></header>
      <div id="overview-view">
        <section class="welcome" aria-labelledby="overview-title">
          <div><h1 id="overview-title">Workspace overview</h1><p class="intro">Your shared projects appear here.<br />A little clarity for everything you’re working on.</p><a class="action" href="/projects" id="explore">Explore projects <span aria-hidden="true">→</span></a></div>
          ${projectScene}
        </section>
        ${workspaceDetails}
      </div>
      <section class="project-view" id="projects-view" hidden aria-labelledby="projects-title">
        <h1 id="projects-title">Projects</h1><p id="projects-status" role="status">Loading granted projects…</p><ul class="project-list" id="project-list"></ul><a class="action" href="/" id="return">Back to overview</a>
      </section>
    </div>
  </main><script>/* OCTONODE_HOSTED_BRIDGE */</script></body></html>`;
}

export function welcomeReact(name: string) {
  return `"use client";
import { useEffect, useState } from "react";
import { OctonodeAppProvider, useOctonodeApp } from "@octonodes/ui-extensions/app/react";
const navigation = [{ label: "Overview", path: "/" }, { label: "Projects", path: "/projects" }];
function WorkspacePage({ showNavbar }: { showNavbar: boolean }) {
  const { bridge, session } = useOctonodeApp();
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [status, setStatus] = useState("Loading granted projects…");
  useEffect(() => {
    const controller = new AbortController();
    bridge.fetch("/api/projects", { signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error(response.status === 401 ? "Session expired. Reopen the app." : response.status === 403 ? "Project access was not granted." : "Project service is unavailable. Try again.");
      return response.json();
    }).then(data => {
      if (controller.signal.aborted) return;
      setProjects(data.projects);
      setStatus(data.failed ? "Some projects could not be loaded." : data.projects.length ? "Connected to selected projects." : "No projects granted. Review access in Studio.");
    }).catch(error => { if (!controller.signal.aborted) setStatus(error.message); });
    return () => controller.abort();
  }, [bridge, session.token]);
  const projectsPage = session.path.split(/[?#]/)[0] === "/projects";
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); bridge.navigate(path);
  };
  return <>
    {showNavbar && <header className="app-navbar"><strong>${name}</strong><nav aria-label="App navigation">{navigation.map(item => <a key={item.path} href={item.path} aria-current={session.path.split(/[?#]/)[0] === item.path ? "page" : undefined} onClick={event => navigate(event, item.path)}>{item.label}</a>)}</nav></header>}
    <main className="app-page">
      <header className="context"><span className="identity">Your workspace</span><span className="connection">App connected</span></header>
      {projectsPage ? <section className="project-view" aria-labelledby="projects-title">
        <h1 id="projects-title">Projects</h1><p role="status">{status}</p>
        {projects.length > 0 && <ul className="project-list">{projects.map(project => <li key={project.id}><strong>{project.name}</strong><small>{project.id}</small></li>)}</ul>}
        <a className="action" href="/" onClick={event => navigate(event, "/")}>Back to overview</a>
      </section> : <>
        <section className="welcome" aria-labelledby="overview-title">
          <div><h1 id="overview-title">Workspace overview</h1><p className="intro">Your shared projects appear here.<br />A little clarity for everything you’re working on.</p><a className="action" href="/projects" onClick={event => navigate(event, "/projects")}>Explore projects <span aria-hidden="true">→</span></a></div>
          ${asJsx(projectScene)}
        </section>
        ${asJsx(workspaceDetails)}
      </>}
    </main>
  </>;
}
export default function App({ showNavbar = false }: { showNavbar?: boolean }) {
  return <OctonodeAppProvider navigation={navigation}><WorkspacePage showNavbar={showNavbar} /></OctonodeAppProvider>;
}
`;
}

export function welcomeHosted() {
  return `import { connectHostedApp } from "@octonodes/ui-extensions/app";
const app = connectHostedApp();
app.setNavigation([{ label: "Overview", path: "/" }, { label: "Projects", path: "/projects" }]);
const output = document.getElementById("message")!;
const content = document.getElementById("workspace-content")!;
const overview = document.getElementById("overview-view")!;
const projectsView = document.getElementById("projects-view")!;
const projectStatus = document.getElementById("projects-status")!;
const list = document.getElementById("project-list")!;
let token: string | undefined;
let controller: AbortController | undefined;
const update = () => {
  const current = app.getSnapshot();
  const projectsPage = current.path.split(/[?#]/)[0] === "/projects";
  overview.hidden = projectsPage;
  projectsView.hidden = !projectsPage;
  if (current.status !== "ready") {
    controller?.abort();
    token = undefined;
    content.hidden = true;
    output.hidden = false;
    output.dataset.state = current.status;
    output.textContent = current.status === "expired" ? "Session expired. Reopen the app from Studio." : current.status === "standalone" ? "Open this app from Studio to connect your workspace." : "Connecting to your workspace…";
    return;
  }
  if (current.token === token) return;
  token = current.token;
  controller?.abort();
  const request = new AbortController();
  controller = request;
  content.hidden = true;
  output.hidden = false;
  output.dataset.state = "connecting";
  output.textContent = "Connecting to your workspace…";
  list.replaceChildren();
  projectStatus.textContent = "Loading granted projects…";
  app.fetch("/api/context", { signal: request.signal }).then(async response => {
    if (!response.ok) throw Error("Workspace access could not be verified.");
    const data = await response.json();
    if (!data.workspace?.kind || !data.workspace.id) throw Error("Missing workspace scope.");
    if (request.signal.aborted) return;
    output.hidden = true;
    content.hidden = false;
    try {
      const response = await app.fetch("/api/projects", { signal: request.signal });
      if (!response.ok) throw Error(response.status === 403 ? "Project access was not granted." : "Project service is unavailable. Try again.");
      const data = await response.json();
      if (request.signal.aborted) return;
      for (const project of data.projects as { id: string; name: string }[]) {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        const id = document.createElement("small");
        title.textContent = project.name; id.textContent = project.id;
        item.append(title, id); list.append(item);
      }
      projectStatus.textContent = data.failed ? "Some projects could not be loaded." : data.projects.length ? "Connected to selected projects." : "No projects granted. Review access in Studio.";
    } catch (error) { if (!request.signal.aborted) projectStatus.textContent = error instanceof Error ? error.message : "Could not load projects."; }
  }).catch(error => { if (!request.signal.aborted) { output.dataset.state = "error"; output.textContent = error.message; } });
};
for (const [id, path] of [["explore", "/projects"], ["return", "/"]]) {
  document.getElementById(id)!.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); app.navigate(path);
  });
}
const unsubscribe = app.subscribe(update);
update();
addEventListener("pagehide", event => { if (event.persisted) return; controller?.abort(); unsubscribe(); app.dispose(); });
`;
}
