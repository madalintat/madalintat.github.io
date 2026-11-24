import { test, expect } from "vitest";
import { routeOf } from "./companion";

const names = ["me-kendo", "me-record", "me-boat-cap", "me-kendo-to-me-kendo-rest", "me-kendo-rest-to-me-kendo-men-off", "me-kendo-men-off-to-me-record",
  "me-record-to-me-kendo-unarmoured", "me-kendo-unarmoured-to-me-dressed", "me-dressed-to-me-boat-cap", "me-boat-cap-to-me-boat-ready"];

test("from armour to filming, every piece of gear comes off in order", () => {
  expect(routeOf(names, "me-kendo", "me-record")).toEqual(["me-kendo-to-me-kendo-rest", "me-kendo-rest-to-me-kendo-men-off", "me-kendo-men-off-to-me-record"]);
});
test("from filming to the boat: the do and tare off, dressed, then in", () => {
  expect(routeOf(names, "me-record", "me-boat-ready")).toEqual(["me-record-to-me-kendo-unarmoured", "me-kendo-unarmoured-to-me-dressed", "me-dressed-to-me-boat-cap", "me-boat-cap-to-me-boat-ready"]);
});
test("no way back up the chain: null, so the page fades me across instead", () => {
  expect(routeOf(names, "me-boat-cap", "me-record")).toBeNull();
  expect(routeOf(names, "me-record", "me-record")).toEqual([]);
});
