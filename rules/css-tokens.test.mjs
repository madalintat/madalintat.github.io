import { test, expect } from "vitest";
import { undefinedTokens } from "./css-tokens.mjs";

test("a token used and defined is fine", () => {
  expect(undefinedTokens([{ file: "a.css", css: ":root{--a:1px}\n.x{gap:var(--a)}" }])).toEqual([]);
});

test("a token used and defined nowhere is reported with its line", () => {
  expect(undefinedTokens([{ file: "a.css", css: ".x{\ngap:var(--b)}" }])).toEqual([["--b", ["a.css:2"]]]);
});
