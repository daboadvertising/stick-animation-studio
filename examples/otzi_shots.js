// all.js — 137 hand-designed shots for "The 5,300-Year-Old Murder: Ötzi the Iceman" (16:9, StickSense Noir). ids s001…s137
import { ease, seg, circle, ring, rr, poly, alpha, text, FONTS, lerp, clamp, rng } from '/engine/core.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { shot, T } from '../lib/engine.js';
import { picto } from '../lib/picto.js';
import * as AL from '../lib/alps.js';
const ACC = '#f07a1a', INK = '#141414', GREY = '#6f695e', CREAM = '#f4efe4';
const GY = 864;
// cast
const GK = (x, o = {}) => ({ who: 'PLAIN', x, s: 1.5, e: 'neutral', ...o });
const HIKER = (x, o = {}) => ({ who: 'PLAIN', items: ['hair'], x, s: 1.5, e: 'neutral', ...o });
const ERIKA = (x, o = {}) => ({ who: 'PLAIN', items: ['ponytail'], x, s: 1.45, e: 'neutral', ...o });
const OTZI = (x, o = {}) => ({ who: 'PLAIN', items: ['hair'], x, s: 1.7, e: 'neutral', ...o });
const DET = (x, o = {}) => ({ who: 'PLAIN', items: ['tie'], prop: 'clipboard', x, s: 1.7, e: 'thinking', ...o });
const HOST = (x, o = {}) => ({ who: 'QUIET', x, s: 1.8, e: 'smile', ...o });
// overlays
const lab = (s, at, o = {}) => ({ t: 'label', s, at, y: o.y ?? 140, x: o.x, col: o.col || GREY, size: o.size || 44 });
const pill = (s, at, x, y, o = {}) => ({ t: 'pill', s, at, x, y, bg: o.bg || INK, size: o.size || 40 });
const bub = (s, at, x, y, o = {}) => ({ t: 'bubble', s, at, x, y, tail: o.tail ?? -1, size: o.size || 40 });
const title = (s, at, y = 160, o = {}) => ({ t: 'title', s, at, y, col: o.col || INK, size: o.size || 100, x: o.x, maxW: o.maxW });
const stamp = (s, at, x, y, o = {}) => ({ t: 'stamp', s, at, x, y, col: o.col || ACC, size: o.size || 80, rot: o.rot });
const name = (n, r, at, x = 1400, y = 260) => ({ t: 'name', n, r, at, x, y });
const date = (s, sub, at, x = 1560, y = 220) => ({ t: 'date', s, sub, at, x, y });
const fn = (f) => ({ t: 'fn', f });
const R = (info, v) => (typeof v === 'number' ? v : T(info, v, 0));
const pop = (t, a, d = 0.4) => ease.outBack(clamp((t - a) / d));
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const P = (g, x, y, s, pose, o = {}) => picto(g, { x, y, s, pose, items: o.items, prop: o.prop, facing: o.f ?? 1, t: o.t || 0, shadow: false, expr: o.e ?? 'neutral', alpha: o.a });
const AT = (draw, at = 0, d = 0.4) => fn((g, t, info) => { const k = pop(t, R(info, at), d); if (k > 0) draw(g, t, k, info); });
const XRAY = (o = {}) => fn((g, t, info) => AL.xray(g, o.x ?? 960, o.y ?? 560, o.s ?? 1.0, t, { scan: o.scanAt != null ? (t - R(info, o.scanAt)) / (o.scanDur || 3) : null, found: o.foundAt != null ? clamp((t - R(info, o.foundAt)) / 0.6) : o.found, artery: o.arteryAt != null && t > R(info, o.arteryAt) }));
const MAP = (o = {}) => fn((g, t, info) => AL.alpsMap(g, t, { pins: (o.pins || []).map(([p, a, l, pos]) => [p, (t - R(info, a)) / 0.35, l, pos]), arrows: (o.arrows || []).map(([a, b, at]) => [a, b, (t - R(info, at)) / 1.2]), labels: o.labels }));
const lockCard = (s, y = 540, o = {}) => fn((g, t, info) => { const open = o.openAt != null ? clamp((t - R(info, o.openAt)) / 0.8) : 0; rr(g, 460, y - 170, 1000, 340, 30); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  if (open > 0) { g.save(); g.globalAlpha = open; AL.axe(g, 960, y + 20, 0.75, { rot: -1.2 }); g.restore(); } else { g.save(); g.filter = 'blur(14px)'; text(g, s, 960, y + 30, { size: 90, color: INK }); g.restore(); }
  g.save(); g.globalAlpha = 1 - open; g.translate(0, -open * 60); rr(g, 890, y - 100, 140, 120, 18); g.fillStyle = INK; g.fill(); g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.arc(960, y - 102, 42, Math.PI, 0); g.stroke(); circle(g, 960, y - 40, 14, ACC); g.restore(); });
const SHADOW = (x, o = {}) => fn((g, t, info) => { const xx = o.walk ? lerp(o.walk[0], o.walk[1], ease.inOut(clamp(t / (o.dur || 3)))) : x; AL.archer(g, xx, o.y ?? GY, o.s ?? 1.5, t, { a: o.a ?? 0.35, f: o.f ?? 1 }); });
const snowfall = { snowfall: true };
// evidence board cards: [label, x, y, at, iconFn]
const ICONS = { xray: (g) => AL.xray(g, 0, 0, 0.18, 0, { found: 1 }), axe: (g) => AL.axe(g, 0, 0, 0.38, { rot: -1.0 }), hand: (g) => AL.hand(g, 0, 10, 0.32, { cut: 1 }), meal: (g) => AL.stomach(g, 0, 0, 0.35, 0, {}), bow: (g) => AL.bow(g, 0, 0, 0.25), shaft: (g) => { poly(g, [[0, -40], [14, -6], [0, -12], [-14, -6]], ACC); g.save(); g.setLineDash([8, 8]); seg(g, [[0, -6], [0, 60]], 5, INK); g.restore(); }, q: (g) => text(g, '?', 0, 20, { size: 100, color: ACC }) };
const BOARD = (cards, strings = []) => fn((g, t, info) => { const pos = {}; cards.forEach(([l, x, y, at, ic]) => { pos[l] = [x, y]; const k = pop(t, R(info, at)); if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(((x * 7) % 10 - 5) * 0.01); g.scale(k, k); rr(g, -130, -110, 260, 220, 8); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.save(); g.translate(0, -20); if (ICONS[ic]) ICONS[ic](g); g.restore(); text(g, l, 0, 85, { size: 22, color: INK, font: FONTS.ui, weight: 900 }); circle(g, 0, -100, 10, ACC); g.restore(); });
  strings.forEach(([a, b, at]) => { const k = clamp((t - R(info, at)) / 0.6); if (k <= 0 || !pos[a] || !pos[b]) return; const [x1, y1] = pos[a], [x2, y2] = pos[b]; seg(g, [[x1, y1 - 100], [lerp(x1, x2, k), lerp(y1 - 100, y2 - 100, k)]], 5, ACC); }); });
const EV_ALL = [['THE ARROWHEAD', 420, 330, 0.2, 'xray'], ['THE MISSING SHAFT', 760, 650, 0.4, 'shaft'], ['THE HEALING CUT', 1120, 330, 0.6, 'hand'], ['THE LAST MEAL', 1480, 650, 0.8, 'meal'], ['THE COPPER AXE', 960, 470, 99, 'axe']];
const S = [
// ---------------- cold open
/*000*/ { set: 'alps', so: snowfall, cam: { z: [1.15, 1.0] }, fx: [date('SEPT 1991', 'THE ALPS', 0.2, 960, 300)] },
/*001*/ { set: 'alps', figs: [HIKER(0, { walk: [500, 900, 0, 6] }), ERIKA(0, { walk: [360, 760, 0, 6] })], fx: [pill('THE AUSTRIA–ITALY BORDER', 'w:border', 960, 150, { size: 42 })] },
/*002*/ { set: 'alps', so: { gully: true }, figs: [HIKER(560, { p: 'point', e: 'surprised' }), ERIKA(400, { p: 'handsOnHead', e: 'scared' })], fx: [pill('SOMETHING BROWN IN THE ICE', 'w:brown', 960, 150, { bg: ACC })] },
/*003*/ { set: 'board', fx: [fn((g, t) => { g.fillStyle = '#6a6a6a'; g.fillRect(0, 640, 1920, 440); seg(g, [[0, 640], [1920, 640]], 8, INK); AL.iceBody(g, 1000, 660, 3.2, t); }), title('A HEAD.', 'w:head', 220, { size: 120 }), title('…AND SHOULDERS.', 'w:shoulders', 360, { col: ACC, size: 100 })] },
/*004*/ { set: 'alps', so: { gully: true }, cam: { z: [1.0, 1.25], y: [0, 80] }, fx: [stamp('A HUMAN BODY', 0.1, 960, 220, { size: 100 })] },
/*005*/ { set: 'alps', so: { gully: true }, figs: [HIKER(560, { p: 'think', e: 'thinking' }), ERIKA(400, { p: 'think', e: 'worried' })], fx: [bub('A CLIMBER? AN ACCIDENT?', 0.2, 600, 300, { size: 40 }), pill('A FEW YEARS AGO? A FEW DECADES?', 'w:years', 1350, 160, { size: 36 })] },
/*006*/ { set: 'alps', so: { gully: true }, figs: [HIKER(560, { p: 'holdFront', e: 'neutral' })], fx: [fn((g, t) => AL.camera(g, 660, 640, 0.6, t, 0.7)), pill('A PHOTO. A REPORT.', 0.2, 960, 150)] },
/*007*/ { set: 'board', fx: [fn((g, t, info) => { const k = ease.inOut(clamp((t - 0.3) / 2.2)); text(g, k < 0.98 ? String(Math.round(lerp(1991, -3300, k))).replace('-', '') + (lerp(1991, -3300, k) < 0 ? ' BC' : '') : 'c. 3300 BC', 960, 420, { size: 170, color: ACC }); }), title('WRONG BY 5,000+ YEARS', 0.5, 640, { size: 90 }), lab('…AND THAT’S NOT EVEN THE TWIST', 'w:twist', { y: 820, col: INK, size: 50 })] },
/*008*/ { set: 'board', fx: [XRAY({ x: 760, scanAt: 0.3, scanDur: 4.5 }), date('10 YEARS LATER', 'AN X-RAY', 0.2, 1450, 300), lab('SOMETHING HIDDEN INSIDE', 'w:hidden', { x: 1450, y: 560, col: ACC, size: 46 })] },
/*009*/ { set: 'board', fx: [stamp('ONE OF THE OLDEST MURDER CASES ON EARTH', 'w:murder', 960, 520, { size: 64 })] },
/*010*/ { set: 'alps', so: snowfall, figs: [OTZI(1300, { p: 'stand', e: 'neutral' })], fx: [SHADOW(400, { a: 0.3 }), title('THE KILLER DID SOMETHING STRANGE', 'w:strange', 150, { size: 72 })] },
/*011*/ { set: 'board', fx: [lockCard('???????'), title('NO THIEF WOULD LEAVE THIS', 'w:thief', 170, { size: 86 })] },
/*012*/ { set: 'board', fx: [lockCard('???????'), title('THE BIGGEST CLUE', 'w:clue', 170, { col: ACC, size: 100 }), lab('STICK WITH ME', 0.2, { y: 860, col: INK, size: 50 })] },
// ---------------- discovery & recovery
/*013*/ { set: 'alps', figs: [HIKER(760, { p: 'wave', e: 'smile' }), ERIKA(960, { p: 'wave', e: 'smile' })], fx: [name('HELMUT & ERIKA SIMON', 'HIKERS FROM GERMANY', 'w:helmut', 1450, 200)] },
/*014*/ { set: 'board', fx: [MAP({ pins: [['tisenjoch', 0.3, 'TISENJOCH · 3,200+ M', 'r']], labels: [['austria', 'AUSTRIA'], ['italy', 'ITALY']] }), pill('THE ÖTZTAL ALPS', 'w:otztal', 480, 1000, { bg: ACC })] },
/*015*/ { set: 'board', fx: [stamp('A BIT OF A DISASTER', 'w:disaster', 960, 520, { size: 110 })] },
/*016*/ { set: 'alps', so: { gully: true }, figs: [GK(560, { p: 'shrug', e: 'thinking' }), GK(1380, { p: 'shrug', e: 'thinking', f: -1 })], fx: [title('NOBODY KNEW WHAT THEY HAD', 0.05, 150, { size: 84 })] },
/*017*/ { set: 'alps', so: { gully: true }, figs: [GK(700, { p: 'reach', e: 'determined' }), GK(1260, { p: 'reach', e: 'determined', f: -1 })], fx: [pill('SKI POLES · ICE AXES', 'w:poles', 960, 160, { size: 46 })] },
/*018*/ { set: 'alps', so: { gully: true }, figs: [GK(1200, { p: 'holdFront', e: 'determined', f: -1 })], fx: [fn((g, t) => AL.drill(g, 1080, 740, 0.9, t)), stamp('IT DAMAGED HIS HIP', 'w:damaged', 960, 220, { size: 76 })] },
/*019*/ { set: 'alps', fx: [fn((g, t) => AL.helicopter(g, lerp(-200, 2200, t / 4.8), 330 - Math.sin(t) * 20, 1.0, t)), pill('FLOWN DOWN TO INNSBRUCK', 'w:innsbruck', 960, 900, { bg: ACC, size: 44 })] },
/*020*/ { set: 'board', fx: [AT((g, t, k) => AL.axe(g, 400, 560, 0.9 * k), 0.1), AT((g, t, k) => AL.bow(g, 760, 560, 0.9 * k), 0.3), AT((g, t, k) => AL.quiver(g, 1100, 640, 0.9 * k, t), 0.5), AT((g, t, k) => AL.dagger(g, 1480, 600, 1.2 * k), 0.7), title('…AND THE STRANGE BITS AND PIECES', 0.1, 140, { size: 74 })] },
/*021*/ { set: 'board', fx: [title('THE EXPERTS STOPPED.', 0.05, 520, { size: 120 })] },
/*022*/ { set: 'board', figs: [GK(600, { who: 'OLD', items: ['glasses'], p: 'holdFront', e: 'surprised', s: 1.8 })], fx: [AT((g, t, k) => AL.axe(g, 1000, 560, 1.1 * k), 'w:axe'), name('KONRAD SPINDLER', 'ARCHAEOLOGIST', 'w:konrad', 1450, 220)] },
/*023*/ { set: 'board', figs: [GK(600, { who: 'OLD', items: ['glasses'], p: 'explain', e: 'surprised', s: 1.8 })], fx: [bub('AT LEAST 4,000 YEARS OLD', 0.1, 1000, 300, { size: 50 }), lab('…AND HE WAS BEING CAUTIOUS', 'w:cautious', { y: 980, col: ACC, size: 52 })] },
/*024*/ { set: 'board', fx: [title('c. 3300 BC', 'w:3300', 480, { col: ACC, size: 220 }), lab('RADIOCARBON DATING', 0.2, { y: 680, col: INK, size: 56 })] },
/*025*/ { set: 'board', fx: [fn((g, t) => { seg(g, [[200, 600], [1720, 600]], 8, INK); const M = [['ÖTZI', 'c. 3300 BC', 360, 0.1, true], ['GIZA PYRAMIDS', 'c. 2560 BC', 1000, 'w:pyramids'], ['STONEHENGE’S GREAT STONES', 'c. 2500 BC', 1440, 'w:stonehenge']]; M.forEach(([n, d, x, a, red]) => { const k = pop(t, typeof a === 'number' ? a : 1.5); if (k <= 0) return; circle(g, x, 600, 22 * k, red ? ACC : INK); text(g, n, x, 500, { size: 40, color: red ? ACC : INK, font: FONTS.ui, weight: 900 }); text(g, d, x, 680, { size: 34, color: GREY, font: FONTS.ui, weight: 900 }); }); }), title('OLDER THAN…', 0.05, 170, { size: 100 })] },
/*026*/ { set: 'alps', figs: [OTZI(960, { p: 'stand', e: 'neutral', s: 2 })], fx: [name('ÖTZI', 'NAMED AFTER THE ÖTZTAL VALLEY', 'w:otzi', 1450, 220)] },
/*027*/ { set: 'board', fx: [MAP({ pins: [['tisenjoch', 0, null]], labels: [['austria', 'AUSTRIA'], ['italy', 'ITALY']] }), pill('WHOSE BODY WAS IT?', 'w:whose', 960, 150, { bg: ACC, size: 50 })] },
/*028*/ { set: 'board', figs: [GK(400, { p: 'point', e: 'thinking', prop: 'clipboard' })], fx: [fn((g, t) => { g.save(); g.setLineDash([24, 16]); seg(g, [[700, 520], [1860, 470]], 8, INK); g.restore(); text(g, 'AUSTRIA', 1300, 380, { size: 50, color: GREY, font: FONTS.ui, weight: 900 }); text(g, 'ITALY', 1300, 700, { size: 50, color: GREY, font: FONTS.ui, weight: 900 }); }), lab('SURVEYORS MEASURED EXACTLY', 0.2, { y: 140, col: INK, size: 48 })] },
/*029*/ { set: 'board', fx: [fn((g, t) => { g.save(); g.setLineDash([24, 16]); seg(g, [[200, 420], [1720, 380]], 8, INK); g.restore(); text(g, 'AUSTRIA', 960, 300, { size: 50, color: GREY, font: FONTS.ui, weight: 900 }); text(g, 'ITALY', 960, 900, { size: 50, color: GREY, font: FONTS.ui, weight: 900 }); const k = ease.inOut(clamp((t - 0.4) / 1.2)); seg(g, [[1000, 400], [1000, 400 + 300 * k]], 6, ACC); circle(g, 1000, 700, 20 * pop(t, 1.5), ACC); }), title('92 M INSIDE ITALY', 'w:ninety', 560, { x: 1460, col: ACC, size: 80 })] },
/*030*/ { set: 'board', fx: [MAP({ pins: [['innsbruck', 0, 'INNSBRUCK', 'r'], ['bolzano', 0.6, 'BOLZANO', 'r']], arrows: [['innsbruck', 'bolzano', 0.3]], labels: [['austria', 'AUSTRIA'], ['italy', 'ITALY']] }), pill('AUSTRIA HANDED HIM OVER', 0.2, 960, 150, { size: 46 })] },
/*031*/ { set: 'coldroom', fx: [lab('A COLD ROOM THAT MIMICS THE GLACIER', 0.2, { y: 120, col: INK, size: 48 })] },
// ---------------- subscribe 1
/*032*/ { set: 'board', figs: [HOST(420, { p: 'point', e: 'smile' })], fx: [{ t: 'subscribe', x: 1050, y: 420, at: 'w:subscribe' }, { t: 'logo', x: 1050, y: 640, at: 'w:subscribe', s: 1 }, lab('REAL HISTORY, TOLD LIKE A MYSTERY', 0.2, { y: 880, x: 1050, col: INK, size: 44 })] },
/*033*/ { set: 'board', fx: [fn((g, t) => { g.save(); g.filter = 'blur(12px)'; AL.xray(g, 960, 560, 0.9, t, {}); g.restore(); }), lab('THE X-RAY IS COMING UP…', 0.1, { y: 120, col: INK, size: 52 }), stamp('IT CHANGES EVERYTHING', 'w:changes', 960, 900, { size: 70 })] },
// ---------------- the first story & the gear
/*034*/ { set: 'alps', so: snowfall, fx: [title('THE FIRST STORY', 0.05, 160, { size: 100 })] },
/*035*/ { set: 'alps', so: snowfall, figs: [OTZI(960, { p: [[0, 'stand'], ['w:lay', 'lie']], e: 'sad' })], fx: [title('FROZE TO DEATH?', 'w:froze', 160, { col: ACC, size: 110 })] },
/*036*/ { set: 'alps', so: { gully: true, snowfall: true }, fx: [lab('THE ICE PRESERVED HIM… AND HIS GEAR', 0.1, { y: 140, col: INK, size: 50 })] },
/*037*/ { set: 'board', fx: [title('NOTHING LIKE IT', 0.05, 440, { size: 120 }), title('HAD EVER SURVIVED', 0.3, 590, { col: ACC, size: 110 })] },
/*038*/ { set: 'board', figs: [OTZI(960, { p: 'stand', e: 'neutral', s: 2.2 })], fx: [pill('COAT: SHEEP & GOAT HIDE', 0.2, 500, 420, { size: 36 }), pill('LEGGINGS', 0.6, 500, 700, { size: 36 }), pill('BEARSKIN CAP', 'w:bearskin', 1400, 260, { bg: ACC, size: 36 })] },
/*039*/ { set: 'board', fx: [AT((g, t, k) => { g.save(); g.translate(960, 600); g.scale(k * 2, k * 2); g.fillStyle = '#e9e2d4'; g.beginPath(); g.moveTo(-160, 40); g.quadraticCurveTo(-170, -60, -60, -70); g.lineTo(-40, -140); g.lineTo(60, -140); g.lineTo(80, -40); g.quadraticCurveTo(170, -20, 170, 40); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); for (let i = 0; i < 9; i++) seg(g, [[-30 + i * 10, -130], [-40 + i * 12, -170 - (i % 3) * 10]], 3, ACC); g.restore(); }, 0.1), pill('BEARSKIN SOLES', 0.2, 480, 300, { size: 38 }), pill('DEER-HIDE UPPERS', 'w:deer', 1440, 300, { size: 38 }), pill('GRASS INSIDE FOR WARMTH', 'w:grass', 960, 900, { bg: ACC, size: 40 })] },
/*040*/ { set: 'board', fx: [AT((g, t, k) => AL.dagger(g, 960, 620, 2.2 * k), 0.1), pill('A FLINT DAGGER · WOVEN GRASS SHEATH', 0.3, 960, 160, { size: 42 })] },
/*041*/ { set: 'board', fx: [AT((g, t, k) => AL.emberBox(g, 960, 680, 2.0 * k, t), 0.1), pill('BIRCH-BARK CONTAINERS', 0.2, 960, 160, { size: 44 }), lab('GLOWING EMBERS INSIDE', 'w:embers', { y: 940, col: ACC, size: 52 })] },
/*042*/ { set: 'board', fx: [fn((g, t) => AL.emberBox(g, 960, 680, 2.0, t)), pill('WRAPPED IN MAPLE LEAVES', 0.05, 960, 160, { size: 44 }), lab('TO START A FIRE LATER', 'w:fire', { y: 940, col: ACC, size: 52 })] },
/*043*/ { set: 'board', fx: [AT((g, t, k) => AL.fungus(g, 960, 560, 2.2 * k), 0.1), pill('FUNGUS ON LEATHER STRIPS', 0.2, 960, 200, { size: 44 }), lab('POSSIBLY A KIND OF MEDICINE', 'w:medicine', { y: 840, col: ACC, size: 52 })] },
/*044*/ { set: 'board', fx: [title('NOT SOME RANDOM PERSON', 0.05, 540, { size: 100 })] },
/*045*/ { set: 'board', figs: [OTZI(960, { p: 'crossArms', e: 'determined', s: 2 })], fx: [title('PREPARED FOR THE MOUNTAINS', 0.05, 150, { size: 80 }), stamp('BUT SOME GEAR WAS WEIRD', 'w:weird', 960, 960, { size: 60 })] },
/*046*/ { set: 'board', figs: [OTZI(800, { p: 'stand', e: 'neutral', s: 1.8 })], fx: [fn((g, t) => AL.bow(g, 1100, 560, 1.15)), pill('A YEW LONGBOW', 0.1, 1450, 300), lab('TALLER THAN HE WAS', 'w:taller', { x: 1450, y: 420, col: ACC, size: 46 })] },
/*047*/ { set: 'board', fx: [fn((g, t) => AL.bow(g, 960, 560, 1.3)), stamp('UNFINISHED', 'w:finished', 960, 300, { size: 110 }), lab('NOT EVEN NOTCHED FOR A STRING', 'w:notched', { y: 960, col: INK, size: 50 })] },
/*048*/ { set: 'board', fx: [AT((g, t, k) => AL.quiver(g, 960, 700, 1.6 * k, t), 0.1), title('14 ARROWS', 'w:fourteen', 160, { size: 110 })] },
/*049*/ { set: 'board', fx: [fn((g, t) => AL.quiver(g, 960, 700, 1.6, t)), title('ONLY 2 READY TO SHOOT', 0.05, 160, { col: ACC, size: 96 })] },
/*050*/ { set: 'board', fx: [title('HOLD ON TO THIS QUESTION…', 0.05, 540, { size: 96 })] },
/*051*/ { set: 'alps', figs: [OTZI(800, { p: 'think', e: 'thinking' })], fx: [fn((g, t) => AL.bow(g, 1000, 600, 0.7)), title('WHY CARRY A BOW YOU CAN’T USE?', 0.1, 150, { size: 76 }), fn((g, t) => { if (t > 1.5) text(g, '?', 1250, 460, { size: 200, color: ACC }); })] },
// ---------------- the X-ray
/*052*/ { set: 'board', figs: [GK(1500, { items: ['glasses'], p: 'point', e: 'thinking', f: -1 })], fx: [XRAY({ x: 760, scanAt: 1, scanDur: 5 }), date('2001', 'RADIOLOGIST PAUL GOSTNER', 0.2, 1450, 220)] },
/*053*/ { set: 'board', fx: [XRAY({ x: 960, foundAt: 'w:shape' }), lab('A SMALL SHAPE NOBODY HAD NOTICED', 0.2, { y: 100, col: INK, size: 46 })] },
/*054*/ { set: 'board', fx: [XRAY({ x: 760, found: 1 }), title('A FLINT', 0.05, 420, { x: 1450, size: 110 }), title('ARROWHEAD', 0.2, 560, { x: 1450, col: ACC, size: 110 })] },
/*055*/ { set: 'alps', figs: [OTZI(1200, { p: 'stand', e: 'neutral' })], fx: [SHADOW(500, { a: 0.5 }), stamp('SHOT FROM BEHIND', 0.2, 960, 200, { size: 90 })] },
/*056*/ { set: 'board', fx: [XRAY({ x: 760, found: 1, arteryAt: 'w:artery' }), pill('A MAJOR ARTERY', 'w:artery', 1400, 400, { bg: ACC, size: 50 }), lab('UNDER HIS COLLARBONE', 'w:collarbone', { x: 1400, y: 520, col: INK, size: 44 })] },
/*057*/ { set: 'alps', so: snowfall, figs: [OTZI(960, { p: [[0, 'stand'], [3, 'fall'], [4.5, 'lie']], e: 'scared' })], fx: [title('WITHIN MINUTES', 'w:minutes', 160, { col: ACC, size: 110 }), lab('5,000 YEARS BEFORE HOSPITALS', 'w:hospitals', { y: 280, col: INK, size: 46 })] },
/*058*/ { set: 'board', fx: [title('HE DIDN’T FREEZE.', 0.05, 440, { size: 110 }), title('HE WAS KILLED.', 'w:killed', 600, { col: ACC, size: 130 })] },
/*059*/ { set: 'board', fx: [lab('A DETAIL THAT STILL GIVES ME CHILLS', 0.1, { y: 540, col: INK, size: 60 })] },
/*060*/ { set: 'board', fx: [fn((g, t, info) => { g.save(); g.translate(960, 560); g.scale(3, 3); poly(g, [[0, -40], [14, -6], [0, -12], [-14, -6]], ACC); const k = clamp((t - R(info, 'w:shaft')) / 0.5); g.save(); g.setLineDash([8, 8]); g.globalAlpha = k; seg(g, [[0, -6], [0, 90]], 5, INK); g.restore(); g.restore(); if (k >= 1) text(g, '?', 1150, 760, { size: 160, color: ACC }); }), pill('ARROWHEAD: STILL INSIDE', 0.2, 600, 200), pill('SHAFT: NEVER FOUND', 'w:shaft', 1320, 200, { bg: ACC })] },
/*061*/ { set: 'alps', figs: [OTZI(1100, { p: 'lie', e: 'neutral' })], fx: [SHADOW(0, { walk: [300, 900], dur: 2.5, a: 0.45 }), pill('SOME RESEARCHERS THINK…', 0.1, 960, 150, { size: 44 })] },
/*062*/ { set: 'board', fx: [title('WHY WOULD SOMEONE DO THAT?', 'w:why', 540, { size: 90 }), lab('WE CAN’T BE SURE', 0.1, { y: 700, col: GREY, size: 44 })] },
// ---------------- the last hours
/*063*/ { set: 'board', fx: [stamp('MURDER.', 0.05, 960, 520, { size: 160 })] },
/*064*/ { set: 'board', fx: [title('WHAT HAPPENED IN HIS', 0.05, 440, { size: 96 }), title('LAST HOURS?', 0.3, 590, { col: ACC, size: 130 })] },
/*065*/ { set: 'board', fx: [AT((g, t, k) => AL.tattooBody(g, 960, 660, 1.0 * k, t, { reveal: 0 }), 0.1), lab('HIS BODY CAN TELL US', 0.3, { y: 140, col: INK, size: 56 })] },
/*066*/ { set: 'board', fx: [fn((g, t) => { for (let i = 0; i < 7; i++) { const k = pop(t, 0.2 + i * 0.25); if (k > 0) AL.pollen(g, 300 + i * 220, 560 + Math.sin(i * 1.7) * 120, 70 * k, t, i + 2); } }), name('HOP-HORNBEAM POLLEN', 'A TREE THAT FLOWERS IN SPRING / EARLY SUMMER', 'w:hornbeam', 960, 220)] },
/*067*/ { set: 'board', fx: [pill('HE MOST LIKELY DIED IN SPRING OR EARLY SUMMER', 0.05, 960, 540, { bg: ACC, size: 46 })] },
/*068*/ { set: 'alps', fx: [fn((g, t) => { const k = clamp(t / 7); const PTS = [[200, 820], [500, 760], [760, 840], [1000, 640], [1250, 500], [1500, 640], [1700, 420]]; const n = Math.max(2, Math.ceil(k * PTS.length)); g.save(); g.setLineDash([20, 14]); seg(g, PTS.slice(0, n), 8, ACC); g.restore(); const [x, y] = PTS[n - 1]; P(g, x, y, 0.9, walkPose(t * 6), { items: ['hair'], t }); }), pill('DOWN TO THE VALLEYS… THEN BACK UP', 'w:valleys', 960, 150, { size: 44 })] },
/*069*/ { set: 'alps', fx: [fn((g, t) => { const P = [[200, 820], [500, 760], [760, 840], [1000, 640], [1250, 500], [1500, 640], [1700, 420]]; g.save(); g.setLineDash([20, 14]); seg(g, P, 8, ACC); g.restore(); }), lab('IN HIS FINAL DAY OR TWO', 0.1, { y: 140, col: INK, size: 52 })] },
/*070*/ { set: 'board', fx: [title('HIS LAST MEAL', 0.05, 540, { col: ACC, size: 140 })] },
/*071*/ { set: 'board', fx: [fn((g, t) => AL.stomach(g, 760, 600, 1.6, t, { fill: clamp(t / 4) })), date('2018', 'STOMACH ANALYSIS', 0.2, 1460, 300), stamp('IT WAS FULL', 'w:full', 1460, 640, { size: 80 })] },
/*072*/ { set: 'alps', fx: [AT((g, t, k) => AL.ibex(g, 960, 820, 1.8 * k, t), 0.1), pill('IBEX: A WILD MOUNTAIN GOAT', 0.2, 960, 160, { size: 46 })] },
/*073*/ { set: 'board', fx: [AT((g, t, k) => AL.einkorn(g, 1300, 880, 2.2 * k), 'w:einkorn'), pill('A LOT OF FAT', 'w:fat', 600, 400, { bg: ACC, size: 50 }), pill('EINKORN WHEAT', 'w:einkorn', 1300, 220, { size: 46 }), lab('ONE OF THE EARLIEST FARMED WHEATS', 'w:earliest', { x: 1300, y: 330, col: INK, size: 36 })] },
/*074*/ { set: 'board', fx: [fn((g, t) => AL.stomach(g, 960, 600, 1.6, t, { fill: 1 })), lab('NOT LONG BEFORE HE DIED', 0.1, { y: 120, col: ACC, size: 54 })] },
/*075*/ { set: 'board', figs: [HOST(960, { p: 'think', e: 'thinking', s: 2 })], fx: [title('THINK ABOUT THAT.', 0.05, 170, { size: 100 })] },
/*076*/ { set: 'board', figs: [OTZI(560, { walkInPlace: true, run: true, e: 'scared' }), OTZI(1360, { p: 'sit', e: 'smile' })], fx: [pill('RUNNING FOR YOUR LIFE?', 0.1, 560, 280, { size: 40 }), { t: 'cross', x: 560, y: 600, r: 200, at: 'w:running' }, pill('A BIG, FATTY MEAL', 0.1, 1360, 280, { bg: ACC, size: 40 })] },
/*077*/ { set: 'alps', figs: [OTZI(960, { p: 'sit', e: 'smile', s: 1.8 })], fx: [title('HE THOUGHT HE WAS SAFE', 0.05, 160, { size: 90 }), lab('HE THOUGHT HE’D GOT AWAY…', 'w:away', { y: 280, col: ACC, size: 50 })] },
/*078*/ { set: 'board', fx: [title('FROM WHAT?', 0.05, 440, { col: ACC, size: 150 }), lab('THERE’S ONE MORE INJURY', 'w:injury', { y: 640, col: INK, size: 56 })] },
// ---------------- the hand wound
/*079*/ { set: 'board', fx: [fn((g, t, info) => AL.hand(g, 960, 620, 1.7, { cut: clamp((t - R(info, 'w:cut')) / 0.6) })), lab('HIS RIGHT HAND', 0.1, { y: 120, col: INK, size: 52 })] },
/*080*/ { set: 'board', fx: [fn((g, t) => AL.hand(g, 960, 620, 1.7, { cut: 1 })), pill('ALMOST TO THE BONE', 0.1, 1450, 300, { bg: ACC, size: 46 })] },
/*081*/ { set: 'board', fx: [fn((g, t) => AL.hand(g, 960, 620, 1.7, { cut: 1, heal: clamp(t / 1.5) })), stamp('ALREADY HEALING', 'w:heal', 1450, 300, { size: 70 }), lab('A FEW DAYS OLD', 'w:days', { x: 1450, y: 480, col: INK, size: 50 })] },
/*082*/ { set: 'board', figs: [GK(700, { p: 'reach', e: 'scared' })], fx: [fn((g, t) => AL.dagger(g, 1000, 520, 1.2)), pill('A DEFENSIVE WOUND?', 0.2, 1400, 300, { bg: ACC, size: 50 }), lab('SOME EXPERTS THINK SO', 0.4, { x: 1400, y: 420, col: GREY, size: 40 })] },
/*083*/ { set: 'board', figs: [OTZI(800, { p: [[0, 'kick'], [1, 'crossArms'], [2, 'kick']], e: 'angry' }), GK(1150, { p: [[0, 'point'], [1, 'kick'], [2, 'point']], e: 'angry', f: -1, a: 0.5 })], fx: [title('A FIGHT, A FEW DAYS BEFORE?', 0.05, 160, { size: 84 })] },
/*084*/ { set: 'alps', figs: [OTZI(0, { walk: [400, 1300, 0, 2.8] })], fx: [lab('HE SURVIVED IT… AND CLIMBED UP', 0.1, { y: 140, col: INK, size: 52 })] },
/*085*/ { set: 'alps', figs: [OTZI(1200, { p: [[0, 'sit'], ['w:shot', 'fall']], e: [[0, 'smile'], ['w:shot', 'scared']] })], fx: [SHADOW(450, { a: 0.5 }), stamp('SHOT IN THE BACK', 'w:shot', 960, 200, { size: 90 })] },
/*086*/ { set: 'board', fx: [fn((g, t) => { AL.bow(g, 700, 560, 1.0); AL.quiver(g, 1200, 680, 1.3, t); }), lab('REMEMBER THE UNFINISHED BOW & ARROWS?', 0.1, { y: 120, col: INK, size: 46 })] },
/*087*/ { set: 'board', fx: [fn((g, t) => { AL.bow(g, 700, 560, 1.0); AL.quiver(g, 1200, 680, 1.3, t); }), pill('THEY FIT THIS STORY TOO', 0.1, 960, 980, { bg: ACC, size: 48 })] },
/*088*/ { set: 'alps', figs: [OTZI(900, { p: 'holdFront', e: 'determined' })], fx: [fn((g, t) => AL.bow(g, 1150, 640, 0.6)), pill('WEAPONS LOST IN THE FIGHT?', 'w:lost', 960, 150, { size: 44 }), lab('MAKING NEW ONES ON THE MOVE… OUT OF TIME', 'w:making', { y: 270, col: ACC, size: 42 })] },
/*089*/ { set: 'board', fx: [stamp('A THEORY', 0.05, 960, 440, { size: 110 }), lab('…BUT IT WOULD EXPLAIN A LOT', 0.4, { y: 680, col: INK, size: 52 })] },
// ---------------- who he was
/*090*/ { set: 'board', fx: [fn((g, t) => AL.tattooBody(g, 960, 680, 1.1, t, { reveal: 0 })), title('WHO WAS HE?', 0.05, 160, { size: 110 })] },
/*091*/ { set: 'board', figs: [OTZI(860, { p: 'stand', e: 'neutral', s: 2 })], fx: [fn((g, t) => { seg(g, [[1040, 864], [1040, 864 - 420]], 6, ACC); text(g, '~1.60 M', 1200, 650, { size: 64, color: ACC }); }), pill('ABOUT 45 YEARS OLD', 0.2, 600, 300, { size: 46 })] },
/*092*/ { set: 'board', fx: [fn((g, t) => AL.tattooBody(g, 960, 680, 1.1, t, { reveal: clamp(t / 4) })), pill('60+ TATTOOS', 'w:tattoos', 1450, 300, { bg: ACC, size: 50 }), pill('WORN KNEES & BACK', 0.2, 480, 300, { size: 42 })] },
/*093*/ { set: 'board', fx: [fn((g, t) => AL.tattooBody(g, 960, 680, 1.1, t, { reveal: 1 })), pill('CHARCOAL RUBBED INTO SMALL CUTS', 0.1, 960, 140, { size: 42 }), lab('RIGHT OVER THE PAINFUL JOINTS', 'w:joints', { y: 1010, col: ACC, size: 46 })] },
/*094*/ { set: 'board', fx: [fn((g, t) => AL.tattooBody(g, 960, 680, 1.1, t, { reveal: 1 })), pill('AN EARLY PAIN TREATMENT?', 0.1, 960, 140, { bg: ACC, size: 50 })] },
/*095*/ { set: 'board', fx: [fn((g, t) => AL.dna(g, 520, 560, 1.2, t)), pill('HIS DNA', 0.1, 520, 140, { size: 46 }), title('ANCESTORS: EARLY FARMERS', 'w:farmers', 460, { x: 1300, size: 60 }), lab('ORIGINALLY FROM ANATOLIA (TODAY’S TURKEY)', 'w:anatolia', { x: 1300, y: 580, col: ACC, size: 36 })] },
/*096*/ { set: 'board', figs: [OTZI(700, { p: 'stand', e: 'smile', s: 2, items: [] })], fx: [date('2023', 'GENOME STUDY', 0.1, 1400, 220), pill('DARKER SKIN THAN OLD RECONSTRUCTIONS', 'w:darker', 1350, 500, { size: 34 }), pill('PROBABLY GOING BALD', 'w:bald', 1350, 640, { bg: ACC, size: 40 })] },
/*097*/ { set: 'board', figs: [OTZI(960, { p: 'stand', e: 'neutral', s: 2 })], fx: [title('A REAL PERSON.', 0.05, 170, { size: 100 }), title('SO WHO KILLED HIM?', 'w:killed', 980, { col: ACC, size: 90 })] },
// ---------------- the detective
/*098*/ { set: 'evidence', fx: [date('2016', 'THE MUSEUM CALLS A DETECTIVE', 0.2, 960, 480)] },
/*099*/ { set: 'board', figs: [DET(700)], fx: [name('INSPECTOR ALEXANDER HORN', 'CRIMINAL POLICE, MUNICH', 'w:alexander', 1350, 300), pill('TREATED LIKE ANY COLD CASE', 'w:cold', 1350, 560, { bg: ACC, size: 40 })] },
/*100*/ { set: 'evidence', fx: [BOARD(EV_ALL, [['THE ARROWHEAD', 'THE MISSING SHAFT', 2], ['THE MISSING SHAFT', 'THE HEALING CUT', 2.6], ['THE HEALING CUT', 'THE LAST MEAL', 3.2]]), lab('…THE MYSTERY COMES TOGETHER', 'w:together', { y: 980, col: INK, size: 44 })] },
/*101*/ { set: 'board', figs: [HOST(420, { p: 'point', e: 'smile' })], fx: [{ t: 'subscribe', x: 1050, y: 420, at: 'w:subscribe' }, { t: 'logo', x: 1050, y: 640, at: 'w:subscribe', s: 1 }] },
/*102*/ { set: 'evidence', fx: [BOARD(EV_ALL.slice(0, 4).map((c) => [...c.slice(0, 3), -1, c[4]])), lockCard('???????', 540), lab('THE STRANGEST CLUE IS COMING UP', 0.2, { y: 980, col: ACC, size: 46 })] },
/*103*/ { set: 'board', figs: [DET(960, { p: 'explain', s: 1.9 })], fx: [title('THE DETECTIVE’S READING', 0.05, 170, { size: 90 })] },
/*104*/ { set: 'alps', figs: [OTZI(1400, { p: 'sit', e: 'smile' })], fx: [SHADOW(300, { a: 0.5 }), fn((g, t) => { const k = clamp(t / 2.5); g.save(); g.setLineDash([18, 14]); seg(g, [[420, 690], [lerp(420, 1360, k), lerp(690, 700, k)]], 6, ACC); g.restore(); }), pill('FROM BEHIND · FROM A DISTANCE', 'w:behind', 960, 150, { size: 44 })] },
/*105*/ { set: 'alps', figs: [OTZI(960, { p: 'sit', e: 'smile', s: 1.8 })], fx: [pill('HE DIDN’T SEE IT COMING', 0.1, 960, 150, { size: 44 }), pill('RELAXED', 'w:relaxed', 600, 300, { bg: ACC }), pill('FED', 'w:eaten', 1320, 300, { bg: ACC })] },
/*106*/ { set: 'alps', figs: [OTZI(1450, { p: 'sit', e: 'smile' })], fx: [SHADOW(0, { walk: [-100, 600], dur: 4, a: 0.5 }), lab('FOLLOWED HIM… WAITED… ONE SHOT', 'w:followed', { y: 140, col: INK, size: 50 })] },
/*107*/ { set: 'board', fx: [fn((g, t) => { g.save(); g.translate(960, 560); g.scale(3, 3); poly(g, [[0, -40], [14, -6], [0, -12], [-14, -6]], ACC); g.save(); g.setLineDash([8, 8]); seg(g, [[0, -6], [0, 90]], 5, INK); g.restore(); g.restore(); }), lab('REMEMBER THE MISSING SHAFT?', 0.1, { y: 140, col: INK, size: 54 })] },
/*108*/ { set: 'board', fx: [fn((g, t) => { g.save(); g.translate(960, 560); g.scale(3, 3); poly(g, [[0, -40], [14, -6], [0, -12], [-14, -6]], ACC); g.restore(); }), pill('REMOVING EVIDENCE?', 'w:evidence', 960, 820, { bg: ACC, size: 56 }), lab('AN ARROW COULD BE RECOGNISED', 'w:recognised', { y: 950, col: INK, size: 44 })] },
/*109*/ { set: 'board', fx: [stamp('A THEORY', 0.05, 960, 520, { size: 120 })] },
/*110*/ { set: 'board', fx: [lockCard('???????'), title('THE CLUE THAT MADE IT PERSONAL', 0.05, 160, { size: 80 })] },
// ---------------- the axe
/*111*/ { set: 'board', fx: [lockCard('???????', 540, { openAt: 'w:axe' }), lab('REMEMBER THE AXE?', 0.1, { y: 160, col: ACC, size: 60 })] },
/*112*/ { set: 'alps', so: { gully: true }, fx: [fn((g, t) => AL.axe(g, 1180, 760, 0.5, { rot: -1.3 })), pill('RIGHT NEXT TO THE BODY', 0.1, 960, 150, { bg: ACC, size: 46 })] },
/*113*/ { set: 'board', fx: [AT((g, t, k) => AL.axe(g, 960, 560, 1.6 * k), 0.05), title('NOT JUST ANY AXE', 0.05, 140, { size: 90 })] },
/*114*/ { set: 'board', fx: [fn((g, t) => AL.axe(g, 760, 560, 1.6)), pill('ALMOST PURE COPPER', 'w:copper', 1400, 360, { bg: ACC, size: 46 }), pill('YEW HANDLE', 'w:yew', 1400, 500, { size: 40 }), pill('BIRCH TAR · LEATHER STRIPS', 'w:birch', 1400, 640, { size: 36 })] },
/*115*/ { set: 'board', fx: [fn((g, t) => AL.axe(g, 760, 560, 1.6)), title('RARE.', 'w:rare', 440, { x: 1400, size: 110 }), title('VALUABLE.', 'w:valuable', 580, { x: 1400, col: ACC, size: 110 })] },
/*116*/ { set: 'board', figs: [OTZI(1400, { p: 'cheer', e: 'joy', s: 1.8 })], fx: [fn((g, t) => AL.axe(g, 640, 560, 1.4)), bub('“I’M SOMEBODY IMPORTANT”', 'w:important', 1250, 260, { size: 38 }), lab('A STATUS SYMBOL', 0.1, { y: 120, col: INK, size: 52 })] },
/*117*/ { set: 'board', fx: [MAP({ pins: [['tuscany', 0.2, 'SOUTHERN TUSCANY', 'r'], ['tisenjoch', 1.2, 'WHERE ÖTZI DIED', 'r']], arrows: [['tuscany', 'tisenjoch', 1.0]], labels: [['austria', 'AUSTRIA'], ['italy', 'ITALY']] }), pill('WHERE THE COPPER CAME FROM', 0.2, 600, 1000, { bg: ACC, size: 40 })] },
/*118*/ { set: 'board', figs: [GK(600, { p: 'reach', e: 'smirk' })], fx: [fn((g, t) => AL.axe(g, 1100, 600, 1.2)), { t: 'cross', x: 860, y: 520, r: 220, at: 'w:didnt' }, title('A THIEF WOULD HAVE GRABBED IT', 0.05, 150, { size: 76 }), lab('BUT THE KILLER DIDN’T TAKE IT', 'w:didnt', { y: 980, col: ACC, size: 52 })] },
/*119*/ { set: 'alps', so: { gully: true }, cam: { z: [1.0, 1.2], y: [0, 70] }, fx: [fn((g, t) => AL.axe(g, 1180, 760, 0.5, { rot: -1.3 })), stamp('LEFT BEHIND', 'w:left', 960, 220, { size: 110 })] },
// ---------------- personal
/*120*/ { set: 'board', fx: [stamp('NOT A ROBBERY', 0.05, 960, 520, { size: 130 })] },
/*121*/ { set: 'board', fx: [title('SOMEBODY WANTED HIM DEAD', 0.05, 440, { size: 90 }), title('NOT HIS STUFF', 'w:stuff', 590, { col: ACC, size: 110 })] },
/*122*/ { set: 'evidence', fx: [BOARD([['THE FIGHT?', 960, 480, 0.1, 'hand']])] },
/*123*/ { set: 'evidence', fx: [BOARD([['THE FIGHT?', 500, 480, -1, 'hand'], ['A FEUD?', 960, 480, 'w:feud', 'q'], ['REVENGE?', 1420, 480, 'w:revenge', 'q']], [['THE FIGHT?', 'A FEUD?', 1.5], ['A FEUD?', 'REVENGE?', 3.5]])] },
/*124*/ { set: 'board', fx: [fn((g, t) => AL.axe(g, 760, 560, 1.4)), pill('TOO RECOGNISABLE TO TAKE?', 0.2, 1400, 400, { bg: ACC, size: 44 }), lab('EVERYONE WOULD KNOW WHOSE IT WAS', 'w:everyone', { x: 1400, y: 520, col: INK, size: 36 })] },
/*125*/ { set: 'board', fx: [SHADOW(960, { a: 0.4, s: 2 }), name('???', 'THE KILLER’S NAME · PROBABLY NEVER KNOWN', 0.1, 960, 200)] },
/*126*/ { set: 'coldroom', fx: [title('WE KNOW HIS LAST HOURS', 0.1, 140, { size: 80 }), lab('BETTER THAN ALMOST ANYONE’S FROM 5,000 YEARS AGO', 'w:almost', { y: 990, col: INK, size: 40 })] },
// ---------------- outro
/*127*/ { set: 'board', figs: [HOST(960, { p: 'think', e: 'thinking', s: 2 })], fx: [lab('WHAT STAYS WITH ME…', 0.1, { y: 160, col: GREY, size: 50 })] },
/*128*/ { set: 'alps', so: snowfall, figs: [OTZI(960, { p: 'lie', e: 'sad' })], fx: [title('“A LONELY MAN FROZE TO DEATH”', 0.1, 160, { size: 76 })] },
/*129*/ { set: 'board', fx: [title('SIMPLE.', 0.02, 440, { size: 120 }), title('SAD.', 0.7, 590, { size: 120 })] },
/*130*/ { set: 'board', fx: [stamp('COMPLETELY WRONG.', 0.02, 960, 520, { size: 130 })] },
/*131*/ { set: 'board', fx: [fn((g, t) => { AL.xray(g, 600, 560, 0.6, t, { found: 1 }); if (t > 1.6) AL.stomach(g, 1340, 600, 1.0, t, { fill: 1 }); }), pill('AN X-RAY', 0.1, 600, 1000), pill('A MEAL', 'w:meal', 1340, 1000, { bg: ACC })] },
/*132*/ { set: 'board', fx: [fn((g, t, info) => { AL.hand(g, 600, 600, 1.1, { cut: 1, heal: 1 }); if (t > R(info, 'w:axe')) AL.axe(g, 1340, 560, 1.2); }), pill('A HALF-HEALED CUT', 0.1, 600, 1000), pill('AN AXE NOBODY TOOK', 'w:axe', 1340, 1000, { bg: ACC })] },
/*133*/ { set: 'board', fx: [title('HOW MANY STORIES', 0.05, 440, { size: 100 }), title('HAVE WE GOT WRONG?', 0.4, 590, { col: ACC, size: 110 })] },
/*134*/ { set: 'board', fx: [SHADOW(960, { a: 0.35, s: 1.8 }), title('WHO KILLED ÖTZI? AND WHY?', 0.05, 160, { size: 88 }), pill('TELL ME IN THE COMMENTS · I READ THEM', 'w:comments', 960, 980, { bg: ACC, size: 44 })] },
/*135*/ { set: 'board', figs: [HOST(420, { p: [[0, 'wave'], ['w:subscribe', 'point']], e: 'smile' }), OTZI(1600, { f: -1, p: 'wave', e: 'smile', s: 1.6 })], fx: [lab('MORE REAL HISTORY', 0.1, { y: 160, col: INK, size: 52 }), { t: 'subscribe', x: 1010, y: 440, at: 'w:subscribe' }, { t: 'logo', x: 1010, y: 660, at: 'w:subscribe', s: 1 }] },
/*136*/ { set: 'board', fx: [{ t: 'logo', x: 960, y: 420, at: 0, s: 1.4 }, title('BIG IDEAS. SIMPLE STICKS.', 'w:ideas', 680, { size: 90 })] },
];
S.forEach((sp, i) => shot('s' + String(i + 1).padStart(3, '0'), sp));
