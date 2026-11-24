/* The starlings: a live murmuration over the sky plate, after superstarling's flock.js. Boids in a 40 px grid (each
   bird looks only at its neighbours), drawn as small flapping strokes, ink near and slate far. They follow a slow
   wandering leader, and lean away from the pointer. Paused when off screen or when the tab is hidden; under reduced
   motion one still frame. */

type Bird = { x: number; y: number; vx: number; vy: number; z: number; ph: number };

export function startFlock(canvas: HTMLCanvasElement, opts: { count?: number; ink?: string; far?: string } = {}): () => void {
  const g = canvas.getContext("2d")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, raf = 0, on = false, px = -1e4, py = -1e4;
  const birds: Bird[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

  const measure = () => {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(1.5, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = opts.count ?? (W < 720 ? 260 : 620);
    while (birds.length < n) birds.push({ x: W * (0.45 + rnd() * 0.25), y: H * (W < 720 ? 0.5 + rnd() * 0.12 : 0.12 + rnd() * 0.25), vx: (rnd() - 0.5) * 2, vy: (rnd() - 0.5), z: 0.45 + rnd() * 0.55, ph: rnd() * 6.28 });
    birds.length = n;
  };

  const step = (t: number) => {
    // the leader wanders a lazy figure of eight in the upper right of the sky
    const ax = W * (W < 720 ? 0.35 : 0.72) + Math.sin(t * 0.00023) * W * (W < 720 ? 0.12 : 0.1);
    const ay = H * (W < 720 ? 0.7 : 0.16) + Math.sin(t * 0.00041) * H * (W < 720 ? 0.05 : 0.06);
    const grid = new Map<number, Bird[]>();
    const key = (x: number, y: number) => Math.floor(x / 40) * 4096 + Math.floor(y / 40);
    for (const b of birds) { const k = key(b.x, b.y); const c = grid.get(k); if (c) c.push(b); else grid.set(k, [b]); }
    for (const b of birds) {
      let sx = 0, sy = 0, avx = 0, avy = 0, cx = 0, cy = 0, n = 0;
      const gx = Math.floor(b.x / 40), gy = Math.floor(b.y / 40);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const o of grid.get((gx + i) * 4096 + gy + j) ?? []) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d = dx * dx + dy * dy;
        if (d > 1600) continue;
        avx += o.vx; avy += o.vy; cx += o.x; cy += o.y; n++;
        if (d < 90) { sx -= dx; sy -= dy; }
      }
      if (n) { b.vx += (avx / n - b.vx) * 0.06 + (cx / n - b.x) * 0.002; b.vy += (avy / n - b.vy) * 0.06 + (cy / n - b.y) * 0.002; }
      b.vx += sx * 0.02 + (ax - b.x) * 0.0004; b.vy += sy * 0.02 + (ay - b.y) * 0.0004;
      const dx = b.x - px, dy = b.y - py, d2 = dx * dx + dy * dy;
      if (d2 < 14400) { const k = (1 - d2 / 14400) * 0.6; b.vx += (dx / Math.sqrt(d2 + 1)) * k; b.vy += (dy / Math.sqrt(d2 + 1)) * k; }
      const sp = Math.hypot(b.vx, b.vy), max = 2.6 * b.z + 0.6;
      if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; }
      b.x += b.vx; b.y += b.vy;
    }
  };

  const draw = (t: number) => {
    g.clearRect(0, 0, W, H);
    // two inks: far birds in one batched path, near birds in another
    for (const [far, colour] of [[true, opts.far ?? "rgba(43,49,64,.55)"], [false, opts.ink ?? "#111318"]] as const) {
      g.strokeStyle = colour; g.lineWidth = far ? 1 : 1.3; g.lineCap = "round"; g.beginPath();
      for (const b of birds) {
        if (b.z < 0.7 !== far) continue;
        const a = Math.atan2(b.vy, b.vx), w = (2.2 + b.z * 2.4), f = Math.sin(t * 0.018 + b.ph) * w * 0.55;
        const c = Math.cos(a), sn = Math.sin(a);
        // a bird is five points: two wing tips, two elbows, the body
        g.moveTo(b.x - c * w + sn * w, b.y - sn * w - c * w + f);
        g.lineTo(b.x - sn * w * 0.3, b.y + c * w * 0.3 + f * 0.3);
        g.lineTo(b.x, b.y);
        g.lineTo(b.x + sn * w * 0.3, b.y - c * w * 0.3 + f * 0.3);
        g.lineTo(b.x - c * w - sn * w, b.y - sn * w + c * w + f);
      }
      g.stroke();
    }
  };

  const frame = (t: number) => { step(t); draw(t); raf = on && !document.hidden ? requestAnimationFrame(frame) : 0; };
  const go = () => { if (!raf && on && !reduce) raf = requestAnimationFrame(frame); };
  measure();
  if (reduce) { for (let i = 0; i < 240; i++) step(i * 16); draw(0); }
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; go(); });
  io.observe(canvas);
  const ro = new ResizeObserver(() => { measure(); if (reduce) draw(0); });
  ro.observe(canvas);
  const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
  const vis = () => go();
  addEventListener("pointermove", move, { passive: true });
  document.addEventListener("visibilitychange", vis);
  return () => { cancelAnimationFrame(raf); raf = 0; on = false; io.disconnect(); ro.disconnect(); removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", vis); };
}
