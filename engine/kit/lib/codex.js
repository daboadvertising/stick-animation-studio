// codex.js — manuscript / codebreaking props (Voynich-style pages, glyph script, herbal plants, zodiac wheel,
// bathing pools, UV reveal, magnifier, Cardan grille, scribes, Europe map). Light palette; noir remaps it.
import { E, layer, seg, circle, ring, rr, poly, alpha, shade, text, FONTS, rng, ease, prog, clamp, lerp } from '/engine/core.js';
const ACC = '#f07a1a', INK = '#141414', PAPER = '#ffffff', VEL = '#f3ead6', BG = '#f5f2ec', MID = '#9a9488';
const all = (g, c) => { g.fillStyle = c; g.fillRect(-E.W * 3, -E.H * 3, E.W * 9, E.H * 9); };
// one invented "Voynichese" glyph drawn with pen strokes (seeded, so words are stable)
export function glyph(g, x, y, sz, seed, col = INK) { const r = rng(seed * 7 + 3), k = Math.floor(r() * 9); g.save(); g.translate(x, y); g.scale(sz / 30, sz / 30); g.strokeStyle = col; g.lineWidth = 3.2; g.lineCap = 'round'; g.beginPath();
  if (k === 0) { g.arc(0, 0, 9, 0.3, Math.PI * 2 - 0.3); } else if (k === 1) { g.moveTo(-8, 10); g.lineTo(-8, -10); g.quadraticCurveTo(4, -16, 8, -4); } else if (k === 2) { g.moveTo(-9, 10); g.quadraticCurveTo(-9, -12, 0, -12); g.quadraticCurveTo(9, -12, 9, 10); }
  else if (k === 3) { g.arc(0, -3, 7, Math.PI, 0); g.lineTo(7, 12); g.moveTo(-7, -3); g.lineTo(-7, 12); } else if (k === 4) { g.moveTo(-10, 10); g.lineTo(-4, -14); g.lineTo(2, 10); g.moveTo(-8, 0); g.quadraticCurveTo(10, -6, 10, 6); }
  else if (k === 5) { g.arc(-3, 0, 7, 0, Math.PI * 2); g.moveTo(4, 0); g.lineTo(10, 12); } else if (k === 6) { g.moveTo(-9, -8); g.quadraticCurveTo(0, -16, 9, -8); g.quadraticCurveTo(0, 0, -9, 8); g.quadraticCurveTo(0, 16, 9, 8); }
  else if (k === 7) { g.moveTo(-6, 12); g.lineTo(-6, -12); g.moveTo(-6, -12); g.quadraticCurveTo(10, -12, 6, 0); g.quadraticCurveTo(0, 6, 10, 12); } else { g.moveTo(-9, 0); g.lineTo(9, 0); g.moveTo(0, -10); g.quadraticCurveTo(10, 0, 0, 10); }
  g.stroke(); g.restore(); }
// a line of glyph "words"; reveal 0..1 writes left to right
export function glyphLine(g, x, y, w, sz, seed, reveal = 1, col = INK, o = {}) { const r = rng(seed); let cx = x, n = 0; const tot = Math.floor(w / (sz * 0.9));
  while (cx < x + w - sz) { const wl = 2 + Math.floor(r() * 5); for (let i = 0; i < wl && cx < x + w - sz; i++) { if (n / tot > reveal) return; const s2 = Math.floor(r() * 1000); const hi = o.hi && o.hi.includes(s2 % 9); glyph(g, cx + sz / 2, y, sz, s2, hi ? ACC : col); cx += sz * 0.85; n++; } cx += sz * 0.7; } }
// a block of text (paragraph) with an optional star marker
export function glyphBlock(g, x, y, w, lines, sz, seed, reveal = 1, o = {}) { if (o.star) { star(g, x - sz, y, sz * 0.5, ACC); } for (let i = 0; i < lines; i++) glyphLine(g, x, y + i * sz * 1.5, i === lines - 1 ? w * 0.6 : w, sz, seed + i * 13, clamp(reveal * lines - i), INK, o); }
export function star(g, x, y, r, col) { const P = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * 0.45 : r; P.push([x + Math.cos(a) * rr2, y + Math.sin(a) * rr2]); } poly(g, P, col); }
// an impossible herbal plant (roots, stalk, mismatched leaves, odd flower)
export function plant(g, x, y, s, seed, t = 0, grow = 1) { const r = rng(seed); g.save(); g.translate(x, y); g.scale(s, s); const gr = ease.out(clamp(grow));
  for (let i = 0; i < 6; i++) { const a = Math.PI * (0.15 + r() * 0.7); seg(g, [[0, 0], [Math.cos(a) * 40, 30], [Math.cos(a) * 70 + (r() - 0.5) * 30, 60 + r() * 50]], 5, INK); } // roots
  if (seed % 2) { g.fillStyle = MID; g.beginPath(); g.ellipse(0, 10, 34, 22, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
  const top = -260 * gr; seg(g, [[0, 0], [Math.sin(t) * 6, top]], 8, INK);
  for (let i = 0; i < 5; i++) { const ly = -50 - i * 45; if (-ly > -top) break; const side = i % 2 ? 1 : -1, big = 30 + r() * 30; g.save(); g.translate(0, ly); g.rotate(side * (0.6 + r() * 0.4)); g.fillStyle = i % 3 === 0 ? '#ffffff' : MID; g.beginPath(); if (r() > 0.5) g.ellipse(side * big, 0, big, big * 0.38, 0, 0, Math.PI * 2); else { for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; g.lineTo(side * big + Math.cos(a) * big * (k % 2 ? 0.5 : 1), Math.sin(a) * big * 0.5); } } g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.restore(); }
  if (gr > 0.95) { for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + t * 0.3; g.fillStyle = k % 2 ? ACC : '#ffffff'; g.beginPath(); g.ellipse(Math.cos(a) * 30, top + Math.sin(a) * 30, 20, 9, a, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); } circle(g, 0, top, 16, INK); }
  g.restore(); }
// zodiac / cosmological wheel with figures around a sun, slowly rotating
export function cosmos(g, x, y, r, t, o = {}) { g.save(); g.translate(x, y); circle(g, 0, 0, r, VEL); ring(g, 0, 0, r, 8, INK); ring(g, 0, 0, r * 0.72, 5, INK); ring(g, 0, 0, r * 0.42, 5, INK);
  g.save(); g.rotate(t * 0.15); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72], [Math.cos(a) * r, Math.sin(a) * r]], 4, INK); g.save(); g.rotate(a + Math.PI / 12); g.translate(r * 0.86, 0); g.rotate(Math.PI / 2); circle(g, 0, -10, 7, INK); seg(g, [[0, -3], [0, 14]], 5, INK); g.restore(); star(g, Math.cos(a + 0.26) * r * 0.57, Math.sin(a + 0.26) * r * 0.57, 12, i % 3 ? INK : ACC); } g.restore();
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2 - t * 0.2; seg(g, [[Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2], [Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36]], 5, ACC); } circle(g, 0, 0, r * 0.18, ACC); circle(g, -r * 0.05, -r * 0.03, r * 0.025, INK); circle(g, r * 0.05, -r * 0.03, r * 0.025, INK); g.restore(); }
// "balneological" pools: tubs of liquid linked by pipes, tiny figures bathing, liquid flowing
export function pools(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const P = [[-300, 40], [0, -60], [300, 40]];
  g.strokeStyle = INK; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(-300, 40); g.quadraticCurveTo(-150, -200, 0, -60); g.quadraticCurveTo(150, -200, 300, 40); g.stroke(); g.strokeStyle = '#ffffff'; g.lineWidth = 14; g.stroke();
  for (let i = 0; i < 10; i++) { const u = ((t * 0.25) + i / 10) % 1, seg1 = u < 0.5, v = seg1 ? u * 2 : (u - 0.5) * 2; const [a, b, c] = seg1 ? [[-300, 40], [-150, -200], [0, -60]] : [[0, -60], [150, -200], [300, 40]]; const px = (1 - v) * (1 - v) * a[0] + 2 * (1 - v) * v * b[0] + v * v * c[0], py = (1 - v) * (1 - v) * a[1] + 2 * (1 - v) * v * b[1] + v * v * c[1]; circle(g, px, py, 5, ACC); }
  P.forEach(([px, py], i) => { rr(g, px - 120, py, 240, 120, 30); g.fillStyle = MID; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); for (let k = 0; k < 3; k++) { const fx = px - 70 + k * 70, fy = py + 10 + Math.sin(t * 2 + k + i) * 4; circle(g, fx, fy - 26, 14, '#ffffff'); ring(g, fx, fy - 26, 14, 4, INK); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(fx, fy + 6, 14, 22, 0, Math.PI, Math.PI * 2); g.fill(); g.stroke(); }
    g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.beginPath(); for (let xx = -110; xx <= 110; xx += 10) { const yy = py + 30 + Math.sin(xx * 0.08 + t * 3) * 4; xx === -110 ? g.moveTo(px + xx, yy) : g.lineTo(px + xx, yy); } g.stroke(); });
  g.restore(); }
// pharmacy jars
export function jars(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < 4; i++) { const jx = -270 + i * 180, h = 160 + (i % 2) * 40; rr(g, jx - 50, -h, 100, h, 20); g.fillStyle = i % 2 ? '#ffffff' : VEL; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, jx - 36, -h - 30, 72, 30, 8); g.fillStyle = INK; g.fill(); glyphLine(g, jx - 38, -h / 2, 76, 16, i * 31 + 5); } g.restore(); }
// an open book (two pages) — content callback per page; flip 0..1 turns a page
export function book(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const W = 420, H = 560;
  g.fillStyle = 'rgba(0,0,0,.18)'; rr(g, -W - 10, -H / 2 + 14, W * 2 + 20, H, 16); g.fill();
  rr(g, -W, -H / 2, W, H, 10); g.fillStyle = VEL; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, 0, -H / 2, W, H, 10); g.fillStyle = VEL; g.fill(); g.stroke(); seg(g, [[0, -H / 2], [0, H / 2]], 6, INK);
  if (o.left) { g.save(); g.translate(-W / 2, 0); o.left(g, W, H); g.restore(); } if (o.right) { g.save(); g.translate(W / 2, 0); o.right(g, W, H); g.restore(); }
  if (o.flip != null && o.flip > 0 && o.flip < 1) { const k = ease.inOut(o.flip), w = W * Math.cos(k * Math.PI); g.fillStyle = shade(VEL, -0.08 * Math.sin(k * Math.PI)); rr(g, Math.min(0, w), -H / 2, Math.abs(w), H, 10); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); }
  g.restore(); }
// closed book (cover) on a surface
export function closedBook(g, x, y, s, rot = -0.08) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -180, -250, 360, 500, 16); g.fillStyle = '#c9b48a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); rr(g, -150, -220, 300, 440, 10); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); for (let i = 0; i < 3; i++) glyph(g, -40 + i * 40, -100, 34, i * 17 + 9); g.restore(); }
// UV lamp sweep revealing a hidden signature on a page
export function uvReveal(g, x, y, w, h, k, t) { rr(g, x - w / 2, y - h / 2, w, h, 12); g.fillStyle = VEL; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); glyphBlock(g, x - w / 2 + 70, y - h / 2 + 70, w - 140, 6, 26, 77, 1);
  const bx = x - w / 2 + w * k; g.save(); g.beginPath(); g.rect(x - w / 2, y - h / 2, w * k, h); g.clip(); g.fillStyle = alpha('#7a4fbf', 0.55); g.fillRect(x - w / 2, y - h / 2, w, h); g.font = 'italic 900 54px "Playfair Display"'; g.fillStyle = ACC; g.textAlign = 'center'; g.fillText('Jacobj à Tepenece', x, y + h / 2 - 60); g.restore();
  rr(g, bx - 30, y - h / 2 - 90, 60, 120, 12); g.fillStyle = INK; g.fill(); g.fillStyle = alpha('#9a6bff', 0.35); g.beginPath(); g.moveTo(bx - 20, y - h / 2 + 30); g.lineTo(bx + 20, y - h / 2 + 30); g.lineTo(bx + 120, y + h / 2); g.lineTo(bx - 120, y + h / 2); g.fill(); }
// magnifying glass over glyphs; cracks=true shows cracked ink
export function magnifier(g, x, y, r, t, o = {}) { g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip(); g.fillStyle = VEL; g.fillRect(x - r, y - r, r * 2, r * 2); g.save(); g.translate(x, y); g.scale(2.6, 2.6); glyph(g, 0, 0, 60, o.seed || 4); g.restore();
  if (o.cracks) { const R = rng(9); for (let i = 0; i < 14; i++) { const a = R() * 6.28, d = R() * r * 0.6; seg(g, [[x + Math.cos(a) * d, y + Math.sin(a) * d], [x + Math.cos(a) * d + (R() - 0.5) * 50, y + Math.sin(a) * d + (R() - 0.5) * 50]], 2, ACC); } } g.restore();
  ring(g, x, y, r, 18, INK); seg(g, [[x + r * 0.7, y + r * 0.7], [x + r * 1.5, y + r * 1.5]], 30, INK); }
// Cardan grille: a card with holes sliding over a table of syllables; words "appear" in the holes
export function grille(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { rr(g, -400 + c * 100, -300 + r * 100, 90, 90, 8); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = MID; g.lineWidth = 3; g.stroke(); glyph(g, -355 + c * 100, -255 + r * 100, 36, r * 8 + c + 1); }
  const ox = Math.round(Math.sin(t * 0.6) * 1.5) * 100, oy = Math.round(Math.cos(t * 0.45)) * 100; g.save(); g.translate(ox, oy); g.fillStyle = alpha(INK, 0.88); g.beginPath(); g.rect(-460, -360, 720, 520); const H = [[-400, -300], [-200, -200], [0, -300], [-300, -100], [100, -100], [-100, 0]]; H.forEach(([hx, hy]) => { g.moveTo(hx, hy); g.lineTo(hx, hy + 90); g.lineTo(hx + 90, hy + 90); g.lineTo(hx + 90, hy); g.closePath(); }); g.fill('evenodd');
  H.forEach(([hx, hy]) => { g.strokeStyle = ACC; g.lineWidth = 6; g.strokeRect(hx, hy, 90, 90); }); g.restore(); g.restore(); }
// Europe map (stylised) with Rome, Prague, New Haven arrow
export const EPIN = { rome: [880, 700], prague: [930, 380], newhaven: [140, 420], arizona: [80, 560], philly: [150, 460] };
export function europeMap(g) { all(g, BG); const land = '#8a8478'; const EU = [[600, 200], [1100, 160], [1400, 260], [1500, 500], [1300, 640], [1120, 620], [1000, 820], [920, 860], [960, 700], [840, 600], [700, 640], [560, 560], [520, 400]];
  poly(g, EU, land); g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = 'round'; g.beginPath(); EU.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); }
// scribe at a desk (silhouette) writing with a quill; hand = 0..4 to vary
export function scribe(g, x, y, s, t, i = 0) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -10, -120, 160, 20, 6); g.fillStyle = MID; g.fill(); seg(g, [[20, -100], [20, 0]], 10, INK); seg(g, [[130, -100], [130, 0]], 10, INK);
  circle(g, -60, -230, 28, INK); seg(g, [[-60, -200], [-50, -110]], 34, INK); seg(g, [[-50, -110], [-10, -60], [-20, 0]], 22, INK); const w = Math.sin(t * 8 + i) * 8; seg(g, [[-55, -180], [10, -140], [40 + w, -128]], 18, INK); seg(g, [[40 + w, -128], [70 + w, -175]], 4, INK);
  g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(76 + w, -182, 7, 18, 0.6, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  rr(g, 10, -136, 110, 14, 3); g.fillStyle = VEL; g.fill(); glyphLine(g, 14, -128, 100, 10, 50 + i * 7, (t * 0.3 + i * 0.2) % 1); g.restore(); }
