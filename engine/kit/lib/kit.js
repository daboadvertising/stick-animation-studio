// kit.js — palette + infographic helpers for the vertical (1080x1920) pictogram video.
import { E, S, seg, circle, ring, rr, poly, alpha, shade, text, measure, FONTS, ease, prog, clamp, lerp, rng } from '/engine/core.js';
export const C = { bg: '#f5f2ec', wall: '#efebe3', floor: '#e4dfd4', line: '#d3ccbe', shape: '#dbd4c7', shape2: '#c9c1b2', white: '#ffffff', grey: '#8a8478',
  nightWall: '#e3e7ee', nightFloor: '#d3d9e2', nightSky: '#c9d3e2', dawnSky: '#fbe2c4', duskSky: '#f9e6d2', mint: '#e4ece9', mintFloor: '#d5dfdb' };
export const ACC = () => S().ui.accent, INK = () => S().ink;
export const GY = () => E.H * 0.68, CX = () => E.W / 2;
export const fillAll = (g, col) => { g.fillStyle = col; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
export function board(g) { fillAll(g, '#faf8f4'); g.strokeStyle = '#ece7de'; g.lineWidth = 2; for (let x = 0; x <= E.W; x += 60) { g.beginPath(); g.moveTo(x, -E.H); g.lineTo(x, E.H * 2); g.stroke(); } for (let y = -E.H; y <= E.H * 2; y += 60) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); } }
// text that shrinks to fit the frame width
export function title(g, str, y, o = {}) { const sz = o.size || 110, font = o.font || FONTS.title, wt = o.weight || 700, w = measure(g, str, sz, font, wt), k = Math.min(1, (o.maxW || E.W * 0.88) / w);
  text(g, str, o.x ?? E.W / 2, y, { size: sz * k, color: o.color || INK(), font, weight: wt, alpha: o.a ?? 1, spacing: o.spacing || 0, align: o.align || 'center', italic: o.italic }); }
export const label = (g, str, x, y, o = {}) => text(g, str, x, y, { size: o.size || 34, color: o.color || '#6f695e', font: FONTS.ui, weight: 900, spacing: o.spacing ?? 3, alpha: o.a ?? 1, align: o.align || 'center' });
// pop transform: scales content in with an overshoot around (x, y)
export function pop(g, t, t0, x, y, fn, d = 0.35) { const k = ease.outBack(prog(t, t0, t0 + d)); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); fn(g); g.restore(); }
export function badge(g, str, a = 1, col) { text(g, str, E.W - 60, 170, { size: 54, color: col || ACC(), font: FONTS.ui, weight: 900, align: 'right', alpha: a }); }
export function check(g, x, y, s = 1, col = ACC(), p = 1) { const pts = [[x - 26 * s, y], [x - 8 * s, y + 18 * s], [x + 28 * s, y - 22 * s]]; const n = p < 0.5 ? [pts[0], [lerp(pts[0][0], pts[1][0], p * 2), lerp(pts[0][1], pts[1][1], p * 2)]] : [pts[0], pts[1], [lerp(pts[1][0], pts[2][0], (p - 0.5) * 2), lerp(pts[1][1], pts[2][1], (p - 0.5) * 2)]]; if (p > 0) seg(g, n, 10 * s, col); }
export function crossX(g, x, y, r, col = ACC(), p = 1, w = 26) { const a = clamp(p * 2), b = clamp(p * 2 - 1); if (a > 0) seg(g, [[x - r, y - r], [x - r + 2 * r * a, y - r + 2 * r * a]], w, col); if (b > 0) seg(g, [[x + r, y - r], [x + r - 2 * r * b, y - r + 2 * r * b]], w, col); }
export function bar(g, x, y, w, h, p, col = ACC(), bg = '#e6e0d5') { rr(g, x, y, w, h, h / 2); g.fillStyle = bg; g.fill(); if (p > 0.001) { rr(g, x, y, Math.max(h, w * clamp(p)), h, h / 2); g.fillStyle = col; g.fill(); } }
export function bubble(g, x, y, o = {}) { const { w = 220, h = 76, str = '', size = 32, tail = -1 } = o; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = C.white; g.fill(); g.strokeStyle = INK(); g.lineWidth = 5; g.stroke();
  const tx = x + tail * w * 0.22; poly(g, [[tx - 16, y + h / 2 - 4], [tx + tail * 12, y + h / 2 + 24], [tx + 16, y + h / 2 - 4]], C.white); seg(g, [[tx - 16, y + h / 2 + 1], [tx + tail * 12, y + h / 2 + 24], [tx + 16, y + h / 2 + 1]], 5, INK());
  text(g, str, x, y + 2, { size, color: INK(), font: FONTS.ui, weight: 900 }); }
export function nameTag(g, x, y, name, role, k = 1) { g.save(); g.globalAlpha *= k; const w = Math.max(measure(g, name, 46, FONTS.ui, 900), measure(g, role, 28, FONTS.ui, 900)) + 70;
  rr(g, x - w / 2, y - 62, w, 124, 18); g.fillStyle = C.white; g.fill(); g.strokeStyle = INK(); g.lineWidth = 5; g.stroke(); g.fillStyle = ACC(); g.fillRect(x - w / 2 + 2.5, y - 59, 14, 118);
  text(g, name, x + 8, y - 16, { size: 46, color: INK(), font: FONTS.ui, weight: 900 }); text(g, role, x + 8, y + 30, { size: 28, color: '#7a7468', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
export function calendar(g, x, y, w, h, o = {}) {
  const ink = INK(), acc = ACC();
  g.save(); g.fillStyle = 'rgba(0,0,0,.08)'; rr(g, x + 10, y + 12, w, h, w * 0.03); g.fill();
  rr(g, x, y, w, h, w * 0.03); g.fillStyle = C.white; g.fill(); g.strokeStyle = C.line; g.lineWidth = Math.max(2, w * 0.005); g.stroke();
  g.fillStyle = acc; rr(g, x, y, w, h * 0.17, w * 0.03); g.fill(); g.fillRect(x, y + h * 0.09, w, h * 0.08);
  if (o.head) text(g, o.head, x + w / 2, y + h * 0.09, { size: h * 0.09, color: C.white, font: FONTS.ui, weight: 900, spacing: 3 });
  for (const fx of [0.25, 0.75]) circle(g, x + w * fx, y + h * 0.02, w * 0.022, ink);
  const n = o.days || 21, rows = Math.ceil(n / 7), px = w * 0.06, top = y + h * 0.24, cw = (w - px * 2) / 7, ch = (h * 0.72) / rows;
  for (let i = 0; i < n; i++) {
    const cx = x + px + (i % 7) * cw, cy = top + Math.floor(i / 7) * ch;
    g.strokeStyle = '#e2ddd3'; g.lineWidth = Math.max(1, w * 0.003); g.strokeRect(cx, cy, cw, ch);
    text(g, String(i + 1), cx + cw * 0.18, cy + ch * 0.22, { size: Math.min(ch, cw) * 0.24, color: '#555', font: FONTS.ui, weight: 900, align: 'left' });
    const k = clamp((o.crossed ?? 0) - i), m = cw * 0.22;
    if (k > 0) { if (o.checks) check(g, cx + cw / 2, cy + ch / 2, cw / 90, acc, k); else crossX(g, cx + cw / 2, cy + ch / 2, cw / 2 - m, ink, k, cw * 0.08); }
    if (o.skip === i) { g.fillStyle = alpha(acc, 0.12); g.fillRect(cx + 2, cy + 2, cw - 4, ch - 4); }
    if (i === (o.ringAt ?? 20) && o.circle > 0) { g.strokeStyle = acc; g.lineWidth = cw * 0.08; g.lineCap = 'round'; g.beginPath(); g.ellipse(cx + cw / 2, cy + ch / 2, cw * 0.6, ch * 0.58, -0.15, -1.2, -1.2 + Math.PI * 2.1 * o.circle); g.stroke(); }
  }
  g.restore();
}
// automaticity curve: fast rise, then plateau. f(u) in 0..1 of height
export const auto = u => 1 - Math.exp(-u * 4.2);
export function curve(g, x, y, w, h, p, o = {}) {
  seg(g, [[x, y], [x, y + h], [x + w, y + h]], 5, '#9a9488');
  const F = u => y + h - h * 0.9 * auto(u);
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = o.base || ACC(); g.lineWidth = 9; g.beginPath(); for (let i = 0; i <= 100 * p; i++) { const u = i / 100; i ? g.lineTo(x + u * w, F(u)) : g.moveTo(x, F(0)); } g.stroke();
  if (o.hi) { const [u0, u1, hp] = o.hi; g.strokeStyle = o.hiCol || INK(); g.lineWidth = 16; g.beginPath(); for (let i = 0; i <= 100 * hp; i++) { const u = u0 + (u1 - u0) * i / 100; i ? g.lineTo(x + u * w, F(u)) : g.moveTo(x + u * w, F(u)); } g.stroke(); }
  if (o.dots) for (let i = 0; i < 12; i++) { const u = (i + 0.5) / 12; if (u > p) break; circle(g, x + u * w, F(u) + Math.sin(i * 7.3) * h * 0.05, 7, INK()); }
  return F;
}
export function dateCard(g, t, year, o = {}) { board(g); const k = ease.outBack(prog(t, 0.05, 0.45)), z = 1 + 0.05 * t;
  g.save(); g.translate(E.W / 2, E.H * 0.4); g.scale(k * z, k * z);
  rr(g, -330, -230, 660, 460, 30); g.fillStyle = C.white; g.fill(); g.strokeStyle = INK(); g.lineWidth = 8; g.stroke(); g.fillStyle = ACC(); rr(g, -330, -230, 660, 110, 30); g.fill(); g.fillRect(-330, -160, 660, 40);
  for (const fx of [-180, 180]) { circle(g, fx, -230, 20, INK()); } text(g, o.top || 'THE YEAR', 0, -172, { size: 44, color: C.white, font: FONTS.ui, weight: 900, spacing: 8 });
  text(g, String(year), 0, 60, { size: 230, color: INK(), font: FONTS.title, weight: 700 }); g.restore(); }
export function stamp(g, str, x, y, k, col = ACC(), rot = -0.12, size = 110) { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); const s = 1.6 - 0.6 * ease.out(k); g.scale(s, s); g.globalAlpha *= clamp(k * 2);
  const w = measure(g, str, size, FONTS.ui, 900) + 70; rr(g, -w / 2, -size * 0.75, w, size * 1.5, 18); g.strokeStyle = col; g.lineWidth = 12; g.stroke(); text(g, str, 0, 6, { size, color: col, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
export const dots = (g, t, col = 'rgba(0,0,0,.05)', seed = 3) => { const r = rng(seed); for (let i = 0; i < 24; i++) { const x = (r() * E.W + t * 10 * (0.3 + r())) % E.W, y = (r() * E.H - t * 6 * r() + E.H) % E.H; circle(g, x, y, 2 + r() * 3, col); } };
export function rays(g, x, y, t, col = ACC(), a = 0.12, n = 9) { g.save(); g.globalAlpha *= a; for (let i = 0; i < n; i++) { const an = Math.PI * 0.5 + (i - n / 2) * 0.12 + Math.sin(t * 0.4 + i) * 0.01; poly(g, [[x, y], [x + Math.cos(an - 0.025) * 2600, y + Math.sin(an - 0.025) * 2600], [x + Math.cos(an + 0.025) * 2600, y + Math.sin(an + 0.025) * 2600]], col); } g.restore(); }
export function rainFlat(g, t, o = {}) { const r = rng(o.seed || 7); g.save(); g.strokeStyle = 'rgba(80,100,130,.28)'; g.lineWidth = 2.5; g.beginPath(); for (let i = 0; i < (o.count || 140); i++) { const x0 = r() * (E.W + 300) - 150, sp = 1700 * (0.7 + r() * 0.6), y = ((r() * E.H + t * sp) % (E.H + 100)) - 50; g.moveTo(x0 + y * 0.12, y); g.lineTo(x0 + y * 0.12 + 6, y + 44); } g.stroke(); g.restore(); }
