import { test, expect } from "vitest";
import names from "../content/sprites.json";
import { routeOf } from "./companion";

const all = Object.keys(names);

test("dojo to filming: the bout closes (sonkyo, osame-to, step back, bow in sageto), kneel left knee first with the shinai on the left, kote off right then left, men off, then the phone", () => {
  expect(routeOf(all, "me-kendo", "me-record")).toEqual(["me-kendo-to-me-sageto", "me-sageto-to-me-seiza-bogu", "me-seiza-bogu-to-me-seiza-kote-off", "me-seiza-kote-off-to-me-seiza-men-off", "me-seiza-men-off-to-me-record"]);
});
test("filming to dressed: do off, the tare hung on the do, a seated bow, out to change and back dressed", () => {
  expect(routeOf(all, "me-record", "me-dressed")).toEqual(["me-record-to-me-seiza-do-off", "me-seiza-do-off-to-me-seiza-unarmoured", "me-seiza-unarmoured-to-me-gear-only", "me-gear-only-to-me-dressed"]);
});
test("the dojo faces left and the boat right, so no clip joins them: the page fades me across", () => {
  expect(routeOf(all, "me-dressed", "me-boat-cap")).toBeNull();
  expect(routeOf(all, "me-boat-cap", "me-scuba")).toEqual(["me-boat-cap-to-me-boat-ready", "me-boat-ready-to-me-dive", "me-dive-to-me-scuba"]);
});
test("no way back up the chain: null, so the page fades me across instead", () => {
  expect(routeOf(all, "me-boat-cap", "me-record")).toBeNull();
  expect(routeOf(all, "me-record", "me-record")).toEqual([]);
});
