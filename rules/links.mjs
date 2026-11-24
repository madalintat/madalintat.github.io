// Every internal link resolves to a file in dist/, every external link answers below 400 (HEAD, then GET).
// linkedin and x answer bots with 999/403 whatever the page; those count as reachable, not as checked.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const D = new URL("../dist/", import.meta.url).pathname;
const SITE = "https://cetusian.com";
const BOT_WALLS = ["linkedin.com", "x.com"];

function* html(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* html(p);
    else if (e.endsWith(".html")) yield p;
  }
}

const internal = new Map(), external = new Set();
for (const f of html(D)) for (const [, href] of readFileSync(f, "utf8").matchAll(/(?:href|src|poster)="([^"#]+)/g)) {
  if (href.startsWith("mailto:")) continue;
  // the site's own absolute urls (canonical, og, sitemap) are checked against dist/ like any internal link
  const own = href.startsWith(SITE) ? href.slice(SITE.length) || "/" : null;
  if (/^https?:/.test(href) && own == null) { external.add(href); continue; }
  const local = own ?? href;
  if (!internal.has(local)) internal.set(local, f.replace(D, ""));
}

let bad = 0;
for (const [href, from] of internal) {
  const path = decodeURIComponent(href.split("?")[0]).replace(/^\//, "");
  const ok = existsSync(D + path) && (statSync(D + path).isFile() || existsSync(D + path + "/index.html")) || existsSync(D + path + "/index.html");
  if (!ok) { bad++; console.log(`missing  ${href}  (from ${from})`); }
}
for (const url of external) {
  let status = 0;
  for (let attempt = 0; attempt < 2 && (status === 0 || status >= 400 || status < 0); attempt++) {
    try {
      status = (await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000) })).status;
      if (status >= 400) status = (await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000) })).status;
    } catch (e) { status = -1; }
  }
  const wall = BOT_WALLS.some((w) => new URL(url).hostname.endsWith(w));
  if (status >= 400 || status < 0) { if (wall) console.log(`wall     ${status} ${url}`); else { bad++; console.log(`broken   ${status} ${url}`); } }
}
console.log(`links: ${internal.size} internal, ${external.size} external, ${bad ? bad + " broken" : "ok"}`);
process.exit(bad ? 1 : 0);
