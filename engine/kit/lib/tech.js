// tech.js — attention-economy / app-design props (phones, feeds, pop-ups, streaks, Skinner box, slide decks).
import { E, layer, seg, circle, ring, rr, poly, alpha, shade, text, FONTS, rng, linGrad, ease, prog, clamp, lerp } from '/engine/core.js';
const ACC = '#f07a1a', INK = '#141414', RED = '#d6402b', BLUE = '#2b3550', SOFT = '#e8e2d6';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const floor = (g, gy, c) => { g.fillStyle = c; g.fillRect(-E.W * 2, gy, E.W * 6, E.H * 2); seg(g, [[-E.W * 2, gy], [E.W * 6, gy]], 4, '#d3ccbe'); };
// ---------------- sets ----------------
// open-plan tech office: big windows, desks with monitors, a few colourful chairs
export function techoffice(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, '#eef1f2'); for (let i = 0; i < 5; i++) { g.fillStyle = '#d6e6ee'; g.fillRect(80 + i * 380, 120, 320, 380); g.strokeStyle = '#ffffff'; g.lineWidth = 12; g.strokeRect(80 + i * 380, 120, 320, 380); }
    const r = rng(9); for (let i = 0; i < 5; i++) { const x = 80 + i * 380; for (let k = 0; k < 5; k++) { g.fillStyle = '#b9cfda'; const h = 60 + r() * 180; g.fillRect(x + 20 + k * 60, 500 - h, 44, h); } }
    if (o.logo !== false) { rr(g, 760, 40, 400, 60, 30); g.fillStyle = '#ffffff'; g.fill(); [ACC, '#8fa7b3', '#c9c1b2', INK].forEach((c, i) => circle(g, 840 + i * 80, 70, 16, c)); }
    floor(g, gy, '#dfe3e5');
    for (const x of [300, 1500]) { rr(g, x - 200, gy - 200, 400, 24, 6); g.fillStyle = '#c9c1b2'; g.fill(); g.fillStyle = '#9a9488'; g.fillRect(x - 180, gy - 176, 16, 176); g.fillRect(x + 164, gy - 176, 16, 176); rr(g, x - 90, gy - 330, 180, 120, 10); g.fillStyle = INK; g.fill(); g.fillStyle = '#9fc3d3'; g.fillRect(x - 78, gy - 318, 156, 96); seg(g, [[x, gy - 210], [x, gy - 200]], 10, INK); }
    for (const [x, c] of [[640, ACC], [1260, '#8fa7b3']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, gy - 50, 90, 60, 0, 0, Math.PI * 2); g.fill(); } });
  return { GY: gy }; }
// 1950s lab: tiled walls, a bench, a Skinner box on it
export function oldlab(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, '#e4e7dc'); for (let y = 0; y < gy; y += 60) seg(g, [[-200, y], [2200, y]], 2, '#d3d7c8'); for (let x = 0; x < 2000; x += 60) seg(g, [[x, 0], [x, gy]], 2, '#d3d7c8');
    rr(g, 1380, 140, 360, 260, 8); g.fillStyle = '#2e3a2e'; g.fill(); g.strokeStyle = '#8a6a4a'; g.lineWidth = 14; g.stroke(); seg(g, [[1420, 220], [1520, 220]], 4, '#e8e8e0'); seg(g, [[1420, 270], [1640, 270]], 4, '#e8e8e0'); seg(g, [[1420, 320], [1580, 320]], 4, '#e8e8e0');
    floor(g, gy, '#cfcfc0'); rr(g, 160, gy - 260, 1100, 30, 6); g.fillStyle = '#8a6a4a'; g.fill(); g.fillStyle = '#6d4a2e'; g.fillRect(190, gy - 230, 24, 230); g.fillRect(1206, gy - 230, 24, 230); });
  return { GY: gy }; }
// ---------------- props ----------------
// Skinner box with a pigeon; pecks = array of peck times; feed = which pecks release food
export function skinnerBox(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -260, -220, 520, 300, 14); g.fillStyle = alpha('#dfeef5', 0.9); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); seg(g, [[-260, 80], [260, 80]], 10, '#5c6670');
  rr(g, 170, -150, 70, 70, 10); g.fillStyle = '#5c6670'; g.fill(); circle(g, 205, -115, 18, o.light ? ACC : '#9a9488'); rr(g, 170, -40, 70, 50, 8); g.fillStyle = '#3a3a3a'; g.fill();
  const rate = o.rate ?? 2, ph = (t * rate) % 1, peck = ph < 0.25, bob = peck ? Math.sin(ph / 0.25 * Math.PI) : 0;
  g.save(); g.translate(40, 40); g.fillStyle = '#9aa3ad'; g.beginPath(); g.ellipse(0, 0, 90, 55, -0.1, 0, Math.PI * 2); g.fill(); g.fillStyle = '#7d8691'; g.beginPath(); g.ellipse(-20, -6, 60, 34, -0.2, 0, Math.PI * 2); g.fill();
  poly(g, [[-80, 0], [-150, -20], [-150, 20]], '#7d8691'); seg(g, [[-10, 50], [-14, 80]], 6, '#d98f84'); seg(g, [[20, 50], [24, 80]], 6, '#d98f84');
  const hx = 70 + bob * 50, hy = -50 + bob * 30; circle(g, hx, hy, 34, '#9aa3ad'); circle(g, hx + 12, hy - 8, 7, INK); circle(g, hx + 14, hy - 10, 2, '#fff'); poly(g, [[hx + 30, hy - 4], [hx + 52, hy + 4], [hx + 30, hy + 10]], '#d4a24a');
  g.fillStyle = alpha('#7ab08a', 0.6); g.beginPath(); g.ellipse(hx - 10, hy + 24, 26, 10, 0, 0, Math.PI * 2); g.fill(); g.restore();
  if (o.food) { const fp = (t * 0.8) % 1; if (fp < 0.6) circle(g, 205, -10 + fp * 60, 9, '#c98a4a'); }
  g.restore(); if (o.counter) text(g, `PECKS: ${Math.floor(t * rate)}`, x, y - 260 * s, { size: 40 * s, color: INK, font: FONTS.ui, weight: 900, spacing: 3 }); }
// laptop showing a slide
export function laptop(g, x, y, s, title, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -300, -210, 600, 380, 18); g.fillStyle = INK; g.fill(); rr(g, -278, -190, 556, 340, 8); g.fillStyle = '#ffffff'; g.fill();
  poly(g, [[-360, 170], [360, 170], [330, 200], [-330, 200]], '#5c6670'); g.fillStyle = ACC; g.fillRect(-278, -190, 556, 16);
  const lines = title.split('\n'); lines.forEach((l, i) => text(g, l, 0, -100 + i * 52, { size: 40, color: i === 0 ? INK : '#5c6670', font: i ? FONTS.ui : FONTS.title, weight: 900 })); for (let i = 0; i < 3; i++) { g.fillStyle = SOFT; g.fillRect(-200, 40 + i * 30, i === 2 ? 240 : 400, 12); }
  if (o.page) text(g, o.page, 240, 140, { size: 22, color: '#9a9488', font: FONTS.ui, weight: 900 }); g.restore(); }
// spreading network: from 1 node outward; k 0..1
export function spread(g, cx, cy, k, t, o = {}) { const r = rng(o.seed || 7), N = o.n || 160, nodes = []; for (let i = 0; i < N; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), 0.6) * (o.r || 440); nodes.push([cx + Math.cos(a) * d * 1.5, cy + Math.sin(a) * d * 0.8, d / (o.r || 440)]); }
  nodes.forEach(([x, y, d], i) => { const on = d < k; if (i % 3 === 0 && on) seg(g, [[cx + (x - cx) * 0.4, cy + (y - cy) * 0.4], [x, y]], 2, alpha(ACC, 0.35)); circle(g, x, y, on ? 9 : 6, on ? ACC : alpha('#9a9488', 0.35)); });
  circle(g, cx, cy, 26, INK); ring(g, cx, cy, 26 + ((t * 30) % 40), 4, alpha(ACC, 1 - ((t * 30) % 40) / 40)); }
// phone frame
export function phone(g, x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -170, -330, 340, 660, 46); g.fillStyle = INK; g.fill(); g.save(); rr(g, -150, -306, 300, 612, 28); g.clip(); g.fillStyle = '#ffffff'; g.fillRect(-150, -306, 300, 612); fn && fn(g); g.restore(); rr(g, -50, -320, 100, 20, 10); g.fillStyle = INK; g.fill(); g.restore(); }
// confirmshaming pop-up
export function popup(g, x, y, s, k, hover) { g.save(); g.translate(x, y); g.scale(s * ease.outBack(k), s * ease.outBack(k)); g.fillStyle = 'rgba(0,0,0,.25)'; rr(g, -330, -200, 680, 420, 26); g.fill(); rr(g, -340, -210, 680, 420, 26); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  text(g, 'GET 20% OFF!', 0, -120, { size: 64, color: INK }); text(g, 'Join our list today', 0, -60, { size: 30, color: '#6f695e', font: FONTS.ui, weight: 900 });
  rr(g, -220, -10, 440, 90, 45); g.fillStyle = ACC; g.fill(); text(g, 'YES, SAVE ME MONEY!', 0, 38, { size: 34, color: '#fff' });
  text(g, 'No thanks, I don’t like saving money', 0, 140, { size: 26, color: hover ? RED : '#9a9488', font: FONTS.ui, weight: 900 }); if (hover) seg(g, [[-230, 158], [230, 158]], 3, RED); circle(g, 300, -170, 24, '#e8e2d6'); text(g, '×', 300, -166, { size: 40, color: '#6f695e' }); g.restore(); }
// streak flame with day counter; broken = 0..1 (flame dies, counter goes to 0)
export function streak(g, x, y, s, t, days, broken = 0) { g.save(); g.translate(x, y); g.scale(s, s); const fl = 1 - broken, w = Math.sin(t * 9) * 6;
  if (fl > 0.02) { g.save(); g.globalAlpha *= fl; g.fillStyle = ACC; g.beginPath(); g.moveTo(0, 90); g.bezierCurveTo(-110, 60, -70, -60, 0 + w, -150); g.bezierCurveTo(30, -60, 120, -20, 0, 90); g.fill(); g.fillStyle = '#ffd28a'; g.beginPath(); g.moveTo(0, 80); g.bezierCurveTo(-50, 50, -30, -10, w * 0.6, -60); g.bezierCurveTo(20, -10, 60, 30, 0, 80); g.fill(); g.restore(); }
  if (broken > 0) { g.save(); g.globalAlpha *= broken; for (let i = 0; i < 4; i++) { const p = ((t * 0.6) + i / 4) % 1; circle(g, Math.sin(i * 2) * 20, -40 - p * 160, 18 + p * 20, alpha('#9a9488', 0.5 * (1 - p))); } g.restore(); }
  text(g, broken > 0.5 ? '0' : String(days), 0, 190, { size: 120, color: broken > 0.5 ? '#9a9488' : INK }); text(g, 'DAY STREAK', 0, 260, { size: 34, color: '#6f695e', font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
// a feed card (post) at y within phone coords
function post(g, y, i) { const cols = ['#f3d9c4', '#d6e6ee', '#e4dcef', '#dfe9d6']; rr(g, -134, y, 268, 200, 14); g.fillStyle = '#f7f5f1'; g.fill(); circle(g, -104, y + 26, 16, ['#5c6670', ACC, '#8fa7b3', '#9cb88c'][i % 4]); g.fillStyle = '#d9d3c7'; g.fillRect(-80, y + 18, 120, 12); rr(g, -124, y + 50, 248, 110, 10); g.fillStyle = cols[i % 4]; g.fill(); circle(g, -100, y + 180, 9, i % 3 ? '#cfc7b8' : RED); g.fillStyle = '#d9d3c7'; g.fillRect(-80, y + 175, 90, 10); }
export function feed(g, off) { const base = Math.floor(off / 220); for (let k = -1; k < 5; k++) post(g, -296 + (k * 220) - (off % 220), base + k); }
// pull-to-refresh as a slot machine: reels spin then land
export function slot(g, x, y, s, t, land) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -330, -180, 660, 360, 40); g.fillStyle = RED; g.fill(); rr(g, -290, -130, 580, 220, 20); g.fillStyle = '#fff'; g.fill(); const sym = ['♥', '✉', '★', '○'];
  for (let i = 0; i < 3; i++) { const stop = 1.2 + i * 0.5, spin = t < stop; const ch = spin ? sym[Math.floor(t * 18 + i * 3) % 4] : (land ? '♥' : sym[(i + 1) % 4]); g.save(); rr(g, -270 + i * 190, -110, 160, 180, 14); g.fillStyle = '#f4efe4'; g.fill(); { const cx = -190 + i * 190, cy = -20 + (spin ? Math.sin(t * 40) * 6 : 0); g.save(); g.translate(cx, cy); if (ch === '♥') { g.fillStyle = RED; g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(-70, -10, -30, -60, 0, -20); g.bezierCurveTo(30, -60, 70, -10, 0, 40); g.fill(); } else if (ch === '✉') { rr(g, -50, -32, 100, 64, 8); g.fillStyle = '#8fa7b3'; g.fill(); seg(g, [[-50, -32], [0, 6], [50, -32]], 5, INK); } else if (ch === '★') { const P = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 22 : 50; P.push([Math.cos(a) * r, Math.sin(a) * r]); } poly(g, P, '#d4a24a'); } else { ring(g, 0, 0, 38, 10, '#9a9488'); } g.restore(); } g.restore(); }
  seg(g, [[350, -120], [350, 60]], 16, '#5c6670'); circle(g, 350, -140, 30, ACC); g.restore(); }
// "spinner" (refresh arrow)
export function spinner(g, x, y, r, t) { g.save(); g.translate(x, y); g.rotate(t * 6); g.strokeStyle = ACC; g.lineWidth = r * 0.22; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 1.5); g.stroke(); poly(g, [[r - 2, -r * 0.45], [r + r * 0.4, 0], [r - r * 0.4, 0]].map(([a, b]) => [a, b]), ACC); g.restore(); }
// stop sign / pause
export function stopSign(g, x, y, s, label = 'PAUSE') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = RED; g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); } g.closePath(); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.stroke(); text(g, label, 0, 8, { size: 56, color: '#fff' }); g.restore(); }
// film frame / documentary card
export function filmCard(g, x, y, s, title, year) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -320, -200, 640, 400, 12); g.fillStyle = INK; g.fill(); for (let i = 0; i < 9; i++) { rr(g, -300 + i * 70, -190, 36, 24, 4); g.fillStyle = '#fff'; g.fill(); rr(g, -300 + i * 70, 166, 36, 24, 4); g.fill(); }
  rr(g, -290, -150, 580, 300, 8); g.fillStyle = BLUE; g.fill(); text(g, title, 0, -10, { size: 58, color: '#fff' }); text(g, year, 0, 60, { size: 34, color: ACC, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); }
