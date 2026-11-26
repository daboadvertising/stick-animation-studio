// synod.js — The Cadaver Synod (Rome, 897): sets & props.
// Sets: basilica (candlelit nave, columns, apse, throne), crypt (tomb vault), tiber (river + 9th-century Rome skyline),
// prison (stone cell, barred window), italy (map of Italy + Balkans with pins/arrows), stpeters (old St Peter's facade).
// Props: throne, corpse (dead pope seated, slumped), candle, tomb, shovel, hand (blessing hand, optional cut fingers),
// basilicaFront (with crack/collapse), crown, rings, popeChain (succession timeline), bishopRow, scrollDecree.
// Light palette; the noir theme remaps it to black / white / red.
import { E, layer, seg, circle, ring, rr, poly, alpha, text, FONTS, rng, ease, clamp, lerp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { picto } from './picto.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#f4efe4', BG = '#f5f2ec', MID = '#9a9488', STONE = '#d8d0c0', CLAY = '#e6dfd0', WATER = '#8f897d';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const path = (g, P, close = true) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); };
const outline = (g, P, w = 6, c = INK, close = true) => { g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; path(g, P, close); g.stroke(); };
const shape = (g, P, fill, w = 6) => { poly(g, P, fill); outline(g, P, w); };

// ---------------------------------------------------------------- poses
const BASE = POSES.sit;
export const SLUMP = { ...BASE, head: [22, -150], sh: [8, -140], eF: [22, -104], hF: [40, -80], eB: [14, -106], hB: [30, -82] };
export const SLUMP_R = { ...SLUMP, head: [30, -146], sh: [10, -138] };                     // head lolling further
export const RAGE = { ...POSES.point, head: [12, -206], sh: [6, -172], eF: [40, -186], hF: [78, -200], eB: [-20, -150], hB: [-40, -176] };
export const RAGE2 = { ...POSES.point, head: [14, -204], sh: [8, -170], eF: [44, -150], hF: [80, -150], eB: [-22, -190], hB: [-30, -232] };
export const BLESS = { ...POSES.stand, eF: [24, -170], hF: [34, -214] };
export const BOW = { ...POSES.sad, head: [26, -178], sh: [14, -160] };

// ---------------------------------------------------------------- small props
export function candle(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -10, -70, 20, 70, 4); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); seg(g, [[-22, 0], [22, 0]], 8, INK);
  if (o.lit !== false) { const f = 1 + 0.12 * Math.sin(t * 13 + x) + 0.06 * Math.sin(t * 29 + x * 0.3); g.fillStyle = ACC; g.beginPath(); g.ellipse(0, -86 * 1, 8 * f, 16 * f, Math.sin(t * 7 + x) * 0.08, 0, Math.PI * 2); g.fill(); }
  g.restore(); }
export function candelabrum(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [0, -180]], 8, INK); seg(g, [[-40, 0], [40, 0]], 8, INK); seg(g, [[-60, -180], [60, -180]], 8, INK);
  for (const dx of [-60, 0, 60]) candle(g, dx, -180, 0.7, t); g.restore(); }
export function throne(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  const back = [[-90, 0], [-90, -330], [-60, -380], [0, -400], [60, -380], [90, -330], [90, 0]]; shape(g, back, STONE, 8);
  rr(g, -60, -310, 120, 200, 14); g.fillStyle = o.cloth || '#8f897d'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  rr(g, -110, -120, 220, 40, 8); g.fillStyle = PAPER; g.fill(); g.lineWidth = 7; g.stroke();
  for (const sx of [-1, 1]) { rr(g, sx * 110 - 18, -190, 36, 190, 8); g.fillStyle = STONE; g.fill(); g.stroke(); circle(g, sx * 110, -196, 20, INK); }
  seg(g, [[-130, 0], [130, 0]], 10, INK); g.restore(); }
// the dead pope, FRONT-facing, slumped on the throne seat. x = centre, y = seat top. o: {stripped, fingers (0..1 cut), nod, tilt}
export function corpse(g, x, y, s, t, o = {}) { const sway = Math.sin(t * 0.7) * 0.015 + (o.nod ? Math.sin(t * 1.6) * 0.03 : 0), tilt = (o.tilt ?? 0.32) + sway;
  g.save(); g.translate(x, y); g.scale(s, s); const W_ = '#ffffff';
  const robe = (P) => { poly(g, P, o.stripped ? INK : PAPER); outline(g, P, 7); };
  // legs under the robe, hanging to the floor
  if (o.stripped) { seg(g, [[-26, 0], [-30, 120]], 22, INK); seg(g, [[26, 0], [30, 120]], 22, INK); } else robe([[-70, -6], [70, -6], [84, 124], [-84, 124]]);
  // torso
  if (o.stripped) seg(g, [[0, -160], [0, -10]], 40, INK); else { robe([[-50, -170], [50, -170], [70, 0], [-70, 0]]); seg(g, [[-40, -164], [0, -110], [40, -164]], 11, ACC); seg(g, [[0, -110], [0, -6]], 11, ACC); seg(g, [[0, -6], [0, 110]], 11, ACC); }
  // arms limp on the armrests
  seg(g, [[-46, -160], [-92, -90], [-104, -40]], 18, INK); seg(g, [[46, -160], [92, -90], [104, -40]], 18, INK);
  const cut = clamp(o.fingers || 0); circle(g, -104, -34, 15, INK); circle(g, 104, -34, 15, INK);
  if (cut < 1) for (let i = 0; i < 3; i++) seg(g, [[-104 - 8 + i * 8, -24], [-106 - 8 + i * 8, -2]], 6, alpha(INK, 1 - cut));
  if (cut > 0) { g.save(); g.globalAlpha = cut; seg(g, [[-122, -18], [-86, -18]], 8, ACC); g.restore(); }
  for (let i = 0; i < 3; i++) seg(g, [[104 - 8 + i * 8, -24], [106 - 8 + i * 8, -2]], 6, INK);
  // neck + tilted head
  g.save(); g.translate(0, -168); g.rotate(tilt); seg(g, [[0, 0], [0, -26]], 22, INK); circle(g, 0, -58, 34, INK);
  for (const ex of [-12, 12]) seg(g, [[ex - 7, -60], [ex + 7, -58]], 4.5, W_); seg(g, [[-9, -38], [9, -39]], 4, W_);
  if (!o.stripped) { g.save(); g.translate(0, -84); g.rotate(0.12); const M_ = [[-28, 6], [-26, -46], [0, -72], [26, -46], [28, 6]]; poly(g, M_, PAPER); outline(g, M_, 6); seg(g, [[0, -66], [0, 2]], 7, ACC); seg(g, [[-27, -4], [27, -4]], 7, ACC); g.restore(); }
  g.restore(); g.restore(); }
export function tomb(g, x, y, s, t, o = {}) { const open = clamp(o.open || 0); g.save(); g.translate(x, y); g.scale(s, s);
  const B = [[-260, 0], [-260, -150], [260, -150], [260, 0]]; shape(g, B, STONE, 8); for (let i = -2; i <= 2; i++) rr(g, i * 100 - 36, -120, 72, 90, 6), (g.strokeStyle = INK), (g.lineWidth = 4), g.stroke();
  text(g, o.label || '', 0, -75, { size: 34, color: INK, font: FONTS.serif, weight: 900, italic: true });
  g.save(); g.translate(open * 300, -150 - open * 40); g.rotate(open * 0.18); const L = [[-280, 0], [-280, -40], [280, -40], [280, 0]]; shape(g, L, PAPER, 8); seg(g, [[-30, -20], [30, -20]], 6, INK); seg(g, [[0, -34], [0, -6]], 6, INK); g.restore();
  if (open > 0.3) { g.save(); g.globalAlpha = (open - 0.3) / 0.7; rr(g, -240, -146, 480, 24, 4); g.fillStyle = INK; g.fill(); g.restore(); }
  g.restore(); }
export function shovel(g, x, y, s, rot = -0.5) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); seg(g, [[0, -220], [0, 40]], 10, INK); seg(g, [[-24, -220], [24, -220]], 10, INK);
  shape(g, [[-36, 40], [36, 40], [30, 110], [0, 132], [-30, 110]], MID, 6); g.restore(); }
// right hand raised in blessing: thumb + index + middle up. o.cut 0..1 removes those three fingers
export function hand(g, x, y, s, o = {}) { const cut = clamp(o.cut || 0); g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -70, -40, 140, 150, 40); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  const finger = (fx, fy, len, ang, up) => { g.save(); g.translate(fx, fy); g.rotate(ang); rr(g, -17, -len, 34, len + 10, 17); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); g.restore(); };
  // ring & little finger folded
  finger(32, -20, 46, 0.5); finger(58, -6, 36, 0.9);
  const three = [[-36, -30, 120, -0.05], [-2, -36, 130, 0.02], [-72, 30, 90, -0.9]];
  three.forEach(([fx, fy, len, a]) => { if (cut < 1) { g.save(); g.globalAlpha = 1 - cut; g.translate(0, -cut * 40); finger(fx, fy, len, a); g.restore(); } });
  if (cut > 0) { g.save(); g.globalAlpha = cut * 0.6; g.setLineDash([12, 10]); for (const [fx, fy, len, a] of three) { g.save(); g.translate(fx, fy); g.rotate(a); rr(g, -17, -len, 34, len + 10, 17); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); } g.restore(); }
  if (cut > 0) { g.save(); g.globalAlpha = Math.min(1, cut * 2); for (const [fx, fy, , a] of three) { g.save(); g.translate(fx, fy); g.rotate(a); seg(g, [[-22, 0], [22, 0]], 10, ACC); g.restore(); } g.restore(); }
  g.restore(); }
export function crown(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const C = [[-70, 40], [-80, -40], [-40, 0], [0, -60], [40, 0], [80, -40], [70, 40]]; shape(g, C, o.fill || '#ffffff', 8);
  for (const [cx, cy] of [[-80, -40], [0, -60], [80, -40]]) circle(g, cx, cy - 8, 12, ACC);
  if (o.crack) { g.save(); g.globalAlpha = clamp(o.crack); seg(g, [[6, -50], [-10, -10], [14, 10], [-4, 40]], 9, ACC); g.restore(); } g.restore(); }
export function rings(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); ring(g, -40, 0, 60, 14, INK); ring(g, 40, 0, 60, 14, ACC); g.restore(); }
export function church(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); shape(g, [[-90, 0], [-90, -110], [0, -190], [90, -110], [90, 0]], o.fill || PAPER, 8);
  rr(g, -22, -70, 44, 70, 20); g.fillStyle = INK; g.fill(); seg(g, [[0, -190], [0, -250]], 8, INK); seg(g, [[-22, -228], [22, -228]], 8, INK);
  if (o.label) text(g, o.label, 0, 50, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
export function scrollDecree(g, x, y, s, t, o = {}) { const k = clamp(o.unroll ?? 1); g.save(); g.translate(x, y); g.scale(s, s); const h = 360 * k;
  rr(g, -200, -h / 2, 400, h, 10); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  for (let i = 0; i < 6; i++) { const yy = -h / 2 + 50 + i * 46; if (yy < h / 2 - 40) seg(g, [[-150, yy], [150 - (i % 3) * 40, yy]], 6, MID); }
  for (const sy of [-h / 2, h / 2]) { rr(g, -220, sy - 18, 440, 36, 18); g.fillStyle = STONE; g.fill(); g.stroke(); }
  if (o.seal) circle(g, 120, h / 2 - 70, 36 * clamp(o.seal), ACC); g.restore(); }

// ---------------------------------------------------------------- basilica interior
function arch(g, x, top, w, h) { g.beginPath(); g.moveTo(x - w / 2, top + h); g.lineTo(x - w / 2, top + w / 2); g.arc(x, top + w / 2, w / 2, Math.PI, 0); g.lineTo(x + w / 2, top + h); }
function column(g, x, top, bottom, w = 46) { rr(g, x - w / 2, top, w, bottom - top, 6); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  rr(g, x - w / 2 - 12, top - 20, w + 24, 22, 4); g.fill(); g.stroke(); rr(g, x - w / 2 - 12, bottom - 4, w + 24, 22, 4); g.fill(); g.stroke(); }
export function basilica(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.25, (g) => { all(g, BG);
    // apse: big arch at the back with a dim mosaic glow
    g.fillStyle = STONE; arch(g, 960, 120, 760, 760); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; arch(g, 960, 120, 760, 760); g.stroke();
    g.strokeStyle = MID; g.lineWidth = 5; arch(g, 960, 170, 640, 700); g.stroke();
    if (o.cross !== false) { seg(g, [[960, 210], [960, 330]], 10, INK); seg(g, [[920, 250], [1000, 250]], 10, INK); }
    if (o.crack) { const k = clamp(o.crack); g.save(); g.globalAlpha = k; seg(g, [[700, 120], [760, 260], [720, 380], [800, 520]].slice(0, 2 + Math.round(k * 2)), 9, ACC); seg(g, [[1260, 150], [1200, 300], [1250, 420]], 9, ACC); g.restore(); }
  });
  layer(g, cam, 0.55, (g) => { for (const x of [180, 420, 1500, 1740]) column(g, x, 170, gy - 20, 52); seg(g, [[60, 150], [700, 150]], 10, INK); seg(g, [[1220, 150], [1860, 150]], 10, INK);
    for (const [a, b] of [[180, 420], [1500, 1740]]) { g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.arc((a + b) / 2, 170, (b - a) / 2, Math.PI, 0); g.stroke(); }
    if (o.candles !== false) for (const x of [300, 600, 1320, 1620]) candelabrum(g, x, gy - 10, 1.0, t);
  });
  layer(g, cam, 0.9, (g) => { const r = rng(5); g.fillStyle = CLAY; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK);
    for (let i = -8; i <= 8; i++) seg(g, [[960 + i * 60, gy + 6], [960 + i * 260, gy + 400]], 3, MID);
    if (o.throne) throne(g, o.throneX ?? 960, gy - 8, o.throneS ?? 1.0, {});
    if (o.corpse) corpse(g, o.throneX ?? 960, gy - 128 * (o.throneS ?? 1), 1.0 * (o.throneS ?? 1), t, { stripped: o.stripped, nod: o.nod, fingers: o.fingers });
    if (o.bishops) bishopRow(g, gy, t, o.bishops);
  });
  return { GY: gy }; }
// rows of seated / standing bishops along both sides (o: {n, look, a})
export function bishopRow(g, gy, t, o = {}) { const n = o.n || 3, xs = [...Array(n)].map((_, i) => 140 + i * 150).concat([...Array(n)].map((_, i) => 1780 - i * 150));
  xs.forEach((x, i) => picto(g, { x, y: gy + 30, s: 1.05, pose: o.pose ? POSES[o.pose] || o.pose : POSES.stand, items: ['vestment', 'mitre'], facing: x < 960 ? 1 : -1, t: t + i, shadow: false, expr: o.expr || 'neutral', alpha: o.a ?? 1, look: o.down ? [0.3, 0.9] : undefined })); }

// ---------------------------------------------------------------- crypt (tomb vault)
export function crypt(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.3, (g) => { all(g, BG); const r = rng(3); for (let row = 0; row < 9; row++) for (let c = 0; c < 14; c++) { const x = c * 160 - (row % 2) * 80 - 100, y = row * 100 - 40; rr(g, x, y, 150, 90, 6); g.fillStyle = r() < 0.5 ? STONE : CLAY; g.fill(); g.strokeStyle = MID; g.lineWidth = 3; g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-400, -400, 3000, 1800); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK);
    if (o.tomb !== false) tomb(g, o.tombX ?? 960, gy, 1.2, t, { open: o.open || 0, label: o.label ?? 'FORMOSVS' });
    for (const x of [360, 1560]) candle(g, x, gy, 1.4, t); });
  return { GY: gy }; }

// ---------------------------------------------------------------- the Tiber & Rome skyline (9th century: round mausoleum, basilica roofs, ruined amphitheatre)
export function tiber(g, t, cam, o = {}) { const gy = E.H * 0.6;
  layer(g, cam, 0.25, (g) => { all(g, BG);
    // skyline
    g.save(); g.translate(960 - 960 * 1.25, gy - 10); g.scale(1.25, 1.25);
    shape(g, [[160, 0], [160, -150], [260, -150], [260, -190], [380, -190], [380, -150], [480, -150], [480, 0]], STONE, 6);                  // round mausoleum (Hadrian's)
    shape(g, [[620, 0], [620, -120], [780, -220], [940, -120], [940, 0]], PAPER, 6); seg(g, [[780, -220], [780, -270]], 6, INK); seg(g, [[760, -252], [800, -252]], 6, INK);   // basilica
    shape(g, [[1080, 0], [1080, -160], [1500, -160], [1500, -60], [1440, -60], [1440, 0]], STONE, 6); for (let i = 0; i < 6; i++) { g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.arc(1120 + i * 62, -100, 20, Math.PI, 0); g.stroke(); }   // amphitheatre ruin
    shape(g, [[1600, 0], [1600, -90], [1700, -150], [1800, -90], [1800, 0]], PAPER, 6);
    g.restore(); });
  layer(g, cam, 0.6, (g) => { g.fillStyle = WATER; g.fillRect(-600, gy, 3200, 260); seg(g, [[-600, gy], [2600, gy]], 6, INK);
    for (let i = 0; i < 12; i++) { const x = ((i * 230 + t * 70) % 2400) - 200, y = gy + 40 + (i % 4) * 50; seg(g, [[x, y], [x + 90, y]], 5, PAPER); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy + 260, 3200, 600); seg(g, [[-600, gy + 260], [2600, gy + 260]], 8, INK);
    if (o.body) { const bx = o.bodyX ?? 960, by = gy + 120 + Math.sin(t * 1.4) * 6; g.save(); g.translate(bx, by); g.rotate(Math.PI / 2 * 0.98); picto(g, { x: 0, y: 0, s: 1.5, pose: POSES.lie, items: [], t, shadow: false, expr: null }); g.restore(); }
  });
  return { GY: gy + 260 + 6 }; }

// ---------------------------------------------------------------- prison cell
export function prison(g, t, cam, o = {}) { const gy = E.H * 0.82;
  layer(g, cam, 0.3, (g) => { all(g, BG); const r = rng(8); for (let row = 0; row < 10; row++) for (let c = 0; c < 14; c++) { rr(g, c * 160 - (row % 2) * 80 - 100, row * 96 - 40, 150, 86, 6); g.fillStyle = r() < 0.5 ? STONE : CLAY; g.fill(); g.strokeStyle = MID; g.lineWidth = 3; g.stroke(); }
    rr(g, 1240, 160, 300, 260, 10); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); for (let i = 1; i < 5; i++) seg(g, [[1240 + i * 60, 160], [1240 + i * 60, 420]], 12, INK); seg(g, [[1240, 290], [1540, 290]], 10, INK);
    g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(-400, -400, 3000, 1800); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); for (let i = 0; i < 4; i++) seg(g, [[300 + i * 30, gy - 120], [300 + i * 30, gy]], 6, MID); });
  if (o.bars) layer(g, cam, 1.1, (g) => { for (let i = 0; i < 9; i++) seg(g, [[120 + i * 220, -100], [120 + i * 220, E.H + 100]], 26, INK); seg(g, [[-100, 120], [2100, 120]], 22, INK); seg(g, [[-100, E.H - 120], [2100, E.H - 120]], 22, INK); });
  return { GY: gy }; }

// ---------------------------------------------------------------- old St Peter's (basilica facade with atrium) & generic facade with crack / collapse
export function basilicaFront(g, x, y, s, t, o = {}) { const col = clamp(o.collapse || 0); g.save(); g.translate(x, y); g.scale(s, s);
  const body = [[-260, 0], [-260, -260], [0, -420], [260, -260], [260, 0]];
  if (col > 0) { g.save(); g.translate(col * 30, col * 60); g.rotate(col * 0.06); }
  shape(g, body, PAPER, 9); for (let i = -2; i <= 2; i++) { rr(g, i * 90 - 24, -200, 48, 110, 24); g.fillStyle = INK; g.fill(); }
  rr(g, -40, -90, 80, 90, 40); g.fillStyle = INK; g.fill(); circle(g, 0, -310, 36, STONE); ring(g, 0, -310, 36, 6, INK);
  if (o.crack) { g.save(); g.globalAlpha = clamp(o.crack); seg(g, [[-60, -380], [-20, -300], [-70, -220], [-30, -120]], 10, ACC); seg(g, [[150, -300], [110, -200], [160, -120]], 10, ACC); g.restore(); }
  if (col > 0) { g.restore(); const r = rng(11); for (let i = 0; i < 14; i++) { const bx = -240 + r() * 480, fall = col * (200 + r() * 200); rr(g, bx, -300 + fall * 1.3, 40 + r() * 40, 30, 4); g.fillStyle = STONE; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); } }
  if (o.label) text(g, o.label, 0, 60, { size: 44, color: INK, font: FONTS.ui, weight: 900 });
  g.restore(); }
export function stpeters(g, t, cam, o = {}) { const gy = E.H * 0.84;
  layer(g, cam, 0.3, (g) => { all(g, BG); });
  layer(g, cam, 0.7, (g) => { shape(g, [[260, gy], [260, gy - 300], [1660, gy - 300], [1660, gy]], STONE, 8); for (let i = 0; i < 12; i++) column(g, 330 + i * 115, gy - 280, gy - 10, 34);
    basilicaFront(g, 960, gy - 300, 1.1, t, {}); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy, 3200, 600); seg(g, [[-600, gy], [2600, gy]], 8, INK); });
  return { GY: gy }; }

// ---------------------------------------------------------------- map: Italy + Balkans
const ITALY = [[7.6, 43.8], [8.9, 44.4], [9.8, 44.1], [10.3, 43.5], [10.5, 42.95], [11.2, 42.45], [11.8, 42.1], [12.3, 41.75], [12.6, 41.45], [13.55, 41.2], [14.25, 40.85], [14.75, 40.65], [15.3, 40.0], [15.9, 38.7], [15.65, 38.1], [16.05, 37.93], [16.6, 38.8], [17.15, 39.1], [16.5, 39.75], [17.2, 40.45], [17.95, 40.05], [18.35, 39.8], [18.5, 40.15], [17.95, 40.65], [16.85, 41.12], [15.9, 41.6], [16.2, 41.9], [15.0, 42.0], [14.2, 42.47], [13.5, 43.6], [12.57, 44.06], [12.3, 44.45], [12.5, 44.95], [12.35, 45.45], [13.75, 45.65], [13.7, 46.5], [12.0, 47.0], [10.5, 46.8], [9.0, 46.5], [7.0, 45.9], [6.9, 45.0]];
const SICILY = [[12.4, 37.8], [13.3, 38.2], [14.5, 38.05], [15.6, 38.27], [15.1, 37.3], [15.1, 36.68], [14.4, 36.8], [12.5, 37.6]];
const SARDINIA = [[8.2, 41.0], [9.5, 41.2], [9.8, 40.5], [9.6, 39.1], [8.9, 38.9], [8.4, 39.1], [8.4, 40.3]];
const CORSICA = [[9.4, 43.0], [9.55, 42.6], [9.4, 41.4], [8.8, 41.6], [8.6, 42.3], [9.0, 42.9]];
const CONT = [[-30, 36], [-6, 36], [-6, 40], [0.9, 41.0], [3.2, 42.3], [3.1, 43.1], [4.8, 43.4], [6.0, 43.1], [7.6, 43.8], [6.9, 45.0], [7.0, 45.9], [9.0, 46.5], [10.5, 46.8], [12.0, 47.0], [13.7, 46.5], [13.75, 45.65], [14.4, 45.3], [15.2, 44.1], [16.4, 43.5], [18.1, 42.65], [19.45, 41.3], [19.5, 40.45], [19.9, 39.6], [21.1, 38.3], [21.7, 36.8], [22.5, 36.4], [23.2, 37.4], [24.0, 38.0], [23.0, 40.2], [24.4, 40.9], [26.0, 40.8], [29.0, 41.0], [28.0, 41.9], [27.9, 43.2], [28.6, 44.3], [29.6, 45.2], [31, 46.5], [40, 46.5], [40, 60], [-30, 60]];
export const PLACES = { rome: [12.48, 41.9], porto: [12.26, 41.78], spoleto: [12.74, 42.73], anagni: [13.16, 41.74], pliska: [27.1, 43.38], regensburg: [12.1, 49.0], alps: [11.0, 46.9] };
export function mapProj(o = {}) { const lon0 = o.lon0 ?? 12.5, lat0 = o.lat0 ?? 42.5, k = o.k ?? 110, cx = o.cx ?? 960, cy = o.cy ?? 540, cl = Math.cos((lat0 * Math.PI) / 180);
  return ([lon, lat]) => [cx + (lon - lon0) * k * cl, cy - (lat - lat0) * k]; }
// italyMap(g, t, {view, italy:0..1 highlight, pins:[[place, k, label, side]], arrows:[[from,to,k]], alps})
export function italyMap(g, t, o = {}) { const pj = mapProj(o.view || {}); all(g, BG);
  const land = (P, fill, w = 5) => { const Q = P.map(pj); poly(g, Q, fill); outline(g, Q, w); };
  land(CONT, o.cont || CLAY, 5); land(CORSICA, CLAY); land(SARDINIA, CLAY); land(SICILY, o.italy ? '#8f897d' : CLAY); land(ITALY, o.italy ? '#8f897d' : CLAY, 7);
  if (o.alps) { g.save(); g.globalAlpha = clamp(o.alps); for (let i = 0; i < 9; i++) { const [x, y] = pj([7.2 + i * 0.75, 46.0 + Math.sin(i) * 0.3]); poly(g, [[x - 26, y + 16], [x, y - 26], [x + 26, y + 16]], MID); outline(g, [[x - 26, y + 16], [x, y - 26], [x + 26, y + 16]], 4, INK, false); } g.restore(); }
  for (const [a, b, k0, dashed] of o.arrows || []) { const k = clamp(k0); if (k <= 0) continue; const A = pj(PLACES[a] || a), B = pj(PLACES[b] || b), m = [(A[0] + B[0]) / 2 + (B[1] - A[1]) * 0.15, (A[1] + B[1]) / 2 - (B[0] - A[0]) * 0.15];
    const P = []; for (let i = 0; i <= 30 * k; i++) { const u = i / 30; P.push([(1 - u) * (1 - u) * A[0] + 2 * u * (1 - u) * m[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * u * (1 - u) * m[1] + u * u * B[1]]); }
    g.save(); if (dashed) g.setLineDash([18, 14]); seg(g, P, 10, ACC); g.restore();
    if (k >= 1 && P.length > 2) { const [x2, y2] = P[P.length - 1], [x1, y1] = P[P.length - 3], a2 = Math.atan2(y2 - y1, x2 - x1); poly(g, [[x2 + Math.cos(a2) * 24, y2 + Math.sin(a2) * 24], [x2 + Math.cos(a2 + 2.4) * 26, y2 + Math.sin(a2 + 2.4) * 26], [x2 + Math.cos(a2 - 2.4) * 26, y2 + Math.sin(a2 - 2.4) * 26]], ACC); } }
  for (const [pl, k0, label, side, hot] of o.pins || []) { const k = ease.outBack(clamp(k0)); if (k <= 0) continue; const [x, y] = pj(PLACES[pl] || pl);
    circle(g, x, y, 16 * k, hot ? ACC : INK); ring(g, x, y, 24 * k, 5, hot ? ACC : INK);
    if (label) { const sz = 34; g.save(); g.font = `900 ${sz}px ${FONTS.ui}`; const w = g.measureText(label).width + 36; g.restore(); const dx = side === 'l' ? -w - 34 : 34, dy = side === 'u' ? -60 : side === 'd' ? 40 : -sz * 0.7;
      g.save(); g.globalAlpha = clamp(k0 * 2); rr(g, x + (side === 'u' || side === 'd' ? -w / 2 : dx), y + dy, w, sz * 1.5, sz * 0.75); g.fillStyle = hot ? ACC : INK; g.fill(); text(g, label, x + (side === 'u' || side === 'd' ? 0 : dx + w / 2), y + dy + sz * 0.78, { size: sz, color: '#ffffff', font: FONTS.ui, weight: 900 }); g.restore(); } }
  return {}; }
export function italy(g, t, cam, o = {}) { italyMap(g, t, { italy: true, ...o }); return { GY: E.H * 0.85 }; }

// ---------------------------------------------------------------- pope succession chain
// popeChain(g, t, names:[[name, sub, k, hot]], y)
export function popeChain(g, t, items, y = 540, o = {}) { const n = items.length, gap = o.gap || Math.min(360, 1600 / Math.max(1, n - 1)), x0 = 960 - (gap * (n - 1)) / 2;
  for (let i = 0; i < n - 1; i++) { const k = clamp(items[i + 1][2]); if (k > 0) seg(g, [[x0 + i * gap + 60, y], [x0 + i * gap + 60 + (gap - 120) * k, y]], 8, INK); }
  items.forEach(([nm, sub, k0, hot, cross], i) => { const k = ease.outBack(clamp(k0)); if (k <= 0) return; const x = x0 + i * gap; g.save(); g.translate(x, y); g.scale(k, k);
    circle(g, 0, 0, 58, hot ? ACC : PAPER); ring(g, 0, 0, 58, 7, INK); picto(g, { x: 0, y: 44, s: 0.42, pose: POSES.stand, items: ['mitre'], t, shadow: false, expr: 'neutral' });
    text(g, nm, 0, 104, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); if (sub) text(g, sub, 0, 146, { size: 32, color: INK, font: FONTS.ui, weight: 800 });
    if (cross) { seg(g, [[-50, -50], [50, 50]], 10, ACC); seg(g, [[50, -50], [-50, 50]], 10, ACC); } g.restore(); }); }
