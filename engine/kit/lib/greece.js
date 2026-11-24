// greece.js — Greco-Persian war sets & props (the pass at Thermopylae, mountain path at night, Persian camp,
// Acropolis, modern plain, the hill of the last stand; throne, arrow storm, boat bridge, stele, altar, horseman).
// Light palette; the noir theme remaps it to black / white / red.
import { E, layer, seg, circle, ring, rr, poly, alpha, text, FONTS, rng, ease, clamp, lerp } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { picto } from './picto.js';
import * as BZ from './bronze.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#ffffff', BG = '#f5f2ec', MID = '#9a9488', CLAY = '#e9e2d4', ROCK = '#d8d0c0';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const outline = (g, P, w = 8) => { g.strokeStyle = INK; g.lineWidth = w; g.lineJoin = 'round'; g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); };
// the pass: steep mountain on the left, sea on the right, a narrow strip of ground; optional wall
export function pass(g, t, cam, o = {}) { const gy = E.H * 0.78;
  layer(g, cam, 0.3, (g) => { all(g, BG); if (o.sun) BZ.sun(g, 1650, 150, 50, t, alpha(INK, 0.25)); });
  layer(g, cam, 0.6, (g) => { const M = [[-300, gy - 120], [-300, 120], [150, 60], [420, 180], [700, 40], [1000, 150], [1300, 20], [1650, 170], [2300, 80], [2300, gy - 120]]; poly(g, M, ROCK); outline(g, M.slice(1, -1), 9);
    for (const [x, y] of [[120, 300], [520, 260], [900, 330], [1250, 240], [1600, 320], [300, 460], [1100, 470]]) outline(g, [[x, y], [x + 70, y + 34], [x + 140, y + 12]], 5);
    if (o.path) { const k = clamp(o.path); g.save(); g.setLineDash([22, 16]); g.strokeStyle = ACC; g.lineWidth = 10; g.beginPath(); const P = [[1900, gy - 160], [1650, 300], [1200, 110], [700, 120], [300, 260], [80, gy - 160]]; const N = Math.max(1, Math.floor(k * (P.length - 1) * 10)); for (let i = 0; i <= N; i++) { const u = i / 10, j = Math.min(P.length - 2, Math.floor(u)), f = u - j; const x = lerp(P[j][0], P[j + 1][0], f), y = lerp(P[j][1], P[j + 1][1], f); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore(); } });
  layer(g, cam, 0.85, (g) => { g.fillStyle = '#e9e2d4'; g.fillRect(-300, gy - 120, 2600, 120); seg(g, [[-300, gy - 120], [2300, gy - 120]], 6, INK); seg(g, [[-300, gy], [2300, gy]], 10, INK);
    if (o.wall !== false) { const wx = o.wx ?? 380; for (let i = 0; i < 4; i++) { rr(g, wx - 30 + (i % 2) * 14, gy - 34 - i * 36, 70, 34, 4); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); } } });
  layer(g, cam, 1, (g) => { g.fillStyle = '#e3ddd0'; g.fillRect(-300, gy + 6, 2600, 400); for (let k = 0; k < 4; k++) { g.strokeStyle = alpha(INK, 0.4); g.lineWidth = 4; g.beginPath(); for (let x = -300; x <= 2300; x += 20) { const y = gy + 40 + k * 45 + Math.sin(x * 0.02 + t * 1.5 + k) * 5; x === -300 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } });
  return { GY: gy }; }
// mountain path at night with oak trees
export function ridge(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.3, (g) => { all(g, BG); const r = rng(3); for (let i = 0; i < 40; i++) circle(g, r() * 1920, r() * 400, 2 + r() * 3, alpha(INK, 0.5)); circle(g, 1650, 160, 50, alpha(INK, 0.12)); });
  layer(g, cam, 0.6, (g) => { poly(g, [[-300, gy - 260], [300, gy - 420], [800, gy - 300], [1300, gy - 460], [2300, gy - 280], [2300, gy], [-300, gy]], ROCK); outline(g, [[-300, gy - 260], [300, gy - 420], [800, gy - 300], [1300, gy - 460], [2300, gy - 280]], 7); });
  layer(g, cam, 0.9, (g) => { for (const x of [80, 360, 620, 1500, 1760]) BZ.tree(g, x, gy, 1.4, o.leaves ?? 0, 'oak', t); seg(g, [[-300, gy], [2300, gy]], 10, INK); const r = rng(8); for (let i = 0; i < 40; i++) { g.fillStyle = INK; g.beginPath(); g.ellipse(r() * 1920, gy + 10 + r() * 30, 10, 5, r() * 3, 0, Math.PI * 2); g.fill(); } });
  return { GY: gy }; }
// Persian camp: tents and a raised throne platform
export function camp(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.7, (g) => { for (const [x, s] of [[150, 1], [420, 0.8], [1560, 0.9], [1800, 1.1]]) { poly(g, [[x - 140 * s, gy], [x, gy - 200 * s], [x + 140 * s, gy]], CLAY); outline(g, [[x - 140 * s, gy], [x, gy - 200 * s], [x + 140 * s, gy], [x - 140 * s, gy]], 7); seg(g, [[x, gy - 200 * s], [x, gy - 250 * s]], 5, INK); poly(g, [[x, gy - 250 * s], [x + 40 * s, gy - 236 * s], [x, gy - 222 * s]], ACC); } seg(g, [[-300, gy], [2300, gy]], 10, INK); });
  if (o.throne !== false) layer(g, cam, 0.9, (g) => throne(g, o.tx ?? 960, gy, 1));
  return { GY: gy - (o.throne !== false ? 0 : 0) }; }
export function throne(g, x, gy, s) { g.save(); g.translate(x, gy); g.scale(s, s); rr(g, -240, -90, 480, 90, 6); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); for (let i = 0; i < 3; i++) seg(g, [[-240 + i * 30, -90 + i * 30], [240 - i * 30, -90 + i * 30]], 4, INK);
  rr(g, -90, -330, 180, 240, 14); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); rr(g, -130, -180, 260, 30, 8); g.fillStyle = ACC; g.fill(); g.restore(); }
// Acropolis rock with a temple
export function acropolis(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.85, (g) => { const R = [[300, gy], [420, gy - 260], [700, gy - 330], [1220, gy - 340], [1480, gy - 260], [1620, gy]]; poly(g, R, ROCK); outline(g, R, 8);
    const ty = gy - 340; rr(g, 720, ty - 30, 480, 30, 4); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); for (let i = 0; i < 7; i++) seg(g, [[750 + i * 70, ty - 30], [750 + i * 70, ty - 200]], 18, INK); rr(g, 720, ty - 230, 480, 30, 4); g.fillStyle = CLAY; g.fill(); g.stroke(); poly(g, [[700, ty - 230], [960, ty - 320], [1220, ty - 230]], CLAY); outline(g, [[700, ty - 230], [960, ty - 320], [1220, ty - 230], [700, ty - 230]], 6);
    seg(g, [[-300, gy], [2300, gy]], 10, INK);
    const k = o.burnAt != null ? ease.out(clamp((t - o.burnAt) / 1)) : (o.burn || 0); if (k > 0) for (const fx of [760, 900, 1040, 1180]) BZ.flames(g, fx, ty - 150, 1.3 * k, t + fx); });
  return { GY: gy }; }
// today: a wide flat plain where the pass used to be, with a road and a distant line of sea
export function plain(g, t, cam) { const gy = E.H * 0.7; layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.8, (g) => { poly(g, [[-300, gy], [-300, -100], [260, -100], [420, 160], [520, gy]], ROCK); outline(g, [[-300, -100], [260, -100], [420, 160], [520, gy]], 8); g.fillStyle = '#e3ddd0'; g.fillRect(-300, gy, 2600, 600); seg(g, [[-300, gy], [2300, gy]], 8, INK);
    seg(g, [[700, E.H + 50], [1100, gy + 10]], 8, INK); seg(g, [[1100, E.H + 50], [1140, gy + 10]], 8, INK); seg(g, [[1700, gy + 40], [2300, gy + 40]], 4, alpha(INK, 0.4)); });
  return { GY: gy + 200 }; }
// the small hill of the last stand
export function hill(g, t, cam) { const gy = E.H * 0.8; layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = ROCK; g.beginPath(); g.moveTo(300, gy); g.quadraticCurveTo(960, gy - 380, 1620, gy); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.beginPath(); g.moveTo(300, gy); g.quadraticCurveTo(960, gy - 380, 1620, gy); g.stroke(); seg(g, [[-300, gy], [2300, gy]], 10, INK); });
  return { GY: gy - 175 }; }
// ---------------------------------------------------------------- props
// a rain of arrows; cover 0..1 hides the sun
export function arrows(g, t, o = {}) { const n = o.n || 80, r = rng(o.seed || 5); if (o.sun) { BZ.sun(g, o.sx ?? 1500, o.sy ?? 220, 80, t); }
  for (let i = 0; i < n; i++) { const p = ((t * (o.speed || 0.6)) + r()) % 1, x0 = r() * 2400 - 400 + (o.dx || 0), y = -100 + p * 1300, x = x0 + p * 500; const a = Math.atan2(1300, 500); g.save(); g.translate(x, y); g.rotate(a); seg(g, [[-50, 0], [20, 0]], 4, INK); poly(g, [[20, -7], [36, 0], [20, 7]], INK); seg(g, [[-50, 0], [-62, -8]], 3, INK); seg(g, [[-50, 0], [-62, 8]], 3, INK); g.restore(); }
  if (o.cover) { const k = clamp(o.cover); g.save(); g.globalAlpha = k * 0.85; const r2 = rng(9); for (let i = 0; i < 260; i++) { const x = (o.sx ?? 1500) - 260 + r2() * 520, y = (o.sy ?? 220) - 200 + r2() * 400; g.save(); g.translate(x, y); g.rotate(1.2); seg(g, [[-30, 0], [30, 0]], 5, INK); g.restore(); } g.restore(); } }
// line of ships lashed together with a road across them (the Hellespont bridges)
export function boatBridge(g, x0, x1, y, t, o = {}) { const n = Math.floor((x1 - x0) / 130); for (let i = 0; i < n; i++) { const x = x0 + i * 130, bob = Math.sin(t * 2 + i) * 3; g.fillStyle = INK; g.beginPath(); g.moveTo(x - 62, y - 30 + bob); g.quadraticCurveTo(x, y + 70 + bob, x + 62, y - 30 + bob); g.closePath(); g.fill(); seg(g, [[x, y - 30 + bob], [x, y - 140 + bob]], 6, INK); }
  if (o.road !== false) { rr(g, x0 - 70, y - 54, x1 - x0 + 20, 30, 6); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); seg(g, [[x0 - 70, y - 74], [x1 - 50, y - 74]], 5, INK); }
  if (o.broken) { const k = clamp(o.broken); for (let i = 0; i < 6; i++) { const x = lerp(x0, x1, (i + 0.5) / 6); seg(g, [[x - 30, y - 70], [x + 30, y - 10]], 8 * k, ACC); } } }
// stone marker with an inscription
export function stele(g, x, y, s, lines, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -260, -560, 520, 560, 20); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); rr(g, -300, -20, 600, 40, 8); g.fillStyle = ROCK; g.fill(); g.stroke();
  (lines || []).forEach((l, i) => { const k = o.reveal == null ? 1 : clamp(o.reveal * lines.length - i); if (k <= 0) return; g.save(); g.globalAlpha = k; text(g, l, 0, -470 + i * 70, { size: o.size || 42, color: i === lines.length - 1 && o.lastRed ? ACC : INK, font: FONTS.serif, weight: 900 }); g.restore(); }); g.restore(); }
// altar with smoke (the seer's sacrifice)
export function altar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -90, -120, 180, 120, 8); g.fillStyle = CLAY; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, -110, -140, 220, 26, 6); g.fill(); g.stroke(); BZ.flames(g, 0, -140, 0.7, t); g.restore(); }
// horseman (scout)
export function horseman(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); const gal = t * 9;
  g.fillStyle = INK; g.beginPath(); g.ellipse(0, -150, 120, 50, 0, 0, Math.PI * 2); g.fill(); seg(g, [[90, -170], [140, -260]], 34, INK); g.beginPath(); g.ellipse(160, -262, 46, 24, 0.5, 0, Math.PI * 2); g.fill(); seg(g, [[-115, -160], [-170, -110]], 12, INK);
  for (const [lx, ph] of [[-80, 0], [-40, 2], [60, 1], [100, 3]]) { const a = Math.sin(gal + ph) * 0.5; seg(g, [[lx, -120], [lx + Math.sin(a) * 50, -60], [lx + Math.sin(a) * 30, 0]], 12, INK); }
  picto(g, { x: -10, y: -170, s: 0.8, pose: POSES.sit || POSES.stand, items: o.items || ['tiara'], t, shadow: false, expr: o.e || 'neutral' }); g.restore(); }
// an eye (Aristodemus' eye infection)
export function eye(g, x, y, s, k = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = PAPER; g.beginPath(); g.moveTo(-160, 0); g.quadraticCurveTo(0, -120, 160, 0); g.quadraticCurveTo(0, 120, -160, 0); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); circle(g, 0, 0, 56, INK); circle(g, 0, 0, 22, PAPER);
  if (k > 0) { g.save(); g.globalAlpha = k; for (let i = 0; i < 5; i++) seg(g, [[-120 + i * 20, -20 + i * 8], [-60 + i * 22, 10 - i * 6]], 5, ACC); g.restore(); } g.restore(); }
