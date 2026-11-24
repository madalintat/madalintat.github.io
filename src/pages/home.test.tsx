import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";
import { Film } from "../components/Film";

const html = renderToString(<MemoryRouter><Home /></MemoryRouter>);

test("home names the person and the handle", () => {
  expect(html).toMatch(/<h1[^>]*>mădălin tatarciuc<\/h1>/);
  expect(html).toContain("cetusian");
});

test("home links the four projects, the cv and the four profiles, and no email", () => {
  for (const slug of ["ipporu", "romanian-speech", "superstarling", "surogates"]) expect(html).toContain(`href="/work/${slug}"`);
  expect(html).toContain('href="/cv"');
  for (const p of ["github.com/madalintat", "huggingface.co/cetusian", "x.com/cetusian", "linkedin.com/in/madalin-tatarciuc"]) expect(html).toContain(p);
  expect(html).not.toContain("mailto:");
});

test("the film never autoplays from the server and offers play", () => {
  const f = renderToString(<Film src="/a.mp4" poster="/a.jpg" alt="a film" />);
  expect(f).not.toContain("autoplay");
  expect(f).toContain('aria-label="play film"');
  expect(f).toContain("muted");
});

test("each work row carries a number with its unit", () => {
  for (const s of ["99 countries", "5.00% WER", "31 block types", "708 commits"]) expect(html).toContain(s);
});
