// Stick Animation Studio runtime: core.js (MIT)
// Shared state, maths, colour, drawing primitives, text, camera layers, and the shot registry.
// Every shot draws in logical units: 1920x1080 for 16:9 and 1080x1920 for 9:16. The player scales to output pixels.
import { STYLES } from './styles.js';

export const E = { W: 1920, H: 1080, PX: 1, fps: 24, vertical: false, style: null, styleId: 'noir', cfg: {}, words: [], shots: [] };
/** V(landscapeValue, verticalValue): pick a value for the current aspect. */
export const V = (land, vert) => (E.vertical ? vert : land);

// ----- maths -----
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, k) => a + (b - a) * k;
/** prog(t, a, b): 0 before a, 1 after b, linear in between. */
export const prog = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
const BACK = 1.70158;
export const ease = {
  linear: (x) => clamp(x),
  in: (x) => clamp(x) ** 3,
  out: (x) => 1 - (1 - clamp(x)) ** 3,
  inOut: (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - ((2 - 2 * x) ** 3) / 2; },
  sine: (x) => (1 - Math.cos(Math.PI * clamp(x))) / 2,
  outBack: (x) => { const u = clamp(x) - 1; return 1 + u * u * ((BACK + 1) * u + BACK); },
  outElastic: (x) => { x = clamp(x); if (x === 0 || x === 1) return x; return Math.pow(2, -10 * x) * Math.sin(((x * 10 - 0.75) * 2 * Math.PI) / 3) + 1; },
};
/** Blend numbers, arrays or objects of numbers. Non-numeric fields switch halfway. */
export function mixVal(a, b, k) {
  if (typeof a === 'number') return lerp(a, b ?? a, k);
  if (Array.isArray(a)) return a.map((v, i) => mixVal(v, b?.[i], k));
  const out = {};
  for (const key of Object.keys(a)) {
    const va = a[key], vb = b?.[key] ?? va;
    out[key] = typeof va === 'number' || Array.isArray(va) ? mixVal(va, vb, k) : k < 0.5 ? va : vb;
  }
  return out;
}
/** key(t, [[t0, v0], [t1, v1, easeFn?], ...], defaultEase): keyframe interpolation. */
export function key(t, frames, fn = ease.inOut) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1, f] = frames[i];
    if (t <= t1) { const [t0, v0] = frames[i - 1]; return mixVal(v0, v1, (f || fn)((t - t0) / (t1 - t0))); }
  }
  return frames[frames.length - 1][1];
}
/** Seeded random generator (mulberry32): rng(seed)() returns a value in [0, 1). */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
}
function hash1(n) { let h = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
/** Smooth 1D value noise in [-1, 1]. */
export function noise(x, seed = 0) { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return lerp(hash1(i + seed * 1013), hash1(i + 1 + seed * 1013), s) * 2 - 1; }
/** Camera shake offset [dx, dy]. */
export const shake = (t, amp = 4, freq = 1.3, seed = 3) => [noise(t * freq, seed) * amp, noise(t * freq + 50, seed + 7) * amp];
/** Mouth-open amount 0..1 while a word is being spoken at globalT. */
export function talkAmount(globalT, from = -Infinity, to = Infinity) {
  if (globalT < from || globalT > to) return 0;
  if (E.words.length && !E.words.some((w) => globalT >= w.start && globalT <= w.end)) return 0;
  return clamp(0.3 + 0.7 * Math.abs(Math.sin(globalT * 16)) * (0.65 + 0.35 * Math.sin(globalT * 4.7)));
}
const normWord = (s) => s.toLowerCase().replace(/[’]/g, "'").replace(/[^\w']/g, '');
/** Global time when a word starting with `match` is first spoken at or after `after` seconds, or null. */
export function wordTime(match, after = 0) {
  const m = normWord(match); if (!m) return null;
  for (const w of E.words) if (w.start >= after - 0.05 && normWord(w.word).startsWith(m)) return w.start;
  return null;
}

// ----- colour -----
export function rgb(c) {
  if (Array.isArray(c)) return c;
  if (c.startsWith('rgb')) { const n = c.match(/[\d.]+/g).map(Number); return [n[0], n[1], n[2], n[3] ?? 1]; }
  let h = c.replace('#', ''); if (h.length <= 4) h = h.split('').map((ch) => ch + ch).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
}
export const css = ([r, g, b, a = 1]) => `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Math.round(a * 1000) / 1000})`;
export const mix = (c1, c2, k) => { const a = rgb(c1), b = rgb(c2); return css([0, 1, 2, 3].map((i) => lerp(a[i] ?? 1, b[i] ?? 1, k))); };
export const alpha = (c, a) => { const [r, g, b] = rgb(c); return css([r, g, b, a]); };
/** shade(c, k): k < 0 darkens toward black, k > 0 lightens toward white. */
export const shade = (c, k) => mix(c, k < 0 ? '#000000' : '#ffffff', Math.abs(k));

// ----- style -----
export function setStyle(id) { E.styleId = STYLES[id] ? id : 'noir'; E.style = STYLES[E.styleId]; }
export const S = () => E.style;
export function mood() { return E.style.mood || {}; }

// ----- primitives (logical units) -----
export function rr(g, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r); g.lineTo(x + w, y + h - r);
  g.arcTo(x + w, y + h, x + w - r, y + h, r); g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r); g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r); g.closePath();
}
function path(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); }
export function seg(g, pts, w, col, cap = 'round') { if (!pts || pts.length < 2) return; g.strokeStyle = col; g.lineWidth = w; g.lineCap = cap; g.lineJoin = 'round'; path(g, pts); g.stroke(); }
export function poly(g, pts, fill) { if (!pts || pts.length < 3) return; g.fillStyle = fill; path(g, pts); g.closePath(); g.fill(); }
export function circle(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, 2 * Math.PI); g.fill(); }
export function ring(g, x, y, r, w, col) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, 2 * Math.PI); g.stroke(); }
function stops(gr, list) { list.forEach((c, i) => (Array.isArray(c) ? gr.addColorStop(c[0], c[1]) : gr.addColorStop(list.length > 1 ? i / (list.length - 1) : 0, c))); return gr; }
export const linGrad = (g, x0, y0, x1, y1, list) => stops(g.createLinearGradient(x0, y0, x1, y1), list);
export const radGrad = (g, x, y, r0, r1, list) => stops(g.createRadialGradient(x, y, r0, x, y, r1), list);
export function glow(g, x, y, r, col, a = 1) {
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, x, y, 0, r, [alpha(col, a), alpha(col, a * 0.3), alpha(col, 0)]);
  g.beginPath(); g.arc(x, y, r, 0, 2 * Math.PI); g.fill(); g.restore();
}
/** Wash the whole stage with a colour (works under any camera transform). */
export function veil(g, color = '#000', a = 0.3, op = 'source-over') { g.save(); g.globalCompositeOperation = op; g.fillStyle = alpha(color, a); g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 5); g.restore(); }
export function fillRect(g, x, y, w, h, fill) { g.fillStyle = fill; g.fillRect(x, y, w, h); }
export function backdrop(g, colors) { g.fillStyle = linGrad(g, 0, 0, 0, E.H, colors); g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 5); }

// ----- text -----
export const FONTS = { title: 'Fredoka', ui: 'Nunito', serif: 'Playfair Display' };
const fontStr = (size, font, weight, italic) => `${italic ? 'italic ' : ''}${weight} ${size}px "${font}"`;
export function text(g, str, x, y, o = {}) {
  const size = o.size ?? 48, font = o.font ?? FONTS.title, weight = o.weight ?? 700;
  g.save(); g.globalAlpha *= o.alpha ?? 1; g.font = fontStr(size, font, weight, o.italic);
  g.textAlign = o.align ?? 'center'; g.textBaseline = o.base ?? 'middle';
  if ('letterSpacing' in g) g.letterSpacing = `${o.spacing ?? 0}px`;
  if (o.stroke) { g.lineJoin = 'round'; g.lineWidth = o.stroke; g.strokeStyle = o.strokeColor ?? '#000'; g.strokeText(str, x, y); }
  if (o.glow) { g.shadowColor = o.glowColor ?? 'rgba(255,255,255,.6)'; g.shadowBlur = o.glow; }
  g.fillStyle = o.color ?? '#fff'; g.fillText(str, x, y); g.restore();
}
export function measure(g, str, size, font = FONTS.title, weight = 700) { g.save(); g.font = fontStr(size, font, weight); const w = g.measureText(str).width; g.restore(); return w; }

// ----- camera -----
/** layer(g, cam {x, y, z, r}, depth, drawFn): parallax layer. depth 1 = subject plane, < 1 farther away. */
export function layer(g, cam, depth, fn) {
  const z = 1 + ((cam.z ?? 1) - 1) * depth;
  g.save(); g.translate(E.W / 2, E.H / 2); if (cam.r) g.rotate(cam.r * Math.min(1, depth)); g.scale(z, z);
  g.translate(-E.W / 2 - (cam.x || 0) * depth, -E.H / 2 - (cam.y || 0) * depth); fn(g); g.restore();
}
/** Draw fn into a reduced, blurred offscreen canvas and composite it full-frame (cheap depth of field). */
const pool = new Map();
export function blurLayer(g, amount, fn, cam = null, depth = 1) {
  const run = (ctx) => (cam ? layer(ctx, cam, depth, fn) : fn(ctx));
  if (amount <= 0.3) { run(g); return; }
  const k = clamp(1 / (1 + amount / 3), 0.06, 1), w = Math.max(8, Math.round(E.W * E.PX * k)), h = Math.max(8, Math.round(E.H * E.PX * k)), id = `${w}x${h}`;
  let p = pool.get(id); if (!p) { p = [document.createElement('canvas'), document.createElement('canvas')]; p.forEach((c) => { c.width = w; c.height = h; }); pool.set(id, p); }
  const [src, dst] = p, sx = src.getContext('2d'), dx = dst.getContext('2d');
  sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, w, h); sx.setTransform(w / E.W, 0, 0, h / E.H, 0, 0); run(sx);
  dx.setTransform(1, 0, 0, 1, 0, 0); dx.clearRect(0, 0, w, h); dx.filter = `blur(${Math.max(0.4, amount * E.PX * k)}px)`; dx.drawImage(src, 0, 0); dx.filter = 'none';
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(dst, 0, 0, E.W * E.PX, E.H * E.PX); g.restore();
}

// ----- shots -----
const REG = new Map();
/** registerShot(id, { draw(g, t, info) }) */
export function registerShot(id, def) { REG.set(id, { kind: '2d', ...def }); }
export const getShot = (id) => REG.get(id);
export const allShots = () => Object.fromEntries(REG);
