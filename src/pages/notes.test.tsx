import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { NotesPage, NotePage } from "./Notes";

const at = (url: string) => renderToString(
  <MemoryRouter initialEntries={[url]}>
    <Routes><Route path="/notes" element={<NotesPage />} /><Route path="/notes/:slug" element={<NotePage />} /></Routes>
  </MemoryRouter>,
);

test("the notes index lists both notes, newest first, with dates", () => {
  const html = at("/notes");
  const a = html.indexOf('href="/notes/when-my-labels-fooled-me"'), b = html.indexOf('href="/notes/ps3-eye-driver-on-apple-silicon"');
  expect(a).toBeGreaterThan(0); expect(b).toBeGreaterThan(a);
  expect(html).toContain("2026-11-24");
});

test("a note renders its title, date and body", () => {
  const html = at("/notes/when-my-labels-fooled-me");
  expect(html).toMatch(/<h1[^>]*>when my labels fooled me<\/h1>/);
  expect(html).toContain("<table>");
});

test("an unknown note is not here", () => {
  expect(at("/notes/nope")).toContain("not here");
});
