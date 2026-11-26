// agincourt.js — Agincourt, 25 Oct 1415: sets & props.
// Sets: mudfield (side view: ploughed field, woods behind, rain, mud depth), battlemap (top-down field narrowing between two woods,
// English line + stakes, French blocks advancing), nfrance (map: Channel, Harfleur → Somme → Agincourt → Calais), harfleur (walled town
// under siege, tents), camp (night camp, tents, fires, rain).
// Props: knight, archer, stakes, volley, horse, rain, mud, pile (crush cross-section), cog (ship), tent, fire, quill, heart, crown2.
// Light palette; the noir theme remaps it to black / white / red.
import { E, layer, seg, circle, ring, rr, poly, text, FONTS, rng, ease, clamp, lerp } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { picto } from './picto.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#f4efe4', BG = '#f5f2ec', MID = '#9a9488', STONE = '#d8d0c0', CLAY = '#e6dfd0', MUD = '#8f897d';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const path = (g, P, close = true) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); };
const outline = (g, P, w = 6, c = INK, close = true) => { g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; path(g, P, close); g.stroke(); };
const shape = (g, P, fill, w = 6) => { poly(g, P, fill); outline(g, P, w); };

// ---------------------------------------------------------------- figures
export const KN_WALK = (t, speed = 0.7) => walkPose(t * Math.PI * 2 * speed, { stride: 18, lift: 6 });
// knight in plate: o {pose, sink 0..1 (sunk into mud), f, t, a, sword}
export function knight(g, x, y, s, t, o = {}) { const sink = clamp(o.sink || 0); g.save();
  if (sink > 0) { g.beginPath(); g.rect(x - 400 * s, y - 2000, 800 * s, 2000 - 0 + (1 - sink) * 0 + 1); g.clip(); }
  picto(g, { x, y: y + sink * 90 * s, s, pose: o.pose || POSES.stand, items: ['helm', 'plate'], prop: o.sword === false ? undefined : 'sword', facing: o.f ?? 1, t, shadow: false, expr: null, alpha: o.a, rot: o.rot });
  g.restore(); }
export function archer(g, x, y, s, t, o = {}) { picto(g, { x, y, s, pose: o.pose || POSES.point, items: ['kettle'], prop: 'prop' in o ? o.prop || undefined : 'bow', facing: o.f ?? 1, t, shadow: false, expr: o.e || 'determined', alpha: o.a }); }
export function king(g, x, y, s, t, o = {}) { picto(g, { x, y, s, pose: o.pose || POSES.stand, items: o.items || ['crown', 'plate'], facing: o.f ?? 1, t, shadow: false, expr: o.e || 'determined', alpha: o.a, prop: o.prop }); }
// stakes angled toward the enemy (f = 1 pointing right)
export function stakes(g, x0, x1, y, n, f = 1, k = 1) { for (let i = 0; i < n; i++) { const u = clamp(k * n - i); if (u <= 0) continue; const x = lerp(x0, x1, n === 1 ? 0.5 : i / (n - 1)) + (i % 2) * 14; seg(g, [[x, y], [x + f * 70 * u, y - 80 * u]], 10, INK); poly(g, [[x + f * 70 * u, y - 80 * u], [x + f * 58 * u, y - 82 * u], [x + f * 80 * u, y - 96 * u]], INK); } }
// arrow volley: arcs from (x0,y0) band to (x1,y1) band, k = 0..1 progress (repeats with t if loop)
export function volley(g, t, o = {}) { const n = o.n || 40, r = rng(o.seed || 7), dur = o.dur || 1.6;
  for (let i = 0; i < n; i++) { const off = r() * dur, sx = (o.x0 ?? 300) + (r() - 0.5) * (o.spread0 ?? 300), ex = (o.x1 ?? 1500) + (r() - 0.5) * (o.spread1 ?? 500), sy = o.y0 ?? 800, ey = (o.y1 ?? 820) + (r() - 0.5) * 80, h = o.h ?? 520;
    let u = (o.loop === false ? clamp((t - (o.at || 0) - off * 0.4) / dur) : (((t + off) % dur) / dur)); if (o.loop === false && (u <= 0 || u >= 1)) continue;
    const x = lerp(sx, ex, u), y = lerp(sy, ey, u) - Math.sin(u * Math.PI) * h, dx = ex - sx, dy = (ey - sy) - Math.cos(u * Math.PI) * Math.PI * h, a = Math.atan2(dy, dx);
    g.save(); g.translate(x, y); g.rotate(a); seg(g, [[-30, 0], [18, 0]], 4, INK); poly(g, [[18, -6], [30, 0], [18, 6]], INK); seg(g, [[-30, 0], [-38, -6]], 3, INK); seg(g, [[-30, 0], [-38, 6]], 3, INK); g.restore(); } }
// horse (side view), optional armoured rider, gallop, panic (rearing / no rider), f facing
export function horse(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.f || 1), s); const gal = t * (o.gallop === false ? 0 : 11), rear = o.rear ? 0.22 + Math.sin(t * 6) * 0.05 : 0;
  g.translate(0, -120); g.rotate(-rear); g.translate(0, 120);
  g.fillStyle = INK; g.beginPath(); g.ellipse(0, -150, 120, 50, 0, 0, Math.PI * 2); g.fill(); seg(g, [[90, -170], [140, -260]], 34, INK); g.beginPath(); g.ellipse(160, -262, 46, 24, 0.5, 0, Math.PI * 2); g.fill(); seg(g, [[-115, -160], [-170, -110 + Math.sin(gal) * 10]], 12, INK);
  circle(g, 168, -270, 5, '#ffffff');
  for (const [lx, ph] of [[-80, 0], [-40, 2], [60, 1], [100, 3]]) { const a = Math.sin(gal + ph) * 0.55; seg(g, [[lx, -120], [lx + Math.sin(a) * 50, -60], [lx + Math.sin(a) * 30, 0]], 12, INK); }
  if (o.caparison !== false) { poly(g, [[-110, -170], [100, -170], [110, -110], [-120, -110]], PAPER); outline(g, [[-110, -170], [100, -170], [110, -110], [-120, -110]], 5); seg(g, [[-100, -140], [96, -140]], 6, ACC); }
  if (o.rider) picto(g, { x: -10, y: -180, s: 0.8, pose: POSES.sit, items: ['helm', 'plate'], prop: 'sword', t, shadow: false, expr: null });
  if (o.arrow) { seg(g, [[-20, -190], [-60, -250]], 5, INK); poly(g, [[-60, -250], [-70, -244], [-64, -262]], INK); circle(g, -20, -188, 9, ACC); }
  g.restore(); }
export function rain(g, t, a = 1, o = {}) { const r = rng(o.seed || 3), n = o.n || 160; g.save(); g.globalAlpha *= a; for (let i = 0; i < n; i++) { const x = (r() * 2400 + t * 160) % 2400 - 200, y = (r() * 1300 + t * (900 + r() * 300)) % 1300 - 100; seg(g, [[x, y], [x - 10, y + 40]], 3, MID); } g.restore(); }
// mud band at ground y with depth px; bubbles & ripples
export function mud(g, y, depth, t, o = {}) { g.fillStyle = MUD; g.fillRect(-600, y - depth, 3200, depth + 600); seg(g, [[-600, y - depth], [2600, y - depth]], 6, INK);
  const r = rng(o.seed || 9); for (let i = 0; i < 26; i++) { const x = r() * 2000 - 40, yy = y - depth + 20 + r() * (depth + 80); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(x + Math.sin(t + i) * 4, yy, 30 + r() * 30, 6, 0, 0, Math.PI); g.stroke(); } }
// cross-section pile of fallen knights (n layers), with pressure arrows from the right
export function pile(g, x, y, s, t, o = {}) { const n = o.n ?? 4, k = clamp(o.k ?? 1); g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < n; i++) { const u = clamp(k * n - i); if (u <= 0) continue; g.save(); g.translate((i % 2 ? 40 : -30), -i * 70 - (1 - u) * 300); g.rotate(i % 2 ? -1.45 : 1.5); picto(g, { x: 0, y: 0, s: 0.9, pose: POSES.lie, items: ['helm', 'plate'], t, shadow: false, expr: null }); g.restore(); }
  if (o.push) for (let i = 0; i < 3; i++) { const yy = -60 - i * 90, dx = Math.sin(t * 5 + i) * 10; poly(g, [[560 + dx, yy - 26], [420 + dx, yy - 26], [420 + dx, yy - 50], [340 + dx, yy], [420 + dx, yy + 50], [420 + dx, yy + 26], [560 + dx, yy + 26]], ACC); }
  g.restore(); }
export function cog(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y + Math.sin(t * 2 + x) * 5); g.scale(s * (o.f || 1), s);
  shape(g, [[-160, -40], [160, -40], [120, 30], [-130, 30]], STONE, 7); rr(g, -150, -70, 50, 30, 4); g.fillStyle = STONE; g.fill(); g.stroke(); rr(g, 100, -70, 50, 30, 4); g.fill(); g.stroke();
  seg(g, [[0, -40], [0, -260]], 9, INK); shape(g, [[-90, -240], [90, -240], [100, -90], [-100, -90]], PAPER, 6); seg(g, [[0, -230], [0, -100]], 12, ACC); seg(g, [[-70, -165], [70, -165]], 12, ACC); g.restore(); }
export function tent(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); shape(g, [[-110, 0], [0, -150], [110, 0]], o.fill || PAPER, 7); seg(g, [[0, -150], [0, -190]], 6, INK); poly(g, [[0, -190], [40, -178], [0, -166]], o.flag || ACC); poly(g, [[-20, 0], [0, -60], [20, 0]], INK); g.restore(); }
export function fire(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[-40, 0], [40, -14]], 10, INK); seg(g, [[-40, -14], [40, 0]], 10, INK); const f = 1 + 0.15 * Math.sin(t * 13 + x); g.fillStyle = ACC; g.beginPath(); g.moveTo(-28, -8); g.quadraticCurveTo(-30, -60 * f, 0, -90 * f); g.quadraticCurveTo(30, -60 * f, 28, -8); g.closePath(); g.fill(); g.restore(); }
export function quill(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -150, -200, 300, 380, 10); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); const k = clamp(t / 3); for (let i = 0; i < 6; i++) { const u = clamp(k * 6 - i); if (u > 0) seg(g, [[-110, -150 + i * 52], [-110 + 220 * u * (i % 3 === 2 ? 0.6 : 1), -150 + i * 52]], 6, MID); }
  g.save(); g.translate(120, -60 + Math.sin(t * 6) * 8); g.rotate(0.6); poly(g, [[0, -170], [26, -60], [6, 30], [-6, 30], [-26, -60]], PAPER); outline(g, [[0, -170], [26, -60], [6, 30], [-6, 30], [-26, -60]], 5); seg(g, [[0, -150], [0, 40]], 4, INK); g.restore(); g.restore(); }
export function heart(g, x, y, s, c = ACC) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -40, -70, 0, -40); g.bezierCurveTo(40, -70, 60, -10, 0, 30); g.fill(); g.restore(); }
export function crown2(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const C = [[-70, 40], [-80, -40], [-40, 0], [0, -60], [40, 0], [80, -40], [70, 40]]; shape(g, C, o.fill || PAPER, 8); for (const [cx, cy] of [[-80, -40], [0, -60], [80, -40]]) circle(g, cx, cy - 8, 12, ACC); if (o.label) text(g, o.label, 0, 100, { size: 40, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }

// ---------------------------------------------------------------- side-view field
function wood(g, x0, x1, yb, r) { const rr_ = rng(r || 2); for (let i = 0; i < 9; i++) { const x = lerp(x0, x1, i / 8) + (rr_() - 0.5) * 40, h = 180 + rr_() * 120; seg(g, [[x, yb], [x, yb - h * 0.6]], 12, INK); circle(g, x, yb - h * 0.7, 60 + rr_() * 30, MID); g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.arc(x, yb - h * 0.7, 60 + rr_() * 30, 0, 7); g.stroke(); } }
export function mudfield(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.2, (g) => { all(g, BG); if (o.clouds !== false) for (let i = 0; i < 5; i++) { g.fillStyle = STONE; g.beginPath(); g.ellipse(200 + i * 420 + Math.sin(t * 0.1 + i) * 20, 140 + (i % 2) * 50, 200, 50, 0, 0, Math.PI * 2); g.fill(); } });
  layer(g, cam, 0.45, (g) => { if (o.woods !== false) { wood(g, -150, 420, gy - 120, 3); wood(g, 1500, 2100, gy - 120, 5); } seg(g, [[-400, gy - 120], [2400, gy - 120]], 6, INK); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy - 120, 3200, 900); for (let i = 0; i < 9; i++) { const yy = gy - 100 + i * 26 + i * i * 3; g.strokeStyle = MID; g.lineWidth = 4; g.beginPath(); for (let x = -600; x < 2600; x += 40) g.lineTo(x, yy + Math.sin(x * 0.02 + i) * 4); g.stroke(); }
    if (o.mud) mud(g, gy + 40, 60 * clamp(o.mud), t); seg(g, [[-600, gy], [2600, gy]], 7, INK); });
  if (o.rain) layer(g, cam, 1.0, (g) => rain(g, t, clamp(o.rain)));
  return { GY: gy }; }

// ---------------------------------------------------------------- top-down battle map
// o: {adv 0..1 French advance, squeeze 0..1, stakes 0..1, eng, volley(bool), cav 0..1 cavalry charge, back 0..1 horses fleeing, fallen 0..1, english forward 0..1}
export function battlemap(g, t, cam, o = {}) { all(g, CLAY); const L = (y) => lerp(560, 760, (y - 60) / 960), Rr = (y) => lerp(1360, 1160, (y - 60) / 960); // woods converge toward the English (bottom)
  const r = rng(4); for (let y = 0; y < 1100; y += 26) { seg(g, [[L(y) + 10, y], [Rr(y) - 10, y]], 2, STONE); }
  for (const side of [-1, 1]) for (let i = 0; i < 34; i++) { const y = -20 + i * 34, x = side < 0 ? L(y) - 50 - r() * 260 : Rr(y) + 50 + r() * 260; circle(g, x, y, 36 + r() * 18, MID); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 36 + r() * 18, 0, 7); g.stroke(); }
  outline(g, [[L(-50), -50], [L(1130), 1130]], 6, INK, false); outline(g, [[Rr(-50), -50], [Rr(1130), 1130]], 6, INK, false);
  text(g, 'AZINCOURT WOOD', 250, 540, { size: 30, color: INK, font: FONTS.ui, weight: 900 }); text(g, 'TRAMECOURT WOOD', 1680, 540, { size: 30, color: INK, font: FONTS.ui, weight: 900 });
  // English line (bottom) + stakes
  const ey = 900 - 120 * clamp(o.fwd || 0);
  for (let i = 0; i < 3; i++) { const cx = lerp(L(ey) + 60, Rr(ey) - 60, i / 2); rr(g, cx - 60, ey - 20, 120, 40, 8); g.fillStyle = INK; g.fill(); }
  for (const side of [0, 1]) { const x0 = side ? Rr(ey) - 190 : L(ey) + 20, x1 = side ? Rr(ey) - 20 : L(ey) + 190; rr(g, x0, ey - 30, x1 - x0, 50, 8); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); }
  if (o.stakes) { const k = clamp(o.stakes); for (let x = L(ey) + 10; x < Rr(ey) - 10; x += 22) { const u = clamp(k * 30 - (x - L(ey)) / 22); if (u > 0) seg(g, [[x, ey - 40], [x + 6 * u, ey - 40 - 26 * u]], 5, INK); } }
  text(g, 'ENGLISH', 960, ey + 70, { size: 34, color: INK, font: FONTS.ui, weight: 900 });
  // French: 3 blocks advancing & squeezing
  const adv = clamp(o.adv || 0), sq = clamp(o.squeeze ?? adv);
  for (let b = 0; b < 3; b++) { const y = lerp(140 + b * 120, 560 + b * 120, adv * (b === 0 ? 1 : 0.55)); const w = lerp(Rr(y) - L(y) - 60, (Rr(y) - L(y)) * 0.55, sq * (b === 0 ? 1 : 0.4)); const cx = 960;
    rr(g, cx - w / 2, y - 34, w, 68, 10); g.fillStyle = b === 0 ? ACC : MID; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
    if (b === 0 && o.fallen) { const fk = clamp(o.fallen); for (let i = 0; i < 18 * fk; i++) { const x = cx - w / 2 + 20 + ((i * 47) % (w - 40)), yy = y + 40 + (i % 3) * 16; seg(g, [[x - 14, yy], [x + 14, yy + 4]], 6, INK); } } }
  text(g, 'FRENCH', 960, 60, { size: 34, color: INK, font: FONTS.ui, weight: 900 });
  if (o.squeezeArrows) { const k = clamp(o.squeezeArrows); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const y = 420 + i * 110, x = 960 + sd * (420 - 60 * k); poly(g, [[x, y - 18], [x - sd * 70, y], [x, y + 18]], ACC); seg(g, [[x, y], [x + sd * 80, y]], 10, ACC); } }
  // cavalry on flanks: charge down (cav) then flee back (back)
  if (o.cav) { const c = clamp(o.cav), bk = clamp(o.back || 0); for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) { const y0 = 200, y1 = ey - 120, y = lerp(lerp(y0, y1, c), y0 + 60, bk) + i * 30, x = (sd < 0 ? L(y) + 70 : Rr(y) - 70) + (i % 2) * 24 * sd; g.save(); g.translate(x, y); g.rotate(bk > 0 ? Math.PI : 0); poly(g, [[-14, -22], [14, -22], [0, 22]], INK); g.restore(); } }
  if (o.volley) volley(g, t, { n: 30, x0: 960, spread0: 600, y0: ey - 40, x1: 960, spread1: 500, y1: lerp(180, 600, adv), h: 160, dur: 1.4 });
  return { GY: E.H * 0.85 }; }

// ---------------------------------------------------------------- map of northern France + Channel
const FR = [[-5, 48.7], [-1.6, 48.65], [-1.6, 49.65], [-1.25, 49.7], [-1.1, 49.4], [0.1, 49.3], [0.1, 49.49], [0.37, 49.76], [1.08, 49.93], [1.38, 50.06], [1.6, 50.2], [1.55, 50.45], [1.6, 50.73], [1.86, 50.95], [2.37, 51.04], [3.2, 51.35], [4.5, 51.8], [8, 51.8], [8, 46], [-5, 46]];
const EN = [[-6, 50], [-3, 50.6], [-1.4, 50.8], [0.3, 50.77], [1.0, 51.0], [1.42, 51.15], [1.42, 51.38], [0.9, 51.5], [1.8, 52.5], [1.7, 54], [-6, 54]];
export const NFP = { harfleur: [0.2, 49.51], calais: [1.86, 50.95], agincourt: [2.13, 50.46], blanchetaque: [1.78, 50.12], amiens: [2.3, 49.89], crossing: [2.95, 49.8], peronne: [2.93, 49.93], southampton: [-1.4, 50.9], paris: [2.35, 48.86], rouen: [1.1, 49.44] };
export function nfProj(o = {}) { const lon0 = o.lon0 ?? 1.2, lat0 = o.lat0 ?? 50.0, k = o.k ?? 300, cl = Math.cos((lat0 * Math.PI) / 180); return ([lon, lat]) => [960 + (lon - lon0) * k * cl, 540 - (lat - lat0) * k]; }
// nfrance(g, t, cam, {view, route 0..1 (Harfleur→detour→Agincourt), plan 0..1 (straight line Harfleur→Calais), pins:[[place,k,label,side,hot]], channel 0..1 (crossing)})
export function nfrance(g, t, cam, o = {}) { const pj = nfProj(o.view); all(g, BG); const land = (P, f) => { const Q = P.map(pj); poly(g, Q, f); outline(g, Q, 6); };
  land(FR, '#8f897d'); land(EN, CLAY);
  const river = (P, w = 7) => seg(g, P.map(pj), w, BG); river([[0.1, 49.47], [0.7, 49.42], [1.1, 49.44], [1.5, 49.15], [2.35, 48.86], [3, 48.8]]); river([[1.6, 50.2], [1.85, 50.1], [2.3, 49.89], [2.6, 49.87], [2.93, 49.93], [3.1, 49.8], [3.3, 49.85]]);
  if (o.sommeLabel) text(g, 'RIVER SOMME', ...pj([2.55, 49.72]), { size: 30, color: INK, font: FONTS.ui, weight: 900 });
  const arrow = (P, k, dashed) => { if (k <= 0) return; const Q = P.map(pj), segs = []; let L_ = 0; for (let i = 1; i < Q.length; i++) { const d = Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]); segs.push(d); L_ += d; } let rem = L_ * clamp(k); const out = [Q[0]];
    for (let i = 1; i < Q.length && rem > 0; i++) { const d = segs[i - 1], u = Math.min(1, rem / d); out.push([lerp(Q[i - 1][0], Q[i][0], u), lerp(Q[i - 1][1], Q[i][1], u)]); rem -= d; }
    g.save(); if (dashed) g.setLineDash([20, 14]); seg(g, out, 10, ACC); g.restore(); const [x2, y2] = out[out.length - 1], [x1, y1] = out[Math.max(0, out.length - 2)], a = Math.atan2(y2 - y1, x2 - x1); if (out.length > 1) poly(g, [[x2 + Math.cos(a) * 22, y2 + Math.sin(a) * 22], [x2 + Math.cos(a + 2.4) * 24, y2 + Math.sin(a + 2.4) * 24], [x2 + Math.cos(a - 2.4) * 24, y2 + Math.sin(a - 2.4) * 24]], ACC); };
  if (o.channel) arrow([NFP.southampton, [-0.3, 50.2], NFP.harfleur], o.channel);
  if (o.plan) arrow([NFP.harfleur, NFP.calais], o.plan, true);
  if (o.route) arrow([NFP.harfleur, [0.37, 49.72], [1.08, 49.88], [1.6, 50.05], NFP.blanchetaque, NFP.amiens, [2.6, 49.82], NFP.crossing, NFP.peronne, [2.4, 50.2], NFP.agincourt], o.route);
  if (o.block) { const [x, y] = pj(NFP.blanchetaque), k = ease.outBack(clamp(o.block)); g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-30, -30], [30, 30]], 12, INK); seg(g, [[30, -30], [-30, 30]], 12, INK); g.restore(); }
  for (const [pl, k0, label, side, hot] of o.pins || []) { const k = ease.outBack(clamp(k0)); if (k <= 0) continue; const [x, y] = pj(NFP[pl] || pl); circle(g, x, y, 15 * k, hot ? ACC : INK); ring(g, x, y, 23 * k, 5, hot ? ACC : INK);
    if (label) { const sz = 32; g.save(); g.font = `900 ${sz}px ${FONTS.ui}`; const w = g.measureText(label).width + 34; g.restore(); const bx = side === 'l' ? x - w - 34 : side === 'u' || side === 'd' ? x - w / 2 : x + 34, by = side === 'u' ? y - 74 : side === 'd' ? y + 34 : y - sz * 0.75;
      g.save(); g.globalAlpha = clamp(k0 * 2); rr(g, bx, by, w, sz * 1.5, sz * 0.75); g.fillStyle = hot ? ACC : INK; g.fill(); text(g, label, bx + w / 2, by + sz * 0.78, { size: sz, color: '#ffffff', font: FONTS.ui, weight: 900 }); g.restore(); } }
  return { GY: E.H * 0.85 }; }

// ---------------------------------------------------------------- Harfleur under siege
export function harfleur(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.2, (g) => { all(g, BG); circle(g, 1650, 180, 70, ACC); });
  layer(g, cam, 0.5, (g) => { shape(g, [[760, gy - 40], [760, gy - 300], [1820, gy - 300], [1820, gy - 40]], STONE, 7); for (let x = 760; x < 1820; x += 60) { rr(g, x, gy - 330, 34, 34, 2); g.fillStyle = STONE; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); }
    for (const x of [760, 1120, 1480, 1820]) { shape(g, [[x - 60, gy - 40], [x - 60, gy - 400], [x + 60, gy - 400], [x + 60, gy - 40]], STONE, 7); poly(g, [[x - 74, gy - 400], [x, gy - 480], [x + 74, gy - 400]], MID); outline(g, [[x - 74, gy - 400], [x, gy - 480], [x + 74, gy - 400]], 6); }
    rr(g, 1240, gy - 200, 120, 160, 60); g.fillStyle = INK; g.fill(); if (o.flag) { seg(g, [[1480, gy - 480], [1480, gy - 580]], 7, INK); { const F_ = [[1480, gy - 580], [1570, gy - 560], [1480, gy - 540]]; poly(g, F_, o.flag === 'white' ? PAPER : ACC); outline(g, F_, 5); } } });
  layer(g, cam, 0.85, (g) => { g.fillStyle = CLAY; g.fillRect(-600, gy - 40, 3200, 700); seg(g, [[-600, gy - 40], [2600, gy - 40]], 7, INK); if (o.tents !== false) for (const [x, s] of [[120, 0.9], [360, 1.0], [600, 0.85]]) tent(g, x, gy - 40, s); });
  if (o.heat) layer(g, cam, 1, (g) => { g.save(); g.globalAlpha = 0.25; for (let i = 0; i < 6; i++) { g.strokeStyle = MID; g.lineWidth = 4; g.beginPath(); for (let x = 0; x < 1920; x += 30) g.lineTo(x, 300 + i * 60 + Math.sin(x * 0.02 + t * 2 + i) * 10); g.stroke(); } g.restore(); });
  return { GY: gy - 40 }; }

// ---------------------------------------------------------------- night camp
export function camp(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.2, (g) => { all(g, '#bfb8aa'); const r = rng(6); if (!o.rain) for (let i = 0; i < 40; i++) circle(g, r() * 1920, r() * 400, 2 + r() * 2, BG); circle(g, 1700, 160, 50, BG); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = MUD; g.fillRect(-600, gy, 3200, 700); seg(g, [[-600, gy], [2600, gy]], 7, INK); for (const [x, s] of o.tents || [[300, 1], [700, 1.1], [1250, 0.95], [1650, 1.05]]) tent(g, x, gy, s); if (o.fires !== false) for (const x of o.fires || [500, 1450]) fire(g, x, gy, 1.1, t); });
  if (o.rain) layer(g, cam, 1.0, (g) => rain(g, t, 1));
  return { GY: gy }; }
