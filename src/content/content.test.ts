import { test, expect } from "vitest";
import { work, getWork } from "./work";
import { sources } from "./sources";

const ALLOWED_CAPS = ["V-JEPA", "FLEURS", "CPU", "WER", "HF", "GPU", "SQLite", "MCP"];
const lower = (s: string) => ALLOWED_CAPS.reduce((acc, w) => acc.replaceAll(w, w.toLowerCase()), s);

test("four projects in order", () => {
  expect(work.map((w) => w.slug)).toEqual(["ipporu", "romanian-speech", "superstarling", "surogates"]);
  expect(getWork("surogates")?.slug).toBe("surogates");
  expect(getWork("nope")).toBeUndefined();
});

test("every number names a source that exists and a condition", () => {
  const ids = new Set(sources.map((s) => s.id));
  for (const w of work)
    for (const n of w.numbers) {
      expect(ids.has(n.source), `${w.slug} ${n.value} -> ${n.source}`).toBe(true);
      expect(n.condition.trim().length, `${w.slug} ${n.value}`).toBeGreaterThan(0);
    }
});

test("nothing banned anywhere in the content", () => {
  const all = JSON.stringify(work);
  for (const bad of ["—", "Superstar (", "Surogate Ops", "73–74", "74%"]) expect(all).not.toContain(bad);
});

test("titles and lines are lowercase, brand caps aside", () => {
  for (const w of work) {
    expect(lower(w.title)).toBe(lower(w.title).toLowerCase());
    expect(lower(w.line)).toBe(lower(w.line).toLowerCase());
  }
});

test("every project says what i did and at least one limit", () => {
  for (const w of work) {
    expect(w.mine.length).toBeGreaterThan(20);
    expect(w.limits.length).toBeGreaterThan(0);
  }
});
