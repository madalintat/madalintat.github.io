// Writes public/demo/all-japan-2024.json from the ipporu engine output. Run: node --experimental-strip-types scripts/demo-data.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { toClipEvents } from "../src/demo/events.ts";

const LIB = `${process.env.HOME}/kendo_world/platform/replay/studio/lib.json`;
const ID = "-BctO8XF2Gw";
const m = JSON.parse(readFileSync(LIB, "utf8")).find((x) => x.id === ID);
// the engine's per-model layers for the same video (the app's fixture of this match)
const FIX = `${process.env.HOME}/kendo_world/platform/app/fixtures/engine_u_BctO8XF2Gw_0/layers.json`;
const F = JSON.parse(readFileSync(FIX, "utf8"));
if (!m) throw new Error(`${ID} not in ${LIB}`);
const out = {
  title: "all japan championships 2024",
  sub: "1st round, 79 seconds",
  source: `https://www.youtube.com/watch?v=${ID}`,
  win: m.win,
  // it appears in the tracking experiments (notebook E94–E101), so it is not a held-out test match
  heldOut: false,
  dur: 79,
  events: toClipEvents(m),
  // what each model saw, in clip seconds, so the story can show one model at a time
  layers: clipLayers(m, F, 79),
};

function clipLayers(m, F, dur) {
  const [a] = m.win, r = (x) => Math.round(x * 100) / 100, inside = (t) => t >= a && t <= a + dur;
  return {
    // the sound model: the clip's loudness at 20 a second (lib wave covers the window from a), and every shinai crack it heard
    wave: m.wave.slice(0, dur * 20),
    cracks: m.cracks.filter(([t]) => inside(t)).map(([t, db]) => [r(t - a), r(db)]),
    // the tracker: the distance between the two fighters (maai, in body heights), every 0.2 s
    maai: F.t.map((t, i) => [t, F.maai[i]]).filter(([t, v], i) => inside(t) && v != null && i % 2 === 0).map(([t, v]) => [r(t - a), r(v)]),
    // the feet: fumikomi (the stamp that lands a strike) and hiki (stepping back)
    foot: F.foot.filter(([t]) => inside(t)).map(([t, s, k]) => [r(t - a), s === 0 ? "aka" : "shiro", k]),
  };
}
writeFileSync(new URL("../public/demo/all-japan-2024.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(`${out.events.length} events:`, out.events.map((e) => `${e.kind}@${e.t.toFixed(1)}`).join(" "));
