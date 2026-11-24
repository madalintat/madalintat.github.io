// Runs on dist/ after `npm run build`. Skipped when there is no build.
import { test, expect, describe } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const D = new URL("../dist/", import.meta.url).pathname;
const has = existsSync(D + "index.html");
const read = (p) => readFileSync(D + p, "utf8");
const ROUTES = {
  "": "mădălin tatarciuc",
  "work/ipporu/": "ipporu", "work/romanian-speech/": "romanian speech", "work/superstarling/": "superstarling", "work/surogates/": "surogates",
  "notes/": "what i measured, and what broke",
  "notes/when-my-labels-fooled-me/": "when my labels fooled me",
  "notes/ps3-eye-driver-on-apple-silicon/": "ps3 eye driver on apple silicon",
  "cv/": "Mădălin Tatarciuc",
};

describe.skipIf(!has)("the prerendered site", () => {
  test("every route is a real html file with its h1 in the raw html", () => {
    for (const [r, h1] of Object.entries(ROUTES)) {
      const html = read(r + "index.html");
      expect(html, r).toMatch(new RegExp(`<h1[^>]*>${h1}</h1>`));
    }
  });
  test("the ipporu page and the home carry the demo's event list without js", () => {
    for (const r of ["work/ipporu/", ""]) expect((read(r + "index.html").match(/<li class="ev /g) ?? []).length, r).toBe(8);
  });
  test("titles are unique and every page has description and og tags", () => {
    const titles = Object.keys(ROUTES).map((r) => read(r + "index.html").match(/<title>([^<]+)<\/title>/)?.[1]);
    expect(new Set(titles).size).toBe(titles.length);
    for (const r of Object.keys(ROUTES)) for (const t of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:image"']) expect(read(r + "index.html"), `${r} ${t}`).toContain(t);
  });
  test("a 404 page and a sitemap with every route", () => {
    expect(read("404.html")).toContain("not here");
    const map = read("sitemap.xml");
    for (const r of Object.keys(ROUTES)) expect(map).toContain(`https://madalintat.github.io/${r}<`);
  });
});
