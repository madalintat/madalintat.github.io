/* Me, the character who goes down the page with the reader: one layer over the scenes, in the pose of the scene under
   the middle of the screen (Home picks it from [data-pose]). A pose is a looping sprite (sprite.ts); a new pose lifts
   the old one away and drops the new one in, and where a clip of the move exists (me-record-to-me-boat-cap, me-boat-ready-to-me-dive…) it plays first.
   The pointer near me tilts me a little towards it, in 3D; a touch or a hover plays my reaction for the scene (a wave,
   a strike, a somersault) and I go back to what I was doing. With less motion asked for: still frames, no tilt. */
import { sprite, preload, type Sheet, type Sprite } from "./sprite";

export type Sheets = Record<string, Sheet>;
// what each pose does when it is touched
const REACT: Record<string, string> = { "me-float": "me-float-flip", "me-scuba": "me-scuba-wave" };

export function startCompanion(root: HTMLElement, sheets: Sheets) {
  const tilt = root.querySelector<HTMLElement>(".me-tilt")!, el = root.querySelector<HTMLElement>(".me-sprite")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pose = root.dataset.pose ?? "me-float", busy = false, sp: Sprite | null = null, timer = 0;
  if (sheets[pose]) sp = sprite(el, sheets[pose]);

  // a change of pose cancels any half-done one: its timer, and the faded-out state it would have undone
  const settle = () => { clearTimeout(timer); root.classList.remove("out", "in"); };
  const set = (next: string) => {
    // "hidden": the scene draws me itself (the lab, with the agents), so the companion steps out
    if (next === "hidden") { if (pose !== next) { settle(); pose = next; root.dataset.pose = next; } return; }
    if (next === pose || !sheets[next]) return;
    // a pose the reader could not see (the phone hides the filming one) has no move out of it worth playing
    const unseen = getComputedStyle(root).opacity === "0";
    const from = pose; pose = next;
    preload(sheets[next], ...(REACT[next] && sheets[REACT[next]] ? [sheets[REACT[next]]] : []));
    root.dataset.pose = next;
    settle();
    if (reduce || !sp) { sp?.swap(sheets[next]); return; }
    const move = unseen ? undefined : sheets[`${from}-to-${next}`];
    if (move) { sp.swap(sheets[next]); sp.react(move); return; } // the move itself is the change
    root.classList.add("out");
    timer = window.setTimeout(() => {
      if (!sheets[pose]) return;
      sp!.swap(sheets[pose]); root.classList.remove("out"); root.classList.add("in");
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("in")));
    }, 260);
  };

  const touch = () => {
    const r = sheets[REACT[pose]];
    if (!r || busy || !sp) return;
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
  return { set, stop() { sp?.stop(); clearTimeout(timer); clearInterval(idle); removeEventListener("pointermove", near); } };
}
