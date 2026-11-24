import { test, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { IpporuDemo, clock } from "./IpporuDemo";
import data from "../../public/demo/all-japan-2024.json";
import type { DemoEvent } from "./events";

const html = renderToString(<IpporuDemo src="/demo/a.mp4" poster="/demo/a.jpg" data={{ ...data, events: data.events as DemoEvent[] }} />);

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

test("every event is a button named by what it shows: the time and the event", () => {
  const buttons = html.match(/<button type="button"><time>[^<]+<\/time><span>[^<]+<\/span><\/button>/g) ?? [];
  expect(buttons.length).toBe(data.events.length);
  expect(html).not.toMatch(/aria-label="jump to/);
});

test("never autoplays, credits the footage and says it is not held out", () => {
  expect(html).not.toContain("autoplay");
  expect(html).toContain("public stream");
  expect(html).toContain("not a held-out match");
});
