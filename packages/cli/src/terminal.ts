const color = (code: number | string, value: string, stream: NodeJS.WriteStream = process.stdout) =>
  stream.isTTY
    ? `\x1b[${code}m${value}\x1b[0m`
    : value;
const coral = "38;2;255;118;95";

export const terminal = {
  brand() {
    if (!process.stdout.isTTY) return;
    process.stdout.write(`\n  ${color(coral, "⬡")} ${color(1, "octonodes")} ${color(90, "· app development")}\n\n`);
  },
  step(label: string) {
    if (process.stdout.isTTY) process.stdout.write(`  ${color(coral, "◆")} ${label}\n`);
  },
  ready(name: string, url: string, previewUrl: string, studioUrl?: string) {
    if (!process.stdout.isTTY) return false;
    process.stdout.write(
      `\n  ${color(32, "●")} ${color(1, name)} ${color(32, "is ready")}\n` +
        `  ${color(90, "────────────────────────────────────────────────────────")}\n` +
        `  ${color(90, "App")}       ${color(coral, url)}\n` +
        `  ${color(90, studioUrl ? "Studio" : "Preview")}   ${color(coral, studioUrl ?? previewUrl)}\n` +
        `  ${color(90, "Tunnel")}    ${color(32, url.startsWith("https:") ? "Connected" : "Local only")}\n\n` +
        `  ${color(90, "Watching for changes · Ctrl-C to stop")}\n\n`,
    );
    return true;
  },
  rebuilt() {
    process.stderr.write(`${process.stderr.isTTY ? `  ${color(coral, "↻", process.stderr)} ` : ""}${color(32, "App rebuilt", process.stderr)}\n`);
  },
  created(path: string, platform?: string) {
    if (!process.stdout.isTTY) return false;
    this.brand();
    process.stdout.write(
      `  ${color(32, "●")} Created ${color(1, path)}${platform ? ` ${color(90, `(${platform})`)}` : ""}\n\n` +
        `  ${color(90, "Next steps")}\n  ${color(coral, `cd ${path}`)}\n  ${color(coral, "npm install")}\n  ${color(coral, "npx octonodes login")}\n  ${color(coral, "npm run dev")}\n\n`,
    );
    return true;
  },
  login(message: string) {
    if (!process.stdout.isTTY) return false;
    process.stdout.write(`  ${color(32, "●")} ${message}\n\n`);
    return true;
  },
};
