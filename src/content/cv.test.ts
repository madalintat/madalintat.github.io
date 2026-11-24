import { test, expect } from "vitest";
import { cv, type CvVersion } from "./cv";

const text = (v: CvVersion) => JSON.stringify(cv[v]);

test("both versions carry the basics and the current speech numbers", () => {
  for (const v of ["research", "builder"] as CvVersion[]) {
    const t = text(v);
    for (const s of ["EU citizen", "jackrabbit-110m-ro", "Surogates", "5.69%", "madalintat@gmail.com"]) expect(t, `${v} ${s}`).toContain(s);
    expect(t.split("madalintat@gmail.com").length - 1).toBe(1);
  }
  expect(text("research")).toContain("57%");
});

test("neither version names private work, a retracted number, a stale number or a commit count", () => {
  for (const v of ["research", "builder"] as CvVersion[]) {
    const t = text(v).toLowerCase();
    for (const bad of ["superstar (", "surogate ops", "74%", "5.00%", "5.75%", "7.15", "commit", "—"]) expect(t, `${v} ${bad}`).not.toContain(bad);
  }
});
