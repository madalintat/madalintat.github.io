// Writes public/demo/all-japan-2024.json from the ipporu engine output. Run: node --experimental-strip-types scripts/demo-data.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { toClipEvents } from "../src/demo/events.ts";

const LIB = `${process.env.HOME}/kendo_world/platform/replay/studio/lib.json`;
const ID = "-BctO8XF2Gw";
const m = JSON.parse(readFileSync(LIB, "utf8")).find((x) => x.id === ID);
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
};
writeFileSync(new URL("../public/demo/all-japan-2024.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(`${out.events.length} events:`, out.events.map((e) => `${e.kind}@${e.t.toFixed(1)}`).join(" "));
