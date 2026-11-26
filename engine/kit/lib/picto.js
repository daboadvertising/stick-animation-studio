// picto.js — solid pictogram stick figure (thick rounded limbs, chunky torso, floating round head),
// simple white facial expressions, one signature item. Uses the engine's POSES joint layout, so posesAt/walkPose work.
import { S, seg, circle, ring, rr, poly, shade, ease, clamp } from '/engine/core.js';
import { POSES, face } from '/engine/rig2d.js';

export const CRAWL = { head: [70, -84], sh: [42, -70], hip: [-34, -62], eF: [48, -36], hF: [52, 0], eB: [40, -36], hB: [34, 0], kF: [-22, -2], fF: [-66, -6], kB: [-30, -2], fB: [-74, -4] };
// crawl cycle: hands and knees alternate (phase in radians)
export function crawlPose(ph) {
  const a = Math.sin(ph), b = Math.sin(ph + Math.PI), la = Math.max(0, Math.cos(ph)) * 10, lb = Math.max(0, Math.cos(ph + Math.PI)) * 10;
  const P = JSON.parse(JSON.stringify(CRAWL));
  P.hF = [52 + a * 14, -la]; P.eF = [48 + a * 8, -36 - la * 0.5]; P.hB = [34 + b * 14, -lb]; P.eB = [40 + b * 8, -36 - lb * 0.5];
  P.kF = [-22 + b * 12, -lb * 0.6]; P.fF = [-66 + b * 10, -6 - lb * 0.3]; P.kB = [-30 + a * 12, -la * 0.6]; P.fB = [-74 + a * 10, -4 - la * 0.3];
  const bob = Math.sin(ph * 2) * 3; for (const k of ['head', 'sh', 'hip']) P[k] = [P[k][0], P[k][1] + bob];
  return P;
}
const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// picto(g, {x, y, s, facing, pose, rot, expr, look, blink, face, item:'scarf'|'glasses'|null, prop:'clipboard'|null, t, alpha, shadow, sweat})
export function picto(g, o) {
  const p = o.pose || POSES.stand, s = o.s ?? 1, f = o.facing ?? 1, ink = S().ink, far = shade(ink, 0.22), acc = S().ui.accent;
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  if (o.shadow !== false) { g.fillStyle = 'rgba(0,0,0,.09)'; g.beginPath(); g.ellipse(o.x, o.y + 3, (o.wide ? 80 : 42) * s, 7 * s, 0, 0, Math.PI * 2); g.fill(); }
  g.translate(o.x, o.y); g.scale(f * s, s);
  if (o.rot) { g.translate(p.hip[0], p.hip[1]); g.rotate(o.rot); g.translate(-p.hip[0], -p.hip[1]); }
  const items = [].concat(o.item || [], o.items || []), has = k => items.includes(k);
  const neck = L(p.sh, p.hip, 0.08), arm0 = L(p.sh, p.hip, 0.16), hip0 = L(p.hip, p.sh, 0.04);
  seg(g, [hip0, p.kB, p.fB], 23, far); seg(g, [arm0, p.eB, p.hB], 19, far);
  if (has('dress')) { poly(g, [[p.hip[0] - 16, p.hip[1] - 20], [p.hip[0] + 16, p.hip[1] - 20], [p.hip[0] + 58, 0], [p.hip[0] - 58, 0]], '#5a3a6a'); }
  seg(g, [neck, L(p.hip, p.sh, 0.08)], 35, ink);
  seg(g, [hip0, p.kF, p.fF], 23, ink);
  if (has('vestment')) { const sh = p.sh, hp = p.hip, fl = Math.min(p.fF[1], p.fB[1]); const R_ = [[sh[0] - 22, sh[1] - 2], [sh[0] + 22, sh[1] - 2], [hp[0] + 46, Math.max(hp[1] + 40, fl - 4)], [hp[0] - 46, Math.max(hp[1] + 40, fl - 4)]]; poly(g, R_, '#f4efe4'); g.strokeStyle = ink; g.lineWidth = 6; g.lineJoin = 'round'; g.beginPath(); R_.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke(); if (!has('stripped')) { seg(g, [[sh[0] - 18, sh[1] + 4], [sh[0], sh[1] + 34], [sh[0] + 18, sh[1] + 4]], 9, acc); seg(g, [[sh[0], sh[1] + 34], [sh[0] + (hp[0] - sh[0]) * 1.1, Math.max(hp[1] + 30, fl - 20)]], 9, acc); } }
  if (has('habit')) { const sh = p.sh, hp = p.hip, fl = Math.min(p.fF[1], p.fB[1]); poly(g, [[sh[0] - 20, sh[1]], [sh[0] + 20, sh[1]], [hp[0] + 40, fl - 6], [hp[0] - 40, fl - 6]], ink); seg(g, [[hp[0] - 26, hp[1] - 6], [hp[0] + 26, hp[1] - 6]], 5, '#f4efe4'); }
  seg(g, [arm0, p.eF, p.hF], 19, ink);
  const hP = p.hF;
  if (o.prop === 'hoplon') { const cx = (p.sh[0] + p.hip[0]) / 2 + 18, cy = (p.sh[1] + p.hip[1]) / 2 + 4; seg(g, [[hP[0] - 70, hP[1] + 70], [hP[0] + 90, hP[1] - 120]], 7, ink); poly(g, [[hP[0] + 90, hP[1] - 120], [hP[0] + 78, hP[1] - 96], [hP[0] + 104, hP[1] - 104]], ink); circle(g, cx, cy, 44, acc); ring(g, cx, cy, 44, 7, ink); ring(g, cx, cy, 30, 4, ink); }
  if (o.prop === 'persian') { const cx = (p.sh[0] + p.hip[0]) / 2 + 18, cy = (p.sh[1] + p.hip[1]) / 2 + 6; seg(g, [[hP[0] - 30, hP[1] + 40], [hP[0] + 60, hP[1] - 70]], 6, ink); rr(g, cx - 22, cy - 44, 44, 88, 10); g.fillStyle = '#e9e2d4'; g.fill(); g.strokeStyle = ink; g.lineWidth = 6; g.stroke(); for (let i = 1; i < 4; i++) seg(g, [[cx - 20, cy - 44 + i * 22], [cx + 20, cy - 44 + i * 22]], 3, ink); }
  if (o.prop === 'bow') { g.strokeStyle = ink; g.lineWidth = 6; g.beginPath(); g.arc(hP[0] + 6, hP[1], 52, -1.2, 1.2); g.stroke(); seg(g, [[hP[0] + 6 + Math.cos(-1.2) * 52, hP[1] + Math.sin(-1.2) * 52], [hP[0] + 6 + Math.cos(1.2) * 52, hP[1] + Math.sin(1.2) * 52]], 2, ink); }
  if (o.prop === 'whip') { g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); g.moveTo(hP[0], hP[1]); g.quadraticCurveTo(hP[0] + 60, hP[1] - 90 + Math.sin((o.t || 0) * 12) * 30, hP[0] + 130, hP[1] - 30); g.stroke(); }
  if (o.prop === 'sword') { seg(g, [[hP[0], hP[1]], [hP[0] + 70, hP[1] - 50]], 7, ink); seg(g, [[hP[0] + 2, hP[1] - 14], [hP[0] + 14, hP[1] + 6]], 6, ink); }
  if (o.prop === 'glass') { rr(g, hP[0] - 2, hP[1] - 40, 26, 40, 4); g.fillStyle = 'rgba(255,255,255,.9)'; g.fill(); g.fillStyle = '#8fc4f0'; g.fillRect(hP[0], hP[1] - 26 + (o.drink || 0) * 18, 22, 24 - (o.drink || 0) * 18); g.strokeStyle = ink; g.lineWidth = 3; rr(g, hP[0] - 2, hP[1] - 40, 26, 40, 4); g.stroke(); }
  if (o.prop === 'fruit') { circle(g, hP[0] + 10, hP[1] - 12, 16, acc); seg(g, [[hP[0] + 10, hP[1] - 28], [hP[0] + 16, hP[1] - 36]], 3, ink); if (o.bite) { circle(g, hP[0] + 24, hP[1] - 18, 8 * o.bite, '#f5f2ec'); } }
  if (o.prop === 'phone') { rr(g, hP[0] - 4, hP[1] - 40, 26, 44, 5); g.fillStyle = ink; g.fill(); g.fillStyle = '#ffffff'; g.fillRect(hP[0], hP[1] - 35, 18, 32); }
  if (o.prop === 'scroll') { rr(g, hP[0] - 6, hP[1] - 30, 46, 30, 6); g.fillStyle = '#f1e2bf'; g.fill(); g.strokeStyle = '#8a6a3a'; g.lineWidth = 3; g.stroke(); circle(g, hP[0] - 6, hP[1] - 15, 9, '#c9a46a'); circle(g, hP[0] + 40, hP[1] - 15, 9, '#c9a46a'); }
  if (o.prop === 'hourglass') { const x = hP[0] + 6, y = hP[1] - 30; poly(g, [[x - 16, y - 26], [x + 16, y - 26], [x, y], [x + 16, y + 26], [x - 16, y + 26], [x, y]], '#f4efe4'); seg(g, [[x - 20, y - 28], [x + 20, y - 28]], 5, '#8a6a3a'); seg(g, [[x - 20, y + 28], [x + 20, y + 28]], 5, '#8a6a3a'); poly(g, [[x - 10, y + 24], [x + 10, y + 24], [x, y + 10]], acc); }
  if (o.prop === 'cane') { seg(g, [[hP[0], hP[1]], [hP[0] + 10, hP[1] + 110]], 6, '#8a6a3a'); }
  if (o.prop === 'pistol') { g.fillStyle = '#3a3a3a'; rr(g, hP[0] - 4, hP[1] - 14, 36, 12, 3); g.fill(); rr(g, hP[0] - 6, hP[1] - 10, 12, 22, 3); g.fill(); }
  if (o.prop === 'bottle') { rr(g, hP[0] - 2, hP[1] - 40, 18, 40, 5); g.fillStyle = '#4f7a4a'; g.fill(); g.fillRect(hP[0] + 3, hP[1] - 52, 8, 14); }
  if (o.prop === 'torch') { seg(g, [[hP[0], hP[1] + 20], [hP[0] + 6, hP[1] - 50]], 7, '#6d4a2e'); circle(g, hP[0] + 7, hP[1] - 62, 26, 'rgba(255,190,80,.35)'); g.fillStyle = '#ffb347'; g.beginPath(); g.ellipse(hP[0] + 7, hP[1] - 62, 9, 18, 0, 0, Math.PI * 2); g.fill(); }
  if (o.prop === 'paper') { g.fillStyle = '#f6efe0'; g.fillRect(hP[0] - 6, hP[1] - 44, 40, 50); g.strokeStyle = '#9a8f78'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(hP[0], hP[1] - 34 + i * 10); g.lineTo(hP[0] + 28, hP[1] - 34 + i * 10); g.stroke(); } }
  if (o.prop === 'candle') { g.fillStyle = '#f6efe0'; g.fillRect(hP[0], hP[1] - 30, 10, 30); circle(g, hP[0] + 5, hP[1] - 40, 22, 'rgba(255,200,100,.35)'); g.fillStyle = '#ffb347'; g.beginPath(); g.ellipse(hP[0] + 5, hP[1] - 40, 5, 10, 0, 0, Math.PI * 2); g.fill(); }
  if (o.prop === 'wallet') { rr(g, hP[0] - 6, hP[1] - 26, 40, 28, 5); g.fillStyle = '#6d4a2e'; g.fill(); }
  if (o.prop === 'coin') { circle(g, hP[0] + 8, hP[1] - 10, 13, '#d4a24a'); }
  if (o.prop === 'pen') { seg(g, [[hP[0], hP[1]], [hP[0] + 18, hP[1] - 26]], 5, acc); }
  if (o.prop === 'clipboard') { const h = p.hF; rr(g, h[0] - 4, h[1] - 40, 34, 44, 4); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = ink; g.lineWidth = 4; g.stroke(); seg(g, [[h[0] + 3, h[1] - 26], [h[0] + 23, h[1] - 26]], 3, acc); seg(g, [[h[0] + 3, h[1] - 16], [h[0] + 19, h[1] - 16]], 3, '#bbb'); }
  if (has('scarf')) {
    const n = L(p.sh, p.hip, 0.04), w = Math.sin((o.t || 0) * 9) * 4;
    const dx = p.hip[0] - p.sh[0], dy = p.hip[1] - p.sh[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const px = -uy, py = ux; seg(g, [[n[0] - px * 17, n[1] - py * 17], [n[0] + px * 17, n[1] + py * 17]], 13, acc);
    seg(g, [[n[0] - 8, n[1] + 3], [n[0] - 24, n[1] + 16 + w], [n[0] - 40, n[1] + 26 - w]], 10, acc);
  }
  if (has('tie')) { const n = L(p.sh, p.hip, 0.1), m = L(p.sh, p.hip, 0.55); poly(g, [[n[0] - 7, n[1]], [n[0] + 7, n[1]], [m[0] + 9, m[1]], [m[0], m[1] + 14], [m[0] - 9, m[1]]], '#5c6670'); }
  const hd = [p.head[0] - p.sh[0], p.head[1] - p.sh[1]], hl = Math.hypot(...hd) || 1, hx = p.head[0] + hd[0] / hl * 7, hy = p.head[1] + hd[1] / hl * 7;
  if (has('ponytail')) { g.strokeStyle = ink; g.lineWidth = 15; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx - 14, hy - 14); g.quadraticCurveTo(hx - 46, hy - 8, hx - 40, hy + 26); g.stroke(); }
  circle(g, hx, hy, 25, ink);
  if (has('hair')) { g.fillStyle = ink; g.beginPath(); g.ellipse(hx - 2, hy - 18, 27, 15, -0.15, Math.PI, Math.PI * 2); g.fill(); for (let i = 0; i < 4; i++) poly(g, [[hx - 22 + i * 13, hy - 26], [hx - 14 + i * 13, hy - 46 + (i % 2) * 6], [hx - 6 + i * 13, hy - 28]], ink); }
  if (has('bun')) { circle(g, hx - 18, hy - 22, 13, ink); }
  if (has('tophat')) { g.fillStyle = '#1a1a1a'; g.fillRect(hx - 20, hy - 94, 40, 70); seg(g, [[hx - 34, hy - 24], [hx + 34, hy - 24]], 7, '#1a1a1a'); g.fillStyle = '#6a6a6a'; g.fillRect(hx - 20, hy - 40, 40, 7); }
  if (has('kepi')) { poly(g, [[hx - 24, hy - 14], [hx - 20, hy - 40], [hx + 18, hy - 34], [hx + 24, hy - 14]], '#3b5a8f'); seg(g, [[hx + 6, hy - 14], [hx + 36, hy - 10]], 7, '#141414'); }
  if (has('slouch')) { g.fillStyle = '#3a3a3a'; g.beginPath(); g.ellipse(hx, hy - 20, 44, 9, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(hx, hy - 30, 22, 16, 0, Math.PI, Math.PI * 2); g.fill(); }
  if (has('jawframe')) { g.strokeStyle = '#d9d9d9'; g.lineWidth = 4; g.beginPath(); g.arc(hx, hy + 4, 24, 0.2, Math.PI - 0.2); g.stroke(); seg(g, [[hx - 22, hy + 10], [hx - 26, hy - 20]], 4, '#d9d9d9'); }
  if (has('laurel')) { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.1); g.save(); g.translate(hx + Math.cos(a) * 26, hy + Math.sin(a) * 26); g.rotate(a + 1.2); g.fillStyle = '#d4a24a'; g.beginPath(); g.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
  if (has('nemes')) { poly(g, [[hx - 30, hy - 2], [hx - 27, hy - 30], [hx + 27, hy - 30], [hx + 30, hy - 2], [hx + 18, hy - 12], [hx - 18, hy - 12]], '#d4a24a'); poly(g, [[hx - 31, hy - 4], [hx - 40, hy + 40], [hx - 22, hy + 40], [hx - 16, hy - 6]], '#d4a24a'); for (let i = 0; i < 3; i++) seg(g, [[hx - 24 + i * 16, hy - 28], [hx - 24 + i * 16, hy - 14]], 3, ink); }
  if (has('crown')) { poly(g, [[hx - 22, hy - 18], [hx - 26, hy - 60], [hx - 10, hy - 42], [hx, hy - 66], [hx + 10, hy - 42], [hx + 26, hy - 60], [hx + 22, hy - 18]], '#d4a24a'); }
  if (has('feathers')) { for (let i = -3; i <= 3; i++) seg(g, [[hx + i * 7, hy - 20], [hx + i * 10, hy - 62]], 6, ink); seg(g, [[hx - 27, hy - 16], [hx + 27, hy - 16]], 9, acc); }
  if (has('horns')) { g.fillStyle = ink; g.beginPath(); g.ellipse(hx, hy - 10, 30, 26, 0, Math.PI, Math.PI * 2); g.fill(); seg(g, [[hx - 30, hy - 12], [hx + 30, hy - 12]], 7, acc); for (const sx of [-1, 1]) { g.strokeStyle = ink; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx + sx * 22, hy - 24); g.quadraticCurveTo(hx + sx * 52, hy - 30, hx + sx * 46, hy - 66); g.stroke(); } }
  if (has('crest')) { g.fillStyle = ink; g.beginPath(); g.ellipse(hx, hy - 4, 29, 28, 0, Math.PI, Math.PI * 2); g.fill(); g.fillRect(hx - 29, hy - 6, 12, 30); g.strokeStyle = acc; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.arc(hx - 2, hy - 18, 30, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }
  if (has('mitre')) { const M_ = [[hx - 22, hy - 20], [hx - 20, hy - 62], [hx, hy - 82], [hx + 20, hy - 62], [hx + 22, hy - 20]]; poly(g, M_, '#f4efe4'); g.strokeStyle = ink; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath(); M_.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke(); seg(g, [[hx, hy - 78], [hx, hy - 24]], 6, acc); seg(g, [[hx - 21, hy - 28], [hx + 21, hy - 28]], 6, acc); }
  if (has('cowl')) { g.fillStyle = ink; g.beginPath(); g.ellipse(hx - 4, hy - 2, 33, 33, 0, Math.PI * 0.75, Math.PI * 2.1); g.fill(); }
  if (has('tiara')) { g.fillStyle = ink; g.beginPath(); g.moveTo(hx - 27, hy - 8); g.quadraticCurveTo(hx - 30, hy - 56, hx + 6, hy - 58); g.quadraticCurveTo(hx + 30, hy - 40, hx + 27, hy - 8); g.closePath(); g.fill(); seg(g, [[hx - 26, hy - 14], [hx + 26, hy - 14]], 7, '#ffffff'); g.fillRect(hx - 30, hy - 8, 10, 34); }
  if (o.expr !== null) face(g, hx, hy, 25, { expr: o.expr || 'neutral', color: '#ffffff', blink: o.blink, look: o.look, override: o.face });
  if (has('ponytail')) { /* drawn before head below */ }
  if (has('glasses')) { g.strokeStyle = '#ffffff'; g.lineWidth = 2.6; for (const dx of [-0.26, 0.32]) { g.beginPath(); g.arc(hx + 25 * 0.34 + dx * 25, hy - 25 * 0.16, 7.5, 0, Math.PI * 2); g.stroke(); } }
  if (has('toga')) { const sh = p.sh, hp = p.hip; g.save(); g.lineCap = 'round'; seg(g, [[sh[0] - 4, sh[1] + 2], [hp[0] + 16, hp[1] + 14]], 22, '#f4efe4'); seg(g, [[sh[0] - 4, sh[1] + 2], [hp[0] + 16, hp[1] + 14]], 6, o.trim || '#d8d0c0'); seg(g, [[sh[0] - 14, sh[1] + 4], [sh[0] - 20, sh[1] + 70]], 14, '#f4efe4'); g.restore(); }
  if (has('surgeon')) { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(hx - 1, hy - 8, 27, 22, 0, Math.PI, Math.PI * 2); g.fill(); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); rr(g, hx + 4, hy + 4, 24, 15, 5); g.fill(); g.stroke(); seg(g, [[hx + 4, hy + 8], [hx - 20, hy + 2]], 2, '#ffffff'); }
  if (has('bandage')) { g.save(); g.beginPath(); g.arc(hx, hy, 25.5, 0, Math.PI * 2); g.clip(); g.fillStyle = '#ffffff'; g.fillRect(hx - 30, hy - 18, 60, 11); g.fillRect(hx - 30, hy + 4, 60, 11); g.restore(); }
  if (o.sweat) { const k = ((o.t || 0) * 1.3) % 1; g.fillStyle = '#7fb6e6'; g.globalAlpha *= 1 - k; g.beginPath(); g.ellipse(hx - 30, hy - 10 + k * 26, 4, 7, 0, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// head position in world coordinates (for bubbles)
export function pictoHead(o) { const p = o.pose || POSES.stand, s = o.s ?? 1, f = o.facing ?? 1; return [o.x + p.head[0] * f * s, o.y + (p.head[1] - 7) * s]; }

// big close-up head: shoulders + orange scarf + giant round head with a simple white face
export function bigHead(g, cx, cy, r, o = {}) {
  const ink = S().ink, acc = S().ui.accent;
  g.save(); g.translate(cx, cy); if (o.tilt) g.rotate(o.tilt);
  g.fillStyle = ink; g.beginPath(); g.ellipse(0, r * 1.9, r * 1.35, r * 0.9, 0, Math.PI, Math.PI * 2); g.fill();
  if (o.toga) { g.save(); g.beginPath(); g.ellipse(0, r * 1.9, r * 1.35, r * 0.9, 0, Math.PI, Math.PI * 2); g.clip(); seg(g, [[-r * 1.2, r * 1.2], [r * 0.9, r * 2.6]], r * 0.45, '#f4efe4'); g.restore(); }
  if (o.scarf !== false && !o.toga) { rr(g, -r * 0.75, r * 1.08, r * 1.5, r * 0.3, r * 0.15); g.fillStyle = acc; g.fill(); seg(g, [[-r * 0.35, r * 1.3], [-r * 0.55, r * 1.75 + Math.sin((o.t || 0) * 6) * 6]], r * 0.22, acc); }
  circle(g, 0, 0, r, ink);
  if (o.laurel) for (let i = 0; i < 13; i++) { const a = Math.PI * (1.02 + i * 0.075); g.save(); g.translate(Math.cos(a) * r * 1.02, Math.sin(a) * r * 1.02); g.rotate(a + 1.2); g.fillStyle = '#d4a24a'; g.beginPath(); g.ellipse(0, 0, r * 0.2, r * 0.09, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  face(g, 0, 0, r, { expr: o.expr, color: '#ffffff', blink: o.blink, look: o.look, front: true, override: o.face });
  if (o.sweat) { for (let i = 0; i < 2; i++) { const k = ((o.t || 0) * 1.1 + i * 0.5) % 1; g.save(); g.globalAlpha *= 1 - k; g.fillStyle = '#7fb6e6'; g.beginPath(); g.ellipse((i ? 1 : -1) * r * 1.08, -r * 0.4 + k * r * 0.6, r * 0.06, r * 0.1, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
  g.restore();
}
