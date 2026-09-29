import {
  mkdirSync,
  mkdtempSync,
  lstatSync,
  rmSync,
  writeFileSync,
  readFileSync,
  renameSync,
  existsSync,
  copyFileSync,
  cpSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { build } from "esbuild";
import { PluginManifest } from "@octonodes/sdk/plugins";
import { buildApp } from "../plugins/app";
import { fileHash, safePath, pluginFiles } from "../plugins/artifact";
import { appManifest, readAppSource, sourceFile } from "./source";

export async function buildAppProject(directory: string, applicationUrl?: string) {
  const root = resolve(directory);
  const source = readAppSource(root);
  let output = root;
  for (const part of ["dist", "apps"]) {
    output = join(output, part);
    if (!lstatSync(output, { throwIfNoEntry: false })) mkdirSync(output);
    if (!lstatSync(output).isDirectory() || lstatSync(output).isSymbolicLink())
      throw new Error("Unsafe build directory");
  }
  const stage = mkdtempSync(join(output, ".sources-"));
  try {
    mkdirSync(join(stage, "extensions"));
    const hashes: string[] = [];
    for (const extension of source.extensions) {
      const entry = sourceFile(root, extension.entry);
      const result = await build({
        absWorkingDir: root,
        stdin: {
          contents: `import extension from ${JSON.stringify(entry)}; import { startExtension } from "@octonodes/ui-extensions/react"; if (extension.target !== ${JSON.stringify(extension.target)}) throw new Error("Extension target mismatch"); startExtension(extension);`,
          resolveDir: root,
          loader: "ts",
        },
        bundle: true,
        platform: "browser",
        format: "iife",
        target: "es2021",
        jsx: "automatic",
        minify: true,
        write: false,
        metafile: true,
        preserveSymlinks: true,
        logLevel: "silent",
      });
      if (result.warnings.length) throw new Error(result.warnings.map((warning) => warning.text).join("\n"));
      assertSourceInputs(root, Object.keys(result.metafile.inputs));
      if (
        result.outputFiles.length !== 1 ||
        Object.values(result.metafile.outputs).some((value) => value.imports.some((item) => item.external))
      )
        throw new Error("App bundles must be self-contained JavaScript");
      const path = join(stage, `extensions/${extension.id}.js`);
      if (result.outputFiles[0].contents.length > 2 * 1024 * 1024) throw new Error("App bundle exceeds 2 MiB");
      writeFileSync(path, result.outputFiles[0].contents);
      hashes.push(`sha256:${fileHash(path)}`);
      if (source.web) copyFileSync(path, join(stage, `extensions/${fileHash(path)}.js`));
    }
    if (!source.web) return buildApp(appManifest(source, hashes), output, stage);
    const origin = applicationUrl ?? source.web.applicationUrl;
    if (!origin)
      throw new Error("Set web.applicationUrl or pass --app-url https://your-app.example before building a full app");
    const normalized = new URL(origin);
    if (normalized.origin !== origin.replace(/\/$/, "")) throw new Error("App URL must be an HTTPS origin");
    const manifest = PluginManifest.parse({
      id: source.id,
      name: source.name,
      version: source.version,
      description: source.description,
      nodes: [],
      app: {
        apiVersion: "1",
        hosting: "self-hosted",
        applicationUrl: normalized.origin,
        redirectUrls: [normalized.origin],
        requestedActions: source.web.requestedActions ?? [],
        extensions: source.extensions.map((extension, index) => ({
          id: extension.id,
          target: extension.target,
          url: `${normalized.origin}/extensions/${hashes[index].slice(7)}.js`,
          sha256: hashes[index],
        })),
      },
    });
    const backend = await build({
      entryPoints: [sourceFile(root, source.web.entry)],
      absWorkingDir: root,
      bundle: true,
      platform: "node",
      preserveSymlinks: true,
      format: "cjs",
      target: "node24",
      outfile: join(stage, "server.cjs"),
      logLevel: "silent",
      metafile: true,
    });
    assertSourceInputs(root, Object.keys(backend.metafile.inputs));
    if (backend.warnings.length) throw new Error(backend.warnings.map((warning) => warning.text).join("\n"));
    if (source.web.platform === "vite" || source.web.platform === "next") {
      const command = source.web.platform === "next" ? "next/dist/bin/next" : "vite/bin/vite.js";
      await promisify(execFile)(process.execPath, [join(root, "node_modules", command), "build"], {
        cwd: root,
        maxBuffer: 8 * 1024 * 1024,
      });
      const site = join(root, source.web.platform === "next" ? "out" : "web-dist");
      pluginFiles(site);
      cpSync(site, join(stage, "site"), { recursive: true, dereference: false });
    } else if (existsSync(join(root, "src/welcome.html"))) {
      let html = readFileSync(sourceFile(root, "src/welcome.html"), "utf8");
      if (html.includes("/* OCTONODE_HOSTED_BRIDGE */")) {
        const browser = await build({ entryPoints: [sourceFile(root, "src/hosted.ts")], absWorkingDir: root, bundle: true, platform: "browser", format: "iife", preserveSymlinks: true, write: false, metafile: true, logLevel: "silent" });
        assertSourceInputs(root, Object.keys(browser.metafile.inputs));
        html = html.replace("/* OCTONODE_HOSTED_BRIDGE */", browser.outputFiles[0].text.replaceAll("</script", "<\\/script"));
      }
      writeFileSync(join(stage, "welcome.html"), html);
    }
    const previousWeb = join(root, "dist/web", source.id);
    if (existsSync(previousWeb)) {
      verifyWebBuild(previousWeb);
      // Retain pinned assets across incremental deployments; clean builders must restore the previous web artifact.
      for (const file of pluginFiles(previousWeb).filter((file) => /^extensions\/[a-f0-9]{64}\.js$/.test(file))) {
        if (!existsSync(join(stage, file))) copyFileSync(join(previousWeb, file), join(stage, file));
      }
    }
    await build({
      stdin: {
        contents: `import { createAppServer } from ${JSON.stringify(require.resolve("./server"))};
import { readFileSync, readdirSync, lstatSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
const root = __dirname;
const record = JSON.parse(readFileSync(join(root,"octonode-web.json"),"utf8"));
function files(dir) { return readdirSync(join(root,dir)).flatMap(name=>{const file=dir?dir+"/"+name:name; const stat=lstatSync(join(root,file)); if(stat.isSymbolicLink())throw Error("Symlink in web build");return stat.isDirectory()?files(file):[file];}); }
const actual=files("").filter(file=>file!=="octonode-web.json").sort();
if(record.format!==1 || JSON.stringify(actual)!==JSON.stringify(Object.keys(record.files).sort()))throw Error("Web build changed");
for(const file of actual)if(createHash("sha256").update(readFileSync(join(root,file))).digest("hex")!==record.files[file])throw Error("Web build changed");
const port=Number(process.env.PORT??3000);if(!Number.isInteger(port)||port<0||port>65535)throw Error("Invalid PORT");
const source={id:record.id,version:"1.0.0",extensions:record.app.extensions};
const host=createAppServer({port,source,development:false});
host.listen().then(()=>{host.setOrigin(record.app.applicationUrl);host.update(source,root,require(join(root,"server.cjs")).default);process.stdout.write("App server ready\\n");});
process.once("SIGINT",()=>host.close());process.once("SIGTERM",()=>host.close());`,
        resolveDir: __dirname,
      },
      bundle: true,
      platform: "node",
      format: "cjs",
      target: "node24",
      outfile: join(stage, "start.cjs"),
      logLevel: "silent",
    });
    writeFileSync(
      join(stage, "octonode-web.json"),
      JSON.stringify({
        format: 1,
        id: source.id,
        app: manifest.app,
        files: Object.fromEntries(pluginFiles(stage).map((file) => [file, fileHash(join(stage, file))])),
      }),
    );
    const webParent = join(root, "dist/web");
    if (!existsSync(webParent)) mkdirSync(webParent);
    if (lstatSync(webParent).isSymbolicLink() || !lstatSync(webParent).isDirectory())
      throw new Error("Unsafe web output directory");
    const webDirectory = join(webParent, source.id);
    const backup = join(output, `.previous-web-${source.id}`);
    if (existsSync(backup)) throw new Error("Previous web backup exists; inspect it before rebuilding");
    if (existsSync(webDirectory)) {
      verifyWebBuild(webDirectory);
      renameSync(webDirectory, backup);
    }
    try {
      renameSync(stage, webDirectory);
      const artifact = buildApp(manifest, output, root);
      rmSync(backup, { recursive: true, force: true });
      return { ...artifact, webDirectory };
    } catch (error) {
      rmSync(webDirectory, { recursive: true, force: true });
      if (existsSync(backup)) renameSync(backup, webDirectory);
      throw error;
    }
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

export function verifyWebBuild(directory: string) {
  const record = JSON.parse(readFileSync(sourceFile(directory, "octonode-web.json"), "utf8"));
  const actual = pluginFiles(directory).filter((file) => file !== "octonode-web.json");
  if (
    record.format !== 1 ||
    !record.files ||
    JSON.stringify(Object.keys(record.files).sort()) !== JSON.stringify(actual.sort())
  )
    throw new Error("Web build changed; rebuild first");
  for (const file of actual)
    if (record.files[file] !== fileHash(join(directory, file))) throw new Error("Web build changed; rebuild first");
  const manifest = PluginManifest.parse({ id: record.id, name: "web", version: "1.0.0", app: record.app });
  return manifest.app!;
}

function assertSourceInputs(root: string, inputs: string[]) {
  for (const input of inputs) {
    if (input === "<stdin>") continue;
    const local = relative(root, resolve(root, input)).replaceAll("\\", "/");
    if (local.split("/").includes("node_modules") && !local.startsWith("../")) continue;
    safePath(local);
    sourceFile(root, local);
  }
}
