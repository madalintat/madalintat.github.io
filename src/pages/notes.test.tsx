import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { NotesPage, NotePage } from "./Notes";
import { notes, drafts } from "../content/notes";

const at = (url: string) => renderToString(
  <MemoryRouter initialEntries={[url]}>
    <Routes><Route path="/notes" element={<NotesPage />} /><Route path="/notes/:slug" element={<NotePage />} /></Routes>
  </MemoryRouter>,
);

test("with no published post, the blog shows its head, what it covers and how to follow", () => {
  expect(notes).toHaveLength(0);
  const html = at("/notes");
  expect(html).toContain("notes from the lab");
  expect(html).toContain("first notes on their way");
  expect(html).toContain('href="/notes/rss.xml"');
});

test("a draft is never listed and its address is not here", () => {
  expect(drafts.length).toBeGreaterThan(0);
  const index = at("/notes");
  for (const d of drafts) {
    expect(index).not.toContain(`/notes/${d.slug}`);
    expect(at(`/notes/${d.slug}`)).toContain("not here");
  }
});

test("an unknown note is not here", () => {
  expect(at("/notes/nope")).toContain("not here");
});
