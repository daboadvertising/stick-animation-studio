// sets/flat.js — clean & bright flat sets: off-white backgrounds, light-grey shapes, orange accents only where it matters.
import { E, V, S, layer, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, rng } from '/engine/core.js';

export const C = {
  bg: '#f5f2ec', wall: '#efebe3', floor: '#e4dfd4', line: '#d3ccbe', shape: '#dbd4c7', shape2: '#c9c1b2', white: '#ffffff',
  nightWall: '#e3e7ee', nightFloor: '#d3d9e2', nightSky: '#c9d3e2', dawnSky: '#fbe2c4', duskSky: '#f9e6d2', win: '#f7efe0',
};
export const GYf = () => E.H * V(0.8, 0.68);
const fill = (g, col) => { g.fillStyle = col; g.fillRect(-E.W * 2, -E.H * 2, E.W * 6, E.H * 6); };
function ground(g, GY, col, lineCol) { g.fillStyle = col; g.fillRect(-E.W * 2, GY, E.W * 8, E.H * 2); seg(g, [[-E.W * 2, GY], [E.W * 6, GY]], 4, lineCol); }
export const dots = (g, t, col = 'rgba(0,0,0,.06)', seed = 3) => { const r = rng(seed); for (let i = 0; i < 26; i++) { const x = (r() * E.W + t * 10 * (0.3 + r())) % E.W, y = (r() * E.H - t * 6 * r() + E.H) % E.H; circle(g, x, y, 2 + r() * 3, col); } };

// wall calendar: white page, orange header, black marker crosses, orange ring on day 21
export function calendar(g, x, y, w, h, o = {}) {
  const ink = S().ink, acc = S().ui.accent;
  g.save(); g.fillStyle = 'rgba(0,0,0,.08)'; rr(g, x + 10, y + 12, w, h, w * 0.03); g.fill();
  rr(g, x, y, w, h, w * 0.03); g.fillStyle = C.white; g.fill(); g.strokeStyle = C.line; g.lineWidth = Math.max(2, w * 0.005); g.stroke();
  g.fillStyle = acc; rr(g, x, y, w, h * 0.17, w * 0.03); g.fill(); g.fillRect(x, y + h * 0.09, w, h * 0.08);
  for (const fx of [0.25, 0.75]) circle(g, x + w * fx, y + h * 0.02, w * 0.022, ink);
  const px = w * 0.06, top = y + h * 0.24, cw = (w - px * 2) / 7, ch = (h * 0.72) / 3;
  for (let i = 0; i < 21; i++) {
    const cx = x + px + (i % 7) * cw, cy = top + Math.floor(i / 7) * ch;
    g.strokeStyle = '#e2ddd3'; g.lineWidth = Math.max(1, w * 0.003); g.strokeRect(cx, cy, cw, ch);
    text(g, String(i + 1), cx + cw * 0.18, cy + ch * 0.22, { size: ch * 0.24, color: '#555', font: FONTS.ui, weight: 900, align: 'left' });
    const k = clamp01((o.crossed ?? 0) - i);
    if (k > 0) { const m = cw * 0.22, a1 = Math.min(1, k * 2), a2 = Math.max(0, k * 2 - 1);
      seg(g, [[cx + m, cy + m], [cx + m + (cw - 2 * m) * a1, cy + m + (ch - 2 * m) * a1]], cw * 0.08, ink);
      if (a2 > 0) seg(g, [[cx + cw - m, cy + m], [cx + cw - m - (cw - 2 * m) * a2, cy + m + (ch - 2 * m) * a2]], cw * 0.08, ink); }
    if (i === 20 && o.circle > 0) { g.strokeStyle = acc; g.lineWidth = cw * 0.08; g.lineCap = 'round'; g.beginPath(); g.ellipse(cx + cw / 2, cy + ch / 2, cw * 0.6, ch * 0.58, -0.15, -1.2, -1.2 + Math.PI * 2.1 * o.circle); g.stroke(); }
  }
  g.restore();
}
const clamp01 = v => Math.max(0, Math.min(1, v));

// bedroom: window (night = moon, dawn = sun), calendar, shelf, bed
export function bedroom(g, t, cam, o = {}) {
  const night = o.night, GY = GYf(), CX = E.W / 2, wall = night ? C.nightWall : C.wall;
  const win = { x: CX + 60, y: GY - 640, w: 540, h: 440 };
  layer(g, cam, 0.6, (g) => {
    fill(g, wall);
    g.fillStyle = night ? C.nightSky : C.dawnSky; g.fillRect(win.x, win.y, win.w, win.h);
    if (night) { circle(g, win.x + win.w * 0.72, win.y + win.h * 0.3, 34, C.white); }
    else { circle(g, win.x + win.w * 0.27, win.y + win.h * 0.74, 46, S().ui.accent); circle(g, win.x + win.w * 0.27, win.y + win.h * 0.74, 80, alpha(S().ui.accent, 0.15)); }
    const r = rng(4); g.fillStyle = night ? '#b7c2d3' : '#efcfab'; for (let x = win.x; x < win.x + win.w; x += 40 + r() * 30) { const h = 40 + r() * 130; g.fillRect(x, win.y + win.h - h, 36, h); }
    g.strokeStyle = C.white; g.lineWidth = 16; g.strokeRect(win.x, win.y, win.w, win.h);
    seg(g, [[win.x + win.w / 2, win.y], [win.x + win.w / 2, win.y + win.h]], 10, C.white); seg(g, [[win.x, win.y + win.h / 2], [win.x + win.w, win.y + win.h / 2]], 10, C.white);
    if (o.calendar !== false) calendar(g, CX - 640, GY - 600, 340, 240, { crossed: o.crossed ?? 0, circle: o.circle ?? 0 });
    g.fillStyle = C.shape2; g.fillRect(CX - 250, GY - 470, 210, 12);
    for (let i = 0; i < 4; i++) { g.fillStyle = i === 2 ? S().ui.accent : C.shape2; g.fillRect(CX - 240 + i * 46, GY - 470 - 70 - (i % 2) * 14, 34, 70 + (i % 2) * 14); }
  });
  layer(g, cam, 0.9, (g) => ground(g, GY, night ? C.nightFloor : C.floor, C.line));
  const bedX = CX - 700;
  layer(g, cam, 1, (g) => { if (o.bed !== false) { rr(g, bedX, GY - 170, 24, 170, 6); g.fillStyle = C.shape2; g.fill(); rr(g, bedX, GY - 76, 460, 76, 10); g.fill(); rr(g, bedX + 10, GY - 104, 450, 34, 14); g.fillStyle = C.white; g.fill(); g.strokeStyle = C.line; g.lineWidth = 3; g.stroke(); rr(g, bedX + 30, GY - 128, 100, 30, 12); g.fill(); g.stroke(); } });
  return { GY, CX, win, bedX, bedEdge: bedX + 430 };
}

// street: two rows of flat buildings, lamp posts; dusk (warm sky + sun) or night (cool + moon + rain)
export function street(g, t, cam, o = {}) {
  const night = o.night, GY = GYf(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { fill(g, night ? C.nightSky : C.duskSky); if (night) circle(g, CX + 520, GY - 760, 40, C.white); else { circle(g, CX - 420, GY - 470, 70, alpha(S().ui.accent, 0.85)); circle(g, CX - 420, GY - 470, 120, alpha(S().ui.accent, 0.12)); } });
  layer(g, cam, 0.35, (g) => { const r = rng(5); g.fillStyle = night ? '#bcc6d6' : '#efd9c3'; for (let x = -E.W * 2; x < E.W * 5; x += 70 + r() * 60) { const h = 160 + r() * 260; g.fillRect(x, GY - 140 - h, 64 + r() * 40, h + 160); } });
  layer(g, cam, 0.6, (g) => {
    const r = rng(9);
    for (let i = -10; i < 18; i++) { const bx = CX + i * 340 - 160, h = 360 + Math.floor(r() * 4) * 50, col = night ? (i % 2 ? '#a9b4c6' : '#b3bdcd') : (i % 2 ? '#e2d8ca' : '#d9cfc0');
      g.fillStyle = col; g.fillRect(bx, GY - h, 320, h);
      for (let cx = 0; cx < 3; cx++) for (let ry = 0; ry < 3; ry++) { const lit = r() < (night ? 0.45 : 0.15); g.fillStyle = lit ? (night ? '#f5e3b5' : '#f7efe0') : shade(col, -0.08); g.fillRect(bx + 40 + cx * 92, GY - h + 40 + ry * ((h - 120) / 3), 52, (h - 120) / 3 - 30); }
      if (i % 4 === 1) { g.fillStyle = shade(col, -0.18); g.fillRect(bx + 130, GY - 120, 60, 120); } }
  });
  layer(g, cam, 0.9, (g) => { ground(g, GY, night ? C.nightFloor : C.floor, C.line);
    for (let x = -2100; x < 7000; x += 700) { seg(g, [[x, GY], [x, GY - 360], [x + 34, GY - 372]], 7, night ? '#8e98aa' : C.shape2); rr(g, x + 24, GY - 378, 28, 10, 3); g.fillStyle = night ? '#8e98aa' : C.shape2; g.fill();
      if (night) { g.fillStyle = 'rgba(255,236,190,.35)'; g.beginPath(); g.moveTo(x + 30, GY - 368); g.lineTo(x + 46, GY - 368); g.lineTo(x + 140, GY); g.lineTo(x - 64, GY); g.closePath(); g.fill(); circle(g, x + 38, GY - 366, 10, '#fff1c8'); } }
    for (let x = -2000; x < 7000; x += 160) seg(g, [[x, GY + 60], [x + 80, GY + 60]], 5, C.white);
  });
  return { GY, CX };
}
export function rainFlat(g, t, o = {}) { const r = rng(o.seed || 7); g.save(); g.strokeStyle = 'rgba(80,100,130,.28)'; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < (o.count || 120); i++) { const x0 = r() * (E.W + 200) - 100, sp = 1600 * (0.7 + r() * 0.6), y = ((r() * E.H + t * sp) % (E.H + 100)) - 50; g.moveTo(x0 + y * 0.12, y); g.lineTo(x0 + y * 0.12 + 5, y + 36); } g.stroke(); g.restore(); }

// the study curve (automaticity rises fast, then levels off)
export function curve(g, x, y, w, h, p) {
  seg(g, [[x, y], [x, y + h], [x + w, y + h]], 4, '#9a9488');
  const f = u => y + h - h * 0.9 * (1 - Math.exp(-u * 4.2));
  g.strokeStyle = S().ui.accent; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath();
  for (let i = 0; i <= 80 * p; i++) { const u = i / 80; i ? g.lineTo(x + u * w, f(u)) : g.moveTo(x, f(0)); } g.stroke();
  for (let i = 0; i < 12; i++) { const u = (i + 0.5) / 12; if (u > p) break; circle(g, x + u * w, f(u) + Math.sin(i * 7.3) * h * 0.05, 6, S().ink); }
}
// lab: cool light wall, window, shelves, big monitor with the curve, desk
export function lab(g, t, cam, o = {}) {
  const GY = GYf(), CX = E.W / 2, scr = { x: CX + 120, y: GY - 560, w: 600, h: 340 };
  layer(g, cam, 0.6, (g) => {
    fill(g, '#eceff2');
    g.fillStyle = C.nightSky; g.fillRect(CX - 780, GY - 640, 420, 380); const r = rng(12); g.fillStyle = '#b7c2d3'; for (let x = CX - 780; x < CX - 360; x += 50 + r() * 20) { const h = 60 + r() * 180; g.fillRect(x, GY - 260 - h, 44, h); }
    g.strokeStyle = C.white; g.lineWidth = 14; g.strokeRect(CX - 780, GY - 640, 420, 380); seg(g, [[CX - 570, GY - 640], [CX - 570, GY - 260]], 9, C.white);
    for (let s = 0; s < 2; s++) { const sy = GY - 300 - s * 130; g.fillStyle = C.shape2; g.fillRect(CX - 300, sy, 300, 10);
      for (let i = 0; i < 5; i++) { const fx = CX - 280 + i * 58, fh = 40 + ((i + s) % 3) * 16; rr(g, fx, sy - fh, 30, fh, 8); g.fillStyle = (i + s) % 4 === 1 ? S().ui.accent : C.white; g.fill(); g.strokeStyle = '#9a9488'; g.lineWidth = 3; g.stroke(); } }
    rr(g, scr.x - 14, scr.y - 14, scr.w + 28, scr.h + 28, 14); g.fillStyle = '#2b2d31'; g.fill(); g.fillStyle = C.white; g.fillRect(scr.x, scr.y, scr.w, scr.h);
    if (o.screenText) { text(g, o.screenText, scr.x + scr.w / 2, scr.y + scr.h / 2, { size: 60, color: '#444', font: FONTS.ui, weight: 900, spacing: 4 }); } else { text(g, 'HABIT STUDY', scr.x + 30, scr.y + 34, { size: 24, color: '#444', font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    curve(g, scr.x + 40, scr.y + 70, scr.w - 80, scr.h - 110, o.graph ?? 1); }
    seg(g, [[scr.x + scr.w / 2, scr.y + scr.h + 14], [scr.x + scr.w / 2, scr.y + scr.h + 60]], 16, '#2b2d31');
  });
  layer(g, cam, 0.9, (g) => ground(g, GY, '#dde1e6', '#c4cad3'));
  layer(g, cam, 1, (g) => { g.fillStyle = C.shape2; g.fillRect(scr.x - 20, GY - 128, scr.w + 40, 18); g.fillStyle = C.shape; g.fillRect(scr.x - 10, GY - 110, scr.w + 20, 110); for (let i = 1; i < 5; i++) seg(g, [[scr.x - 10 + i * (scr.w + 20) / 5, GY - 100], [scr.x - 10 + i * (scr.w + 20) / 5, GY - 8]], 3, C.shape2); });
  return { GY, CX, scr };
}
// clean infographic board (replaces the blueprint): off-white with a faint grid
export function board(g) { fill(g, '#faf8f4'); g.strokeStyle = '#ece7de'; g.lineWidth = 2; for (let x = 0; x <= E.W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y <= E.H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); } }
// speech bubble with outline (readable on light backgrounds)
export function bubble(g, x, y, o = {}) { const { w = 190, h = 66, str = '', size = 28 } = o; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = C.white; g.fill(); g.strokeStyle = S().ink; g.lineWidth = 4; g.stroke(); poly(g, [[x - w * 0.22, y + h / 2 - 3], [x - w * 0.34, y + h / 2 + 20], [x - w * 0.06, y + h / 2 - 3]], C.white); seg(g, [[x - w * 0.22, y + h / 2 + 1], [x - w * 0.34, y + h / 2 + 20], [x - w * 0.08, y + h / 2 + 1]], 4, S().ink); text(g, str, x, y + 2, { size, color: S().ink, font: FONTS.ui, weight: 900 }); }
// "21 DAYS" signpost; split 0..1 breaks the orange board in two
export function signpost(g, x, GY, o = {}) {
  const bw = 360, bh = 110, by = GY - 430, sp = o.split || 0, fall = sp * sp;
  seg(g, [[x, GY], [x, by + bh + 10]], 16, '#6d675d');
  const half = (side) => { g.save(); const px = x + (side < 0 ? -bw * 0.3 : bw * 0.5), py = by + bh / 2;
    g.translate(px + side * sp * 60, py + fall * 330); g.rotate(side * sp * 0.9); g.translate(-px, -py);
    const cx = x + bw * 0.12, zig = [[cx, by - 6], [cx - 18, by + 28], [cx + 14, by + 56], [cx - 12, by + 84], [cx + 6, by + bh + 6]];
    g.beginPath(); if (side < 0) { g.moveTo(x - bw * 0.55, by - 10); zig.forEach(p => g.lineTo(...p)); g.lineTo(x - bw * 0.55, by + bh + 10); } else { g.moveTo(x + bw, by - 10); zig.forEach(p => g.lineTo(...p)); g.lineTo(x + bw, by + bh + 10); }
    g.closePath(); g.clip();
    poly(g, [[x - bw * 0.5, by], [x + bw * 0.62, by], [x + bw * 0.78, by + bh / 2], [x + bw * 0.62, by + bh], [x - bw * 0.5, by + bh]], S().ui.accent);
    text(g, '21 DAYS', x + bw * 0.06, by + bh / 2 + 2, { size: 56, color: C.white, font: FONTS.ui, weight: 900 }); g.restore(); };
  half(-1); half(1);
}
