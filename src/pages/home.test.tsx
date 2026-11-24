import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";
import { existsSync } from "node:fs";
import { SCENES } from "../content/world";

const html = renderToString(<MemoryRouter><Home /></MemoryRouter>);
const text = html.replace(/<[^>]+>/g, " ");

test("the dive runs from the sky to the floor, in order, each scene with its depth", () => {
  expect(SCENES.map((l) => l.id)).toEqual(["sky", "harbour", "ships", "surface", "whales", "lab", "notebook", "garden"]);
  const shown = SCENES.filter((l) => l.id !== "harbour" && l.id !== "notebook"); // beats inside the sky and the lab
  const at = shown.map((l) => html.indexOf(`id="${l.id}"`));
  expect(at.every((x, i) => x > 0 && (i === 0 || x > at[i - 1]))).toBe(true);
  for (const l of shown) expect(html).toMatch(new RegExp(`id="${l.id}"[^>]*data-m="${l.m}"`));
});

test("every picture the page asks for is in public/", () => {
  const srcs = [...html.matchAll(/(?:src|srcSet|srcset)="(\/sea\/[^"]+)"/g), ...html.matchAll(/url\((\/sea\/[^)]+)\)/g)].map((m) => m[1]);
  expect(srcs.length).toBeGreaterThan(20);
  for (const s of new Set(srcs)) expect(existsSync(`public${s}`), s).toBe(true);
});

test("the page opens on the name, and the proof is on it", () => {
  expect(html).toMatch(/<h1[^>]*>mădălin tatarciuc<\/h1>/);
  for (const s of ["5.69%", "of 182 strikes found", "e1 to e105"]) expect(text).toContain(s); // the proof lives in the stories below
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
