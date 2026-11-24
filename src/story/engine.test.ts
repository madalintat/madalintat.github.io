import { test, expect } from "vitest";
import { draw, type Part } from "./engine";

// a stand-in element: only what draw() touches
const el = (text = "") => {
  const cls = new Set<string>(), vars: Record<string, string> = {};
  return { textContent: text, classList: { toggle: (c: string, on: boolean) => (on ? cls.add(c) : cls.delete(c)) }, style: { setProperty: (k: string, v: string) => (vars[k] = v) }, cls, vars };
};
const part = (e: ReturnType<typeof el>, at: number, to: number | null, extra: Partial<Part> = {}): Part =>
  ({ el: e as unknown as HTMLElement, at, to, text: null, num: null, unit: "", dec: 0, on: null, t: -1, n: "", ...extra });

test("a part is on from its beat", () => {
  const e = el(); const l = [part(e, 2, null)];
  draw(l, 1.9); expect(e.cls.has("on")).toBe(false);
  draw(l, 2); expect(e.cls.has("on")).toBe(true);
});

test("typed words type in between data-at and data-to", () => {
  const e = el("tracker"); const l = [part(e, 1, 2, { text: "tracker" })];
  draw(l, 1.5); expect(e.textContent).toBe("trac");
  draw(l, 3); expect(e.textContent).toBe("tracker");
});

test("numbers count up with their decimals and unit", () => {
  const e = el(); const l = [part(e, 0, 1, { num: 5.69, dec: 2, unit: "%" })];
  draw(l, 0.5); expect(e.textContent).toBe("2.85%");
  draw(l, 1); expect(e.textContent).toBe("5.69%");
});

test("anything else runs --t from 0 to 1", () => {
  const e = el(); const l = [part(e, 1, 3)];
  draw(l, 2); expect(e.vars["--t"]).toBe("0.500");
});
