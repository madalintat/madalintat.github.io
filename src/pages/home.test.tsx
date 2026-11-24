import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";
import { LAYERS } from "../content/world";

const html = renderToString(<MemoryRouter><Home /></MemoryRouter>);
const text = html.replace(/<[^>]+>/g, " ");

test("the world runs from the sky to the core, in order, each scene with its depth", () => {
  expect(LAYERS.map((l) => l.id)).toEqual(["sky", "flock", "rooftops", "city", "street", "engine", "bedrock", "core"]);
  const at = LAYERS.map((l) => html.indexOf(`id="${l.id}"`));
  expect(at.every((x, i) => x > 0 && (i === 0 || x > at[i - 1]))).toBe(true);
  for (const l of LAYERS) expect(html).toMatch(new RegExp(`id="${l.id}"[^>]*data-m="${l.m}"`));
});

test("the first scene carries the name and the proof", () => {
  expect(html).toMatch(/<h1[^>]*>mădălin tatarciuc<\/h1>/);
  for (const s of ["5.69%", "152 of 182", "e1 to e105"]) expect(text).toContain(s);
});

test("titles are lowercase, copy has no em dash, no commit counts, no stale or retracted numbers", () => {
  for (const l of LAYERS) expect(l.title).toBe(l.title.toLowerCase());
  expect(html).not.toContain("—");
  for (const bad of ["commit", "5.00%", "5.75%", "7.15", "73%", "74%", "76% who"]) expect(text.toLowerCase()).not.toContain(bad);
});

test("contact is one tap away: email in the header and at the core, the cvs, the profiles", () => {
  expect(html.match(/href="mailto:madalintat@gmail.com"/g)!.length).toBeGreaterThanOrEqual(2);
  for (const h of ['href="/cv"', 'href="/cv?v=builder"', "github.com/madalintat", "huggingface.co/surogate", "linkedin.com/in/madalin-tatarciuc"]) expect(html).toContain(h);
});

test("without javascript every scene is already formed", () => {
  expect(html).not.toMatch(/--p:\s*0[;"]/);
});
