const logoSrc = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#181721"/><path d="M24 10h16l14 14v16L40 54H24L10 40V24Z" stroke="#FF765F" stroke-linejoin="round" stroke-width="3.5"/><path d="m21 24 11 8 11-8M32 32v13" stroke="#FF765F" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><g fill="#FF765F"><circle cx="21" cy="24" r="3"/><circle cx="43" cy="24" r="3"/><circle cx="32" cy="32" r="4"/><circle cx="32" cy="45" r="3"/></g></svg>');

export const welcomeCss = `:root{font-family:"Avenir Next",Avenir,ui-sans-serif,system-ui,sans-serif;background:#f7f8fa;color:#181721}*{box-sizing:border-box}body{margin:0;min-width:320px}a{color:inherit;text-decoration:none}a:focus-visible{outline:3px solid #ff765f;outline-offset:4px}.shell{max-width:1120px;margin:auto;padding:0 32px}.top{height:82px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e5e1e0}.brand{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:800;letter-spacing:-.05em}.mark{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:#ff765f;color:white;box-shadow:4px 4px 0 #ffd5cc}.top a{font-size:14px;font-weight:700;color:#923a2a}.hero{min-height:calc(100vh - 82px);display:grid;grid-template-columns:minmax(0,1.1fr) minmax(310px,.9fr);gap:64px;align-items:center;padding-top:64px;padding-bottom:64px}.eyebrow{display:flex;align-items:center;gap:9px;color:#923a2a;font-size:14px;font-weight:700}.eyebrow:before{content:"";width:8px;height:8px;border-radius:50%;background:#ff765f}h1{font-size:clamp(48px,5.4vw,76px);line-height:1.02;letter-spacing:-.075em;margin:20px 0 24px}h1 span{color:#dc5841}.intro{font-size:18px;line-height:1.6;color:#5d5a60;max-width:550px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.button{border-radius:12px;background:#181721;color:white;padding:14px 20px;font-weight:700;box-shadow:0 7px 18px #1817212a}.button.secondary{background:white;color:#181721;border:1px solid #e2dedf;box-shadow:none}.steps{margin-top:32px;color:#666169;font-size:13px;line-height:1.7}.steps code{color:#923a2a;background:#fff0ed;padding:3px 6px;border-radius:5px}.stage{position:relative;min-height:380px;border:1px solid #e5e1e0;border-radius:24px;background:linear-gradient(155deg,#fff,#fff3ef);padding:28px;box-shadow:0 24px 56px #18172118;overflow:hidden}.stage:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#8c6a5b12 1px,transparent 1px),linear-gradient(90deg,#8c6a5b12 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,#000,transparent)}.stage>*{position:relative}.stage-title{display:flex;justify-content:space-between;color:#53607d;font-size:13px;font-weight:700}.flow{display:flex;align-items:center;gap:8px;margin:75px 0 65px}.node{width:115px;min-height:96px;flex:none;background:#fff;border:1px solid #e6dfdd;border-radius:16px;padding:14px;box-shadow:0 8px 20px #18172116}.node.main{border-color:#ff9b89;box-shadow:0 10px 24px #dc58412b}.node-symbol{font-size:22px;color:#e36852}.node strong{display:block;margin-top:14px;font-size:13px}.wire{height:2px;min-width:12px;flex:1;background:#c8aaa4;position:relative}.wire:after{content:"";position:absolute;right:-2px;top:-4px;border-left:7px solid #c8aaa4;border-top:5px solid transparent;border-bottom:5px solid transparent}.connection{padding:16px 18px;background:#fff;border:1px solid #e9dfdc;border-radius:13px;display:flex;align-items:center;gap:11px;font-size:14px;line-height:1.4}.connection:before{content:"";width:10px;height:10px;flex:none;border-radius:50%;background:#ff765f}.connection span{overflow-wrap:anywhere}@media(max-width:850px){.hero{grid-template-columns:1fr;gap:45px}.stage{min-height:330px}.flow{margin:55px 0}}@media(max-width:500px){.shell{padding-left:20px;padding-right:20px}.top{height:70px}.hero{padding-top:45px}.stage{padding:18px;min-height:300px}.flow{margin:45px 0}.node{width:82px;padding:9px;min-height:84px}.node strong{font-size:11px}.intro{font-size:16px}}`;

export function welcomeHtml(name: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · Octonode</title><style>${welcomeCss}</style></head><body><header class="top shell"><div class="brand"><img class="mark" src="${logoSrc}" alt=""/>octonode</div><a href="https://playbook.octonodes.com/docs/apps">App guide ↗</a></header><main class="hero shell"><div><div class="eyebrow">Your app is running</div><h1>Hello, <span>world.</span></h1><p class="intro">A small beginning for something useful. Your page and backend are ready to shape.</p><div class="actions"><a class="button" href="https://playbook.octonodes.com/docs/apps">Build your app</a><a class="button secondary" href="https://octonodes.com/studio">Open Studio</a></div><p class="steps">Start in <code>src/server.ts</code> · Add optional contributions with <code>app extension add</code></p></div><div class="stage"><div class="stage-title"><span>Connection map</span><span>${name}</span></div><div class="flow"><div class="node"><span class="node-symbol">◇</span><strong>Studio</strong></div><div class="wire"></div><div class="node main"><span class="node-symbol">◆</span><strong>Your app</strong></div><div class="wire"></div><div class="node"><span class="node-symbol">◈</span><strong>Backend</strong></div></div><div class="connection" role="status"><span id="message">Checking connection…</span></div></div></main><script>/* OCTONODE_HOSTED_BRIDGE */</script></body></html>`;
}

export const appCss = `:root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#181721;background:#fff}*{box-sizing:border-box}body{margin:0;min-width:320px}.app-page{max-width:920px;padding:44px clamp(20px,5vw,64px)}h1{font-size:clamp(28px,3vw,40px);letter-spacing:-.04em;line-height:1.15;margin:0 0 12px}p{color:#5f6470;line-height:1.6}.eyebrow{font-size:13px;font-weight:700;color:#92513f;margin:0 0 12px}.project-list{list-style:none;margin:28px 0 0;padding:0;border:1px solid #e4e6ea;border-radius:12px;overflow:hidden}.project-list li{padding:16px 20px;border-bottom:1px solid #e4e6ea}.project-list li:last-child{border-bottom:0}.project-list strong{display:block}.project-list small{display:block;margin-top:4px;color:#5f6470;overflow-wrap:anywhere}`;

export function welcomeReact(name: string) {
  return `"use client";
import { useEffect, useState } from "react";
import { OctonodeAppProvider, useOctonodeApp } from "@octonodes/ui-extensions/app/react";
const navigation = [{ label: "Projects", path: "/projects" }];
function WorkspacePage() {
  const { bridge, session, workspace } = useOctonodeApp();
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
  const projectsPage = session.path.split("?")[0] === "/projects";
  return <main className="app-page">
    <p className="eyebrow">${name}</p>
    <h1>{projectsPage ? "Projects" : "Workspace overview"}</h1>
    <p>Connected to {workspace.kind}:{workspace.id}</p>
    {projectsPage && <><p role="status">{status}</p><ul className="project-list">{projects.map(project => <li key={project.id}><strong>{project.name}</strong><small>{project.id}</small></li>)}</ul></>}
  </main>;
}
export default function App() {
  return <OctonodeAppProvider navigation={navigation}><WorkspacePage /></OctonodeAppProvider>;
}
`;
}
