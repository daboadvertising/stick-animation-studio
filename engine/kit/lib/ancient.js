// ancient.js — ancient-history / archaeology sets and props (storm sea, seabed, museum, gears, dials, scans).
// Drawn in the classic light palette; the noir theme remaps it to black / white / red automatically.
import { E, layer, seg, circle, ring, rr, poly, alpha, shade, text, FONTS, rng, linGrad, ease, prog, clamp, lerp } from '/engine/core.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#ffffff', BG = '#f5f2ec', MID = '#9a9488';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
// ---------------- sets ----------------
// stormy sea with a small boat, waves, rain and lightning flashes (o.calm for still water)
export function stormsea(g, t, cam, o = {}) { const hz = E.H * 0.55, calm = o.calm;
  layer(g, cam, 0.2, (g) => { all(g, BG); if (!calm) { const r = rng(3); for (let i = 0; i < 60; i++) { const x = (r() * 2400 + t * 400) % 2400 - 200, y = (r() * 1200 + t * 900) % 1200 - 100; seg(g, [[x, y], [x - 14, y + 40]], 3, alpha(INK, 0.35)); } }
    if (!calm && (t % 4.2) < 0.12) { seg(g, [[1500, -20], [1440, 160], [1500, 200], [1420, 380]], 8, INK); }
    if (o.island !== false) { poly(g, [[1250, hz + 6], [1360, hz - 120], [1450, hz - 80], [1560, hz - 170], [1700, hz + 6]], INK); } });
  layer(g, cam, 0.6, (g) => { for (let k = 0; k < 7; k++) { const y = hz + k * 70, amp = (calm ? 6 : 22) + k * (calm ? 2 : 8); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); for (let x = -200; x <= 2200; x += 20) { const yy = y + Math.sin(x * 0.012 + t * (calm ? 1 : 2.4) + k) * amp; x === -200 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); } });
  if (o.boat !== false) layer(g, cam, 0.8, (g) => { const bx = o.bx ?? 760, by = hz + 40 + Math.sin(t * 2.4) * (calm ? 4 : 16), rot = Math.sin(t * 1.9) * (calm ? 0.02 : 0.12); g.save(); g.translate(bx, by); g.rotate(rot);
    poly(g, [[-220, 0], [220, 0], [170, 80], [-170, 80]], INK); seg(g, [[0, 0], [0, -300]], 10, INK); poly(g, [[8, -290], [8, -40], [190, -40]], PAPER); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(8, -290); g.lineTo(8, -40); g.lineTo(190, -40); g.closePath(); g.stroke(); g.restore(); });
  return { GY: hz + 40 }; }
// seabed: dark-ish water column, light rays, sand, scattered statue limbs & amphorae
export function seabed(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.3, (g) => { all(g, BG); for (let i = 0; i < 6; i++) { const x = 200 + i * 320 + Math.sin(t * 0.4 + i) * 30; g.fillStyle = alpha('#ffffff', 0.5); g.beginPath(); g.moveTo(x - 30, -20); g.lineTo(x + 30, -20); g.lineTo(x + 140, gy); g.lineTo(x + 40, gy); g.fill(); }
    for (let i = 0; i < 14; i++) { const p = ((t * 0.15) + i / 14) % 1; ring(g, 120 + i * 130 + Math.sin(i) * 40, gy - p * 900, 6 + (i % 3) * 3, 3, alpha(INK, 0.6 * (1 - p))); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = MID; g.beginPath(); g.moveTo(-200, gy); for (let x = -200; x <= 2200; x += 80) g.lineTo(x, gy - 10 - Math.sin(x * 0.01) * 14); g.lineTo(2200, E.H + 200); g.lineTo(-200, E.H + 200); g.fill();
    if (o.wreck !== false) { // broken hull ribs
      for (let i = 0; i < 6; i++) { g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.arc(1300 + i * 70, gy + 40, 120 - i * 6, Math.PI * 1.1, Math.PI * 1.75); g.stroke(); }
      for (const [x, r] of [[300, 0.3], [520, -0.5], [880, 0.9], [1150, 0.2]]) { g.save(); g.translate(x, gy - 30); g.rotate(r); rr(g, -70, -24, 140, 48, 24); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); } // marble limbs
      for (const x of [420, 1000, 1700]) { g.save(); g.translate(x, gy - 20); g.rotate(1.2); g.fillStyle = INK; g.beginPath(); g.ellipse(0, 0, 34, 70, 0, 0, Math.PI * 2); g.fill(); g.fillRect(-12, -100, 24, 40); g.restore(); } } });
  return { GY: gy }; }
// museum hall: plinths, display cases, framed labels
export function museum(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, BG); for (let x = 0; x < 2000; x += 380) { g.fillStyle = '#e8e2d6'; g.fillRect(x + 40, 80, 300, 560); poly(g, [[x + 30, 80], [x + 350, 80], [x + 190, 30]], '#e1dacd'); }
    g.fillStyle = '#e1dacd'; g.fillRect(-200, gy, E.W + 400, 400); seg(g, [[-200, gy], [E.W + 200, gy]], 4, '#d3ccbe');
    if (o.cases !== false) for (const x of [380, 1540]) { rr(g, x - 90, gy - 220, 180, 220, 6); g.fillStyle = '#d3ccbe'; g.fill(); rr(g, x - 110, gy - 520, 220, 300, 6); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.fillStyle = alpha('#ffffff', 0.5); g.fill(); circle(g, x, gy - 360, 46, MID); } });
  return { GY: gy }; }
// ---------------- props ----------------
// brass diving helmet drawn on top of a figure's head (hx, hy = head centre)
export function helmet(g, hx, hy, s = 1) { g.save(); g.translate(hx, hy); g.scale(s, s); circle(g, 0, 0, 46, '#c9a46a'); ring(g, 0, 0, 46, 6, INK); circle(g, 10, 0, 18, PAPER); ring(g, 10, 0, 18, 5, INK); seg(g, [[-30, 40], [30, 40]], 12, INK); seg(g, [[-36, -24], [-60, -60]], 5, INK); g.restore(); }
// the corroded lump (shapeless fragment); gearAt 0..1 reveals a gear inside
export function lump(g, x, y, s, t, reveal = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#7d8691'; g.beginPath(); const r = rng(11); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, rr2 = 150 + r() * 40; g.lineTo(Math.cos(a) * rr2 * 1.3, Math.sin(a) * rr2); } g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  for (let i = 0; i < 18; i++) circle(g, (r() - 0.5) * 340, (r() - 0.5) * 240, 6 + r() * 10, alpha(INK, 0.35));
  if (reveal > 0) { g.save(); g.globalAlpha *= reveal; gear(g, 30, -10, 95, 34, t * 0.2, PAPER, INK); g.restore(); if (reveal > 0.8) ring(g, 30, -10, 130 + Math.sin(t * 4) * 6, 8, ACC); } g.restore(); }
// a gear wheel with n triangular teeth
export function gear(g, x, y, r, n, rot = 0, fill = PAPER, line = INK, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); for (let i = 0; i < n; i++) { const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.5) / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2; g.lineTo(Math.cos(a0) * r, Math.sin(a0) * r); g.lineTo(Math.cos(a1) * (r + r * 0.12), Math.sin(a1) * (r + r * 0.12)); g.lineTo(Math.cos(a2) * r, Math.sin(a2) * r); } g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = line; g.lineWidth = Math.max(3, r * 0.04); g.stroke();
  if (o.spokes !== false) for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; rr(g, -r * 0.08, -r * 0.72, r * 0.16, r * 0.72, 4); g.save(); g.rotate(a); g.fillStyle = line; g.fillRect(-r * 0.05, -r * 0.7, r * 0.1, r * 0.55); g.restore(); }
  ring(g, 0, 0, r * 0.72, Math.max(3, r * 0.05), line); circle(g, 0, 0, r * 0.12, line); g.restore(); }
// gear train: several meshing gears turning
export function gearTrain(g, cx, cy, s, t, speed = 0.6) { const G = [[0, 0, 160, 48, 1], [215, -40, 70, 21, -48 / 21], [300, 110, 95, 28, 48 / 28 * (21 / 28) * -1], [-210, 90, 85, 25, -48 / 25], [-120, -190, 60, 18, -48 / 18]]; g.save(); g.translate(cx, cy); g.scale(s, s); G.forEach(([x, y, r, n, ratio], i) => gear(g, x, y, r, n, t * speed * ratio + i * 0.2, i % 2 ? '#f6ead0' : PAPER, INK)); g.restore(); }
// X-ray / CT scan view of a fragment: dark panel with glowing gear outlines revealed by a scanning line
export function xray(g, x, y, w, h, t, k = 1, o = {}) { g.save(); rr(g, x - w / 2, y - h / 2, w, h, 20); g.fillStyle = INK; g.fill(); g.clip(); const sx = x - w / 2 + w * k;
  g.save(); g.beginPath(); g.rect(x - w / 2, y - h / 2, w * k, h); g.clip(); const r = rng(5); for (let i = 0; i < (o.n || 7); i++) { const gx = x - w * 0.35 + r() * w * 0.7, gy = y - h * 0.3 + r() * h * 0.6, gr = 40 + r() * 90; g.globalAlpha = 0.75; g.strokeStyle = '#e8e8e8'; g.lineWidth = 3; g.beginPath(); for (let j = 0; j <= 40; j++) { const a = j / 40 * Math.PI * 2, rr2 = gr + (j % 2) * gr * 0.1; j ? g.lineTo(gx + Math.cos(a) * rr2, gy + Math.sin(a) * rr2) : g.moveTo(gx + rr2, gy); } g.stroke(); ring(g, gx, gy, gr * 0.6, 2, '#bbbbbb'); }
  if (o.letters) { g.globalAlpha = 0.9; for (let i = 0; i < 90; i++) text(g, 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'[Math.floor(r() * 24)], x - w * 0.45 + (i % 18) * (w * 0.05), y - h * 0.3 + Math.floor(i / 18) * 46, { size: 26, color: '#ffffff', font: FONTS.ui, weight: 900 }); } g.restore();
  g.globalAlpha = 1; seg(g, [[sx, y - h / 2], [sx, y + h / 2]], 6, ACC); g.restore(); rr(g, x - w / 2, y - h / 2, w, h, 20); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); }
// the front dial: zodiac ring, sun & moon pointers, moon-phase ball
export function frontDial(g, x, y, r, t, o = {}) { const turn = o.turn ?? t * 0.6; g.save(); g.translate(x, y); circle(g, 0, 0, r, '#f6ead0'); ring(g, 0, 0, r, 10, INK); ring(g, 0, 0, r * 0.78, 6, INK);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(g, [[Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78], [Math.cos(a) * r, Math.sin(a) * r]], 5, INK); circle(g, Math.cos(a + 0.26) * r * 0.89, Math.sin(a + 0.26) * r * 0.89, r * 0.025, INK); }
  const as = turn * 0.3 - Math.PI / 2, am = turn * 4 - Math.PI / 2 + (o.anomaly ? Math.sin(turn * 4) * 0.35 : 0);
  seg(g, [[0, 0], [Math.cos(as) * r * 0.7, Math.sin(as) * r * 0.7]], 10, ACC); circle(g, Math.cos(as) * r * 0.7, Math.sin(as) * r * 0.7, r * 0.09, ACC);
  seg(g, [[0, 0], [Math.cos(am) * r * 0.55, Math.sin(am) * r * 0.55]], 8, INK); const mx = Math.cos(am) * r * 0.55, my = Math.sin(am) * r * 0.55, mr = r * 0.1; circle(g, mx, my, mr, PAPER); g.save(); g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.clip(); const ph = Math.cos(turn * 4 - turn * 0.3); circle(g, mx + ph * mr * 1.4, my, mr, INK); g.restore(); ring(g, mx, my, mr, 4, INK);
  circle(g, 0, 0, r * 0.06, INK); g.restore(); }
// back spiral dial (Metonic / Saros style) with a pointer winding outwards; k 0..1 progress
export function spiralDial(g, x, y, r, t, label, turns = 5, o = {}) { g.save(); g.translate(x, y); rr(g, -r * 1.1, -r * 1.1, r * 2.2, r * 2.2, 18); g.fillStyle = '#f6ead0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); const N = 400; for (let i = 0; i <= N; i++) { const u = i / N, a = u * turns * Math.PI * 2 - Math.PI / 2, rr2 = r * (0.25 + 0.7 * u); i ? g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : g.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } g.stroke();
  const u = (o.speed ?? 0.06) * t % 1, a = u * turns * Math.PI * 2 - Math.PI / 2, rr2 = r * (0.25 + 0.7 * u); seg(g, [[0, 0], [Math.cos(a) * rr2, Math.sin(a) * rr2]], 7, ACC); circle(g, Math.cos(a) * rr2, Math.sin(a) * rr2, 12, ACC);
  if (o.marks) for (let i = 0; i < 9; i++) { const uu = (i + 0.5) / 9, aa = uu * turns * Math.PI * 2 - Math.PI / 2, r3 = r * (0.25 + 0.7 * uu); circle(g, Math.cos(aa) * r3, Math.sin(aa) * r3, 9, INK); }
  circle(g, 0, 0, 12, INK); g.restore(); text(g, label, x, y + r * 1.1 + 50, { size: 38, color: INK, font: FONTS.ui, weight: 900, spacing: 3 }); }
// pin-and-slot: two off-centre gears; the second's pointer speeds up and slows down
export function pinSlot(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const a = t * 0.9, off = 40; gear(g, -off, 0, 150, 44, a, PAPER, INK, { spokes: false }); const px = -off + Math.cos(a) * 110, py = Math.sin(a) * 110; const b = Math.atan2(py, px - off);
  gear(g, off, 0, 150, 44, b, '#f6ead0', INK, { spokes: false }); g.save(); g.translate(off, 0); g.rotate(b); rr(g, 60, -14, 110, 28, 14); g.fillStyle = INK; g.fill(); g.restore(); circle(g, px, py, 14, ACC); ring(g, px, py, 14, 4, INK);
  seg(g, [[off, 0], [off + Math.cos(b) * 260, Math.sin(b) * 260]], 8, ACC); circle(g, off + Math.cos(b) * 260, Math.sin(b) * 260, 26, PAPER); ring(g, off + Math.cos(b) * 260, Math.sin(b) * 260, 26, 6, INK); g.restore(); }
// the reconstructed mechanism box (front view) with a handle that turns
export function mechBox(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -260, -340, 520, 680, 20); g.fillStyle = '#c9a46a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); frontDial(g, 0, -20, 220, t, { anomaly: o.anomaly });
  rr(g, -200, 250, 400, 60, 10); g.fillStyle = '#f6ead0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); for (let i = 0; i < 3; i++) g.fillRect(-170, 266 + i * 14, 340, 4);
  const ha = t * 2.4; seg(g, [[260, 0], [300, 0]], 16, INK); seg(g, [[300, 0], [300 + Math.cos(ha) * 70, Math.sin(ha) * 70]], 14, INK); circle(g, 300 + Math.cos(ha) * 70, Math.sin(ha) * 70, 20, ACC); g.restore(); }
// timeline across the screen: lit start, a long dark gap, lit end
export function lostTimeline(g, y, t, k = 1) { const x0 = 200, x1 = 1720, xe = lerp(x0, x1, ease.inOut(clamp(k))); seg(g, [[x0, y], [xe, y]], 10, INK); for (let i = 0; i <= 15; i++) { const x = lerp(x0, x1, i / 15); if (x > xe) break; seg(g, [[x, y - 14], [x, y + 14]], 5, INK); }
  if (k > 0) { gear(g, x0, y - 120, 70, 22, t * 0.5, PAPER, INK); text(g, '~100 BC', x0, y + 70, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); }
  if (k > 0.98) { gear(g, x1, y - 120, 70, 22, t * 0.5, PAPER, INK); text(g, '1300s AD', x1, y + 70, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); text(g, '?  ?  ?', 960, y - 110, { size: 70, color: ACC }); } }
// Greek map (stylised): Peloponnese, Crete, Antikythera between, Rhodes, Sicily/Syracuse, Corinth
export const GPIN = { antikythera: [800, 640], athens: [930, 430], corinth: [830, 450], rhodes: [1380, 640], syracuse: [260, 600], crete: [1000, 760] };
function greeceMapOutline(g, pts) { g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); }
export function greeceMap(g) { all(g, BG); g.fillStyle = '#e1dacd'; const GR = [[600, 300], [820, 280], [1000, 330], [1060, 420], [960, 470], [880, 470], [900, 560], [820, 620], [760, 560], [700, 600], [640, 520], [600, 420]], CR = [[880, 760], [1180, 740], [1220, 790], [900, 800]], SI = [[140, 520], [360, 520], [340, 640], [180, 680]]; poly(g, GR, '#8a8478'); poly(g, CR, '#8a8478'); greeceMapOutline(g, GR); greeceMapOutline(g, CR); greeceMapOutline(g, SI);
  poly(g, SI, '#8a8478'); circle(g, 1390, 640, 30, '#8a8478'); ring(g, 1390, 640, 30, 6, INK); ring(g, 800, 645, 12, 4, INK); circle(g, 800, 645, 12, '#c9c1b2'); for (const [x, y, w, h] of [[200, 330, 150, 120], [1150, 340, 160, 120]]) { rr(g, x, y, w, h, 30); g.fillStyle = '#d3ccbe'; g.fill(); } }
