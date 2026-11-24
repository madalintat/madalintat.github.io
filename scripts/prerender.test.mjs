// Runs on dist/ after `npm run build`. Skipped when there is no build.
import { test, expect, describe } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const D = new URL("../dist/", import.meta.url).pathname;
const has = existsSync(D + "index.html");
const read = (p) => readFileSync(D + p, "utf8");
const ROUTES = {
  "": "mădălin tatarciuc",
  "work/ipporu/": "ipporu", "work/romanian-speech/": "romanian speech", "work/superstarling/": "superstarling", "work/surogates/": "surogates",
  "notes/": "notes from the lab",
  "cv/": "Mădălin Tatarciuc",
};

describe.skipIf(!has)("the prerendered site", () => {
  test("every route is a real html file with its h1 in the raw html", () => {
    for (const [r, h1] of Object.entries(ROUTES)) {
      const html = read(r + "index.html");
      expect(html, r).toMatch(new RegExp(`<h1[^>]*>${h1}</h1>`));
    }
  });
  test("the ipporu page carries the demo's event list without js", () => {
    expect((read("work/ipporu/index.html").match(/<li class="ev /g) ?? []).length).toBe(8);
  });
  test("search and ai engines get who this is: json-ld, llms.txt, and a yes for ai crawlers", () => {
    const ld = JSON.parse(read("index.html").match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
    const me = ld["@graph"].find((n) => n["@type"] === "Person");
    expect(me.name).toBe("Mădălin Tatarciuc");
    expect(me.sameAs).toContain("https://huggingface.co/cetusian");
    expect(ld["@graph"].some((n) => n.name?.startsWith("ipporu"))).toBe(true);
    const txt = read("llms.txt");
    for (const w of ["# Mădălin Tatarciuc", "ipporu", "superstarling", "5.69%", "how it is built"]) expect(txt).toContain(w);
    for (const b of ["GPTBot", "ClaudeBot", "PerplexityBot"]) expect(read("robots.txt")).toContain(`User-agent: ${b}\nAllow: /`);
  });
  test("titles are unique and every page has description and og tags", () => {
    const titles = Object.keys(ROUTES).map((r) => read(r + "index.html").match(/<title>([^<]+)<\/title>/)?.[1]);
    expect(new Set(titles).size).toBe(titles.length);
    for (const r of Object.keys(ROUTES)) for (const t of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:image"']) expect(read(r + "index.html"), `${r} ${t}`).toContain(t);
  });
  test("a 404 page and a sitemap with every route", () => {
    expect(read("404.html")).toContain("not here");
    const map = read("sitemap.xml");
    for (const r of Object.keys(ROUTES)) expect(map).toContain(`https://cetusian.com/${r}<`);
  });
  test("drafts stay out of the build: no page, not in the sitemap, an empty but valid feed", () => {
    expect(existsSync(D + "notes/when-my-labels-fooled-me/index.html")).toBe(false);
    expect(read("sitemap.xml")).not.toContain("when-my-labels-fooled-me");
    const feed = read("notes/rss.xml");
    expect(feed).toContain("<rss version=\"2.0\"");
    expect(feed).not.toContain("<item>");
  });
});
