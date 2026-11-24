import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";
import { existsSync } from "node:fs";
import { SCENES } from "../content/world";

const html = renderToString(<MemoryRouter><Home /></MemoryRouter>);
const text = html.replace(/<[^>]+>/g, " ");

test("the dive runs from the sky to the floor, in order, each scene with its depth", () => {
  expect(SCENES.map((l) => l.id)).toEqual(["sky", "harbour", "ships", "surface", "whales", "bench", "lab", "notebook", "garden"]);
  const shown = SCENES.filter((l) => !["harbour", "bench", "notebook"].includes(l.id)); // beats inside the sky, the whales and the lab
  const at = shown.map((l) => html.indexOf(`id="${l.id}"`));
  expect(at.every((x, i) => x > 0 && (i === 0 || x > at[i - 1]))).toBe(true);
  for (const l of shown) expect(html).toMatch(new RegExp(`id="${l.id}"[^>]*data-m="${l.m}"`));
});

test("every picture the page asks for is in public/", () => {
  const srcs = [...html.matchAll(/(?:src|srcSet|srcset)="(\/sea\/[^"]+)"/g), ...html.matchAll(/url\((\/sea\/[^)]+)\)/g)].map((m) => m[1]);
  expect(srcs.length).toBeGreaterThan(20);
  for (const s of new Set(srcs)) expect(existsSync(`public${s.split("?")[0]}`), s).toBe(true); // ?v= is only a cache key
});

test("the page opens on the name, and the proof is on it", () => {
  expect(html).toMatch(/<h1[^>]*>mădălin tatarciuc<\/h1>/);
  for (const s of ["5.69%", "of 182 strikes found", "105 experiments"]) expect(text).toContain(s); // the proof lives in the stories below
});

test("titles are lowercase, copy has no em dash, no commit counts, no stale or retracted numbers", () => {
  for (const l of SCENES) expect(l.title).toBe(l.title.toLowerCase());
  expect(html).not.toContain("—");
  for (const bad of ["commit", "5.00%", "5.75%", "7.15", "73%", "74%", "76% who"]) expect(text.toLowerCase()).not.toContain(bad);
});

test("contact is one tap away: email in the header and on the floor, the cvs, the profiles", () => {
  expect(html.match(/href="mailto:madalintat@gmail.com"/g)!.length).toBeGreaterThanOrEqual(2);
  for (const h of ['href="/cv"', 'href="/cv?v=builder"', "github.com/madalintat", "huggingface.co/surogate", "linkedin.com/in/madalin-tatarciuc"]) expect(html).toContain(h);
});

test("without javascript every scene is already formed", () => {
  expect(html).not.toMatch(/--p:\s*0[;"]/);
});

test("a phone's sheets open only when asked: none in the prerendered page, and every way in says it opens one", () => {
  expect(html).not.toContain("bsheet");
  const ways = html.match(/class="(?:card-toggle|ip-more)"[^>]*/g)!;
  expect(ways.length).toBeGreaterThanOrEqual(10); // the cards with more, and each model's "how it was made"
  for (const w of ways) expect(w).toContain('aria-haspopup="dialog"');
  // the rows the sheet shows are on the page too, for a desktop and for no javascript
  expect(html.match(/class="ip-facts"/g)!.length).toBe(html.match(/class="ip-more"/g)!.length);
});
