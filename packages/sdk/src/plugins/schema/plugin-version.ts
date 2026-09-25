// Generated from packages/schema/src/plugin-version.ts. Do not edit; run the Octonode SDK sync.
import { z } from "zod";

/** SemVer 2.0.0: no leading zeroes in numeric identifiers. */
export const PluginVersion = z
  .string()
  .max(200)
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/,
    "Use a semantic version such as 1.2.3 or 2.0.0-beta.1",
  );

/** Legacy invalid versions sort below SemVer; build metadata never affects precedence. */
export function comparePluginVersions(left: string, right: string): number {
  const validLeft = PluginVersion.safeParse(left).success;
  const validRight = PluginVersion.safeParse(right).success;
  if (!validLeft || !validRight) return Number(validLeft) - Number(validRight) || left.localeCompare(right);
  const [leftCore, ...leftPre] = left.split("+")[0].split("-");
  const [rightCore, ...rightPre] = right.split("+")[0].split("-");
  const numeric = (a: string, b: string) => a.length - b.length || (a > b ? 1 : a < b ? -1 : 0);
  const a = leftCore.split(".");
  const b = rightCore.split(".");
  for (let i = 0; i < 3; i++) {
    const difference = numeric(a[i], b[i]);
    if (difference) return difference;
  }
  if (!leftPre.length || !rightPre.length) return Number(!leftPre.length) - Number(!rightPre.length);
  const ap = leftPre.join("-").split(".");
  const bp = rightPre.join("-").split(".");
  for (let i = 0; i < Math.min(ap.length, bp.length); i++) {
    if (ap[i] === bp[i]) continue;
    const an = /^\d+$/.test(ap[i]);
    const bn = /^\d+$/.test(bp[i]);
    return an && bn ? numeric(ap[i], bp[i]) : an !== bn ? Number(bn) - Number(an) : ap[i] > bp[i] ? 1 : -1;
  }
  return ap.length - bp.length;
}

/** Match npm's stable patch/minor/major bumps, including promotion from prereleases. */
export function bumpPluginVersion(version: string, release: "patch" | "minor" | "major"): string {
  PluginVersion.parse(version);
  const core = version.split("+")[0];
  const prerelease = core.includes("-");
  let [major, minor, patch] = core.split("-")[0].split(".").map(BigInt);
  if (release === "major") {
    major += !prerelease || minor !== 0n || patch !== 0n ? 1n : 0n;
    minor = 0n;
    patch = 0n;
  } else if (release === "minor") {
    minor += !prerelease || patch !== 0n ? 1n : 0n;
    patch = 0n;
  } else patch += prerelease ? 0n : 1n;
  return PluginVersion.parse(`${major}.${minor}.${patch}`);
}
