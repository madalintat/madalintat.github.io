import { test, expect } from "vitest";
import { sceneProgress } from "./progress";

test("a pinned scene runs 0 to 1 while its sticky stage holds the screen", () => {
  // scene top 1000, 300vh tall at an 800px screen: pinned from 1000 to 2600
  expect(sceneProgress(1000, 2400, 800, 900)).toBe(0);
  expect(sceneProgress(1000, 2400, 800, 1000)).toBe(0);
  expect(sceneProgress(1000, 2400, 800, 1800)).toBeCloseTo(0.5);
  expect(sceneProgress(1000, 2400, 800, 2600)).toBe(1);
  expect(sceneProgress(1000, 2400, 800, 9000)).toBe(1);
});

test("a scene no taller than the screen is always formed", () => {
  expect(sceneProgress(0, 800, 800, 0)).toBe(1);
});
