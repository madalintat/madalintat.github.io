import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { WorkPage } from "./Work";
import { work } from "../content/work";
import { sources } from "../content/sources";

const render = (path: string) =>
  renderToString(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/work/:slug" element={<WorkPage />} /></Routes>
    </MemoryRouter>,
  );
const text = (html: string) => html.replace(/<!-- -->/g, "").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");

for (const w of work) {
  test(`${w.slug}: title, every number with its condition, what i did, limits, footnotes`, () => {
    const html = text(render(`/work/${w.slug}`));
    expect(html).toMatch(new RegExp(`<h1[^>]*>${w.title}</h1>`));
    for (const n of w.numbers) {
      expect(html).toContain(n.value);
      expect(html).toContain(n.condition);
    }
    expect(html).toContain("what i did");
    expect(html).toContain("limits");
    for (const l of w.limits) expect(html).toContain(l);
    for (const id of new Set(w.numbers.map((n) => n.source))) expect(html).toContain(sources.find((s) => s.id === id)!.text);
  });
}

test("an unknown slug renders the not-found page", () => {
  expect(render("/work/nope")).toContain("not here");
});
