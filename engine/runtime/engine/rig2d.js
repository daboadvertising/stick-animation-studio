// Stick Animation Studio runtime: rig2d.js (MIT)
// The stick-figure skeleton: named poses, pose blending, idle motion, walk/run cycles, and faces.
// Local space: feet at y = 0, up is -y, the figure faces +x, about 240 units tall at scale 1.
// Joints: head, sh (shoulders), hip, eF/hF near elbow/hand, eB/hB far elbow/hand, kF/fF near knee/foot, kB/fB far knee/foot.
import { E, S, clamp, lerp, mixVal, seg, circle, ring, ease } from './core.js';

// Build a pose from compact numbers: legs default to a relaxed stance unless given.
const STANCE = { hip: [0, -100], kF: [5, -50], fF: [4, 0], kB: [-5, -50], fB: [-10, 0] };
const mk = (o) => ({ ...STANCE, head: [3, -208], sh: [0, -174], ...o });
const ARMS_DOWN = { eF: [8, -137], hF: [12, -101], eB: [-6, -137], hB: [-8, -101] };

export const POSES = {
  stand: mk({ ...ARMS_DOWN }),
  relaxed: mk({ head: [4, -207], sh: [1, -173], eF: [11, -137], hF: [19, -105], eB: [-8, -137], hB: [-13, -104], kF: [7, -50], fF: [10, 0], kB: [-4, -50], fB: [-12, 0] }),
  talk: mk({ head: [5, -208], sh: [1, -174], eF: [21, -133], hF: [41, -147], eB: [-6, -137], hB: [-8, -101] }),
  explain: mk({ head: [5, -208], sh: [1, -174], eF: [23, -135], hF: [45, -155], eB: [15, -135], hB: [33, -147] }),
  point: mk({ head: [5, -208], sh: [1, -174], eF: [33, -171], hF: [67, -173], eB: [-6, -137], hB: [-8, -101], fF: [6, 0], fB: [-12, 0] }),
  pointUp: mk({ head: [4, -209], sh: [1, -174], eF: [17, -205], hF: [21, -245], eB: [-6, -137], hB: [-8, -101] }),
  wave: mk({ head: [4, -209], sh: [1, -174], eF: [27, -195], hF: [35, -235], eB: [-6, -137], hB: [-8, -101] }),
  cheer: mk({ head: [3, -212], sh: [0, -176], eF: [21, -205], hF: [35, -245], eB: [-19, -205], hB: [-31, -245], kF: [9, -50], fF: [15, 0], kB: [-9, -50], fB: [-15, 0] }),
  handsOnHead: mk({ eF: [31, -195], hF: [11, -229], eB: [-27, -195], hB: [-7, -231] }),
  crossArms: mk({ head: [2, -208], eF: [15, -143], hF: [-7, -151], eB: [9, -145], hB: [13, -153], fF: [6, 0], fB: [-12, 0] }),
  think: mk({ head: [6, -206], sh: [1, -173], eF: [23, -149], hF: [15, -191], eB: [15, -135], hB: [5, -141] }),
  shrug: mk({ head: [3, -206], sh: [0, -172], eF: [25, -157], hF: [39, -175], eB: [-23, -157], hB: [-37, -175] }),
  holdFront: mk({ head: [5, -207], sh: [1, -173], eF: [21, -141], hF: [35, -153], eB: [15, -143], hB: [29, -155] }),
  phone: mk({ head: [6, -204], sh: [1, -172], eF: [19, -139], hF: [27, -165], eB: [-6, -137], hB: [-8, -101] }),
  reach: mk({ head: [8, -206], sh: [4, -172], eF: [33, -185], hF: [61, -203], eB: [-5, -137], hB: [-9, -103], kF: [9, -50], fF: [12, 0], fB: [-18, 0] }),
  sad: mk({ head: [12, -193], sh: [6, -167], eF: [9, -133], hF: [11, -99], eB: [-1, -133], hB: [-1, -99] }),
  facepalm: mk({ head: [8, -200], sh: [2, -170], eF: [27, -161], hF: [25, -199], eB: [-6, -137], hB: [-8, -101] }),
  ready: { head: [12, -182], sh: [6, -148], hip: [0, -80], eF: [33, -133], hF: [55, -147], eB: [-25, -133], hB: [-45, -147], kF: [25, -44], fF: [22, 0], kB: [-23, -44], fB: [-24, 0] },
  crouch: { head: [16, -150], sh: [8, -118], hip: [0, -58], eF: [27, -89], hF: [37, -61], eB: [17, -87], hB: [25, -59], kF: [33, -54], fF: [20, 0], kB: [19, -50], fB: [-8, 0] },
  sit: { head: [4, -180], sh: [1, -146], hip: [0, -72], eF: [15, -111], hF: [37, -85], eB: [9, -111], hB: [29, -85], kF: [43, -74], fF: [45, 0], kB: [39, -72], fB: [37, 0] },
  sitBack: { head: [-8, -176], sh: [-6, -144], hip: [0, -72], eF: [2, -109], hF: [25, -87], eB: [-13, -111], hB: [-23, -81], kF: [43, -78], fF: [53, -2], kB: [39, -76], fB: [43, 0] },
  kneel: { head: [10, -168], sh: [5, -134], hip: [0, -62], eF: [23, -101], hF: [37, -77], eB: [-3, -101], hB: [-5, -67], kF: [35, -46], fF: [35, 0], kB: [-5, -4], fB: [-47, 0] },
  lie: mk({ eF: [13, -137], hF: [17, -101], eB: [-11, -139], hB: [-19, -105], kF: [4, -50], fF: [2, 0], kB: [-4, -50], fB: [-6, 0] }), // rotate ±π/2
  dive: { head: [4, -212], sh: [0, -176], hip: [0, -100], eF: [8, -217], hF: [12, -255], eB: [-6, -217], hB: [-4, -253], kF: [8, -52], fF: [10, -2], kB: [-6, -54], fB: [-14, -8] },
  kick: { head: [-4, -206], sh: [-6, -172], hip: [0, -100], eF: [8, -141], hF: [23, -125], eB: [-23, -141], hB: [-41, -129], kF: [35, -78], fF: [65, -70], kB: [-4, -50], fB: [-8, 0] },
  jump: { head: [4, -232], sh: [1, -198], hip: [0, -124], eF: [23, -225], hF: [31, -265], eB: [-17, -225], hB: [-25, -265], kF: [15, -82], fF: [6, -48], kB: [-11, -84], fB: [-21, -50] },
  fall: { head: [-10, -196], sh: [-8, -164], hip: [0, -100], eF: [23, -195], hF: [43, -221], eB: [-33, -185], hB: [-57, -203], kF: [23, -58], fF: [43, -28], kB: [-10, -54], fB: [-6, -8] },
};

export const pose = (name) => (typeof name === 'string' ? POSES[name] || POSES.stand : name || POSES.stand);
export const blendPose = (a, b, k) => mixVal(pose(a), pose(b), ease.inOut(k));
/** posesAt(t, [[time, poseOrName], ...], blend): hold each pose, crossfading over `blend` seconds. */
export function posesAt(t, keys, blend = 0.35) {
  let cur = pose(keys[0][1]);
  for (let i = 1; i < keys.length; i++) {
    const [ti, pi] = keys[i]; if (t < ti) break;
    const k = clamp((t - ti) / blend);
    cur = k >= 1 ? pose(pi) : blendPose(cur, pi, k);
    if (k < 1) break;
  }
  return cur;
}
/** Gentle idle: breathing bob and a little sway on the upper body. */
export function breathe(p, t, amt = 1, seed = 0) {
  const bob = Math.sin(t * 2.1 + seed) * 1.6 * amt, sway = Math.sin(t * 0.85 + seed * 1.7) * 1.2 * amt, q = { ...p };
  for (const [k, m] of [['head', 1.2], ['sh', 0.6], ['eF', 0.6], ['hF', 0.6], ['eB', 0.6], ['hB', 0.6]]) q[k] = [p[k][0] + sway * m, p[k][1] + bob];
  return q;
}
// two-bone solve: where does the middle joint go so both bones keep their length?
function solve(a, b, L1, L2, bend = 1) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.01) || 0.01;
  const ang = Math.atan2(dy, dx) - bend * Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  return [a[0] + Math.cos(ang) * L1, a[1] + Math.sin(ang) * L1];
}
/** walkPose(phase, {run}): a walking or running cycle; phase advances 2π per stride pair. */
export function walkPose(phase, o = {}) {
  const run = !!o.run, stride = run ? 46 : o.stride ?? 26, lift = run ? 34 : o.lift ?? 12, bob = run ? 7 : o.bob ?? 3, swing = run ? 30 : o.arm ?? 16, lean = run ? 14 : o.lean ?? 2;
  const hy = -100 + (run ? 6 : 0) - bob * (1 - Math.abs(Math.sin(phase))) + bob / 2;
  const hip = [0, hy], sh = [lean, hy - 74], head = [lean + 4, hy - 108];
  const foot = (ph) => [stride * Math.sin(ph), -lift * Math.max(0, Math.cos(ph))];
  const fF = foot(phase), fB = foot(phase + Math.PI);
  const hand = (ph) => (run ? [lean + swing * 0.9 * Math.sin(ph) + 6, hy - 46 - 10 * Math.cos(ph)] : [lean / 2 - swing * Math.sin(ph) + 4, hy - 2]);
  const hF = hand(phase + Math.PI), hB = hand(phase);
  const elbow = (h) => (run ? [lerp(sh[0], h[0], 0.5) - 14, lerp(sh[1], h[1], 0.5) + 6] : [lerp(sh[0], h[0], 0.5) - 3, sh[1] + 38]);
  return { head, sh, hip, eF: elbow(hF), hF, eB: elbow(hB), hB, kF: solve(hip, fF, 52, 52), fF, kB: solve(hip, fB, 52, 52), fB };
}

// ----- faces -----
export const EXPR = {
  neutral: { eyes: 'dot', mouth: 'smallSmile' }, happy: { eyes: 'arc', mouth: 'grin' }, joy: { eyes: 'arc', brows: 'up', mouth: 'grin' },
  smile: { eyes: 'dot', mouth: 'smile' }, surprised: { eyes: 'ring', brows: 'up', mouth: 'o' }, shocked: { eyes: 'big', brows: 'up', mouth: 'oBig' },
  scared: { eyes: 'ring', brows: 'worried', mouth: 'wavy' }, worried: { eyes: 'dot', brows: 'worried', mouth: 'wavy' }, nervous: { eyes: 'dot', brows: 'worried', mouth: 'flat', sweat: true },
  angry: { eyes: 'dot', brows: 'angry', mouth: 'flat' }, determined: { eyes: 'dot', brows: 'angry', mouth: 'smallFlat' }, sad: { eyes: 'dot', brows: 'worried', mouth: 'frown' },
  cry: { eyes: 'shut', brows: 'worried', mouth: 'frown', tears: true }, smirk: { eyes: 'dot', mouth: 'smirk' }, sleepy: { eyes: 'shut', mouth: 'flat' },
  thinking: { eyes: 'dot', brows: 'up', mouth: 'smallFlat', look: [0.5, -0.6] }, confused: { eyes: 'dot', brows: 'mixed', mouth: 'wavy' }, awe: { eyes: 'big', brows: 'up', mouth: 'o' },
};
const ALIAS = { happy: 'arc', ring: 'ring', wide: 'big', closed: 'shut', raised: 'up', confused: 'mixed' };
/** face(g, headX, headY, radius, {expr, override, talk, blink, look:[x,y], front, color}) */
export function face(g, hx, hy, r, o = {}) {
  const ex = { ...(EXPR[o.expr] || EXPR.neutral), ...(o.override || {}) };
  const eyes = ALIAS[ex.eyes] || ex.eyes, brows = ALIAS[ex.brows] || ex.brows;
  const col = o.color || S()?.feature || '#fff', ink = S()?.ink || '#141414', look = o.look || ex.look || [0, 0];
  const cx = hx + (o.front ? 0 : r * 0.34), cy = hy - r * 0.08, ey = cy - r * 0.08;
  const xs = o.front ? [cx - r * 0.34, cx + r * 0.34] : [cx - r * 0.26, cx + r * 0.32];
  const arc = (x, y, rad, a0, a1, w) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(x, y, rad, a0, a1); g.stroke(); };
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  xs.forEach((x, i) => {
    const k = o.front || i ? 1 : 0.88;
    if (o.blink || eyes === 'shut') return seg(g, [[x - r * 0.12 * k, ey], [x + r * 0.12 * k, ey]], r * 0.08, col);
    if (eyes === 'arc') return arc(x, ey + r * 0.05, r * 0.13 * k, Math.PI * 1.1, Math.PI * 1.9, r * 0.09);
    if (eyes === 'ring') { ring(g, x, ey, r * 0.2 * k, r * 0.085, col); return circle(g, x + look[0] * r * 0.06, ey + look[1] * r * 0.06, r * 0.075 * k, col); }
    if (eyes === 'big') { circle(g, x, ey, r * 0.2 * k, col); return circle(g, x + look[0] * r * 0.08, ey + look[1] * r * 0.08, r * 0.085 * k, ink); }
    circle(g, x + look[0] * r * 0.05, ey + look[1] * r * 0.05, r * 0.125 * k, col);
  });
  const by = ey - r * 0.3, bw = r * 0.15, line = (x, tilt) => seg(g, [[x - bw, by + tilt], [x + bw, by - tilt]], r * 0.075, col), up = (x) => arc(x, by + r * 0.12, r * 0.15, Math.PI * 1.2, Math.PI * 1.8, r * 0.07);
  if (brows === 'worried') { line(xs[0], -r * 0.06); line(xs[1], r * 0.06); }
  else if (brows === 'angry') { line(xs[0], r * 0.08); line(xs[1], -r * 0.08); }
  else if (brows === 'up') xs.forEach(up);
  else if (brows === 'mixed') { line(xs[0], r * 0.07); up(xs[1]); }
  const mx = cx + (o.front ? 0 : r * 0.04), my = cy + r * 0.42, w = r * 0.085;
  if ((o.talk || 0) > 0.05) { g.fillStyle = col; g.beginPath(); g.ellipse(mx, my, r * 0.16, r * (0.05 + 0.2 * o.talk), 0, 0, 2 * Math.PI); g.fill(); }
  else switch (ex.mouth) {
    case 'grin': g.fillStyle = col; g.beginPath(); g.moveTo(mx - r * 0.3, my - r * 0.06); g.quadraticCurveTo(mx, my + r * 0.42, mx + r * 0.3, my - r * 0.06); g.closePath(); g.fill(); break;
    case 'smile': arc(mx, my - r * 0.2, r * 0.27, 0.35, Math.PI - 0.35, r * 0.09); break;
    case 'smallSmile': arc(mx, my - r * 0.14, r * 0.18, 0.4, Math.PI - 0.4, w); break;
    case 'o': g.fillStyle = col; g.beginPath(); g.ellipse(mx, my, r * 0.11, r * 0.15, 0, 0, 2 * Math.PI); g.fill(); break;
    case 'oBig': ring(g, mx, my + r * 0.04, r * 0.15, r * 0.08, col); break;
    case 'flat': seg(g, [[mx - r * 0.2, my], [mx + r * 0.2, my]], w, col); break;
    case 'smallFlat': seg(g, [[mx - r * 0.12, my], [mx + r * 0.12, my]], w, col); break;
    case 'frown': arc(mx, my + r * 0.2, r * 0.2, Math.PI + 0.5, 2 * Math.PI - 0.5, w); break;
    case 'smirk': g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(mx - r * 0.16, my); g.quadraticCurveTo(mx + r * 0.05, my + r * 0.06, mx + r * 0.22, my - r * 0.1); g.stroke(); break;
    case 'wavy': g.strokeStyle = col; g.lineWidth = w; g.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 16, x = mx - r * 0.24 + u * r * 0.48, y = my + Math.sin(u * 2 * Math.PI) * r * 0.06; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); break;
  }
  if (ex.tears) { g.fillStyle = col; for (const x of xs) { g.beginPath(); g.ellipse(x, ey + r * 0.3, r * 0.05, r * 0.1, 0, 0, 2 * Math.PI); g.fill(); } }
  if (ex.sweat) { g.fillStyle = col; g.beginPath(); g.ellipse(hx - r * 0.6, hy - r * 0.45, r * 0.08, r * 0.13, 0, 0, 2 * Math.PI); g.fill(); }
  g.restore();
}
/** Head centre and radius for a figure drawn with picto-style options. */
export function headPos(o) {
  const p = o.pose || POSES.stand, s = o.s ?? 1, f = o.facing ?? 1; let [x, y] = p.head;
  if (o.rot) { const [hx, hy] = p.hip, c = Math.cos(o.rot), sn = Math.sin(o.rot); [x, y] = [hx + (x - hx) * c - (y - hy) * sn, hy + (x - hx) * sn + (y - hy) * c]; }
  return [o.x + x * f * s, o.y + y * s, 26 * s];
}
