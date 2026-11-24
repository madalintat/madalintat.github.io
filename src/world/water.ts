/* The water, alive: one small WebGL shader over a painted plate, in one of two modes.
     surface   the plate redrawn with the sea under its horizon moving: slow horizontal ripples that grow towards the
               viewer, and the glints breathing. Nothing above the horizon moves.
     caustics  underwater light: a net of moving bright lines, screen-blended over the plate, strongest near the
               surface and fading with depth.
   The plate's <img> stays under the canvas, so with no WebGL, no JS or less motion the painting is simply there.
   Drawn at half resolution, only while on screen and the tab is visible. */

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const SURFACE = `precision mediump float; varying vec2 v; uniform sampler2D img; uniform float t, hz; uniform vec2 scale, off;
void main(){
  vec2 q = vec2(v.x, 1. - v.y) * scale + off;      // the picture's own 0..1, top down (object-fit: cover)
  float d = max(0., q.y - hz);                     // how far under the painted horizon
  float a = d * d * 9.;                            // ripples grow towards the viewer
  q.x += sin(q.y * 220. - t * 1.3) * .0016 * a + sin(q.y * 57. + t * .7) * .0022 * a;
  q.y += sin(q.x * 36. + t * .9) * .0009 * a;
  vec4 c = texture2D(img, q);
  float glint = smoothstep(.82, 1., dot(c.rgb, vec3(.33))) * step(hz, q.y);
  c.rgb += glint * (.12 + .12 * sin(t * 2.3 + uv.x * 40. + uv.y * 90.));
  gl_FragColor = c;
}`;

const CAUSTICS = `precision mediump float; varying vec2 v; uniform float t, top; uniform vec2 res; uniform vec3 tint;
float net(vec2 p, float t){
  vec2 i = p; float c = 1.; const float k = .005;
  for (int n = 0; n < 4; n++) {
    float s = t * (1. - (3.5 / float(n + 1)));
    i = p + vec2(cos(s - i.x) + sin(s + i.y), sin(s - i.y) + cos(s + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + s) / k), p.y / (cos(i.y + s) / k)));
  }
  c /= 4.; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.);
}
void main(){
  vec2 p = vec2(v.x * res.x / res.y, v.y) * 5.;
  float l = clamp(net(p, t * .35), 0., 1.);
  float fade = smoothstep(0., 1., mix(1. - top, 1., v.y));   // brighter near the top of the frame
  gl_FragColor = vec4(tint * l * fade, 1.);
}`;

export type WaterOpts = { mode: "surface"; img: HTMLImageElement; horizon: () => number } | { mode: "caustics"; top?: number; tint?: [number, number, number] };

export function startWater(canvas: HTMLCanvasElement, o: WaterOpts): () => void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
  if (!gl) return () => {};
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, o.mode === "surface" ? SURFACE : CAUSTICS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);

  let ready = o.mode === "caustics", iw = 1, ih = 1;
  if (o.mode === "surface") {
    const tex = gl.createTexture();
    const load = () => {
      const im = new Image(); im.crossOrigin = "anonymous"; im.src = o.img.currentSrc || o.img.src;
      im.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, val);
        iw = im.naturalWidth; ih = im.naturalHeight; ready = true; canvas.classList.add("live"); go();
      };
    };
    if (o.img.complete) load(); else o.img.addEventListener("load", load, { once: true });
  } else canvas.classList.add("live");

  let W = 0, H = 0, raf = 0, on = false;
  const size = () => {
    const r = canvas.getBoundingClientRect(), k = 0.5 * Math.min(2, devicePixelRatio || 1);
    W = Math.max(2, Math.round(r.width * k)); H = Math.max(2, Math.round(r.height * k));
    canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
  };
  const frame = (now: number) => {
    raf = 0;
    if (!ready) return;
    gl.uniform1f(u("t"), now / 1000);
    if (o.mode === "surface") {
      // object-fit: cover, in the texture's own 0..1
      const sa = W / H, ia = iw / ih, sx = sa > ia ? 1 : sa / ia, sy = sa > ia ? ia / sa : 1;
      gl.uniform2f(u("scale"), sx, sy); gl.uniform2f(u("off"), (1 - sx) / 2, (1 - sy) / 2);
      gl.uniform1f(u("hz"), o.horizon());
    } else {
      gl.uniform2f(u("res"), W, H); gl.uniform1f(u("top"), o.top ?? 0.7);
      const c = o.tint ?? [0.56, 0.89, 0.82]; gl.uniform3f(u("tint"), c[0], c[1], c[2]);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (on && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const go = () => { if (!raf && on) raf = requestAnimationFrame(frame); };
  size();
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; go(); }); io.observe(canvas);
  const ro = new ResizeObserver(() => { size(); go(); }); ro.observe(canvas);
  document.addEventListener("visibilitychange", go);
  return () => { cancelAnimationFrame(raf); on = false; io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", go); };
}
