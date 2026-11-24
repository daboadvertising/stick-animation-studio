// modern.js — clean & bright everyday sets for "5 Signs You Have Quiet Confidence" (16:9).
// Each set returns { GY, fg? } — fg draws foreground furniture (tables) in front of the figures.
import { E, layer, seg, circle, ring, rr, poly, alpha, shade, text, FONTS, rng, linGrad, ease, prog, clamp, lerp } from '/engine/core.js';
export const M = { wall: '#efebe3', wall2: '#e8e2d6', floor: '#e1dacd', line: '#d3ccbe', shape: '#dbd4c7', shape2: '#c9c1b2', white: '#ffffff', wood: '#b98a5e', wood2: '#9a6e46', acc: '#f07a1a', ink: '#141414', warm: '#ffd9a0', sky: '#cfe2ee', teal: '#9fc3d3', sofa: '#8fa7b3' };
const GYm = () => E.H * 0.8;
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const floor = (g, gy, c = M.floor) => { g.fillStyle = c; g.fillRect(-E.W * 2, gy, E.W * 6, E.H * 2); seg(g, [[-E.W * 2, gy], [E.W * 6, gy]], 4, M.line); };
const glowC = (g, x, y, r, c, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, alpha(c, a)); gr.addColorStop(1, alpha(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
function frame(g, x, y, w, h, c) { rr(g, x, y, w, h, 6); g.fillStyle = M.white; g.fill(); g.strokeStyle = M.shape2; g.lineWidth = 8; g.stroke(); g.fillStyle = c; g.fillRect(x + 16, y + 16, w - 32, h - 32); }
function plant(g, x, gy, s = 1) { g.save(); g.translate(x, gy); g.scale(s, s); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; g.fillStyle = i % 2 ? '#7c9a6a' : '#6a8a5a'; g.beginPath(); g.ellipse(Math.cos(a) * 60, -110 + Math.sin(a) * 70, 18, 52, a + Math.PI / 2, 0, Math.PI * 2); g.fill(); } rr(g, -40, -80, 80, 80, 10); g.fillStyle = M.wood2; g.fill(); g.restore(); }
function windowBox(g, x, y, w, h, o = {}) { g.fillStyle = o.night ? '#2b3550' : M.sky; g.fillRect(x, y, w, h); const r = rng(o.seed || 4); g.fillStyle = o.night ? '#3e4a6a' : '#b9d0de'; for (let xx = x; xx < x + w - 30; xx += 50 + r() * 30) { const hh = 60 + r() * 150; g.fillRect(xx, y + h - hh, 40, hh); }
  if (o.night) for (let i = 0; i < 14; i++) circle(g, x + r() * w, y + r() * h * 0.5, 2, '#fff'); g.strokeStyle = M.white; g.lineWidth = 16; g.strokeRect(x, y, w, h); seg(g, [[x + w / 2, y], [x + w / 2, y + h]], 10, M.white); }
// ---- party / living room: string lights, sofa, lamp, plants
export function party(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.6, (g) => { all(g, o.dim ? '#3a3440' : M.wall); windowBox(g, 1180, gy - 640, 420, 360, { night: true, seed: 6 });
    frame(g, 300, gy - 620, 220, 160, '#e8b48a'); frame(g, 560, gy - 580, 150, 190, M.teal);
    for (let i = 0; i < 26; i++) { const x = -100 + i * 85, y = 90 + Math.sin(i * 0.7) * 18 + 30 * Math.sin((i / 25) * Math.PI); if (i) seg(g, [[x - 85, 90 + Math.sin((i - 1) * 0.7) * 18 + 30 * Math.sin(((i - 1) / 25) * Math.PI)], [x, y]], 3, '#6f695e'); const tw = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7); glowC(g, x, y + 14, 46, M.warm, 0.5 * tw); circle(g, x, y + 14, 9, i % 3 ? M.warm : M.acc); }
    floor(g, gy, o.dim ? '#2c2832' : M.floor); g.fillStyle = M.sofa; rr(g, 120, gy - 230, 520, 120, 30); g.fill(); rr(g, 100, gy - 140, 560, 110, 26); g.fillStyle = shade(M.sofa, -0.1); g.fill(); g.fillStyle = M.wood2; g.fillRect(130, gy - 30, 20, 30); g.fillRect(610, gy - 30, 20, 30);
    seg(g, [[1760, gy], [1760, gy - 420]], 8, M.ink); poly(g, [[1700, gy - 420], [1820, gy - 420], [1790, gy - 520], [1730, gy - 520]], M.warm); glowC(g, 1760, gy - 440, 220, M.warm, 0.35); plant(g, 1000, gy, 0.9); });
  return { GY: gy }; }
// ---- dinner: dining room, pendant lamp, long table in the foreground (figures stand/sit behind it)
export function dinner(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.6, (g) => { all(g, M.wall2); for (let x = -200; x < 2200; x += 120) seg(g, [[x, 0], [x, gy - 300]], 3, alpha('#000', 0.05)); g.fillStyle = M.wall; g.fillRect(-400, gy - 300, E.W + 800, 300); seg(g, [[-400, gy - 300], [E.W + 400, gy - 300]], 8, M.white);
    windowBox(g, 1300, gy - 700, 360, 320, { night: true, seed: 2 }); frame(g, 260, gy - 700, 260, 180, '#e8b48a'); floor(g, gy);
    for (const x of [700, 1220]) { seg(g, [[x, -40], [x, 150]], 4, M.ink); poly(g, [[x - 70, 220], [x + 70, 220], [x + 30, 150], [x - 30, 150]], M.ink); glowC(g, x, 260, 260, M.warm, 0.35); circle(g, x, 222, 14, M.warm); } });
  const fg = (g) => { const y = gy - 150; rr(g, 300, y, 1320, 40, 10); g.fillStyle = M.wood; g.fill(); g.fillStyle = M.wood2; g.fillRect(340, y + 40, 30, 150); g.fillRect(1550, y + 40, 30, 150); g.fillStyle = '#f4f0e8'; g.fillRect(300, y + 30, 1320, 36);
    for (let i = 0; i < 5; i++) { const x = 420 + i * 270; g.fillStyle = M.white; g.beginPath(); g.ellipse(x, y + 4, 60, 14, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = M.line; g.lineWidth = 3; g.stroke(); rr(g, x + 72, y - 44, 22, 44, 5); g.fillStyle = alpha('#ffffff', 0.85); g.fill(); g.strokeStyle = M.ink; g.lineWidth = 3; g.stroke(); }
    if (o.food !== false) { g.fillStyle = M.acc; g.beginPath(); g.ellipse(960, y - 6, 90, 34, 0, Math.PI, Math.PI * 2); g.fill(); } };
  return { GY: gy, fg }; }
// ---- meeting room: whiteboard, window, long table foreground
export function meeting(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.6, (g) => { all(g, '#eef0f1'); windowBox(g, 1260, gy - 700, 520, 400, { seed: 9 }); rr(g, 220, gy - 680, 760, 400, 12); g.fillStyle = M.white; g.fill(); g.strokeStyle = '#b7bcc0'; g.lineWidth = 10; g.stroke();
    if (o.chart !== false) { seg(g, [[300, gy - 360], [420, gy - 470], [540, gy - 420], [700, gy - 560], [880, gy - 600]], 8, M.acc); seg(g, [[290, gy - 340], [900, gy - 340]], 5, '#9aa0a5'); for (let i = 0; i < 3; i++) seg(g, [[300, gy - 640 + i * 30], [560 - i * 60, gy - 640 + i * 30]], 6, '#9aa0a5'); }
    floor(g, gy, '#dcdfe1'); plant(g, 1840, gy, 0.8); });
  const fg = o.table === false ? null : (g) => { const y = gy - 140; rr(g, 260, y, 1400, 36, 10); g.fillStyle = '#5c6670'; g.fill(); g.fillStyle = '#48515a'; g.fillRect(320, y + 36, 26, 140); g.fillRect(1574, y + 36, 26, 140);
    for (let i = 0; i < 4; i++) { const x = 440 + i * 330; rr(g, x, y - 12, 120, 12, 3); g.fillStyle = '#f4f4f4'; g.fill(); rr(g, x + 150, y - 40, 26, 40, 5); g.fillStyle = M.white; g.fill(); g.strokeStyle = M.ink; g.lineWidth = 3; g.stroke(); } };
  return { GY: gy, fg }; }
// ---- cafe: two chairs and a small round table, big window
export function cafe(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.6, (g) => { all(g, '#f1e9de'); windowBox(g, 200, gy - 720, 1520, 460, { seed: 12 }); g.fillStyle = '#d9c3a0'; g.fillRect(-400, gy - 240, E.W + 800, 240); seg(g, [[-400, gy - 240], [E.W + 400, gy - 240]], 8, M.white);
    for (const x of [500, 960, 1420]) { seg(g, [[x, -40], [x, 120]], 4, M.ink); g.fillStyle = M.ink; g.beginPath(); g.arc(x, 150, 40, Math.PI, 0); g.fill(); glowC(g, x, 170, 160, M.warm, 0.35); } floor(g, gy, '#c9b494'); });
  const fg = o.table === false ? null : (g) => { const x = o.tx ?? 960, y = gy - 190; g.fillStyle = M.wood; g.beginPath(); g.ellipse(x, y, 150, 22, 0, 0, Math.PI * 2); g.fill(); seg(g, [[x, y + 10], [x, gy - 6]], 14, M.wood2); seg(g, [[x - 70, gy - 4], [x + 70, gy - 4]], 10, M.wood2);
    for (const dx of [-60, 60]) { rr(g, x + dx - 20, y - 40, 40, 40, 8); g.fillStyle = M.white; g.fill(); g.strokeStyle = M.ink; g.lineWidth = 4; g.stroke(); } };
  return { GY: gy, fg }; }
// ---- stage: dark auditorium, curtains, spotlight cone at o.spot (x) or none
export function stage(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.6, (g) => { all(g, '#1d1a1f'); for (const sx of [-1, 1]) { const x0 = sx < 0 ? 0 : E.W; g.fillStyle = '#5a1f22'; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + sx * -260, 0); g.quadraticCurveTo(x0 + sx * -160, gy * 0.6, x0 + sx * -200, gy); g.lineTo(x0, gy); g.fill(); for (let i = 1; i < 4; i++) seg(g, [[x0 + sx * -i * 60, 0], [x0 + sx * -i * 50, gy]], 4, alpha('#000', 0.25)); }
    g.fillStyle = '#5a1f22'; g.fillRect(-100, 0, E.W + 200, 60); g.fillStyle = '#3a2a22'; g.fillRect(-400, gy, E.W + 800, 400); seg(g, [[-400, gy], [E.W + 400, gy]], 6, '#6b4a30'); });
  if (o.spot != null) spotlight(g, o.spot, gy, t, o.spotA ?? 1);
  if (o.crowd) layer(g, cam, 1.15, (g) => { const r = rng(3); for (let i = 0; i < 22; i++) { const x = i * 92 + r() * 30, y = E.H + 40 + r() * 30; circle(g, x, y - 120, 46, '#0e0c10'); g.fillStyle = '#0e0c10'; g.beginPath(); g.ellipse(x, y, 80, 70, 0, Math.PI, Math.PI * 2); g.fill(); } });
  return { GY: gy }; }
export function spotlight(g, x, gy, t, a = 1) { g.save(); g.globalAlpha *= a; const gr = g.createLinearGradient(0, 0, 0, gy); gr.addColorStop(0, 'rgba(255,240,200,.05)'); gr.addColorStop(1, 'rgba(255,240,200,.38)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40, -20); g.lineTo(x + 40, -20); g.lineTo(x + 230, gy); g.lineTo(x - 230, gy); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,240,200,.45)'; g.beginPath(); g.ellipse(x, gy + 6, 240, 34, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
// ---- outdoor: park path with benches and trees (calm, open air)
export function park(g, t, cam, o = {}) { const gy = GYm();
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, gy, ['#cfe2ee', '#eef3ef']); g.fillRect(-E.W, -E.H, E.W * 4, E.H * 3); circle(g, 1500, 220, 70, '#ffe2b0'); });
  layer(g, cam, 0.5, (g) => { const r = rng(8); for (let i = 0; i < 9; i++) { const x = i * 260 - 80, h = 200 + r() * 160; g.fillStyle = '#c5d6c0'; g.beginPath(); g.ellipse(x, gy - 160 - h * 0.4, 130, h * 0.6, 0, 0, Math.PI * 2); g.fill(); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#d8e3cf'; g.fillRect(-E.W, gy - 30, E.W * 4, 40); for (const x of [260, 1660]) { seg(g, [[x, gy], [x, gy - 260]], 26, '#8a6a4a'); circle(g, x, gy - 360, 150, '#9cb88c'); circle(g, x - 90, gy - 300, 100, '#8fae80'); circle(g, x + 90, gy - 300, 100, '#a8c498'); } if (o.bench !== false) { rr(g, 760, gy - 120, 400, 26, 8); g.fillStyle = M.wood; g.fill(); rr(g, 760, gy - 200, 400, 22, 8); g.fill(); g.fillStyle = M.ink; g.fillRect(790, gy - 94, 14, 94); g.fillRect(1116, gy - 94, 14, 94); } });
  floor(g, gy, '#e6dfcf'); return { GY: gy }; }
// ---- overlays (registered in engine OV) ----------------------------------------------------
// seesaw: plank with a figure riding it (tilt oscillates up/down) + a steady figure beside it on solid ground
export function seesaw(g, x, gy, ang, s = 1) { g.save(); g.translate(x, gy); g.scale(s, s); poly(g, [[-60, 0], [60, 0], [0, -110]], '#5c6670'); g.translate(0, -110); g.rotate(ang); rr(g, -420, -14, 840, 28, 12); g.fillStyle = M.wood; g.fill(); g.strokeStyle = M.wood2; g.lineWidth = 4; g.stroke(); g.restore(); }
// brick wall growing: n bricks visible out of total, newest brick orange
export function bricks(g, x, y, n, o = {}) { const cols = o.cols || 6, bw = o.bw || 150, bh = o.bh || 66, tot = o.total || 18; for (let i = 0; i < Math.min(n, tot); i++) { const r = Math.floor(i / cols), c = i % cols, off = r % 2 ? bw / 2 : 0, k = clamp(n - i);
  if (k <= 0) continue; const bx = x + c * bw + off - (cols * bw) / 2, by = y - r * bh - (1 - ease.outBack(k)) * 80; rr(g, bx + 4, by - bh + 4, bw - 8, bh - 8, 8); g.fillStyle = i === Math.ceil(n) - 1 && o.hiNew !== false ? M.acc : ['#cfc7b8', '#bdb6a8', '#c9c1b2'][i % 3]; g.fill(); g.strokeStyle = M.ink; g.lineWidth = 4; g.stroke(); } }
// notifications: hearts / thumbs popping around a phone
export function notifs(g, x, y, t, o = {}) { const n = o.n || 6; for (let i = 0; i < n; i++) { const p = ((t * (o.speed || 0.5)) + i / n) % 1, a = (i / n) * Math.PI * 2 + 0.4; const px = x + Math.cos(a) * (120 + p * 160), py = y + Math.sin(a) * (80 + p * 120) - p * 120; g.save(); g.globalAlpha *= 1 - p; g.translate(px, py);
  rr(g, -46, -34, 92, 68, 20); g.fillStyle = o.bad ? '#5c6670' : M.white; g.fill(); g.strokeStyle = M.ink; g.lineWidth = 4; g.stroke(); if (o.bad) text(g, '✕', 0, 2, { size: 40, color: '#fff', font: FONTS.ui, weight: 900 }); else { g.fillStyle = M.acc; g.beginPath(); g.moveTo(0, 18); g.bezierCurveTo(-34, -4, -16, -30, 0, -12); g.bezierCurveTo(16, -30, 34, -4, 0, 18); g.fill(); } g.restore(); } }
// sound waves / noise lines from a mouth point
export function shout(g, x, y, t, dir = 1, col = M.ink) { for (let i = 0; i < 3; i++) { const p = ((t * 1.6) + i / 3) % 1; g.save(); g.globalAlpha *= 1 - p; g.strokeStyle = col; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, 30 + p * 120, dir > 0 ? -0.6 : Math.PI - 0.6, dir > 0 ? 0.6 : Math.PI + 0.6); g.stroke(); g.restore(); } }
// a meter / gauge bar (0..1)
export function meter(g, x, y, w, v, lab, col = M.acc) { rr(g, x - w / 2, y - 26, w, 52, 26); g.fillStyle = M.white; g.fill(); g.strokeStyle = M.ink; g.lineWidth = 6; g.stroke(); rr(g, x - w / 2 + 8, y - 18, (w - 16) * clamp(v), 36, 18); g.fillStyle = col; g.fill(); if (lab) text(g, lab, x, y - 62, { size: 34, color: M.ink, font: FONTS.ui, weight: 900, spacing: 3 }); }
