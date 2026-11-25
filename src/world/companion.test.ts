import { test, expect } from "vitest";
import names from "../content/sprites.json";
import { routeOf } from "./companion";

const all = Object.keys(names);

test("dojo to filming, in seiza: kote off (right, then left), men off with the tenugui inside it, then the phone", () => {
  expect(routeOf(all, "me-kendo", "me-record")).toEqual(["me-kendo-to-me-seiza-bogu", "me-seiza-bogu-to-me-seiza-kote-off", "me-seiza-kote-off-to-me-seiza-men-off", "me-seiza-men-off-to-me-record"]);
});
test("filming to the water: do off, the tare hung on the do, out to change and back dressed, the boat, the dive in a cloud of bubbles, scuba", () => {
  expect(routeOf(all, "me-record", "me-scuba")).toEqual(["me-record-to-me-seiza-do-off", "me-seiza-do-off-to-me-seiza-unarmoured", "me-seiza-unarmoured-to-me-gear-only", "me-gear-only-to-me-dressed",
    "me-dressed-to-me-boat-cap", "me-boat-cap-to-me-boat-ready", "me-boat-ready-to-me-dive", "me-dive-to-me-scuba"]);
});
test("no way back up the chain: null, so the page fades me across instead", () => {
  expect(routeOf(all, "me-boat-cap", "me-record")).toBeNull();
  expect(routeOf(all, "me-record", "me-record")).toEqual([]);
});
