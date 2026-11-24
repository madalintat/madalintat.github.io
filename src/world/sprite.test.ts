import { test, expect } from "vitest";
import { frameAt, cellAt } from "./sprite";

test("a loop runs at its own fps and wraps round", () => {
  expect(frameAt(0, 12, 48)).toBe(0);
  expect(frameAt(1000, 12, 48)).toBe(12);
  expect(frameAt(4000, 12, 48)).toBe(0); // 48 frames at 12 a second: back to the start after 4 s
  expect(frameAt(4100, 12, 48)).toBe(1);
});

test("a reaction plays once and holds its last frame", () => {
  expect(frameAt(5000, 12, 48, true)).toBe(47);
  expect(frameAt(1000, 12, 48, true)).toBe(12);
});

test("a frame's cell is found in a sheet 8 to a row", () => {
  expect(cellAt(0, 8)).toEqual([0, 0]);
  expect(cellAt(7, 8)).toEqual([7, 0]);
  expect(cellAt(8, 8)).toEqual([0, 1]);
  expect(cellAt(47, 8)).toEqual([7, 5]);
});
