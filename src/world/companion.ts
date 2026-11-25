/* Me, the character who goes down the page with the reader: one layer over the scenes, in the pose of the scene under
   the middle of the screen (Home picks it from [data-pose]). A pose is a looping sprite (sprite.ts); where clips of
   the moves between two poses exist they play in order (the armour coming off, the dive), and otherwise I go up in a
   cloud of bubbles, the one I dive into scuba through, and come out of it in the new pose.
   The pointer near me tilts me a little towards it, in 3D; a touch or a hover plays my reaction for the scene (a wave,
   a strike, a somersault) and I go back to what I was doing. With less motion asked for: still frames, no tilt. */
import { sprite, preload, type Sheet, type Sprite } from "./sprite";

export type Sheets = Record<string, Sheet>;
// what each pose does when it is touched
const REACT: Record<string, string> = { "me-float": "me-float-flip", "me-scuba": "me-scuba-wave" };
const MOVE_SPEED = 1.5;
// the bubbles sheet (art/bubbles.sh) is thickest at its 10th frame: the pose changes under it there
const COVER_FRAME = 9;

/** The shortest run of moves from pose a to pose b, read off the sheets' names ("me-record-to-me-kendo-unarmoured"),
    so I get from one place to the next through every step between: the shinai down, the kote, the men; then the do,
    the tare, dressed, into the boat. Null when there is no way through. */
export function routeOf(names: string[], a: string, b: string): string[] | null {
  const moves = new Map<string, [string, string][]>();
  for (const k of names) { const m = k.match(/^(me-.+?)-to-(me-.+)$/); if (m) moves.set(m[1], [...(moves.get(m[1]) ?? []), [m[2], k]]); }
  const via = new Map<string, string[]>([[a, []]]), q = [a];
  for (let p = q.shift(); p; p = q.shift()) {
    if (p === b) return via.get(p)!;
    for (const [to, k] of moves.get(p) ?? []) if (!via.has(to)) { via.set(to, [...via.get(p)!, k]); q.push(to); }
  }
  return null;
}

export function startCompanion(root: HTMLElement, sheets: Sheets) {
  const tilt = root.querySelector<HTMLElement>(".me-tilt")!, el = root.querySelector<HTMLElement>(".me-sprite")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pose = root.dataset.pose ?? "me-float", busy = false, sp: Sprite | null = null, timer = 0;
  if (sheets[pose]) sp = sprite(el, sheets[pose]);
  // the cloud rests on its first frame, which is empty (fps 0 holds it there), and plays through once for a change
  const bubbles = sheets.bubbles, cloudEl = root.querySelector<HTMLElement>(".me-bubbles");
  const cloud = bubbles && cloudEl ? sprite(cloudEl, { ...bubbles, fps: 0 }) : null;
  const coverMs = bubbles ? (COVER_FRAME * 1000) / bubbles.fps : 0;
  // a cloud's ticket and start: a later change rides the cloud already playing if it has not thinned out yet
  let puff = 0, puffAt = -Infinity;
  const clear = () => { puff++; puffAt = -Infinity; if (cloud && bubbles) cloud.swap({ ...bubbles, fps: 0 }); };

  const route = (a: string, b: string) => routeOf(Object.keys(sheets), a, b);
  // a run of moves plays one after another; a new pose voids the run (its ticket) wherever it has got to
  let run = 0, moving = false;
  const play = (keys: string[]) => {
    const t = ++run; moving = true;
    // a move plays at 1.5x: the clips are drawn slow, and each has to finish inside the beat that asked for it
    const step = (i: number) => { if (t !== run) return; if (i === keys.length) { moving = false; return; } const k = sheets[keys[i]]; sp!.react({ ...k, fps: k.fps * MOVE_SPEED }, () => step(i + 1)); };
    step(0);
  };

  // a change of pose cancels any half-done one: its timer and its run of moves
  const settle = () => { clearTimeout(timer); run++; moving = false; };
  // the pose names my place (sea.css). I am put there at once, never slid: it changes only while I cannot be seen
  // (hidden, faded, under the bubbles) or between two poses with the same place
  const place = (p: string) => {
    if (root.dataset.pose === p) return;
    root.classList.add("jump"); root.dataset.pose = p;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("jump")));
  };
  /** next: a pose, or "entry>pose": coming in from hidden I appear as the entry and move from there (in armour, then
      the gear comes off one piece at a time until I am filming) */
  const set = (want: string) => {
    const [entry, next] = want.includes(">") ? want.split(">") : ["", want];
    if (next === pose) return;
    // "hidden": the scene draws me itself (the dojo, the lab), so the companion steps out where it stands
    if (next === "hidden") { settle(); clear(); pose = next; root.classList.add("away"); return; }
    if (!sheets[next]) return;
    if (entry && pose === "hidden" && sheets[entry] && !reduce) set(entry);
    const from = pose; pose = next;
    // what this pose may do next loads now: its reaction, and the first step of every move out of it
    preload(sheets[next], ...[REACT[next], ...Object.keys(sheets).filter((k) => k.startsWith(`${next}-to-`))].filter((k) => k && sheets[k]).map((k) => sheets[k]));
    settle();
    // back from hidden: already unseen, so I take my new place and come in there
    if (from === "hidden" || reduce || !sp) {
      place(next); sp?.swap(sheets[next]);
      if (from === "hidden" && !reduce) { root.classList.add("in"); requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("in"))); }
      root.classList.remove("away");
      return;
    }
    // moves play only between two places of one size: otherwise the first would jump as it starts
    const keys = route(from, next), w = root.offsetWidth;
    if (keys?.length) {
      place(next);
      if (Math.abs(root.offsetWidth - w) < 2) { clear(); preload(...keys.map((k) => sheets[k])); sp.swap(sheets[next]); play(keys); return; }
      place(from);
    }
    // no clip for it: the bubbles, and the pose and place change under their thickest
    if (!cloud) { place(next); sp.swap(sheets[next]); return; }
    moving = true;
    const since = performance.now() - puffAt;
    if (since >= coverMs) { const c = ++puff; puffAt = performance.now(); cloud.react(bubbles!, () => { if (c === puff) moving = false; }); }
    timer = window.setTimeout(() => { if (sheets[pose]) { place(pose); sp!.swap(sheets[pose]); } }, since < coverMs ? coverMs - since : coverMs);
  };

  const touch = () => {
    const r = sheets[REACT[pose]];
    if (!r || busy || moving || !sp) return;
    busy = true; root.classList.add("acting");
    sp.react(r, () => { busy = false; root.classList.remove("acting"); });
  };
  const near = (e: PointerEvent) => {
    if (reduce) return;
    const b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / innerWidth * 2)), dy = Math.max(-1, Math.min(1, (e.clientY - cy) / innerHeight * 2));
    tilt.style.transform = `rotateY(${(dx * 14).toFixed(2)}deg) rotateX(${(-dy * 9).toFixed(2)}deg)`;
  };
  // I do my thing on my own now and then, not only when touched
  const idle = window.setInterval(() => { if (!document.hidden && !reduce) touch(); }, 13000);
  el.addEventListener("pointerenter", touch);
  el.addEventListener("click", touch);
  addEventListener("pointermove", near, { passive: true });
  return { set, stop() { sp?.stop(); cloud?.stop(); clearTimeout(timer); clearInterval(idle); removeEventListener("pointermove", near); } };
}
