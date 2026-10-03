export const PACKAGE = "@octonodes/cli";
export const HOMEPAGE = "https://github.com/nivdoron1/octonode-devtools";
export const TARGETS = ["darwin-arm64", "darwin-x64", "linux-arm64", "linux-x64", "win32-x64"];
export const UPGRADE_CODE = "A863136D-42D7-4AF0-9B3E-C47348928E6A";
export const WIX_VERSION = "6.0.2";

export function assetNames(version, target) {
  const names = [`octonodes-${version}-${target}.${target === "win32-x64" ? "zip" : "tar.gz"}`];
  if (target === "win32-x64") names.push(`octonodes-${version}-${target}.msi`);
  if (target.startsWith("linux-")) {
    const arch = target.endsWith("x64") ? "amd64" : "arm64";
    const rpmArch = target.endsWith("x64") ? "x86_64" : "aarch64";
    names.push(`octonodes_${version}_${arch}.deb`, `octonodes-${version}-1.${rpmArch}.rpm`);
  }
  return names;
}
