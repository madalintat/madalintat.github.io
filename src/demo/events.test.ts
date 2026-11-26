import { test, expect } from "vitest";
import { toClipEvents, lastBefore, stepMoment, waveBars, type LibMatch } from "./events";

const m: LibMatch = {
  id: "x", name: "n", sub: "s", win: [100, 195],
  strikes: [[99, 0, 0.9], [108.26, 0, 0.83], [154.05, 1, 0.87]],
  ips: [{ t: 154.2, who: "shiro", waza: "men", letter: "M" }],
  flags: [[155, "white"]],
};

test("keeps events inside the window, shifted to clip time, sides named, sorted", () => {
  const e = toClipEvents(m);
  expect(e.map((x) => x.kind)).toEqual(["strike", "strike", "ippon", "flag"]);
  expect(e[0]).toMatchObject({ kind: "strike", side: "aka", conf: 0.83 });
  expect(e[0].t).toBeCloseTo(8.26);
  expect(e[1]).toMatchObject({ kind: "strike", side: "shiro" });
  expect(e[1].t).toBeCloseTo(54.05);
  expect(e[2]).toMatchObject({ kind: "ippon", side: "shiro", waza: "men" });
  expect(e[2].t).toBeCloseTo(54.2);
  expect(e[3]).toMatchObject({ kind: "flag", colour: "white" });
  expect(e[3].t).toBeCloseTo(55);
});


test("the label holds the last event for two seconds, never shows one early", () => {
  const e = toClipEvents(m);
  expect(lastBefore(e, 55.9)).toMatchObject({ kind: "flag" });
  expect(lastBefore(e, 57.5)).toBeUndefined();
  expect(lastBefore(e, 8.0)).toBeUndefined();
});

test("next and previous moment step through the events from where the video is", () => {
  const e = toClipEvents(m); // 8.26, 54.05, 54.2, 55
  expect(stepMoment(e, 0, 1)?.t).toBeCloseTo(8.26);
  expect(stepMoment(e, 8.26, 1)?.t).toBeCloseTo(54.05);
  expect(stepMoment(e, 55, 1)).toBeUndefined();
  // from a moment you picked, back is the one before it, not the same one again
  expect(stepMoment(e, 55, -1)?.t).toBeCloseTo(54.2);
  expect(stepMoment(e, 8.26, -1)).toBeUndefined();
});

test("a wave becomes one bar per sample, scaled to the loudest", () => {
  expect(waveBars([0, 5, 10], 3)).toBe("M0 1V1M1 1V0.5M2 1V0");
});
