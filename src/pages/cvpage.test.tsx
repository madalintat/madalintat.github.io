import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CvPage } from "./Cv";

const at = (url: string) => renderToString(<MemoryRouter initialEntries={[url]}><Routes><Route path="/cv" element={<CvPage />} /></Routes></MemoryRouter>);

test("research by default, a two-way switch, both pdfs to download", () => {
  const html = at("/cv");
  expect(html).toContain("Applied AI research engineer");
  expect(html).toMatch(/<button[^>]*aria-pressed="true"[^>]*>research<\/button>/);
  expect(html).toMatch(/<button[^>]*aria-pressed="false"[^>]*>builder<\/button>/);
  expect(html).toContain('href="/cv/madalin-tatarciuc-research.pdf"');
  expect(html).toContain('href="/cv/madalin-tatarciuc-builder.pdf"');
});

test("?v=builder shows the builder version", () => {
  const html = at("/cv?v=builder");
  expect(html).toContain("AI engineer who ships the model");
  expect(html).not.toContain("Applied AI research engineer");
});
