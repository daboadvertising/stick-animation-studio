// louvre.js — The theft of the Mona Lisa (Paris 1911 – Florence 1913): sets & props.
// Sets: gallery (Salon Carré wall: paintings, the panel or four bare hooks, easel, crowd), stairwell (service stairs, locked door,
// discarded frame & glass), paris (street + Louvre façade), garret (Peruggia's room: bed, table, trunk), records (police card files),
// hotel (Florence hotel room). Props: mona (stylised panel portrait), hooks, frame, glassBox, trunk, fingerprint, newspaper, postcard,
// phoneCrowd, cardDrawer, wrench. Light palette; the noir theme remaps it to black / white / red.
import { E, layer, seg, circle, ring, rr, poly, text, FONTS, rng, ease, clamp, lerp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { picto } from './picto.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#f4efe4', BG = '#f5f2ec', MID = '#9a9488', STONE = '#d8d0c0', CLAY = '#e6dfd0', DARKG = '#8f897d';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const box = (g, x, y, w, h, fill, lw = 6, r = 4) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); };

// ---------------------------------------------------------------- the painting (stylised, not a copy): panel 77 x 53 ratio
// mona(g, cx, cy, s, {frame, smile, glow}) — panel height ≈ 300*s
export function mona(g, cx, cy, s, o = {}) { g.save(); g.translate(cx, cy); g.scale(s, s); const W = 212, H = 300;
  if (o.frame) { box(g, -W / 2 - 34, -H / 2 - 34, W + 68, H + 68, DARKG, 8, 6); rr(g, -W / 2 - 20, -H / 2 - 20, W + 40, H + 40, 4); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
  box(g, -W / 2, -H / 2, W, H, PAPER, 6, 2);
  g.save(); rr(g, -W / 2, -H / 2, W, H, 2); g.clip();
  // distant landscape: winding lines
  g.strokeStyle = MID; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); for (let x = -W / 2; x <= W / 2; x += 10) g.lineTo(x, -60 + i * 24 + Math.sin(x * 0.05 + i) * 8); g.stroke(); }
  // figure: shoulders / dress, folded hands, dark hair framing the face
  g.fillStyle = INK; g.beginPath(); g.moveTo(-W / 2, H / 2); g.quadraticCurveTo(-80, 10, 0, 0); g.quadraticCurveTo(80, 10, W / 2, H / 2); g.closePath(); g.fill();
  g.fillStyle = INK; g.beginPath(); g.ellipse(0, -62, 52, 74, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = PAPER; g.beginPath(); g.ellipse(0, -58, 34, 50, 0, 0, Math.PI * 2); g.fill();
  circle(g, -12, -66, 4, INK); circle(g, 12, -66, 4, INK);
  g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.arc(0, -46, 12, 0.35, Math.PI - 0.35); g.stroke();
  rr(g, -46, 90, 92, 30, 14); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  g.restore();
  if (o.glow) { g.strokeStyle = ACC; g.lineWidth = 8; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; seg(g, [[Math.cos(a) * (W * 0.85), Math.sin(a) * (H * 0.7)], [Math.cos(a) * (W * 1.05), Math.sin(a) * (H * 0.86)]], 7, ACC); } }
  g.restore(); }
export function hooks(g, cx, cy, s, o = {}) { g.save(); g.translate(cx, cy); g.scale(s, s); for (const [x, y] of [[-110, -140], [110, -140], [-110, 140], [110, 140]]) { seg(g, [[x, y], [x, y + 22]], 9, INK); seg(g, [[x, y + 22], [x + (x < 0 ? -12 : 12), y + 14]], 8, INK); circle(g, x, y, 7, INK); }
  if (o.ghost) { g.save(); g.setLineDash([16, 14]); rr(g, -140, -175, 280, 350, 6); g.strokeStyle = MID; g.lineWidth = 5; g.stroke(); g.restore(); } g.restore(); }
export function glassBox(g, cx, cy, s) { g.save(); g.translate(cx, cy); g.scale(s, s); rr(g, -150, -190, 300, 380, 8); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); seg(g, [[-110, -150], [-40, -80]], 4, MID); seg(g, [[-90, -160], [-20, -90]], 4, MID); g.restore(); }
export function frameOnly(g, cx, cy, s) { g.save(); g.translate(cx, cy); g.scale(s, s); rr(g, -140, -180, 280, 360, 6); g.strokeStyle = INK; g.lineWidth = 30; g.stroke(); g.strokeStyle = DARKG; g.lineWidth = 20; g.stroke(); g.restore(); }
export function trunk(g, cx, cy, s, t, o = {}) { const op = clamp(o.open || 0); g.save(); g.translate(cx, cy); g.scale(s, s);
  box(g, -170, -120, 340, 120, STONE, 7, 10); seg(g, [[-170, -60], [170, -60]], 5, INK); for (const x of [-120, 120]) box(g, x - 14, -120, 28, 120, DARKG, 5, 3);
  if (o.falseBottom) { g.save(); g.setLineDash([12, 10]); seg(g, [[-160, -30], [160, -30]], 5, ACC); g.restore(); }
  if (op > 0 && o.painting) { g.save(); g.translate(0, -120 - 150 * op); mona(g, 0, 0, 0.55 * op, {}); g.restore(); }
  g.save(); g.translate(-170, -120); g.rotate(-op * 1.2); box(g, 0, -44, 340, 44, STONE, 7, 12); g.restore();
  if (o.glow) { g.save(); g.globalAlpha = 0.5 + 0.3 * Math.sin(t * 4); rr(g, -190, -180, 380, 200, 20); g.strokeStyle = ACC; g.lineWidth = 6; g.stroke(); g.restore(); }
  g.restore(); }
export function fingerprint(g, cx, cy, s, col = INK, k = 1) { g.save(); g.translate(cx, cy); g.scale(s, s); g.strokeStyle = col; g.lineWidth = 4; for (let i = 0; i < 8; i++) { const r = 10 + i * 9; const span = clamp(k * 8 - i); if (span <= 0) continue; g.beginPath(); g.ellipse(0, 0, r * 0.8, r, 0, Math.PI * (1.1 - 0.3 * (i % 2)), Math.PI * (1.1 - 0.3 * (i % 2)) + Math.PI * 1.7 * span); g.stroke(); } g.restore(); }
export function newspaper(g, cx, cy, s, head, o = {}) { g.save(); g.translate(cx, cy); g.rotate(o.rot || 0); g.scale(s, s); box(g, -230, -160, 460, 320, PAPER, 6, 4); text(g, o.mast || 'LE JOURNAL', 0, -125, { size: 34, color: INK, font: FONTS.serif, weight: 900, italic: true }); seg(g, [[-210, -100], [210, -100]], 4, INK);
  text(g, head, 0, -60, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); mona(g, -110, 50, 0.34, {}); for (let i = 0; i < 6; i++) seg(g, [[10, -10 + i * 26], [200, -10 + i * 26]], 5, MID); g.restore(); }
export function postcard(g, cx, cy, s, label, o = {}) { g.save(); g.translate(cx, cy); g.rotate(o.rot || 0); g.scale(s, s); box(g, -150, -100, 300, 200, PAPER, 6, 6); mona(g, -70, 0, 0.42, {}); text(g, label, 60, 0, { size: 28, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
export function cardDrawer(g, cx, cy, s, t, o = {}) { g.save(); g.translate(cx, cy); g.scale(s, s); for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { box(g, -300 + c * 100, -200 + r * 100, 92, 92, STONE, 5, 4); circle(g, -254 + c * 100, -150 + r * 100, 7, INK); } g.restore(); }
export function wrench(g, x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); seg(g, [[0, 0], [0, 110]], 14, INK); g.strokeStyle = INK; g.lineWidth = 14; g.beginPath(); g.arc(0, -10, 24, 0.6, Math.PI * 2 - 0.6 + Math.PI); g.stroke(); g.restore(); }
export function phoneCrowd(g, x0, x1, y, s, t, n = 7) { for (let i = 0; i < n; i++) { const x = lerp(x0, x1, i / (n - 1)) + Math.sin(i * 7) * 20; picto(g, { x, y: y + (i % 2) * 16, s, pose: POSES.phone, t: t + i, shadow: false, expr: 'happy', facing: x < (x0 + x1) / 2 ? 1 : -1 }); } }

// ---------------------------------------------------------------- sets
function wallPainting(g, x, y, w, h, seed) { box(g, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, DARKG, 6, 4); box(g, x - w / 2, y - h / 2, w, h, STONE, 4, 2); const r = rng(seed); for (let i = 0; i < 3; i++) { g.strokeStyle = MID; g.lineWidth = 4; g.beginPath(); g.moveTo(x - w / 2 + 10, y + (r() - 0.5) * h * 0.8); g.quadraticCurveTo(x, y + (r() - 0.5) * h, x + w / 2 - 10, y + (r() - 0.5) * h * 0.8); g.stroke(); } }
// gallery(o: {mona: true|false, easel, crowd, rope, cx})
export function gallery(g, t, cam, o = {}) { const gy = E.H * 0.82, cx = o.cx ?? 960;
  layer(g, cam, 0.35, (g) => { all(g, BG); g.fillStyle = CLAY; g.fillRect(-600, 60, 3200, gy - 60); seg(g, [[-600, 120], [2600, 120]], 6, INK); seg(g, [[-600, 150], [2600, 150]], 3, MID);
    wallPainting(g, cx - 640, 400, 300, 220, 3); wallPainting(g, cx + 640, 420, 260, 300, 5); wallPainting(g, cx - 1120, 380, 220, 260, 8); wallPainting(g, cx + 1120, 400, 300, 200, 9);
    if (o.mona === false) hooks(g, cx, 430, 1.0, { ghost: o.ghost !== false }); else mona(g, cx, 430, 0.95, { frame: true, glow: o.glow });
    text(g, 'SALON CARRÉ', cx, 92, { size: 26, color: INK, font: FONTS.ui, weight: 900 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = STONE; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); for (let i = -8; i <= 8; i++) seg(g, [[960 + i * 70, gy + 4], [960 + i * 240, gy + 400]], 3, MID);
    if (o.rope) { for (const x of [cx - 260, cx + 260]) { seg(g, [[x, gy], [x, gy - 110]], 8, INK); circle(g, x, gy - 116, 10, INK); } g.strokeStyle = ACC; g.lineWidth = 7; g.beginPath(); g.moveTo(cx - 260, gy - 105); g.quadraticCurveTo(cx, gy - 50, cx + 260, gy - 105); g.stroke(); }
    if (o.easel) { const ex = o.easel; seg(g, [[ex - 70, gy], [ex, gy - 330]], 8, INK); seg(g, [[ex + 70, gy], [ex, gy - 330]], 8, INK); seg(g, [[ex, gy - 330], [ex + 20, gy]], 6, INK); box(g, ex - 90, gy - 320, 180, 150, PAPER, 6, 2); seg(g, [[ex - 100, gy - 168], [ex + 100, gy - 168]], 8, INK); }
  });
  return { GY: gy }; }
export function stairwell(g, t, cam, o = {}) { const gy = E.H * 0.85;
  layer(g, cam, 0.4, (g) => { all(g, BG); g.fillStyle = CLAY; g.fillRect(-600, -200, 3200, 1600); const r = rng(2); for (let row = 0; row < 12; row++) for (let c = 0; c < 16; c++) { rr(g, c * 140 - (row % 2) * 70 - 100, row * 80 - 40, 132, 72, 4); g.strokeStyle = STONE; g.lineWidth = 3; g.stroke(); } });
  layer(g, cam, 0.85, (g) => { // steps descending from top-left to bottom-right
    for (let i = 0; i < 9; i++) { const x = -100 + i * 150, y = 260 + i * 70; g.fillStyle = STONE; g.fillRect(x, y, 170, gy - y); seg(g, [[x, y], [x + 150, y]], 7, INK); seg(g, [[x + 150, y], [x + 150, y + 70]], 7, INK); }
    seg(g, [[-100, 180], [1250, 760]], 8, INK);
    // door at bottom right
    const dx = 1500; box(g, dx - 120, gy - 420, 240, 420, PAPER, 9, 6); for (let i = 0; i < 2; i++) box(g, dx - 90, gy - 390 + i * 200, 180, 160, PAPER, 5, 4);
    const k = clamp(o.doorOpen || 0); if (k > 0) { g.save(); g.fillStyle = BG; g.fillRect(dx - 120, gy - 420, 240 * k, 420); g.restore(); }
    if (!o.noKnob) circle(g, dx + 85, gy - 210, 14, o.knobHot ? ACC : INK);
    if (o.locked) { rr(g, dx + 60, gy - 280, 50, 44, 8); g.fillStyle = ACC; g.fill(); g.strokeStyle = ACC; g.lineWidth = 8; g.beginPath(); g.arc(dx + 85, gy - 282, 16, Math.PI, 0); g.stroke(); }
    if (o.frame) { g.save(); g.translate(560, 560); g.rotate(-0.25); frameOnly(g, 0, 0, 0.55); g.restore(); g.save(); g.translate(780, 640); g.rotate(-0.2); glassBox(g, 0, 0, 0.45); g.restore(); }
    seg(g, [[-600, gy], [2600, gy]], 8, INK); });
  return { GY: gy }; }
export function paris(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.3, (g) => { all(g, BG); const x0 = 100, w = 1700, top = gy - 380; box(g, x0, top, w, 380, STONE, 7, 2); poly(g, [[x0 - 20, top], [x0 + 60, top - 90], [x0 + w - 60, top - 90], [x0 + w + 20, top]], DARKG); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(x0, top - 90, 0.01, 0.01);
    for (let i = 0; i < 16; i++) { rr(g, x0 + 40 + i * 104, top + 60, 56, 110, 26); g.fillStyle = INK; g.fill(); rr(g, x0 + 40 + i * 104, top + 220, 56, 110, 26); g.fill(); }
    if (o.sign !== false) text(g, 'MUSÉE DU LOUVRE', x0 + w / 2, top - 40, { size: 40, color: INK, font: FONTS.serif, weight: 900, italic: true }); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); for (const x of [260, 1660]) { seg(g, [[x, gy], [x, gy - 300]], 10, INK); rr(g, x - 26, gy - 350, 52, 60, 8); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } });
  return { GY: gy }; }
export function garret(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.35, (g) => { all(g, BG); g.fillStyle = CLAY; g.fillRect(-600, -200, 3200, gy + 200); poly(g, [[-600, -200], [700, -200], [-600, 420]], STONE); seg(g, [[700, -200], [-600, 420]], 7, INK);
    box(g, 1240, 220, 280, 300, '#bfb8aa', 8, 6); seg(g, [[1380, 220], [1380, 520]], 7, INK); seg(g, [[1240, 370], [1520, 370]], 7, INK); circle(g, 1450, 290, 30, PAPER); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = STONE; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK);
    box(g, 100, gy - 160, 520, 60, PAPER, 7, 8); seg(g, [[110, gy - 100], [110, gy]], 10, INK); seg(g, [[610, gy - 100], [610, gy]], 10, INK); box(g, 100, gy - 230, 120, 70, PAPER, 6, 20);
    box(g, 1180, gy - 220, 300, 26, DARKG, 6, 4); for (const x of [1200, 1460]) seg(g, [[x, gy - 194], [x, gy]], 9, INK); circle(g, 1260, gy - 236, 16, ACC);
    if (o.trunk !== false) trunk(g, o.trunkX ?? 860, gy, 1.0, t, { open: o.open, painting: o.painting, glow: o.glow, falseBottom: o.falseBottom }); });
  return { GY: gy }; }
export function records(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.35, (g) => { all(g, BG); g.fillStyle = CLAY; g.fillRect(-600, -200, 3200, gy + 200); for (let k = 0; k < 3; k++) cardDrawer(g, 360 + k * 620, 440, 0.85, t); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = STONE; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); });
  return { GY: gy }; }
export function hotel(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.35, (g) => { all(g, BG); g.fillStyle = CLAY; g.fillRect(-600, -200, 3200, gy + 200); box(g, 1260, 160, 380, 380, '#bfb8aa', 8, 6);
    // Florence skyline in the window: a dome + tower
    g.save(); rr(g, 1260, 160, 380, 380, 6); g.clip(); g.fillStyle = PAPER; g.beginPath(); g.arc(1430, 470, 90, Math.PI, 0); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); seg(g, [[1430, 380], [1430, 350]], 6, INK); rr(g, 1540, 330, 44, 210, 2); g.fillStyle = PAPER; g.fill(); g.stroke(); g.restore();
    seg(g, [[1450, 160], [1450, 540]], 7, INK); text(g, 'HOTEL', 520, 200, { size: 46, color: MID, font: FONTS.serif, weight: 900, italic: true }); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = STONE; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); box(g, 80, gy - 170, 520, 70, PAPER, 7, 8); for (const x of [90, 590]) seg(g, [[x, gy - 100], [x, gy]], 10, INK);
    if (o.trunk !== false) trunk(g, o.trunkX ?? 960, gy, 1.0, t, { open: o.open, painting: o.painting, glow: o.glow, falseBottom: o.falseBottom }); });
  return { GY: gy }; }
