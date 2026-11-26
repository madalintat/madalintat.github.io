import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { TopBar } from "./Shell";

const html = renderToString(<MemoryRouter initialEntries={["/work/surogates"]}><TopBar /></MemoryRouter>);

test("the work menu starts closed and links every project page", () => {
  expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*aria-controls="work-menu"/);
  expect(html).toMatch(/id="work-menu" hidden/);
  for (const slug of ["ipporu", "superstarling", "surogates", "romanian-speech"]) expect(html).toContain(`href="/work/${slug}"`);
});

test("the page you are on is marked in the menu", () => {
  expect(html).toMatch(/href="\/work\/surogates" aria-current="page"|aria-current="page" href="\/work\/surogates"/);
});
