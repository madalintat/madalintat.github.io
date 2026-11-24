// The world behind the page: sky, flock, a city that rises out of the ground as you scroll into it, and the earth
// under it. One fixed canvas, drawn from the scroll position. Scenes are read from [data-scene] elements.
import { sceneProgress } from "./progress";

type Scene = { id: string; top: number; height: number };
type Rgb = [number, number, number];

const SKY: [number, Rgb][] = [[0, [7, 9, 18]], [0.6, [14, 18, 32]], [1, [27, 29, 40]]];
const EARTH: [number, Rgb][] = [[0, [24, 20, 17]], [0.5, [15, 12, 11]], [1, [6, 5, 5]]];
const CREAM = "236,230,216";
const LIT = "236,214,170";
const AKA = "#e0463c";

function mix(stops: [number, Rgb][], t: number): Rgb {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
    const [a, ca] = stops[i - 1], [b, cb] = stops[i], k = (t - a) / (b - a);
    return ca.map((v, j) => Math.round(v + (cb[j] - v) * k)) as Rgb;
  }
  return stops[stops.length - 1][1];
}

function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

type Building = { x: number; w: number; h: number; win: [number, number, number][]; ant: boolean; ph: number; order: number };
const PERIOD = 2600;

function layer(rnd: () => number, hMin: number, hMax: number, wMin: number, wMax: number, lit: number): Building[] {
  const out: Building[] = [];
  for (let x = 0; x < PERIOD;) {
    const w = wMin + rnd() * (wMax - wMin), h = hMin + rnd() * (hMax - hMin);
    const win: [number, number, number][] = [];
    for (let wy = 10; wy < h - 8; wy += 11) for (let wx = 6; wx < w - 6; wx += 9) if (rnd() < lit) win.push([wx, wy, rnd() * 9]);
    out.push({ x, w, h, win, ant: h > hMax * 0.8 && rnd() < 0.6, ph: rnd() * 3, order: rnd() });
    x += w + rnd() * 6;
  }
  return out;
}

export function startWorld(canvas: HTMLCanvasElement): () => void {
  const g = canvas.getContext("2d")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = seeded(7);
  let W = 0, H = 0, docH = 0, raf = 0, CH = 800;
  let scenes: Record<string, Scene> = {};
  let far: Building[] = [], mid: Building[] = [], near: Building[] = [];

  const stars = Array.from({ length: 240 }, () => ({ x: rnd(), y: rnd(), r: rnd() * 1.1 + 0.3, p: rnd() * 6 }));
  const birds: { x: number; y: number; vx: number; vy: number }[] = [];
  const cars = Array.from({ length: 28 }, () => ({ x: rnd() * 3000, v: (rnd() < 0.5 ? -1 : 1) * (1.2 + rnd() * 2.2), lane: rnd() < 0.5 ? 0 : 1 }));

  function measure() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    scenes = {};
    document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
      scenes[el.id] = { id: el.id, top: el.offsetTop, height: el.offsetHeight };
    });
    docH = document.documentElement.scrollHeight;
    if (Math.abs(CH - Math.max(560, H)) > 80 || !far.length) {
      CH = Math.max(560, H);
      const r = seeded(11);
      far = layer(r, CH * 0.18, CH * 0.62, 36, 90, 0.16);
      mid = layer(r, CH * 0.14, CH * 0.46, 50, 110, 0.22);
      near = layer(r, CH * 0.06, CH * 0.24, 70, 150, 0.3);
    }
    if (!birds.length) {
      const n = W < 720 ? 90 : 170;
      for (let i = 0; i < n; i++) birds.push({ x: W * (W < 720 ? 0.5 : 0.76) + (rnd() - 0.5) * 240, y: 90 + rnd() * 220, vx: rnd() - 0.5, vy: rnd() - 0.5 });
    }
  }

  const ground = () => { const c = scenes.city; return c ? c.top + c.height - 60 : docH * 0.6; };

  function flock(t: number) {
    const cx = W < 720 ? W * 0.5 : W * 0.76, cy = W < 720 ? H * 0.16 : H * 0.2;
    const ax = cx + Math.sin(t * 0.00031) * W * (W < 720 ? 0.3 : 0.13), ay = cy + Math.sin(t * 0.00047) * 110;
    for (const b of birds) {
      let sx = 0, sy = 0, avx = 0, avy = 0, n = 0;
      for (const o of birds) {
        const dx = o.x - b.x, dy = o.y - b.y, d = dx * dx + dy * dy;
        if (d < 1600 && o !== b) { avx += o.vx; avy += o.vy; n++; if (d < 120) { sx -= dx; sy -= dy; } }
      }
      if (n) { b.vx += (avx / n - b.vx) * 0.05; b.vy += (avy / n - b.vy) * 0.05; }
      b.vx += sx * 0.012 + (ax - b.x) * 0.00035; b.vy += sy * 0.012 + (ay - b.y) * 0.00035;
      const sp = Math.hypot(b.vx, b.vy); if (sp > 2.4) { b.vx *= 2.4 / sp; b.vy *= 2.4 / sp; }
      b.x += b.vx; b.y += b.vy;
    }
  }

  function buildings(L: Building[], base: number, off: number, fill: string, winA: number, rise: number, t: number) {
    for (let rep = -1; rep <= Math.ceil(W / PERIOD); rep++) for (const b of L) {
      const x = (((b.x - off) % PERIOD) + PERIOD) % PERIOD + rep * PERIOD;
      if (x > W + 200 || x + b.w < -200) continue;
      // each building comes up out of the ground at its own moment while the city scene forms
      const k = reduce ? 1 : Math.max(0, Math.min(1, (rise * 1.6 - b.order * 0.6) * 1.4));
      if (k <= 0) continue;
      const h = b.h * (1 - Math.pow(1 - k, 3));
      g.fillStyle = fill; g.fillRect(x, base - h, b.w, h);
      if (k < 1) continue;
      if (b.ant) {
        g.fillRect(x + b.w / 2 - 0.5, base - h - 26, 1, 26);
        if (reduce || Math.sin(t * 0.003 + b.ph) > 0.6) { g.fillStyle = AKA; g.beginPath(); g.arc(x + b.w / 2, base - h - 27, 2, 0, 7); g.fill(); }
      }
      for (const [wx, wy, ph] of b.win) {
        if (!reduce && Math.sin(t * 0.0004 + ph * 7) < -0.85) continue;
        g.fillStyle = `rgba(${LIT},${winA * (0.55 + 0.45 * Math.sin(ph))})`; g.fillRect(x + wx, base - h + wy, 3, 4);
      }
    }
  }

  function city(t: number, sy: number) {
    const base = ground() - sy;
    if (base < -40 || base - CH * 0.75 > H) return;
    const c = scenes.city;
    const rise = c ? sceneProgress(c.top - H * 0.6, c.height, H, sy) : 1;
    const drift = reduce ? 0 : t * 0.006;
    buildings(far, base - 40, drift * 0.4 + sy * 0.08, "#1a2033", 0.45, rise, t);
    buildings(mid, base - 18, drift * 0.8 + sy * 0.18, "#121726", 0.75, rise * 0.92, t);
    if (rise > 0.75) {
      const ry = base - CH * 0.2;
      g.fillStyle = `rgba(${CREAM},0.12)`; g.fillRect(0, ry + 18, W, 2);
      for (let x = ((-drift * 4) % 120 + 120) % 120; x < W; x += 120) g.fillRect(x, ry + 20, 3, CH * 0.2 - 20);
      const tx = reduce ? W * 0.3 : ((t * 0.32) % (W + 1100)) - 900;
      g.fillStyle = "#0b0e16"; g.fillRect(tx, ry, 760, 18);
      g.fillStyle = `rgba(${LIT},0.85)`; for (let x = 12; x < 750; x += 19) g.fillRect(tx + x, ry + 5, 10, 6);
      g.fillStyle = AKA; g.fillRect(tx + 756, ry + 6, 3, 5);
    }
    buildings(near, base, drift * 1.4 + sy * 0.32, "#0a0c13", 0.8, rise * 0.85, t);
    g.fillStyle = "#08090d"; g.fillRect(0, base, W, 22);
    for (const car of cars) {
      if (!reduce) car.x += car.v;
      const x = ((car.x % (W + 200)) + W + 200) % (W + 200) - 100;
      g.fillStyle = car.v > 0 ? `rgba(${CREAM},0.9)` : "rgba(224,70,60,0.85)";
      g.fillRect(x, base + 7 + car.lane * 8, 14, 2);
    }
    g.strokeStyle = `rgba(${CREAM},0.35)`; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, base + 22.5); g.lineTo(W, base + 22.5); g.stroke();
  }

  function earth(t: number, sy: number) {
    const gY = ground() + 22;
    g.lineWidth = 1;
    for (let k = 0; k < 90; k++) {
      const wy = gY + 40 + k * 46 - sy;
      if (wy < -20 || wy > H + 20) continue;
      g.strokeStyle = `rgba(${CREAM},${k % 4 === 0 ? 0.09 : 0.045})`;
      g.beginPath();
      for (let x = 0; x <= W; x += 16) g.lineTo(x, wy + Math.sin(x * 0.006 + k * 1.7) * 7 + Math.sin(x * 0.021 + k) * 2);
      g.stroke();
    }
    // the subway runs under the engine room
    const e = scenes.engine;
    if (e) {
      const ty = e.top + e.height - H * 0.35 - sy;
      if (ty > -60 && ty < H + 60) {
        g.strokeStyle = `rgba(${CREAM},0.16)`; g.strokeRect(-2, ty, W + 4, 46);
        const tx = reduce ? W * 0.2 : ((t * 0.5) % (W + 900)) - 700;
        g.fillStyle = "#1d1f25"; g.fillRect(tx, ty + 8, 620, 30);
        g.fillStyle = `rgba(${LIT},0.75)`; for (let x = 10; x < 610; x += 22) g.fillRect(tx + x, ty + 15, 12, 8);
      }
    }
  }

  function frame(t: number) {
    const sy = scrollY, gY = ground();
    const colourAt = (y: number) => (y < gY ? mix(SKY, y / gY) : mix(EARTH, (y - gY) / Math.max(1, docH - gY)));
    const grd = g.createLinearGradient(0, 0, 0, H);
    for (let i = 0; i <= 6; i++) grd.addColorStop(i / 6, `rgb(${colourAt(sy + (H * i) / 6).join(",")})`);
    g.fillStyle = grd; g.fillRect(0, 0, W, H);

    const skyEnd = gY - CH;
    if (sy < skyEnd) for (const s of stars) {
      const y = s.y * skyEnd - sy * 0.6;
      if (y < 0 || y > H) continue;
      g.fillStyle = `rgba(${CREAM},${0.25 + 0.35 * (reduce ? 0.5 : (Math.sin(t * 0.001 + s.p) + 1) / 2)})`;
      g.fillRect(s.x * W, y, s.r, s.r);
    }

    const flockEnd = scenes.flock ? scenes.flock.top + scenes.flock.height : H * 2;
    if (sy < flockEnd) {
      if (!reduce) flock(t);
      // the flock follows the reader down through the sky, then is left behind
      const lift = Math.max(0, sy - (flockEnd - H)) ;
      g.strokeStyle = `rgba(${CREAM},0.8)`; g.lineWidth = 1;
      for (const b of birds) {
        const y = b.y - lift;
        if (y < -10 || y > H + 10) continue;
        const a = Math.atan2(b.vy, b.vx), f = Math.sin(t * 0.02 + b.x) * 1.5;
        g.beginPath();
        g.moveTo(b.x - Math.cos(a - 0.6) * 4, y - Math.sin(a - 0.6) * 4 - f);
        g.lineTo(b.x, y);
        g.lineTo(b.x - Math.cos(a + 0.6) * 4, y - Math.sin(a + 0.6) * 4 - f);
        g.stroke();
      }
    }

    city(t, sy);
    if (sy + H > gY) earth(t, sy);
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  const onScroll = () => { if (reduce) requestAnimationFrame(frame); };
  const onResize = () => { measure(); if (reduce) frame(0); };
  measure();
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  addEventListener("resize", onResize);
  addEventListener("scroll", onScroll, { passive: true });
  if (reduce) frame(0); else raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf); ro.disconnect();
    removeEventListener("resize", onResize); removeEventListener("scroll", onScroll);
  };
}
