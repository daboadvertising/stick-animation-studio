// bronze.js — Late Bronze Age props & sets (Eastern Mediterranean map, clay tablets, ox-hide ingots,
// Bronze Age ships, pollen core, grain jars, dominoes, cyclopean walls, Egyptian pylon, ox carts, chariots,
// mummy scan, Phoenician alphabet, modern globe). Light palette; the noir theme remaps it to black/white/red.
import { E, layer, seg, circle, ring, rr, poly, alpha, text, FONTS, rng, ease, prog, clamp, lerp } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { picto } from './picto.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#ffffff', BG = '#f5f2ec', MID = '#9a9488', LAND = '#8a8478', CLAY = '#e9e2d4';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const stroke = (g, P, w, c = INK, close = true) => { g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); g.stroke(); };
export function pillB(g, s, x, y, o = {}) { const sz = o.size || 30; g.save(); g.font = `900 ${sz}px ${FONTS.ui}`; const w = g.measureText(s).width + sz * 1.3 + s.length * 2.6; g.restore(); rr(g, x - w / 2, y - sz * 0.9, w, sz * 1.8, sz * 0.9); g.fillStyle = o.bg || INK; g.fill(); text(g, s, x, y + sz * 0.02, { size: sz, color: o.col || '#ffffff', font: FONTS.ui, weight: 900, spacing: 2 }); }

// ---------------------------------------------------------------- MAP (lon 19–48 E, lat 27–42 N)
export const MX = (lon) => ((lon - 19) / 29) * 1920, MY = (lat) => ((42 - lat) / 15) * 1080;
const L = (pts) => pts.map(([lo, la]) => [MX(lo), MY(la)]);
const SEA = L([[19, 40.3], [19.5, 40.6], [20.0, 39.7], [20.7, 39.0], [21.1, 38.3], [21.6, 37.9], [21.3, 37.6], [21.7, 36.8], [22.4, 36.4], [22.8, 36.8], [23.2, 36.4], [23.1, 37.3], [23.5, 37.9], [24.0, 37.7], [24.1, 38.2], [23.2, 38.6], [22.9, 39.4], [23.4, 39.9], [22.6, 40.5], [23.8, 40.0], [24.0, 40.9], [25.5, 40.9], [26.0, 40.8], [26.2, 40.0], [26.7, 39.3], [26.4, 38.4], [27.2, 37.9], [27.3, 37.0], [28.0, 36.7], [29.0, 36.6], [30.5, 36.4], [30.6, 36.8], [32.0, 36.5], [33.5, 36.1], [34.6, 36.8], [36.0, 36.8], [35.9, 36.2], [35.8, 35.5], [35.9, 34.7], [35.6, 34.0], [35.2, 33.0], [34.9, 32.4], [34.5, 31.5], [33.8, 31.1], [32.3, 31.2], [31.0, 31.6], [30.0, 31.4], [29.0, 30.9], [27.0, 31.3], [25.0, 31.8], [23.0, 32.6], [20.0, 32.0], [19.0, 30.4]]);
const BLACKSEA = L([[28, 42.2], [28.6, 41.3], [29.2, 41.2], [30.5, 41.1], [31.8, 41.4], [33.3, 42.0], [34.9, 42.0], [36.3, 41.3], [38.0, 40.95], [40, 41], [41.6, 41.5], [41.8, 42.2]]);
const SUEZ = L([[32.5, 30.0], [32.6, 29.5], [33.0, 27.0], [34.0, 27.0], [32.7, 29.6]]);
const CRETE = L([[23.5, 35.6], [24.3, 35.4], [25.0, 35.4], [26.3, 35.3], [26.2, 35.0], [24.7, 34.9], [23.6, 35.2]]);
const CYPRUS = L([[32.3, 35.1], [33.0, 35.4], [34.6, 35.7], [34.0, 35.2], [33.9, 34.95], [33.0, 34.6], [32.4, 34.8]]);
const NILE = L([[31.2, 30.1], [31.25, 29.3], [31.0, 28.5], [30.8, 27.6], [30.9, 27.0]]), DELTA = [L([[31.2, 30.1], [30.4, 31.4]]), L([[31.2, 30.1], [31.8, 31.4]])];
const EUPH = L([[38.5, 38.4], [38.0, 36.8], [40.0, 35.0], [41.5, 34.4], [43.0, 33.5], [44.4, 32.5], [46.5, 31.0], [48, 30.4]]);
const TIGR = L([[40.0, 38.2], [42.5, 37.1], [43.2, 36.3], [44.0, 34.5], [44.4, 33.3], [46.0, 32.0], [48, 31.0]]);
export const BP = { ugarit: [35.78, 35.6], cyprus: [33.4, 35.1], hattusa: [34.62, 40.02], mycenae: [22.76, 37.73], pylos: [21.67, 37.03], tiryns: [22.8, 37.6], egypt: [31.25, 29.9], amarna: [30.9, 27.65],
  babylon: [44.42, 32.54], assyria: [43.26, 35.46], canaan: [35.0, 31.9], lukka: [29.4, 36.6], galilee: [35.6, 32.8], uluburun: [29.55, 36.13], larnaca: [33.6, 34.9], crete: [24.8, 35.2], hatti: [33.5, 39.2], greece: [22.2, 38.6], deltanile: [31.2, 31.2], syria: [36.3, 35.25],
  thermopylae: [22.54, 38.8], athens: [23.73, 37.98], sparta: [22.43, 37.07], marathon: [23.97, 38.15], salamis: [23.47, 37.93], plataea: [23.27, 38.21], athos: [24.25, 40.2], hellespont: [26.4, 40.2], artemisium: [23.25, 39.0], thespiae: [23.16, 38.31], sardis: [28.04, 38.48], aegean: [25.2, 38.6] };
export const bp = (k) => [MX(BP[k][0]), MY(BP[k][1])];
export function emedMap(g, t, cam, o = {}) { all(g, LAND);
  const sea = (P) => { poly(g, P, BG); stroke(g, P, 5); };
  poly(g, [...SEA, [-400, MY(30.4)], [-400, MY(40.3)]], BG); stroke(g, SEA, 5, INK, false); sea(BLACKSEA); sea(SUEZ);
  for (const P of [CRETE, CYPRUS]) { poly(g, P, LAND); stroke(g, P, 5); }
  circle(g, MX(28.0), MY(36.2), 9, LAND); ring(g, MX(28.0), MY(36.2), 9, 4, INK);
  for (const R of [NILE, ...DELTA, EUPH, TIGR]) stroke(g, R, 4, alpha(BG, 0.9), false);
  // faint sea texture
}
// pins, trade lines, fires, blackouts, arrows on the map. Times are already resolved (seconds).
export function mapFx(g, t, o) {
  (o.lines || []).forEach(([a, b, at0, cut]) => { const k = ease.inOut(clamp((t - at0) / 0.8)); if (k <= 0) return; const [x1, y1] = bp(a), [x2, y2] = bp(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.18;
    const broken = cut != null && t >= cut; g.save(); g.setLineDash(broken ? [8, 26] : [16, 12]); g.lineDashOffset = -t * 40; g.strokeStyle = broken ? alpha(INK, 0.35) : ACC; g.lineWidth = broken ? 4 : 7; g.beginPath(); g.moveTo(x1, y1);
    const N = 30; for (let i = 1; i <= N * k; i++) { const u = i / N; g.lineTo((1 - u) * (1 - u) * x1 + 2 * u * (1 - u) * mx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * u * (1 - u) * my + u * u * y2); } g.stroke(); g.restore();
    if (broken) { const u = 0.5, x = (1 - u) * (1 - u) * x1 + 2 * u * (1 - u) * mx + u * u * x2, y = (1 - u) * (1 - u) * y1 + 2 * u * (1 - u) * my + u * u * y2, kk = ease.outBack(clamp((t - cut) / 0.3)); seg(g, [[x - 16 * kk, y - 16 * kk], [x + 16 * kk, y + 16 * kk]], 7, ACC); seg(g, [[x + 16 * kk, y - 16 * kk], [x - 16 * kk, y + 16 * kk]], 7, ACC); } });
  (o.fire || []).forEach(([p, at0]) => { if (t < at0) return; const [x, y] = bp(p); flames(g, x, y - 6, 0.55 * ease.outBack(clamp((t - at0) / 0.4)), t + x); });
  (o.dark || []).forEach(([p, at0]) => { if (t < at0) return; const [x, y] = bp(p), k = ease.out(clamp((t - at0) / 0.5)); circle(g, x, y, 34 * k, alpha(BG, 0.92)); ring(g, x, y, 34 * k, 5, INK); seg(g, [[x - 18 * k, y - 18 * k], [x + 18 * k, y + 18 * k]], 6, INK); seg(g, [[x + 18 * k, y - 18 * k], [x - 18 * k, y + 18 * k]], 6, INK); });
  (o.pins || []).forEach((pn) => { const [p, at0, lab, pos] = pn; const k = ease.outBack(clamp((t - at0) / 0.35)); if (k <= 0) return; const [x, y] = bp(p); g.save(); g.translate(x, y); g.scale(k * (o.ps || 1), k * (o.ps || 1));
    if (!pn[4]) { ring(g, 0, 0, 22 + ((t * 40) % 40), 4, alpha(ACC, 1 - ((t * 40) % 40) / 40)); circle(g, 0, 0, 14, ACC); ring(g, 0, 0, 14, 4, INK); }
    if (lab) { const dy = pos === 'b' ? 58 : pos === 'c' ? 0 : -58, dx = pos === 'r' ? 1 : pos === 'l' ? -1 : 0; pillB(g, lab, dx * (lab.length * 11 + 50) * (o.ls || 1), dx ? 0 : dy * (o.ls || 1), { size: 28 * (o.ls || 1) }); } g.restore(); });
  (o.arrows || []).forEach(([x1, y1, x2, y2, at0, col]) => { const k = ease.inOut(clamp((t - at0) / 0.9)); if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k); seg(g, [[x1, y1], [x, y]], 9, col || ACC); const a = Math.atan2(y2 - y1, x2 - x1); poly(g, [[x + Math.cos(a) * 26, y + Math.sin(a) * 26], [x + Math.cos(a + 2.4) * 26, y + Math.sin(a + 2.4) * 26], [x + Math.cos(a - 2.4) * 26, y + Math.sin(a - 2.4) * 26]], col || ACC); });
}
// ---------------------------------------------------------------- fire & smoke
export function flames(g, x, y, s, t) { if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < 4; i++) { const p = ((t * 0.5) + i / 4) % 1; circle(g, Math.sin(i * 2 + t) * 20, -120 - p * 160, 30 + p * 40, alpha(MID, 0.5 * (1 - p))); }
  for (let i = 0; i < 5; i++) { const dx = (i - 2) * 26, h = 90 + Math.sin(t * 9 + i * 1.7) * 22 + (i === 2 ? 40 : 0); g.fillStyle = ACC; g.beginPath(); g.moveTo(dx - 26, 0); g.quadraticCurveTo(dx - 22, -h * 0.5, dx + Math.sin(t * 6 + i) * 10, -h); g.quadraticCurveTo(dx + 22, -h * 0.5, dx + 26, 0); g.fill(); }
  g.restore(); }
// ---------------------------------------------------------------- clay tablet with cuneiform (o.kind 'linb' = Linear B leaf tablet)
function wedge(g, x, y, s, a, col) { g.save(); g.translate(x, y); g.rotate(a); poly(g, [[-6 * s, -5 * s], [6 * s, -5 * s], [0, 3 * s]], col); seg(g, [[0, 0], [0, 14 * s]], 2.6 * s, col); g.restore(); }
export function tablet(g, x, y, s, t, o = {}) { const r = rng(o.seed || 7), W = o.kind === 'linb' ? 520 : 300, H = o.kind === 'linb' ? 200 : 400, rv = o.reveal ?? 1;
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  if (o.glow) { const k = o.glow; circle(g, 0, 0, Math.max(W, H) * 0.75 * k, alpha(ACC, 0.25 * k)); }
  rr(g, -W / 2, -H / 2, W, H, 40); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke();
  const rows = o.kind === 'linb' ? 3 : 9, cols = o.kind === 'linb' ? 11 : 9, tot = rows * cols; let n = 0;
  for (let i = 0; i < rows; i++) { seg(g, [[-W / 2 + 24, -H / 2 + 38 + i * (H - 50) / rows + 18], [W / 2 - 24, -H / 2 + 38 + i * (H - 50) / rows + 18]], 2, alpha(INK, 0.35));
    for (let j = 0; j < cols; j++, n++) { if (n / tot > rv) continue; const cx = -W / 2 + 40 + j * (W - 70) / cols, cy = -H / 2 + 30 + i * (H - 50) / rows, q = r();
      if (o.kind === 'linb') { const k = Math.floor(q * 5); seg(g, [[cx, cy - 4], [cx, cy + 24]], 4, INK); if (k > 0) seg(g, [[cx - 10, cy + 4], [cx + 10, cy + 4]], 4, INK); if (k > 1) seg(g, [[cx - 10, cy + 16], [cx + 10, cy + 16]], 4, INK); if (k > 2) circle(g, cx + 12, cy - 4, 5, INK); if (k > 3) seg(g, [[cx - 12, cy + 24], [cx, cy + 10]], 4, INK); }
      else { const k = 1 + Math.floor(q * 3); for (let m = 0; m < k; m++) wedge(g, cx + m * 9 - 4, cy + (m % 2) * 4, 1.15, q > 0.7 ? -1.57 : 0, INK); } } }
  if (o.crack) { const k = ease.out(clamp(o.crack)); const P = [[-W / 2, -H * 0.1], [-W * 0.2, -H * 0.02], [-W * 0.05, H * 0.12], [W * 0.15, H * 0.05], [W / 2, H * 0.2]]; const m = Math.max(1, Math.floor(k * P.length)); seg(g, P.slice(0, m), 10, INK); }
  g.restore(); }
// ---------------------------------------------------------------- ox-hide ingot (the "biscuits with ears")
export function ingot(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  const P = [[-70, -40], [-40, -30], [0, -26], [40, -30], [70, -40], [60, 0], [70, 40], [40, 30], [0, 26], [-40, 30], [-70, 40], [-60, 0]];
  poly(g, P, o.col || ACC); stroke(g, P, 6); if (o.tin) { seg(g, [[-30, 0], [30, 0]], 4, alpha(INK, 0.4)); } g.restore(); }
export function bun(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col || PAPER; g.beginPath(); g.ellipse(0, 0, 60, 22, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.restore(); }
// ---------------------------------------------------------------- ships
export function ship(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); const bob = Math.sin(t * 2 + x * 0.01) * 4; g.translate(0, bob); g.rotate(Math.sin(t * 1.6 + x) * 0.025);
  // hull
  g.fillStyle = INK; g.beginPath(); g.moveTo(-230, -30); g.quadraticCurveTo(0, 60, 230, -30); g.lineTo(210, 0); g.quadraticCurveTo(0, 50, -210, 0); g.closePath(); g.fill();
  rr(g, -210, -40, 420, 24, 8); g.fill();
  if (o.sea) { // bird-head stem and stern (Sea Peoples ships as carved at Medinet Habu)
    for (const sx of [-1, 1]) { seg(g, [[sx * 220, -30], [sx * 250, -110]], 14, INK); circle(g, sx * 256, -124, 20, INK); poly(g, [[sx * 270, -128], [sx * 300, -118], [sx * 270, -112]], INK); circle(g, sx * 258, -128, 4, PAPER); } }
  else { seg(g, [[220, -30], [250, -90]], 12, INK); seg(g, [[-220, -30], [-240, -70]], 12, INK); }
  if (o.oars) for (let i = 0; i < 7; i++) { const a = Math.sin(t * 4 + i * 0.4) * 0.25; seg(g, [[-150 + i * 50, -10], [-150 + i * 50 - 30 + Math.sin(a) * 40, 70]], 5, INK); }
  // mast & square sail
  seg(g, [[0, -40], [0, -300]], 10, INK); seg(g, [[-150, -290], [150, -290]], 8, INK); seg(g, [[-150, -150], [150, -150]], 8, INK);
  g.fillStyle = o.sail || PAPER; g.beginPath(); g.moveTo(-145, -286); g.quadraticCurveTo(0, -270 + Math.sin(t * 2) * 8, 145, -286); g.lineTo(145, -154); g.quadraticCurveTo(0, -140, -145, -154); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  for (let i = 1; i < 4; i++) seg(g, [[-145 + i * 72, -284], [-145 + i * 72, -154]], 3, alpha(INK, 0.5));
  if (o.cargo) { for (let i = 0; i < 4; i++) ingot(g, -120 + i * 70, -56, 0.42, { col: i % 2 ? PAPER : ACC }); }
  if (o.sacks) { for (let i = 0; i < 4; i++) { g.fillStyle = PAPER; g.beginPath(); g.ellipse(-110 + i * 70, -60, 30, 24, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); } }
  if (o.crew) for (let i = 0; i < o.crew; i++) picto(g, { x: -120 + i * 80, y: -40, s: 0.55, pose: POSES.stand, items: o.crewItems || [], t, shadow: false, expr: 'neutral' });
  g.restore(); if (o.burn) flames(g, x, y - 40 * s, s * 1.2 * o.burn, t + x); }
// ---------------------------------------------------------------- cargo icons (Uluburun)
export function cargo(g, k, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  if (k === 'glass') { for (let i = 0; i < 3; i++) { g.fillStyle = PAPER; g.beginPath(); g.ellipse(0, 30 - i * 26, 70, 22, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } }
  if (k === 'ivory') { g.strokeStyle = INK; g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.moveTo(-70, 50); g.quadraticCurveTo(-20, -60, 70, -50); g.stroke(); g.strokeStyle = PAPER; g.lineWidth = 18; g.stroke(); }
  if (k === 'ebony') { for (let i = 0; i < 3; i++) { rr(g, -80, 20 - i * 30, 160, 26, 12); g.fillStyle = INK; g.fill(); } }
  if (k === 'egg') { for (const dx of [-38, 38]) { g.fillStyle = PAPER; g.beginPath(); g.ellipse(dx, 0, 32, 44, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } }
  if (k === 'gold') { ring(g, 0, 0, 50, 12, ACC); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; circle(g, Math.cos(a) * 50, Math.sin(a) * 50, 10, ACC); } }
  if (k === 'scarab') { g.fillStyle = ACC; g.beginPath(); g.ellipse(0, 10, 50, 64, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); circle(g, 0, -62, 22, ACC); ring(g, 0, -62, 22, 6, INK); seg(g, [[0, -40], [0, 72]], 5, INK); seg(g, [[-50, -10], [50, -10]], 5, INK); for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) seg(g, [[sx * 44, -20 + i * 34], [sx * 76, -36 + i * 40]], 6, INK); }
  if (k === 'copper') ingot(g, 0, 0, 1);
  if (k === 'tin') ingot(g, 0, 0, 1, { col: PAPER, tin: 1 });
  g.restore(); }
// weapons / tools / armour
export function gear(g, k, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  if (k === 'sword') { poly(g, [[-12, -150], [0, -180], [12, -150], [10, 40], [-10, 40]], PAPER); stroke(g, [[-12, -150], [0, -180], [12, -150], [10, 40], [-10, 40]], 6); seg(g, [[-50, 40], [50, 40]], 16, INK); seg(g, [[0, 40], [0, 100]], 18, INK); circle(g, 0, 108, 14, INK); }
  if (k === 'axe') { seg(g, [[0, -120], [0, 130]], 14, INK); g.fillStyle = PAPER; g.beginPath(); g.moveTo(0, -110); g.quadraticCurveTo(90, -130, 100, -40); g.quadraticCurveTo(60, -50, 0, -30); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); }
  if (k === 'armour') { g.fillStyle = PAPER; g.beginPath(); g.ellipse(0, -60, 70, 60, 0, Math.PI, Math.PI * 2); g.lineTo(70, -20); g.lineTo(-70, -20); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); seg(g, [[-60, -40], [60, -40]], 5, INK); circle(g, 0, 70, 80, PAPER); ring(g, 0, 70, 80, 8, INK); ring(g, 0, 70, 30, 6, INK); }
  g.restore(); }
// ---------------------------------------------------------------- pollen core + trees + sun
export function tree(g, x, y, s, dry = 0, kind = 'oak', t = 0) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [0, -120]], 18, INK); seg(g, [[0, -80], [-40, -130]], 10, INK); seg(g, [[0, -90], [44, -140]], 10, INK);
  const r = rng(kind === 'oak' ? 3 : 9), n = 26; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = r() * 80, lx = Math.cos(a) * d * 1.2, ly = -150 + Math.sin(a) * d * 0.7; const fall = clamp(dry * 1.4 - r() * 0.6); if (fall >= 1) continue;
    const yy = ly + fall * fall * (150 - ly + 10 * Math.sin(i)), xx = lx + Math.sin(t * 3 + i) * 12 * fall; g.fillStyle = kind === 'oak' ? INK : MID; g.beginPath(); g.ellipse(xx, yy, kind === 'oak' ? 18 : 22, kind === 'oak' ? 14 : 8, i, 0, Math.PI * 2); g.fill(); }
  g.restore(); }
export function sun(g, x, y, r, t, col = ACC) { circle(g, x, y, r, col); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.2; seg(g, [[x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18)], [x + Math.cos(a) * (r + 52), y + Math.sin(a) * (r + 52)]], 10, col); } }
export function core(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const N = 9, H = 70, rv = o.reveal ?? 1;
  for (let i = 0; i < N; i++) { const yy = -N * H / 2 + i * H, k = clamp(rv * N - (N - 1 - i)); if (k <= 0) continue; rr(g, -90, yy, 180, H - 4, 6); g.fillStyle = i % 2 ? '#d8d0c0' : '#c4baa6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
    const dens = o.drop != null && i < o.drop ? 2 : 7, r = rng(i * 5 + 1); for (let j = 0; j < dens; j++) circle(g, -70 + r() * 140, yy + 12 + r() * (H - 28), 6, INK); }
  g.restore(); }
// ---------------------------------------------------------------- storage jar (pithos) with grain level
export function jar(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const P = []; for (let i = 0; i <= 20; i++) { const u = i / 20, a = -Math.PI / 2 + u * Math.PI, w = 110 * Math.sin(u * Math.PI) ** 0.6 + 40; P.push([w, -230 + u * 260]); }
  const S2 = [...P, ...P.slice().reverse().map(([a, b]) => [-a, b])]; poly(g, S2, CLAY); const lvl = o.fill ?? 0.8; g.save(); g.beginPath(); S2.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.closePath(); g.clip(); g.fillStyle = MID; g.fillRect(-200, 30 - 260 * lvl, 400, 400); g.restore();
  stroke(g, S2, 8); rr(g, -50, -250, 100, 26, 8); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  if (o.crack) stroke(g, [[-60, -170], [-20, -120], [-50, -60], [-10, -10]], 7, INK, false); g.restore(); }
// ---------------------------------------------------------------- dominoes
export function dominoes(g, t, o) { const n = o.items.length, gap = o.gap || 300, x0 = o.x0 ?? 960 - (n - 1) * gap / 2, y = o.y || 820, H = o.h || 360, W = o.w || 110;
  o.items.forEach((lab, i) => { const at = (o.at || 0) + i * (o.stagger ?? 0.45), k = ease.in(clamp((t - at) / 0.4)); const a = (o.still ? 0 : k) * 1.18; g.save(); g.translate(x0 + i * gap + W / 2, y); g.rotate(a); rr(g, -W, -H, W, H, 14); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); seg(g, [[-W + 16, -H / 2], [-16, -H / 2]], 5, INK); circle(g, -W / 2, -H * 0.75, 12, INK); circle(g, -W / 2, -H * 0.25, 12, INK);
    g.translate(-W / 2, -H - 50); g.rotate(-a); text(g, lab, 0, 0, { size: o.size || 34, color: i === n - 1 && o.lastRed ? ACC : INK, font: FONTS.ui, weight: 900 }); g.restore(); }); }
// ---------------------------------------------------------------- sets
// harbour city on the Syrian coast (Ugarit): flat-roofed houses, palace, harbour wall, sea on the left
export function harbour(g, t, cam, o = {}) { const gy = E.H * 0.8, hz = E.H * 0.58;
  layer(g, cam, 0.25, (g) => { all(g, BG); if (o.sun !== false) circle(g, 300, 220, 70, alpha(INK, 0.06)); });
  layer(g, cam, 0.5, (g) => { g.fillStyle = '#e3ddd0'; g.fillRect(-400, hz, 1100, 800); for (let k = 0; k < 4; k++) { g.strokeStyle = alpha(INK, 0.3); g.lineWidth = 4; g.beginPath(); for (let x = -400; x <= 700; x += 20) { const yy = hz + 40 + k * 60 + Math.sin(x * 0.02 + t * 1.5 + k) * 6; x === -400 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    if (o.ships) for (const [sx, sy, ss] of [[120, hz + 120, 0.45], [430, hz + 60, 0.32]]) ship(g, sx, sy, ss, t, { sea: o.ships === 'sea', burn: 0 }); });
  layer(g, cam, 0.85, (g) => { const r = rng(4); g.fillStyle = INK;
    const blocks = [[640, 200, 150], [800, 160, 210], [970, 220, 140], [1100, 300, 230], [1420, 180, 170], [1610, 240, 130], [1760, 170, 200], [1900, 260, 160]];
    for (const [bx, w, h] of blocks) { rr(g, bx, gy - h, w - 14, h, 4); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); for (let i = 0; i < 2; i++) { rr(g, bx + 24 + i * (w - 90) / 1.4, gy - h + 34, 26, 36, 4); g.fillStyle = INK; g.fill(); } }
    // palace
    rr(g, 1110, gy - 380, 380, 380, 4); g.fillStyle = '#efe9dc'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); for (let i = 0; i < 5; i++) { seg(g, [[1150 + i * 75, gy - 220], [1150 + i * 75, gy]], 12, INK); } seg(g, [[1110, gy - 230], [1490, gy - 230]], 8, INK); for (let i = 0; i < 9; i++) rr(g, 1110 + i * 44, gy - 404, 26, 24, 2), g.fillStyle = INK, g.fill();
    seg(g, [[560, gy], [2000, gy]], 10, INK); seg(g, [[560, gy], [640, gy - 60], [640, gy]], 8, INK);
    const k = o.burnAt != null ? ease.out(clamp((t - o.burnAt) / 1)) : (o.burn || 0); if (k > 0) for (const fx of [700, 900, 1180, 1300, 1450, 1650, 1820]) flames(g, fx, gy - 200 - (fx % 3) * 40, 1.1 * k, t + fx);
  });
  return { GY: gy }; }
// cyclopean citadel wall with a Lion Gate (Mycenae; Hattusa also had a Lion Gate)
export function citadel(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.3, (g) => { all(g, BG); poly(g, [[-300, gy - 120], [300, gy - 300], [700, gy - 220], [1200, gy - 360], [1700, gy - 240], [2300, gy - 320], [2300, gy], [-300, gy]], '#e3ddd0'); });
  layer(g, cam, 0.9, (g) => { const r = rng(12); const top = gy - 470;
    for (let row = 0; row < 5; row++) { let x = -200; while (x < 2200) { const w = 120 + r() * 160, h = 94; if (!(x + w > 800 && x < 1120)) { const yy = top + row * h + (row % 2) * 6; const P = [[x + 6, yy + 4 + r() * 8], [x + w - 6, yy + r() * 10], [x + w - 2, yy + h - 4], [x + 4, yy + h - 2]]; const FL = o.fallAt != null ? clamp((t - o.fallAt) / 1.6) : (o.fall || 0), fall = FL ? ease.in(clamp(FL * 1.6 - r() * 0.8 - (4 - row) * 0.1)) : 0;
          g.save(); if (fall > 0) { g.translate(fall * (r() * 200 - 100), fall * (gy - yy - 60)); g.rotate(fall * (r() - 0.5) * 1.2); } poly(g, P, CLAY); stroke(g, P, 6); g.restore(); } x += w; } }
    // gate: posts, lintel, relieving triangle with two lions & column
    rr(g, 800, top, 40, 470, 4); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, 1080, top, 40, 470, 4); g.fill(); g.stroke(); rr(g, 780, top + 80, 360, 60, 6); g.fill(); g.stroke();
    poly(g, [[820, top + 80], [960, top - 120], [1100, top + 80]], '#d8d0c0'); stroke(g, [[820, top + 80], [960, top - 120], [1100, top + 80]], 7); seg(g, [[960, top + 70], [960, top - 60]], 16, INK);
    for (const sx of [-1, 1]) { g.save(); g.translate(960 + sx * 70, top + 20); g.scale(sx, 1); poly(g, [[0, 50], [10, -30], [30, -60], [50, -50], [60, 50]], INK); g.restore(); }
    g.fillStyle = '#b8b0a2'; g.fillRect(840, top + 140, 240, 330);
    const bk = o.burnAt != null ? ease.out(clamp((t - o.burnAt) / 1)) : (o.burn || 0); if (bk > 0) for (const fx of [200, 520, 1360, 1700]) flames(g, fx, top - 10, 1.2 * bk, t + fx);
  });
  return { GY: gy }; }
// Egyptian temple pylon (Medinet Habu) with carved relief panels
export function pylon(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.3, (g) => { all(g, BG); sun(g, 1650, 170, 60, t, alpha(INK, 0.15)); });
  layer(g, cam, 0.9, (g) => { const tw = (cx) => { const P = [[cx - 380, gy], [cx - 320, gy - 640], [cx + 320, gy - 640], [cx + 380, gy]]; poly(g, P, CLAY); stroke(g, P, 9); seg(g, [[cx - 330, gy - 600], [cx + 330, gy - 600]], 6, INK);
      // relief: rows of little carved figures and a ship
      for (let row = 0; row < 3; row++) for (let i = 0; i < 5; i++) { const fx = cx - 220 + i * 110, fy = gy - 470 + row * 150; picto(g, { x: fx, y: fy + 70, s: 0.42, pose: row === 1 ? POSES.point : POSES.stand, facing: row === 2 ? -1 : 1, t: 0, shadow: false, expr: null, items: row === 2 ? ['feathers'] : [] }); }
    }; tw(560); tw(1360); rr(g, 900, gy - 420, 120, 420, 4); g.fillStyle = '#b8b0a2'; g.fill(); });
  return { GY: gy }; }
// cracked drought plain under a hard sun
export function drought(g, t, cam, o = {}) { const gy = E.H * 0.72; layer(g, cam, 0.3, (g) => { all(g, BG); sun(g, 1560, 380, 80, t); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#d8d0c0'; g.fillRect(-300, gy, 2600, 700); const r = rng(21); for (let row = 0; row < 5; row++) { const y0 = gy + 20 + row * row * 22 + row * 30, h = 40 + row * 30; for (let x = -200 + (row % 2) * 60; x < 2200; x += 120 + row * 70) { const w = 110 + row * 60, j = () => (r() - 0.5) * 24; stroke(g, [[x + j(), y0 + j()], [x + w + j(), y0 + j()], [x + w + j(), y0 + h + j()], [x + j(), y0 + h + j()]], 3 + row, INK); } } seg(g, [[-300, gy], [2300, gy]], 8, INK); });
  return { GY: gy + 120 }; }
// Valley tomb cliffs (Deir el-Medina workmen)
export function cliffs(g, t, cam) { const gy = E.H * 0.8; layer(g, cam, 0.3, (g) => { all(g, BG); }); layer(g, cam, 0.8, (g) => { const P = [[-300, gy], [-300, 240], [300, 180], [600, 300], [900, 160], [1300, 260], [1700, 140], [2300, 260], [2300, gy]]; poly(g, P, '#e3ddd0'); stroke(g, P, 8); for (const [x, y] of [[420, 520], [1100, 470], [1560, 500]]) { rr(g, x - 50, y - 70, 100, 140, 8); g.fillStyle = '#b8b0a2'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } seg(g, [[-300, gy], [2300, gy]], 8, INK); }); return { GY: gy }; }
// ---------------------------------------------------------------- ox cart with families; chariot
export function oxcart(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); const spin = t * 2.5;
  // ox
  g.fillStyle = INK; g.beginPath(); g.ellipse(310, -110, 110, 56, 0, 0, Math.PI * 2); g.fill(); circle(g, 430, -130, 36, INK); seg(g, [[430, -164], [400, -200]], 8, INK); seg(g, [[440, -164], [470, -200]], 8, INK);
  for (const lx of [240, 280, 350, 390]) { const sw = Math.sin(spin * 2 + lx) * 14; seg(g, [[lx, -70], [lx + sw, 0]], 14, INK); }
  seg(g, [[200, -110], [100, -100]], 10, INK);
  // cart & solid wheels
  rr(g, -220, -140, 320, 70, 8); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  for (const wx of [-160, 40]) { circle(g, wx, -40, 52, PAPER); ring(g, wx, -40, 52, 9, INK); g.save(); g.translate(wx, -40); g.rotate(spin); seg(g, [[-40, 0], [40, 0]], 6, INK); g.restore(); }
  const ppl = o.people || [['WOMAN', 1.0], ['CHILD', 0.65], ['CHILD', 0.55], ['WOMAN', 0.95]];
  ppl.forEach(([w, ps], i) => picto(g, { x: -180 + i * 80, y: -140, s: 0.6 * ps, pose: POSES.stand, items: w === 'WOMAN' ? ['ponytail'] : [], t, shadow: false, expr: 'neutral', facing: 1 }));
  g.restore(); }
export function chariot(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); const gal = t * 9;
  // horse
  g.fillStyle = INK; g.beginPath(); g.ellipse(260, -150, 120, 50, -0.05, 0, Math.PI * 2); g.fill(); seg(g, [[350, -170], [400, -260]], 34, INK); g.beginPath(); g.ellipse(420, -262, 46, 24, 0.5, 0, Math.PI * 2); g.fill(); seg(g, [[380, -270], [372, -300]], 8, INK);
  for (const [lx, ph] of [[180, 0], [220, 2], [320, 1], [360, 3]]) { const a = Math.sin(gal + ph) * 0.5; seg(g, [[lx, -120], [lx + Math.sin(a) * 50, -60], [lx + Math.sin(a) * 30, 0]], 12, INK); }
  seg(g, [[150, -160], [100, -200], [60, -170]], 10, INK);
  // chariot box & six-spoke wheel
  rr(g, -120, -190, 160, 120, 10); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); seg(g, [[40, -110], [160, -140]], 9, INK);
  circle(g, -40, -60, 60, PAPER); ring(g, -40, -60, 60, 9, INK); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + gal * 0.4; seg(g, [[-40, -60], [-40 + Math.cos(a) * 56, -60 + Math.sin(a) * 56]], 5, INK); }
  if (o.rider !== false) picto(g, { x: -40, y: -170, s: 0.75, pose: POSES.point || POSES.stand, items: o.items || [], t, shadow: false, expr: 'determined' });
  g.restore(); }
// ---------------------------------------------------------------- mummy + CT ring
export function mummy(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = CLAY; g.beginPath(); g.ellipse(-330, 0, 70, 62, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  const P = [[-270, -60], [200, -80], [330, -40], [330, 40], [200, 80], [-270, 60]]; poly(g, P, CLAY); stroke(g, P, 7); for (let i = 0; i < 12; i++) seg(g, [[-240 + i * 46, -70], [-220 + i * 46, 70]], 3, alpha(INK, 0.5));
  if (o.cut) { const k = ease.out(clamp(o.cut)); seg(g, [[-268, -40], [-268, -40 + 80 * k]], 12, ACC); }
  if (o.scan != null) { const sx = lerp(-420, 380, o.scan); rr(g, sx - 30, -180, 60, 360, 10); g.fillStyle = alpha(ACC, 0.25); g.fill(); seg(g, [[sx, -180], [sx, 180]], 5, ACC); }
  g.restore(); }
export function ctRing(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); ring(g, 0, 0, 260, 70, '#d8d0c0'); ring(g, 0, 0, 296, 8, INK); ring(g, 0, 0, 224, 8, INK); rr(g, -300, 250, 600, 40, 10); g.fillStyle = INK; g.fill(); g.restore(); }
// ---------------------------------------------------------------- Phoenician letters -> Latin
export function phoen(g, ch, x, y, s, col = INK) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 14; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = col; g.beginPath();
  if (ch === 'A') { g.moveTo(-50, -60); g.lineTo(40, 0); g.lineTo(-50, 60); g.moveTo(-20, -80); g.lineTo(-20, 80); }       // aleph (ox head)
  if (ch === 'B') { g.moveTo(-40, -70); g.lineTo(30, -70); g.lineTo(30, 10); g.lineTo(-40, 10); g.moveTo(30, 10); g.lineTo(30, 80); } // bet (house)
  if (ch === 'C') { g.moveTo(-40, 40); g.lineTo(0, -70); g.lineTo(40, 40); }                                               // gimel
  if (ch === 'D') { g.moveTo(0, -70); g.lineTo(50, 40); g.lineTo(-50, 40); g.closePath(); }                              // dalet
  g.stroke(); g.restore(); }
// ---------------------------------------------------------------- modern globe with trade lines
export function globe(g, x, y, r, t, o = {}) { circle(g, x, y, r, PAPER); ring(g, x, y, r, 9, INK); g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  for (let i = -2; i <= 2; i++) { g.strokeStyle = alpha(INK, 0.3); g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, r * Math.abs(Math.cos((i / 5) * Math.PI + t * 0.2)), r, 0, 0, Math.PI * 2); g.stroke(); seg(g, [[x - r, y + i * r * 0.38], [x + r, y + i * r * 0.38]], 3, alpha(INK, 0.3)); }
  const C = [[-0.5, -0.3], [0.1, -0.45], [0.55, -0.1], [0.3, 0.4], [-0.35, 0.35], [-0.05, 0.05]]; C.forEach(([a, b]) => { circle(g, x + a * r, y + b * r, 10, INK); });
  for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) { const [a, b] = C[i], [c, d] = C[j], flick = o.flicker != null && i === 0 && j === 3 && Math.sin(t * 22) > 0.2; if (flick) continue; seg(g, [[x + a * r, y + b * r], [x + c * r, y + d * r]], 4, alpha(ACC, 0.9)); }
  g.restore(); }
// Mycenaean palace hall (megaron): porch columns, gabled roof
export function megaron(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -360, -300, 720, 300, 4); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  poly(g, [[-400, -300], [0, -440], [400, -300]], '#d8d0c0'); stroke(g, [[-400, -300], [0, -440], [400, -300]], 8); for (const cx of [-120, 120]) { seg(g, [[cx, -290], [cx, 0]], 30, INK); rr(g, cx - 34, -300, 68, 22, 4); g.fillStyle = INK; g.fill(); }
  rr(g, -60, -200, 120, 200, 6); g.fillStyle = INK; g.fill(); seg(g, [[-460, 0], [460, 0]], 10, INK); g.restore(); }
// a book cover with a title (for "1177 B.C." by Eric H. Cline)
export function cover(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -190, -260, 380, 520, 14); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); rr(g, -190, -260, 34, 520, 8); g.fillStyle = INK; g.fill();
  text(g, title, 20, -60, { size: 74, color: ACC, font: FONTS.serif, weight: 900 }); seg(g, [[-100, 10], [140, 10]], 5, INK); String(sub).split('|').forEach((ln, i) => text(g, ln, 20, 70 + i * 40, { size: 28, color: INK, font: FONTS.ui, weight: 900 })); g.restore(); }
