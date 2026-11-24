// After `vite build` and `vite build --ssr`: writes dist/<route>/index.html for every route, 404.html and sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const D = new URL("../dist/", import.meta.url).pathname;
const S = new URL("../dist-ssr/entry-server.js", import.meta.url);
const { render, routes, head, SITE, llms, rss } = await import(pathToFileURL(S.pathname).href);
import { readdirSync } from "node:fs";
// the h1 is the largest paint and waits on inter (latin, and latin-ext for the ă), so those fonts load first
const fonts = readdirSync(D + "assets").filter((f) => /^(inter-latin-wght|inter-latin-ext-wght|jetbrains-mono-latin-wght)-normal-.*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join("\n    ");
const template = readFileSync(D + "index.html", "utf8").replace("<!--head-->", `${preload}\n    <!--head-->`);
const page = (url, meta) => template.replace("<!--head-->", head(url, meta)).replace("<!--app-->", render(url));

const all = routes();
for (const [url, meta] of Object.entries(all)) {
  mkdirSync(D + url, { recursive: true });
  writeFileSync(D + url + "index.html", page(url, meta));
}
// the 404 is never a page of its own: no canonical, and not for indexing
writeFileSync(D + "404.html", page("/404/", { title: "not here · mădălin tatarciuc", description: "that page does not exist." })
  .replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex" />').replace(/<meta property="og:url"[^>]*>\n\s*/, "").replace(/<meta name="robots" content="index[^>]*>\n\s*/, ""));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(D + "sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(all).map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
// every crawler, ai answer engines named so their owners see the yes; and the plain-text summary they read first
const bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];
writeFileSync(D + "robots.txt", `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(D + "llms.txt", llms());
mkdirSync(D + "notes", { recursive: true });
writeFileSync(D + "notes/rss.xml", rss());
rmSync(new URL("../dist-ssr/", import.meta.url), { recursive: true, force: true });
console.log(`prerendered ${Object.keys(all).length} routes, 404, sitemap`);
