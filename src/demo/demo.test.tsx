import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { IpporuDemo, clock, type DemoData } from "./IpporuDemo";
import data from "../../public/demo/all-japan-2024.json";

const html = renderToString(<IpporuDemo src="/demo/a.mp4" poster="/demo/a.jpg" data={data as unknown as DemoData} />);

test("clock reads m:ss", () => {
  expect(clock(44.93)).toBe("0:44");
  expect(clock(70.02)).toBe("1:10");
});

test("without js the page lists every event with its time", () => {
  const items = html.match(/<li class="ev/g) ?? [];
  expect(items.length).toBe(data.events.length);
  expect(html).toContain("0:44");
  expect(html).toContain("kote");
});

test("one row per model, and a button for each ippon", () => {
  for (const name of ["sound", "tracker", "pose", "strike finder", "flag reader", "ippon"]) expect(html).toContain(`<b>${name}</b>`);
  expect(html.match(/>ippon <!-- -->\d/g)?.length).toBe(data.events.filter((e) => e.kind === "ippon").length);
});

test("the timeline is a slider a keyboard can reach", () => {
  expect(html).toMatch(/role="slider" tabindex="0" aria-label="the match timeline"/);
});

test("never autoplays, has no native controls, credits the footage and says it is not held out", () => {
  expect(html).not.toContain("autoplay");
  expect(html).not.toMatch(/<video[^>]*controls/);
  expect(html).toContain("public stream");
  expect(html).toContain("not a held-out match");
});
