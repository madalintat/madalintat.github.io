// After `vite build` and `vite build --ssr`: writes dist/<route>/index.html for every route, 404.html and sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const D = new URL("../dist/", import.meta.url).pathname;
const S = new URL("../dist-ssr/entry-server.js", import.meta.url);
const { render, routes, head, SITE } = await import(pathToFileURL(S.pathname).href);
const template = readFileSync(D + "index.html", "utf8");
const page = (url, meta) => template.replace("<!--head-->", head(url, meta)).replace("<!--app-->", render(url));

const all = routes();
for (const [url, meta] of Object.entries(all)) {
  mkdirSync(D + url, { recursive: true });
  writeFileSync(D + url + "index.html", page(url, meta));
}
writeFileSync(D + "404.html", page("/404/", { title: "not here · mădălin tatarciuc", description: "that page does not exist." }));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(D + "sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(all).map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(D + "robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
rmSync(new URL("../dist-ssr/", import.meta.url), { recursive: true, force: true });
console.log(`prerendered ${Object.keys(all).length} routes, 404, sitemap`);
