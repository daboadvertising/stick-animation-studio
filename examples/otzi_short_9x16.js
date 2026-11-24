// all.js — 46.5 s vertical HOOK Short for "The 5,300-Year-Old Murder: Ötzi the Iceman" (1080x1920, noir). ids s001…s016
import { ease, clamp, lerp, seg, text, rr, circle, poly } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { shot, T } from '../lib/engine.js';
import { picto } from '../lib/picto.js';
import * as AL from '../lib/alps.js';
const ACC = '#f07a1a', INK = '#141414';
const HEAD = { t: 'pill', s: 'ÖTZI · THE ALPS · c. 3300 BC', x: 540, y: 140, at: 0, bg: INK, size: 36 };
const title = (s, at, y, o = {}) => ({ t: 'title', s, at, x: 540, y, col: o.col || INK, size: o.size || 100, maxW: 980 });
const pill = (s, at, y, o = {}) => ({ t: 'pill', s, at, x: o.x ?? 540, y, bg: o.bg || INK, size: o.size || 50 });
const stamp = (s, at, y, o = {}) => ({ t: 'stamp', s, at, x: 540, y, col: ACC, size: o.size || 100, rot: o.rot ?? -0.08 });
const fn = (f) => ({ t: 'fn', f });
const R = (info, v) => (typeof v === 'number' ? v : T(info, v, 0));
const P = (g, x, y, s, pose, o = {}) => picto(g, { x, y, s, pose, items: o.items, prop: o.prop, facing: o.f ?? 1, t: o.t || 0, shadow: false, expr: o.e ?? 'neutral', alpha: o.a });
// portrait mountain scene with the ice gully
const MOUNT = (body = true) => fn((g, t) => { const gy = 1400; const pk = (x, h, w) => { poly(g, [[x - w, gy - 120], [x, gy - 120 - h], [x + w, gy - 120]], '#9a9488'); seg(g, [[x - w, gy - 120], [x, gy - 120 - h], [x + w, gy - 120]], 6, INK); poly(g, [[x - w * 0.3, gy - 120 - h * 0.7], [x, gy - 120 - h], [x + w * 0.3, gy - 120 - h * 0.7]], '#3a3a3a'); }; pk(200, 520, 320); pk(620, 700, 360); pk(980, 540, 320);
  poly(g, [[0, gy], [0, gy - 160], [540, gy - 220], [1080, gy - 160], [1080, gy]], '#d8d0c0'); seg(g, [[0, gy], [1080, gy]], 8, INK); poly(g, [[300, gy - 30], [400, gy - 110], [700, gy - 110], [800, gy - 30]], '#6a6a6a'); if (body) AL.iceBody(g, 560, gy - 70, 0.9, t); });
const XR = (foundAt) => fn((g, t, info) => AL.xray(g, 540, 1000, 1.05, t, { scan: foundAt != null ? clamp(t / 1.6) : null, found: foundAt != null ? clamp((t - R(info, foundAt)) / 0.5) : 0 }));
const LOCK = fn((g, t) => { rr(g, 140, 820, 800, 340, 30); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); g.save(); g.filter = 'blur(14px)'; text(g, '???????', 540, 1020, { size: 90, color: INK }); g.restore(); rr(g, 470, 900, 140, 120, 18); g.fillStyle = INK; g.fill(); g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.arc(540, 898, 42, Math.PI, 0); g.stroke(); circle(g, 540, 960, 14, ACC); });
const S = [
/*s001*/ { set: 'board', fx: [HEAD, MOUNT(true), title('1991', 0.05, 420, { col: ACC, size: 150 }), title('A BODY IN THE ICE', 'w:body', 560, { size: 90 })] },
/*s002*/ { set: 'board', figs: [{ who: 'PLAIN', items: ['hair'], x: 340, y: 1400, s: 1.6, p: 'think', e: 'thinking' }, { who: 'PLAIN', items: ['ponytail'], x: 760, y: 1400, s: 1.5, p: 'think', e: 'worried', f: -1 }], fx: [HEAD, { t: 'bubble', s: 'A CLIMBER? A FEW YEARS AGO?', at: 0.1, x: 540, y: 560, tail: -1, size: 44 }] },
/*s003*/ { set: 'board', fx: [HEAD, stamp('OFF BY 5,000 YEARS', 0.05, 900, { size: 90 })] },
/*s004*/ { set: 'board', fx: [HEAD, fn((g, t) => { const k = ease.inOut(clamp(t / 1.8)); const v = lerp(1991, -3300, k); text(g, k < 0.98 ? String(Math.abs(Math.round(v))) + (v < 0 ? ' BC' : '') : 'c. 3300 BC', 540, 900, { size: 150, color: ACC }); })] },
/*s005*/ { set: 'board', fx: [HEAD, MOUNT(true), fn((g, t) => { for (let i = 0; i < 40; i++) { const x = (i * 97 + t * 60) % 1080, y = (i * 211 + t * 160) % 1400; circle(g, x, y, 5, 'rgba(20,20,20,.6)'); } }), title('FROZE IN A STORM?', 0.1, 420, { size: 100 })] },
/*s006*/ { set: 'board', fx: [HEAD, XR(null), title('THEN… AN X-RAY', 0.05, 360, { size: 100 })] },
/*s007*/ { set: 'board', fx: [HEAD, XR('w:arrowhead'), pill('AN ARROWHEAD', 'w:arrowhead', 360, { bg: ACC, size: 60 })] },
/*s008*/ { set: 'board', fx: [HEAD, fn((g, t) => { AL.archer(g, 260, 1300, 1.6, t, { a: 0.4 }); P(g, 800, 1300, 1.7, POSES.fall, { items: ['hair'], t, e: 'scared' }); }), stamp('SHOT IN THE BACK', 0.05, 520, { size: 100 })] },
/*s009*/ { set: 'board', fx: [HEAD, fn((g, t) => AL.stomach(g, 540, 1000, 1.6, t, { fill: clamp(t / 1) })), title('STOMACH: FULL', 0.05, 380, { size: 110 })] },
/*s010*/ { set: 'board', figs: [{ who: 'PLAIN', items: ['hair'], x: 540, y: 1400, s: 2.2, p: 'sit', e: 'smile' }], fx: [HEAD, title('HE THOUGHT', 0.05, 420, { size: 110 }), title('HE WAS SAFE', 'w:safe', 540, { col: ACC, size: 110 })] },
/*s011*/ { set: 'board', fx: [HEAD, fn((g, t) => AL.hand(g, 540, 1050, 1.6, { cut: 1, heal: clamp(t / 1.5) })), title('A FIGHT,', 0.05, 380, { size: 110 }), title('DAYS EARLIER', 'w:fight', 500, { col: ACC, size: 100 })] },
/*s012*/ { set: 'board', fx: [HEAD, MOUNT(true), LOCK, title('THE STRANGEST CLUE', 0.05, 380, { size: 90 }), pill('LEFT RIGHT NEXT TO THE BODY', 'w:lying', 560, { bg: ACC, size: 40 })] },
/*s013*/ { set: 'board', fx: [HEAD, LOCK, title('NO THIEF WOULD', 0.05, 420, { size: 100 }), title('EVER LEAVE IT', 0.3, 540, { col: ACC, size: 110 })] },
/*s014*/ { set: 'board', fx: [HEAD, LOCK, title('WHAT WAS IT?', 0.02, 460, { size: 120 })] },
/*s015*/ { set: 'board', fx: [HEAD, LOCK, pill('▶ FULL STORY ON THE CHANNEL', 0.1, 1450, { bg: ACC, size: 46 })] },
/*s016*/ { set: 'dark', fx: [{ t: 'title', s: 'WHAT DID THE KILLER LEAVE?', at: 0.05, x: 540, y: 560, col: '#ffffff', size: 84, maxW: 960 }, { t: 'pill', s: '▶  WATCH THE FULL VIDEO', x: 540, y: 900, at: 0.5, bg: ACC, size: 56 }, fn((g, t) => { if (t < 0.9) return; g.save(); g.font = '700 80px Fredoka'; const a = g.measureText('STICK').width, b = g.measureText('SENSE').width; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('STICK', 540 - (a + b) / 2, 1150); g.fillStyle = ACC; g.fillText('SENSE', 540 - (a + b) / 2 + a, 1150); g.restore(); })] },
];
S.forEach((sp, i) => shot('s' + String(i + 1).padStart(3, '0'), sp));
