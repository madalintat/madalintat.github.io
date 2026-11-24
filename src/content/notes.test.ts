import { test, expect } from "vitest";
import { notes, drafts, parse } from "./notes";

test("both written notes are drafts for now: nothing published", () => {
  expect(notes).toHaveLength(0);
  expect(drafts.map((n) => n.slug)).toEqual(["when-my-labels-fooled-me", "ps3-eye-driver-on-apple-silicon"]);
});

test("every note, draft or not, has a lowercase title, an iso date and a short summary, slugs unique, no em dash", () => {
  const all = [...notes, ...drafts];
  expect(new Set(all.map((n) => n.slug)).size).toBe(all.length);
  for (const n of all) {
    expect(n.title).toBe(n.title.toLowerCase());
    expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(n.summary.length).toBeGreaterThan(0);
    expect(n.summary.length).toBeLessThanOrEqual(160);
    expect(n.html).not.toContain("—");
  }
});

test("front matter: tags split on commas, draft only when true, a reading time of at least a minute", () => {
  const n = parse("x/a-post.md", "---\ntitle: a post\ndate: 2026-12-01\nsummary: s\ntags: speech, small models\n---\nhello world\n");
  expect(n).toMatchObject({ slug: "a-post", tags: ["speech", "small models"], draft: false, minutes: 1 });
  expect(parse("x/b.md", "---\ntitle: b\ndate: 2026-12-01\nsummary: s\ndraft: true\n---\nx\n").draft).toBe(true);
});

test("the labels draft keeps the real numbers and never the old one", () => {
  const n = drafts.find((x) => x.slug === "when-my-labels-fooled-me")!;
  for (const s of ["57%", "58%", "83", "e101", "<table>"]) expect(n.html).toContain(s);
  expect(n.html).not.toContain("74%");
});
