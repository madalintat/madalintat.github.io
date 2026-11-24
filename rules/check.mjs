// npm run check: exits 0 only when every check passes. Run after npm run build.
import { execSync } from "node:child_process";
const HOME = process.env.HOME;
const steps = [
  ["tokens", "node rules/css-tokens.mjs"],
  ["slop, source", `node ${HOME}/real-design-no-stupidass-slop/skills/slop-audit/scripts/uislop-scan.mjs src --strict`],
  ["copy", "node rules/copy.mjs"],
  ["links", "node rules/links.mjs"],
  ["tests", "npx vitest run"],
];
// in ci the slop tools and voicecheck live only on the owner's machine: those steps run locally
const LOCAL_ONLY = new Set(["slop, source", "copy"]);
let failed = [];
for (const [name, cmd] of steps) {
  if (process.env.CI && LOCAL_ONLY.has(name)) { console.log(`skip  ${name} (local only)`); continue; }
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    if (name.startsWith("slop") && !out.includes("No slop signals")) throw Object.assign(new Error(), { stdout: out });
    console.log(`ok    ${name}`);
  } catch (e) { failed.push(name); console.log(`FAIL  ${name}\n${e.stdout ?? ""}${e.stderr ?? ""}`); }
}
process.exit(failed.length ? 1 : 0);
