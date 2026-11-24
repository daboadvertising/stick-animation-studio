// shop.js — retail / money sets and props for spending-psychology videos (16:9 + 9:16).
import { E, layer, seg, circle, ring, rr, poly, alpha, shade, text, FONTS, rng, linGrad, ease, prog, clamp, lerp } from '/engine/core.js';
const ACC = '#f07a1a', INK = '#141414', RED = '#d6402b', GRN = '#4f9a5a', PAPER = '#ffffff';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
const floor = (g, gy, c) => { g.fillStyle = c; g.fillRect(-E.W * 2, gy, E.W * 6, E.H * 2); seg(g, [[-E.W * 2, gy], [E.W * 6, gy]], 4, '#d3ccbe'); };
const glowC = (g, x, y, r, c, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, alpha(c, a)); gr.addColorStop(1, alpha(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
// ---------------- sets ----------------
export function mall(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, '#f3eee6'); g.fillStyle = '#e8e0d2'; g.fillRect(-400, 0, E.W + 800, 120);
    for (let i = 0; i < 9; i++) { const x = -60 + i * 260, sw = Math.sin(t * 2 + i) * 4; seg(g, [[x, 120], [x + sw, 170]], 3, '#9a9488'); rr(g, x - 70 + sw, 170, 140, 70, 10); g.fillStyle = i % 2 ? RED : ACC; g.fill(); text(g, i % 3 === 1 ? '-50%' : 'SALE', x + sw, 208, { size: 34, color: '#fff' }); }
    for (const rx of [140, 1240]) { seg(g, [[rx, gy - 380], [rx + 520, gy - 380]], 8, '#6f695e'); seg(g, [[rx + 20, gy - 380], [rx + 20, gy]], 8, '#6f695e'); seg(g, [[rx + 500, gy - 380], [rx + 500, gy]], 8, '#6f695e');
      const r = rng(rx); for (let k = 0; k < 7; k++) { const x = rx + 50 + k * 64; seg(g, [[x, gy - 380], [x, gy - 360]], 3, '#6f695e'); poly(g, [[x - 26, gy - 360], [x + 26, gy - 360], [x + 30, gy - 210], [x - 30, gy - 210]], ['#8fa7b3', '#c98a4a', '#5c6670', '#b9a7c9', '#9cb88c'][Math.floor(r() * 5)]); } }
    floor(g, gy, '#e1dacd'); });
  return { GY: gy }; }
export function cinema(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, '#2a2230'); for (let i = 0; i < 30; i++) circle(g, 40 + i * 66, 60, 8, i % 2 ? '#ffd28a' : alpha('#ffd28a', 0.4 + 0.4 * Math.sin(t * 6 + i)));
    rr(g, 520, 110, 880, 300, 16); g.fillStyle = '#141414'; g.fill(); g.strokeStyle = '#ffd28a'; g.lineWidth = 6; g.stroke(); text(g, 'SNACKS', 960, 165, { size: 54, color: '#ffd28a' });
    if (o.menu !== false) [['SMALL', '$5'], ['MEDIUM', '$8.50'], ['LARGE', '$9']].forEach(([a, b], i) => { text(g, a, 680, 240 + i * 56, { size: 38, color: '#f4efe4', font: FONTS.ui, weight: 900, align: 'left' }); text(g, b, 1240, 240 + i * 56, { size: 38, color: i === 1 && o.hiDecoy ? ACC : '#f4efe4', font: FONTS.ui, weight: 900, align: 'right' }); });
    g.fillStyle = '#5a1f22'; g.fillRect(-400, gy - 200, E.W + 800, 200); g.fillStyle = '#7a2a2e'; g.fillRect(-400, gy - 212, E.W + 800, 16); floor(g, gy, '#3a2a30'); });
  return { GY: gy }; }
export function checkout(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.6, (g) => { all(g, '#eef0f1'); for (let i = 0; i < 6; i++) { rr(g, 100 + i * 300, 160, 220, 360, 8); g.fillStyle = '#e1e4e6'; g.fill(); for (let k = 0; k < 4; k++) { g.fillStyle = ['#c98a4a', '#8fa7b3', '#9cb88c', ACC][(i + k) % 4]; g.fillRect(120 + i * 300, 190 + k * 86, 180, 50); } }
    floor(g, gy, '#dcdfe1'); });
  const fg = (g) => { rr(g, 1000, gy - 230, 760, 230, 14); g.fillStyle = '#5c6670'; g.fill(); g.fillStyle = '#48515a'; g.fillRect(1000, gy - 230, 760, 26); rr(g, 1500, gy - 330, 110, 100, 12); g.fillStyle = INK; g.fill(); g.fillStyle = '#9fd3a0'; g.fillRect(1514, gy - 318, 82, 40); };
  return { GY: gy, fg }; }
export function forest(g, t, cam, o = {}) { const gy = E.H * 0.8;
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, gy, ['#cfe2d6', '#eef3ea']); g.fillRect(-E.W, -E.H, E.W * 4, E.H * 3); });
  layer(g, cam, 0.5, (g) => { const r = rng(4); for (let i = 0; i < 14; i++) { const x = i * 150 - 60, h = 300 + r() * 260; poly(g, [[x - 90, gy - 40], [x, gy - 40 - h], [x + 90, gy - 40]], i % 2 ? '#7f9e78' : '#6d8c67'); } });
  floor(g, gy, '#d8dfc8'); return { GY: gy }; }
// ---------------- props / overlays ----------------
// price tag with an old price that gets struck through and a new price that pops
export function priceTag(g, x, y, s, o) { const { old, now, strike = 0, pop = 1, rot = -0.08 } = o; g.save(); g.translate(x, y); g.rotate(rot + Math.sin((o.t || 0) * 2) * 0.02); g.scale(s, s);
  seg(g, [[0, -230], [0, -150]], 4, '#6f695e'); poly(g, [[-170, -140], [170, -140], [170, 170], [-170, 170], [-170, -100]], PAPER); g.beginPath(); g.moveTo(-170, -100); g.lineTo(-130, -140); g.lineTo(170, -140); g.lineTo(170, 170); g.lineTo(-170, 170); g.closePath(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); ring(g, -110, -95, 14, 6, INK);
  if (old) { text(g, old, 0, -30, { size: 72, color: '#9a9488' }); if (strike > 0) seg(g, [[-130, -30], [lerp(-130, 130, strike), -30 - 10 * strike]], 12, RED); }
  if (now && pop > 0) { g.save(); g.translate(0, 85); g.scale(ease.outBack(pop), ease.outBack(pop)); text(g, now, 0, 0, { size: now.length > 5 ? Math.min(96, 470 / now.length) : 96, color: ACC }); g.restore(); } g.restore(); }
// rigged fortune wheel that spins and lands on `land`
export function fortuneWheel(g, x, y, r, t, o = {}) { const nums = [10, 65, 10, 65, 10, 65, 10, 65], n = nums.length, idx = nums.indexOf(o.land ?? 65);
  const spin = o.spinAt != null ? ease.out(clamp((t - o.spinAt) / 3.2)) : 1, target = -Math.PI / 2 - (idx + 0.5) * (Math.PI * 2 / n) + Math.PI * 2 * 5, a = target * spin;
  g.save(); g.translate(x, y); g.rotate(a); for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? ACC : '#f4efe4'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, i * Math.PI * 2 / n, (i + 1) * Math.PI * 2 / n); g.closePath(); g.fill();
    g.save(); g.rotate((i + 0.5) * Math.PI * 2 / n); text(g, String(nums[i]), r * 0.68, 0, { size: r * 0.2, color: i % 2 ? '#fff' : INK }); g.restore(); } g.restore();
  ring(g, x, y, r, 12, INK); circle(g, x, y, r * 0.12, INK); poly(g, [[x - 26, y - r - 40], [x + 26, y - r - 40], [x, y - r + 14]], RED); seg(g, [[x, y + r], [x, y + r + 120]], 16, '#5c6670'); rr(g, x - 120, y + r + 110, 240, 30, 10); g.fillStyle = '#5c6670'; g.fill(); }
// $10.00 → $9.99 with the first digit glowing
export function leftDigit(g, x, y, k, t) { const s1 = '$10.00', s2 = '$9.99'; g.save(); g.globalAlpha *= 1 - k; text(g, s1, x, y, { size: 200, color: INK }); g.restore();
  if (k > 0) { g.save(); g.globalAlpha *= k; g.font = '700 200px Fredoka'; const w = g.measureText(s2).width, wd = g.measureText('$').width, w9 = g.measureText('9').width; const x0 = x - w / 2; glowC(g, x0 + wd + w9 / 2, y - 10, 170, ACC, 0.35 + 0.1 * Math.sin(t * 5));
    text(g, '$', x0, y, { size: 200, color: INK, align: 'left' }); text(g, '9', x0 + wd, y, { size: 200, color: ACC, align: 'left' }); text(g, '.99', x0 + wd + w9, y, { size: 200, color: INK, align: 'left' }); g.restore(); } }
// popcorn buckets (small / medium decoy / large)
export function bucket(g, x, gy, s, price, lab, o = {}) { g.save(); g.translate(x, gy); g.scale(s, s); for (let i = 0; i < 9; i++) circle(g, -60 + (i % 5) * 30 + (i > 4 ? 15 : 0), -250 - (i > 4 ? 30 : 0) + Math.sin(i * 3) * 6, 26, '#fff4d6');
  poly(g, [[-90, -240], [90, -240], [65, 0], [-65, 0]], '#ffffff'); for (let i = 0; i < 4; i++) poly(g, [[-90 + i * 45, -240], [-67 + i * 45, -240], [-48 + i * 32 + 5, 0], [-65 + i * 32 + 5, 0]], RED); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(-90, -240); g.lineTo(90, -240); g.lineTo(65, 0); g.lineTo(-65, 0); g.closePath(); g.stroke(); g.restore();
  text(g, lab, x, gy + 50, { size: 34, color: o.dim ? '#9a9488' : INK, font: FONTS.ui, weight: 900, spacing: 3 }); rr(g, x - 80, gy + 80, 160, 64, 32); g.fillStyle = o.hi ? ACC : INK; g.fill(); text(g, price, x, gy + 114, { size: 40, color: '#fff' }); }
// cookie jar with n cookies
export function cookieJar(g, x, gy, n, s = 1) { g.save(); g.translate(x, gy); g.scale(s, s); rr(g, -120, -300, 240, 300, 40); g.fillStyle = alpha('#dfeef5', 0.85); g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, -90, -340, 180, 46, 14); g.fillStyle = '#8a6a4a'; g.fill();
  const r = rng(n + 3); for (let i = 0; i < n; i++) { const cx = -70 + (i % 4) * 46 + r() * 10, cy = -40 - Math.floor(i / 4) * 50 - r() * 8; circle(g, cx, cy, 26, '#c98a4a'); for (let k = 0; k < 3; k++) circle(g, cx - 10 + k * 9, cy - 6 + (k % 2) * 12, 4, '#4a2e1a'); } g.restore(); }
// digital countdown timer (counts down from secs)
export function timer(g, x, y, secs, t, o = {}) { const left = Math.max(0, secs - (o.fast ? t * 7 : t)), m = Math.floor(left / 60), sd = Math.floor(left % 60), flash = (t * 2) % 1 < 0.5;
  rr(g, x - 300, y - 110, 600, 220, 30); g.fillStyle = INK; g.fill(); ring(g, x, y, 0, 0, INK); g.strokeStyle = flash ? RED : '#5a2a2a'; g.lineWidth = 10; rr(g, x - 300, y - 110, 600, 220, 30); g.stroke();
  text(g, `00:${String(m).padStart(2, '0')}:${String(sd).padStart(2, '0')}`, x, y + 8, { size: 120, color: flash ? '#ff5a3c' : '#ff8a6a', font: FONTS.ui, weight: 900 }); if (o.lab) text(g, o.lab, x, y - 150, { size: 40, color: RED, font: FONTS.ui, weight: 900, spacing: 4 }); }
// stock bar: ONLY N LEFT
export function stockBar(g, x, y, w, n, t) { rr(g, x - w / 2, y - 40, w, 80, 40); g.fillStyle = '#ffe4de'; g.fill(); rr(g, x - w / 2, y - 40, w * 0.12 * n, 80, 40); g.fillStyle = RED; g.fill(); text(g, `ONLY ${n} LEFT!`, x, y + 4, { size: 44, color: INK, font: FONTS.ui, weight: 900, spacing: 3, alpha: 0.75 + 0.25 * Math.sin(t * 8) }); }
// payment card
export function card(g, x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -150, -95, 300, 190, 22); g.fillStyle = '#2b3550'; g.fill(); rr(g, -150, -95, 300, 190, 22); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, -110, -40, 60, 46, 8); g.fillStyle = '#d4a24a'; g.fill(); for (let i = 0; i < 4; i++) { g.fillStyle = '#9fb0d0'; g.fillRect(-110 + i * 62, 40, 46, 12); } circle(g, 90, -50, 22, alpha(ACC, 0.9)); circle(g, 115, -50, 22, alpha('#ffd28a', 0.8)); g.restore(); }
// paper money note
export function note(g, x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -110, -55, 220, 110, 10); g.fillStyle = '#9cc79a'; g.fill(); g.strokeStyle = '#4f7a4a'; g.lineWidth = 6; g.stroke(); ring(g, 0, 0, 30, 6, '#4f7a4a'); text(g, '$', 0, 4, { size: 42, color: '#2e5a2e' }); g.restore(); }
// big "BUY NOW" button with a pointer clicking it at clickAt
export function buyNow(g, x, y, t, clickAt = 1) { const pressed = t > clickAt && t < clickAt + 0.25, s = pressed ? 0.94 : 1 + 0.03 * Math.sin(t * 6); g.save(); g.translate(x, y); g.scale(s, s); rr(g, -260, -80, 520, 160, 80); g.fillStyle = ACC; g.fill(); rr(g, -260, -80, 520, 160, 80); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); text(g, 'BUY NOW', 0, 6, { size: 80, color: '#fff' }); g.restore();
  const px = lerp(x + 380, x + 80, ease.inOut(clamp(t / clickAt))), py = lerp(y + 260, y + 30, ease.inOut(clamp(t / clickAt))); g.save(); g.translate(px, py); poly(g, [[0, 0], [0, 80], [20, 62], [36, 96], [50, 90], [34, 56], [60, 56]], '#fff'); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 80); g.lineTo(20, 62); g.lineTo(36, 96); g.lineTo(50, 90); g.lineTo(34, 56); g.lineTo(60, 56); g.closePath(); g.stroke(); g.restore();
  if (t > clickAt) for (let i = 0; i < 2; i++) { const p = clamp((t - clickAt) * 1.5 - i * 0.3); if (p > 0 && p < 1) ring(g, x + 80, y + 30, 20 + p * 120, 6, alpha(ACC, 1 - p)); } }
// phone screen with a shop UI
export function shopPhone(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -150, -290, 300, 580, 40); g.fillStyle = INK; g.fill(); rr(g, -132, -262, 264, 524, 22); g.fillStyle = '#fff'; g.fill();
  rr(g, -116, -246, 232, 150, 14); g.fillStyle = '#f3e3d0'; g.fill(); text(g, o.item || 'SNEAKERS', 0, -170, { size: 30, color: INK, font: FONTS.ui, weight: 900 });
  text(g, o.price || '$59.99', -40, -60, { size: 50, color: ACC }); text(g, o.old || '$120', 70, -60, { size: 30, color: '#9a9488' }); seg(g, [[38, -62], [102, -62]], 4, RED);
  rr(g, -116, -10, 232, 54, 14); g.fillStyle = RED; g.fill(); text(g, `ENDS IN 0:0${Math.max(0, 9 - Math.floor(t))}:${String(59 - Math.floor((t * 7) % 60)).padStart(2, '0')}`, 0, 18, { size: 26, color: '#fff', font: FONTS.ui, weight: 900 });
  text(g, 'ONLY 3 LEFT', 0, 90, { size: 28, color: RED, font: FONTS.ui, weight: 900 }); rr(g, -116, 150, 232, 70, 35); g.fillStyle = ACC; g.fill(); text(g, 'BUY NOW', 0, 186, { size: 34, color: '#fff' }); g.restore(); }
// a brain with N levers, pulled one by one
export function leverBrain(g, x, y, s, t, pulled = []) { g.save(); g.translate(x, y); g.scale(s, s); const P = [[-60, -20, 70], [-10, -40, 72], [44, -18, 64], [-30, 32, 66], [30, 30, 56]]; g.fillStyle = '#f2b7ae'; for (const [dx, dy, r] of P) { g.beginPath(); g.arc(dx, dy, r, 0, 7); g.fill(); }
  g.strokeStyle = '#d98f84'; g.lineWidth = 6; for (const [dx, dy, r] of P) { g.beginPath(); g.arc(dx, dy, r * 0.6, 0.5, 2.6); g.stroke(); }
  for (let i = 0; i < 5; i++) { const bx = -120 + i * 60, a = -0.5 + (pulled[i] ? 1.0 * pulled[i] : 0); seg(g, [[bx, -100], [bx + Math.sin(a) * 90, -100 - Math.cos(a) * 90]], 10, INK); circle(g, bx + Math.sin(a) * 90, -100 - Math.cos(a) * 90, 18, pulled[i] > 0.5 ? ACC : '#ffffff'); ring(g, bx + Math.sin(a) * 90, -100 - Math.cos(a) * 90, 18, 5, INK); rr(g, bx - 18, -112, 36, 24, 6); g.fillStyle = '#5c6670'; g.fill(); } g.restore(); }
