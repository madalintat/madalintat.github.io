// Final review fixes: each test pins what a visitor got wrong before.
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { scrollTarget } from "./layout/ScrollOnNav";

const css = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const at = (url: string) => renderToString(<StaticRouter location={url}><App /></StaticRouter>);

test("the demo's video box and credit have their own classes, so home.css cannot restyle them", () => {
  const html = at("/work/ipporu");
  expect(html).toContain('class="demo-stage"');
  expect(html).toContain('class="demo-credit"');
  expect(css("./demo/demo.css")).not.toMatch(/^\.(stage|credit)\b/m);
});

test("a page change scrolls to the hash target, otherwise to the top", () => {
  expect(scrollTarget("#flock")).toBe("flock");
  expect(scrollTarget("")).toBeNull();
});

test("/cv?v=builder first renders what was prerendered at /cv/, so hydration matches", () => {
  expect(at("/cv?v=builder")).toContain(at("/cv").match(/<p class="role">[^<]+<\/p>/)![0]);
});

test("phones keep the notes and cv links in the top bar", () => {
  expect(css("./layout/shell.css")).not.toMatch(/\.bar nav \{ display: none/);
});

test("without javascript every story and scene is laid out flat and fully shown", () => {
  const block = css("./story/story.css").match(/@media \(scripting: none\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(block).toMatch(/\.st \{[^}]*height: auto/);
  expect(block).toMatch(/\[data-at\][^{]*\{[^}]*opacity: 1/);
  expect(block).toMatch(/\.st-caps li[^{]*\{[^}]*opacity: 1/);
  expect(block).toMatch(/stroke-dashoffset: 0/);
});
