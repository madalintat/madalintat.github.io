// Every visible block of text on the built site (cv aside: it is sentence case for recruiters) through the
// owner's voicecheck and the slop copy check. Batch-level voicecheck rules are LinkedIn posting rules (the same
// number in two comments) and do not apply to one website, so only per-block refusals count.
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const D = new URL("../dist/", import.meta.url).pathname;
const VOICE = `${process.env.HOME}/cetusian/social/tools/voicecheck`;
const SLOP = `${process.env.HOME}/real-design-no-stupidass-slop/skills/slop-audit/scripts/check.py`;
// the ps3 eye post is a 2025 post ported as it was published
const SKIP = ["cv/", "notes/ps3-eye-driver-on-apple-silicon/"];

function* pages(dir, rel = "") {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e), r = rel + e;
    if (statSync(p).isDirectory()) yield* pages(p, r + "/");
    else if (e === "index.html" && !SKIP.some((s) => r.startsWith(s))) yield [r, readFileSync(p, "utf8")];
  }
}

export function blocks(html) {
  const body = html.replace(/[\s\S]*<div id="root">/, "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, "");
  return body
    .split(/<\/?(?:p|li|h1|h2|h3|dd|dt|td|th|figcaption|header|nav|ol|ul|dl|div|section|article|table|tr)\b[^>]*>/)
    .map((t) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim())
    .filter((t) => t.split(" ").length >= 4);
}

let failed = 0;
const seen = new Set(), all = [];
for (const [route, html] of pages(D)) for (const b of blocks(html)) if (!seen.has(b)) { seen.add(b); all.push(b); }
const file = join(tmpdir(), "site-copy.json");
writeFileSync(file, JSON.stringify(all.map((text) => ({ text }))));
let out = "";
try { out = execFileSync(VOICE, ["linkedin", file], { encoding: "utf8" }); } catch (e) { out = e.stdout ?? ""; }
const bad = out.split("\n").filter((l) => l.trim() && !l.startsWith("ok") && !l.startsWith("REFUSE batch"));
if (bad.length) { failed++; console.log("voicecheck:\n" + bad.join("\n")); }
try { execFileSync("python3", [SLOP], { input: all.join("\n\n"), encoding: "utf8" }); }
catch (e) { failed++; console.log("slop copy:\n" + e.stdout); }
console.log(`copy: ${all.length} blocks, ${failed ? "FAIL" : "ok"}`);
process.exit(failed ? 1 : 0);
