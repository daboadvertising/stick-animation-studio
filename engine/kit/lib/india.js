// india.js — Ashoka / Maurya props & sets: map of the subcontinent (Maurya empire, Kalinga, pins), rock edicts in
// a Brahmi-like script, polished pillars, the Sarnath lion capital, the 24-spoke wheel, flag, coins/passport,
// Firuz Shah's 42-wheeled cart, peacock & deer, stupa, forest. Light palette; noir remaps to black/white/red.
import { E, layer, seg, circle, ring, rr, poly, alpha, text, FONTS, rng, ease, clamp, lerp } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { picto } from './picto.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#ffffff', BG = '#f5f2ec', MID = '#9a9488', LAND = '#8a8478', CLAY = '#e9e2d4', STONE = '#d8d0c0';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const path = (g, P, close = true) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); };
const outline = (g, P, w = 6, c = INK, close = true) => { g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; path(g, P, close); g.stroke(); };
function pillB(g, s, x, y, o = {}) { const sz = o.size || 28; g.save(); g.font = `900 ${sz}px ${FONTS.ui}`; const w = g.measureText(s).width + sz * 1.3 + s.length * 2.6; g.restore(); rr(g, x - w / 2, y - sz * 0.9, w, sz * 1.8, sz * 0.9); g.fillStyle = o.bg || INK; g.fill(); text(g, s, x, y + sz * 0.02, { size: sz, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2 }); }
// ---------------------------------------------------------------- MAP (lon 48–104 E, lat 4–38 N)
export const IX = (lon) => ((lon - 48) / 56) * 1920, IY = (lat) => ((38 - lat) / 34) * 1080;
const L = (pts) => pts.map(([a, b]) => [IX(a), IY(b)]);
const SEA = L([[48, 4], [48, 13.5], [52, 16.0], [55, 17.2], [57.6, 18.9], [58.6, 20.6], [59.8, 22.4], [58.6, 23.6], [56.5, 24.4], [56.4, 26.2], [57.3, 25.8], [61.6, 25.2], [66.6, 25.4], [67.3, 24.5], [68.5, 23.6], [70.0, 22.8], [69.0, 22.3], [70.5, 20.9], [72.6, 21.1], [72.8, 19.0], [73.3, 16.5], [74.0, 14.8], [74.8, 12.9], [75.8, 11.2], [76.3, 9.5], [77.5, 8.1], [78.2, 8.9], [79.3, 10.3], [79.8, 11.9], [80.3, 13.1], [80.2, 15.5], [81.3, 16.3], [82.3, 17.0], [83.3, 17.7], [84.9, 19.3], [86.4, 20.0], [87.0, 21.5], [88.2, 21.7], [89.0, 21.9], [90.5, 22.3], [91.8, 22.3], [92.3, 20.8], [94.3, 16.0], [97.6, 16.5], [98.6, 13.5], [98.3, 9.0], [104, 9], [104, 4]]);
const LANKA = L([[79.8, 8.0], [80.1, 9.8], [81.2, 8.5], [81.9, 7.0], [80.6, 5.95], [79.9, 6.8]]);
const GANGES = L([[78.2, 30.0], [79.0, 27.5], [80.3, 26.5], [82.0, 25.3], [85.1, 25.6], [87.3, 25.2], [88.1, 24.0], [89.0, 22.2]]);
const INDUS = L([[75.5, 35.3], [72.5, 33.9], [71.4, 31.0], [70.0, 28.0], [68.3, 25.5], [67.6, 24.3]]);
const EMPIRE = L([[62, 31.5], [66, 35], [71, 36.2], [75, 35], [78, 32.5], [81, 30], [84, 28], [88, 27], [90, 26], [89.5, 23], [88.2, 21.9], [87, 22.2], [85.5, 22.6], [83.5, 22.2], [82.3, 20.5], [82.3, 18.6], [81.2, 17.2], [80.2, 15.2], [78.5, 14.0], [76.5, 13.0], [74.8, 12.9], [74.0, 14.8], [73.3, 16.5], [72.8, 19.0], [72.6, 21.1], [70.5, 20.9], [69, 22.3], [70, 22.8], [68.5, 23.6], [67.3, 24.5], [66.6, 25.4], [61.6, 25.2], [61, 28]]);
const KALINGA = L([[82.3, 20.5], [83.5, 22.2], [85.5, 22.6], [87.0, 22.2], [87.0, 21.5], [86.4, 20.0], [84.9, 19.3], [83.3, 17.7], [82.3, 17.0], [82.3, 18.6]]);
export const IP = { pataliputra: [85.14, 25.61], kalinga: [85.0, 20.6], dhauli: [85.84, 20.19], jaugada: [84.83, 19.53], sarnath: [83.02, 25.38], maski: [76.66, 15.96], kandahar: [65.71, 31.61], delhi: [77.21, 28.61], topra: [77.0, 30.3], lanka: [80.7, 7.8], odisha: [84.6, 20.6], west: [50, 30], south: [77.5, 11.5], afghan: [66.5, 33.5], india: [79, 22] };
export const ip = (k) => [IX(IP[k][0]), IY(IP[k][1])];
const hatch = (g, P, col, gap = 18, w = 5) => { g.save(); path(g, P); g.clip(); g.strokeStyle = col; g.lineWidth = w; for (let x = -1200; x < 2400; x += gap) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 1080, 1080); g.stroke(); } g.restore(); };
export function indiaMap(g, t, cam, o = {}) { all(g, LAND);
  poly(g, SEA, BG); outline(g, SEA.slice(1, -3), 5, INK, false); poly(g, LANKA, LAND); outline(g, LANKA, 5);
  for (const R of [GANGES, INDUS]) outline(g, R, 4, alpha(BG, 0.9), false);
  // Himalaya
  for (let i = 0; i < 22; i++) { const u = i / 21, lon = lerp(73, 95, u), lat = lerp(35, 28.2, Math.min(1, u * 1.4)) + (u > 0.7 ? (u - 0.7) * 2 : 0); const x = IX(lon), y = IY(lat); poly(g, [[x - 22, y + 14], [x, y - 20], [x + 22, y + 14]], STONE); outline(g, [[x - 22, y + 14], [x, y - 20], [x + 22, y + 14]], 3, INK, false); }
  if (o.empire) { const k = o.empire; g.save(); g.globalAlpha = clamp(k); hatch(g, EMPIRE, ACC, 20, 5); outline(g, EMPIRE, 6, ACC); g.restore(); }
  if (o.kalinga) { poly(g, KALINGA, CLAY); outline(g, KALINGA, 6); if (o.conquered) { g.save(); g.globalAlpha = clamp(o.conquered); hatch(g, KALINGA, ACC, 16, 6); outline(g, KALINGA, 7, ACC); g.restore(); } } }
export function mapFx(g, t, o) {
  (o.arrows || []).forEach(([x1, y1, x2, y2, at0, col]) => { const k = ease.inOut(clamp((t - at0) / 0.9)); if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k); seg(g, [[x1, y1], [x, y]], 9, col || ACC); const a = Math.atan2(y2 - y1, x2 - x1); poly(g, [[x + Math.cos(a) * 26, y + Math.sin(a) * 26], [x + Math.cos(a + 2.4) * 26, y + Math.sin(a + 2.4) * 26], [x + Math.cos(a - 2.4) * 26, y + Math.sin(a - 2.4) * 26]], col || ACC); });
  (o.pins || []).forEach(([p, at0, lab, pos, nodot]) => { const k = ease.outBack(clamp((t - at0) / 0.35)); if (k <= 0) return; const [x, y] = ip(p); g.save(); g.translate(x, y); g.scale(k, k); if (!nodot) { ring(g, 0, 0, 22 + ((t * 40) % 40), 4, alpha(ACC, 1 - ((t * 40) % 40) / 40)); circle(g, 0, 0, 14, ACC); ring(g, 0, 0, 14, 4, INK); }
    if (lab) { const dy = pos === 'b' ? 56 : pos === 'c' ? 0 : -56, dx = pos === 'r' ? 1 : pos === 'l' ? -1 : 0; pillB(g, lab, dx * (lab.length * 10 + 50), dx ? 0 : dy, { size: 26 }); } g.restore(); }); }
// ---------------------------------------------------------------- Brahmi-like glyphs (stylised, not real text)
export function bglyph(g, x, y, sz, seed, col = INK) { let r = Math.sin(seed * 12.9898) * 43758.5453; r -= Math.floor(r); const k = Math.floor(r * 8); g.save(); g.translate(x, y); g.scale(sz / 40, sz / 40); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
  if (k === 0) { g.moveTo(0, -18); g.lineTo(0, 18); g.moveTo(-14, 0); g.lineTo(14, 0); }
  if (k === 1) { g.arc(0, 0, 14, 0, Math.PI * 2); }
  if (k === 2) { g.moveTo(-14, 18); g.lineTo(0, -18); g.lineTo(14, 18); }
  if (k === 3) { g.moveTo(-12, -18); g.lineTo(-12, 18); g.lineTo(12, 18); g.lineTo(12, -18); }
  if (k === 4) { g.moveTo(0, -18); g.lineTo(0, 18); g.moveTo(0, -4); g.lineTo(14, -16); }
  if (k === 5) { g.moveTo(-14, -14); g.lineTo(14, -14); g.lineTo(-14, 16); g.lineTo(14, 16); }
  if (k === 6) { g.moveTo(-14, 0); g.lineTo(0, -16); g.lineTo(14, 0); g.lineTo(0, 16); g.closePath(); }
  if (k === 7) { g.moveTo(0, -18); g.lineTo(0, 18); g.moveTo(-14, -18); g.lineTo(14, -18); }
  g.stroke(); g.restore(); }
// a rock edict: irregular boulder covered in Brahmi-like lines; reveal 0..1; o.redRow highlights a row
export function rockEdict(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const r = rng(o.seed || 3), P = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; P.push([Math.cos(a) * (360 + r() * 50), Math.sin(a) * (230 + r() * 40)]); }
  poly(g, P, STONE); outline(g, P, 9); const rows = 6, rv = o.reveal ?? 1;
  for (let l = 0; l < rows; l++) for (let c = 0; c < 12; c++) { const n = l * 12 + c; if (n / (rows * 12) > rv) continue; bglyph(g, -250 + c * 46, -150 + l * 58, 34, n * 7 + (o.seed || 3), o.redRow === l ? ACC : INK); }
  if (o.blur) { g.save(); g.globalAlpha = clamp(o.blur) * 0.85; path(g, P); g.fillStyle = STONE; g.fill(); g.restore(); text(g, '?', 0, 30, { size: 200, color: ACC, alpha: clamp(o.blur) }); }
  g.restore(); }
// an Ashokan pillar: polished shaft, bell capital, abacus, animal on top ('lion' | 'lions4' | 'bull' | 'none')
export function pillar(g, x, gy, s, o = {}) { g.save(); g.translate(x, gy); g.scale(s, s); const H = o.h || 700;
  g.fillStyle = PAPER; g.beginPath(); g.moveTo(-34, 0); g.lineTo(-26, -H); g.lineTo(26, -H); g.lineTo(34, 0); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  seg(g, [[-10, -40], [-6, -H + 40]], 4, alpha(INK, 0.3)); // polish glint
  if (o.text) for (let i = 0; i < 6; i++) bglyph(g, -12 + (i % 2) * 24, -260 - i * 40, 18, i * 13 + 5);
  // bell (lotus) capital + abacus
  g.fillStyle = PAPER; g.beginPath(); g.moveTo(-26, -H); g.quadraticCurveTo(-70, -H - 40, -40, -H - 90); g.lineTo(40, -H - 90); g.quadraticCurveTo(70, -H - 40, 26, -H); g.closePath(); g.fill(); g.stroke();
  rr(g, -70, -H - 130, 140, 40, 6); g.fillStyle = PAPER; g.fill(); g.stroke(); if (o.top !== 'none') wheel(g, 0, -H - 110, 14, 0, 8);
  if (o.top === 'lion' || o.top === 'bull') { g.save(); g.translate(0, -H - 130); poly(g, [[-55, 0], [-50, -50], [-20, -70], [30, -60], [55, -90], [70, -60], [60, 0]], INK); g.restore(); }
  if (o.top === 'lions4') { g.save(); g.translate(0, -H - 130); g.scale(0.55, 0.55); lionsBody(g); g.restore(); }
  g.restore(); }
// the Sarnath lion capital, front view (three lions visible, wheel between a bull and a horse on the abacus)
function lionsBody(g) { const lion = (dx, f) => { g.save(); g.translate(dx, 0); g.scale(f, 1);
    poly(g, [[-48, 0], [-50, -110], [-30, -150], [30, -150], [50, -110], [48, 0]], INK); seg(g, [[-22, -10], [-22, -90]], 12, PAPER); seg(g, [[22, -10], [22, -90]], 12, PAPER);
    g.fillStyle = INK; g.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? 62 : 76; g.lineTo(Math.cos(a) * r, -200 + Math.sin(a) * r); } g.closePath(); g.fill();
    circle(g, 0, -196, 40, CLAY); circle(g, -14, -206, 7, INK); circle(g, 14, -206, 7, INK); poly(g, [[-10, -190], [10, -190], [0, -178]], INK); seg(g, [[0, -178], [-10, -168]], 4, INK); seg(g, [[0, -178], [10, -168]], 4, INK);
    circle(g, -30, -262, 14, INK); circle(g, 30, -262, 14, INK); g.restore(); };
  lion(-120, -1); lion(120, 1); lion(0, 1); }
export function emblem(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); lionsBody(g); rr(g, -190, 0, 380, 80, 10); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); wheel(g, 0, 40, 30, o.spin ? t : 0, 12, o.red ? ACC : INK);
  // bull (left) & horse (right), tiny silhouettes
  poly(g, [[-160, 66], [-150, 22], [-100, 18], [-80, 30], [-90, 66]], INK); poly(g, [[90, 66], [96, 26], [140, 18], [165, 8], [160, 66]], INK); g.restore(); }
// the 24-spoke wheel (Ashoka Chakra)
export function wheel(g, x, y, r, rot = 0, n = 24, col = INK) { ring(g, x, y, r, Math.max(3, r * 0.12), col); circle(g, x, y, r * 0.16, col); for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; seg(g, [[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], Math.max(2, r * 0.045), col); } }
export function flag(g, x, y, w, t) { const h = w * 2 / 3, wave = (u) => Math.sin(u * 6 + t * 3) * w * 0.02; g.save(); g.translate(x - w / 2, y - h / 2);
  const band = (i, col) => { g.fillStyle = col; g.beginPath(); for (let u = 0; u <= 1.001; u += 0.05) g.lineTo(u * w, i * h / 3 + wave(u)); for (let u = 1; u >= -0.001; u -= 0.05) g.lineTo(u * w, (i + 1) * h / 3 + wave(u)); g.closePath(); g.fill(); };
  band(0, PAPER); band(1, PAPER); band(2, PAPER); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(0, 0, w, h); seg(g, [[0, h / 3], [w, h / 3]], 4, INK); seg(g, [[0, 2 * h / 3], [w, 2 * h / 3]], 4, INK); wheel(g, w / 2, h / 2, h / 7, 0, 24, INK); seg(g, [[0, -10], [0, h + 120]], 10, INK); g.restore(); }
// coin, banknote, passport each carrying the emblem
export function coin(g, x, y, r) { circle(g, x, y, r, CLAY); ring(g, x, y, r, 8, INK); ring(g, x, y, r * 0.85, 3, INK); g.save(); g.translate(x, y - r * 0.05); g.scale(r / 420, r / 420); lionsBody(g); g.restore(); }
export function note(g, x, y, w) { const h = w * 0.45; rr(g, x - w / 2, y - h / 2, w, h, 10); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); if (w > 80) { rr(g, x - w / 2 + 20, y - h / 2 + 20, w - 40, h - 40, 6); g.lineWidth = 3; g.stroke(); } g.save(); g.translate(x - w * 0.3, y + h * 0.2); g.scale(w / 2200, w / 2200); lionsBody(g); g.restore(); }
export function passport(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -130, -180, 260, 360, 16); g.fillStyle = INK; g.fill(); g.save(); g.translate(0, 0); g.scale(0.32, 0.32); g.fillStyle = PAPER; const P = picto; lionsWhite(g); g.restore(); text(g, 'PASSPORT', 0, 130, { size: 30, color: PAPER, font: FONTS.ui, weight: 900 }); g.restore(); }
function lionsWhite(g) { const lion = (dx, f) => { g.save(); g.translate(dx, 0); g.scale(f, 1); poly(g, [[-40, 0], [-44, -120], [-20, -170], [20, -170], [44, -120], [40, 0]], PAPER); circle(g, 0, -190, 50, PAPER); g.restore(); }; lion(-110, -1); lion(110, 1); lion(0, 1); }
// peacock & deer
export function peacock(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + i * Math.PI * 0.11; const r = 150; seg(g, [[-30, -60], [-30 + Math.cos(a) * r, -60 + Math.sin(a) * r]], 6, INK); circle(g, -30 + Math.cos(a) * r, -60 + Math.sin(a) * r, 16, PAPER); ring(g, -30 + Math.cos(a) * r, -60 + Math.sin(a) * r, 16, 5, INK); circle(g, -30 + Math.cos(a) * r, -60 + Math.sin(a) * r, 6, ACC); }
  g.fillStyle = INK; g.beginPath(); g.ellipse(0, -50, 50, 34, 0, 0, Math.PI * 2); g.fill(); seg(g, [[30, -70], [50, -130]], 14, INK); circle(g, 54, -140, 16, INK); poly(g, [[66, -142], [86, -136], [66, -132]], INK); for (const d of [-8, 0, 8]) seg(g, [[52 + d, -156], [56 + d * 1.4, -176]], 3, INK); seg(g, [[-10, -20], [-14, 20]], 5, INK); seg(g, [[14, -20], [18, 20]], 5, INK); g.restore(); }
export function deer(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); g.fillStyle = INK; g.beginPath(); g.ellipse(0, -110, 90, 38, 0, 0, Math.PI * 2); g.fill(); seg(g, [[70, -130], [100, -200]], 22, INK); g.beginPath(); g.ellipse(118, -206, 34, 18, 0.4, 0, Math.PI * 2); g.fill();
  for (const sx of [-1, 1]) { seg(g, [[100 + sx * 6, -222], [90 + sx * 20, -280], [70 + sx * 30, -300]], 5, INK); seg(g, [[94 + sx * 14, -255], [120 + sx * 20, -270]], 5, INK); }
  for (const lx of [-60, -30, 40, 70]) seg(g, [[lx, -80], [lx + Math.sin(t * 6 + lx) * 6, 0]], 9, INK); g.restore(); }
// stupa (Buddhist dome)
export function stupa(g, x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); rr(g, -260, -40, 520, 40, 6); g.fillStyle = STONE; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); g.beginPath(); g.moveTo(-220, -40); g.quadraticCurveTo(-220, -300, 0, -300); g.quadraticCurveTo(220, -300, 220, -40); g.closePath(); g.fillStyle = PAPER; g.fill(); g.stroke();
  rr(g, -50, -340, 100, 40, 4); g.fill(); g.stroke(); seg(g, [[0, -340], [0, -420]], 8, INK); for (let i = 0; i < 3; i++) seg(g, [[-40 + i * 8, -370 - i * 20], [40 - i * 8, -370 - i * 20]], 7, INK); g.restore(); }
// Firuz Shah's long cart with a wrapped pillar and haulers
export function cart(g, x, gy, s, t, o = {}) { g.save(); g.translate(x, gy); g.scale(s, s); const L = 1300; rr(g, -L / 2, -90, L, 30, 6); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  for (let i = 0; i < 21; i++) { const wx = -L / 2 + 30 + i * (L - 60) / 20; circle(g, wx, -40, 26, PAPER); ring(g, wx, -40, 26, 6, INK); g.save(); g.translate(wx, -40); g.rotate(t * 2); seg(g, [[-20, 0], [20, 0]], 4, INK); g.restore(); }
  // wrapped pillar
  rr(g, -L / 2 + 40, -170, L - 80, 80, 40); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); for (let i = 0; i < 26; i++) seg(g, [[-L / 2 + 70 + i * 46, -168], [-L / 2 + 90 + i * 46, -92]], 3, alpha(INK, 0.4));
  // ropes + haulers
  seg(g, [[L / 2, -70], [L / 2 + 900, -120]], 4, INK); for (let i = 0; i < (o.men ?? 6); i++) picto(g, { x: L / 2 + 120 + i * 130, y: 0, s: 0.9, pose: walkPose(t * 5 + i), facing: 1, t, shadow: false, expr: 'worried' }); g.restore(); }
// forest edge
export function forest(g, x0, gy, n, t) { for (let i = 0; i < n; i++) { const x = x0 + i * 150; seg(g, [[x, gy], [x, gy - 160]], 14, INK); circle(g, x, gy - 210, 80, MID); ring(g, x, gy - 210, 80, 6, INK); circle(g, x - 50, gy - 170, 50, MID); ring(g, x - 50, gy - 170, 50, 5, INK); } }
// sets
export function court(g, t, cam) { const gy = E.H * 0.8; layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.85, (g) => { for (const x of [260, 600, 1320, 1660]) { rr(g, x - 40, gy - 560, 80, 560, 6); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, x - 70, gy - 600, 140, 40, 6); g.fill(); g.stroke(); } g.beginPath(); g.moveTo(160, gy - 600); g.lineTo(1760, gy - 600); g.stroke(); seg(g, [[-300, gy], [2300, gy]], 10, INK);
    rr(g, 820, gy - 120, 280, 120, 8); g.fillStyle = CLAY; g.fill(); g.stroke(); rr(g, 880, gy - 300, 160, 190, 10); g.fill(); g.stroke(); rr(g, 860, gy - 180, 200, 26, 8); g.fillStyle = ACC; g.fill(); });
  return { GY: gy }; }
export function plainIndia(g, t, cam, o = {}) { const gy = E.H * 0.8; layer(g, cam, 0.3, (g) => { all(g, BG); circle(g, 1600, 200, 60, alpha(INK, 0.08)); });
  layer(g, cam, 0.8, (g) => { poly(g, [[-300, gy - 80], [300, gy - 200], [700, gy - 120], [1200, gy - 230], [1700, gy - 140], [2300, gy - 200], [2300, gy], [-300, gy]], STONE); seg(g, [[-300, gy], [2300, gy]], 10, INK); if (o.forest) forest(g, 1250, gy, 5, t); });
  return { GY: gy }; }
