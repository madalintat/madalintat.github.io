import { test, expect } from "vitest";
import { notes } from "./notes";

test("two notes at launch, newest first", () => {
  expect(notes.map((n) => n.slug)).toEqual(["when-my-labels-fooled-me", "ps3-eye-driver-on-apple-silicon"]);
});

test("every note has a lowercase title, an iso date and a short summary, slugs unique, no em dash", () => {
  expect(new Set(notes.map((n) => n.slug)).size).toBe(notes.length);
  for (const n of notes) {
    expect(n.title).toBe(n.title.toLowerCase());
    expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(n.summary.length).toBeGreaterThan(0);
    expect(n.summary.length).toBeLessThanOrEqual(160);
    expect(n.html).not.toContain("—");
  }
});

test("the labels note carries the real numbers and never the old one", () => {
  const n = notes.find((x) => x.slug === "when-my-labels-fooled-me")!;
  for (const s of ["57%", "58%", "83", "e101", "<table>"]) expect(n.html).toContain(s);
  expect(n.html).not.toContain("74%");
});
