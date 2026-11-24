// ego-browser nodejs < rules/sweep.mjs   (with vite preview of dist/ on :4179)
// One page in the given task space (EGO_SPACE, default 8), reused, closed at the end. Every route at four widths: no sideways scroll, buttons at least 44 px on a phone.
const BASE = "http://localhost:4179";
const OUT = "/Users/madalintat/madalintat-site/docs/sweep/";
const ROUTES = ["/", "/work/ipporu/", "/work/romanian-speech/", "/work/superstarling/", "/work/surogates/", "/notes/", "/notes/when-my-labels-fooled-me/", "/notes/ps3-eye-driver-on-apple-silicon/", "/cv/"];
const WIDTHS = [390, 820, 1280, 1600];
const task = await taskSpace(Number(process.env.EGO_SPACE ?? 8));
const page = await task.newPage();
const problems = [];
try {
  for (const w of WIDTHS) {
    await page.cdp("Emulation.setDeviceMetricsOverride", { width: w, height: w === 390 ? 844 : 800, deviceScaleFactor: 1, mobile: w === 390 });
    for (const r of ROUTES) {
      await page.goto(BASE + r, { timeout: 20000 });
      await page.cdp("Emulation.setDeviceMetricsOverride", { width: w, height: w === 390 ? 844 : 800, deviceScaleFactor: 1, mobile: w === 390 });
      await page.waitForTimeout(900);
      const f = await page.evaluate((phone) => {
        const d = document.documentElement, out = [];
        if (d.scrollWidth > d.clientWidth) out.push(`scrolls sideways ${d.scrollWidth} > ${d.clientWidth}`);
        if (phone) for (const b of document.querySelectorAll("button")) { const r = b.getBoundingClientRect(); if (r.width && (r.height < 40 || r.width < 40)) out.push(`small button "${b.textContent || b.getAttribute("aria-label")}" ${Math.round(r.width)}x${Math.round(r.height)}`); }
        return out;
      }, w === 390);
      for (const p of f) problems.push(`${w} ${r}: ${p}`);
      await page.screenshot({ path: `${OUT}${w}${r.replace(/\//g, "_") || "_"}.png` });
    }
  }
} finally {
  await page.close(); // the caller finishes the space: task.finish({ keep: [] })
}
console.log(problems.length ? problems.join("\n") : "sweep: no problems");
