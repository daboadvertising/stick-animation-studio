// Stick Animation Studio runtime: player.js (MIT)
// Loads a project, maps global time to a shot, and draws frames deterministically.
// Exposes window.renderFrame(frameIndex), READY, BOOT_ERROR, ERRORS, DURATION, TOTAL_FRAMES, OUT and SHOT_LIST for render.mjs.
import { E, setStyle, getShot, clamp, ease, prog, text, measure, FONTS, V, S } from './core.js';

const q = new URLSearchParams(location.search);
const errors = (window.ERRORS = []);
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
let main, mg, bufA, bufB, grain = [];

async function loadFonts() {
  const list = [['Fredoka', '600', 'fredoka-600.woff2'], ['Fredoka', '700', 'fredoka-700.woff2'], ['Nunito', '800', 'nunito-800.woff2'], ['Nunito', '900', 'nunito-900.woff2'], ['Playfair Display', '900', 'playfair-900-italic.woff2', 'italic']];
  for (const [family, weight, file, style] of list) {
    try { const f = new FontFace(family, `url(/fonts/${file})`, { weight, style: style || 'normal' }); await f.load(); document.fonts.add(f); }
    catch { console.log('font missing', family, weight); }
  }
}
const getJSON = async (u, fb) => { try { const r = await fetch(u); return r.ok ? await r.json() : fb; } catch { return fb; } };

async function boot() {
  const cfg = await getJSON('/project/config.json', {});
  const story = await getJSON('/project/story/shots.json', null); if (!story) throw new Error('story/shots.json missing');
  const w = await getJSON('/project/timeline/words.json', []);
  const vertical = (cfg.aspect || '16:9') === '9:16';
  const shortSide = { '720p': 720, '1080p': 1080, '1440p': 1440, '2160p': 2160, '4k': 2160 }[cfg.resolution || '1080p'] || 1080;
  const longSide = Math.round((shortSide * 16) / 9 / 2) * 2, scale = +(q.get('scale') || 1);
  const even = (v) => Math.round((v * scale) / 2) * 2;
  const outW = even(vertical ? shortSide : longSide), outH = even(vertical ? longSide : shortSide);
  Object.assign(E, { vertical, W: vertical ? 1080 : 1920, H: vertical ? 1920 : 1080, fps: cfg.fps || 24, cfg, words: w.words || w, shots: story.shots, outW, outH, PX: outW / (vertical ? 1080 : 1920) });
  setStyle(q.get('style') || cfg.style || 'noir');
  await loadFonts();
  main = document.getElementById('main'); main.width = outW; main.height = outH; mg = main.getContext('2d');
  bufA = canvas(outW, outH); bufB = canvas(outW, outH);
  for (let k = 0; k < 3; k++) { // static grain tiles, seeded so every render is identical
    const c = canvas(Math.ceil(outW / 2), Math.ceil(outH / 2)), x = c.getContext('2d'), img = x.createImageData(c.width, c.height); let s = 777 + k * 131;
    for (let i = 0; i < img.data.length; i += 4) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = s >>> 24; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0); grain.push(c);
  }
  for (const f of await getJSON('/__scenes', [])) { try { await import(f); } catch (e) { errors.push(`import ${f}: ${e.message}`); console.log('IMPORT ERROR', f, e.message); } }
  const dur = story.duration || E.shots[E.shots.length - 1].end;
  Object.assign(window, { DURATION: dur, TOTAL_FRAMES: Math.ceil(dur * E.fps), OUT: [outW, outH], SHOT_LIST: E.shots.map((s) => ({ id: s.id, start: s.start, end: s.end, ok: !!getShot(s.id) })), READY: true });
}

function drawShot(buf, shot, lt) {
  const g = buf.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  g.fillStyle = '#000'; g.fillRect(0, 0, buf.width, buf.height); g.setTransform(E.PX, 0, 0, E.PX, 0, 0);
  const def = getShot(shot.id), dur = shot.end - shot.start;
  const info = { ...(shot.params || {}), shot, dur, globalT: shot.start + lt, p: clamp(lt / dur), line: shot.line };
  if (!def) { text(g, `NO SCENE FOR ${shot.id}`, E.W / 2, E.H / 2 - 30, { size: 60, color: '#ff4040' }); text(g, (shot.line || '').slice(0, 80), E.W / 2, E.H / 2 + 50, { size: 30, font: FONTS.ui, weight: 800 }); return; }
  try { g.save(); def.draw(g, lt, info); g.restore(); }
  catch (e) {
    const msg = `${shot.id}@${lt.toFixed(2)}: ${e.message}`; if (errors.length < 200 && !errors.includes(msg)) errors.push(msg); console.log('SHOT ERROR', msg);
    g.setTransform(E.PX, 0, 0, E.PX, 0, 0); text(g, 'ERROR ' + msg.slice(0, 90), E.W / 2, E.H / 2, { size: 34, color: '#ff4040', font: FONTS.ui, weight: 900 });
  }
}

/** Word-by-word captions: groups of up to `max` words, the current word highlighted and popped. */
function captions(g, t, o = {}) {
  const W = E.words; if (!W.length) return;
  const y = o.y ?? V(E.H - 150, E.H * 0.79), size = o.size ?? V(58, 74), max = o.max ?? 4, base = o.color ?? '#ffffff', hi = o.hi ?? S().ui.accent;
  let i = -1; for (let k = W.length - 1; k >= 0; k--) if (t >= W[k].start - 0.05) { if (t <= W[k].end + 0.35) i = k; break; }
  if (i < 0) return;
  const first = i - (i % max), group = W.slice(first, first + max), strs = group.map((w) => w.word.trim().toUpperCase());
  const raw = strs.reduce((a, s) => a + measure(g, s, size), 0) + size * 0.3 * (strs.length - 1);
  const sz = size * Math.min(1, (E.W * 0.88) / raw), gap = sz * 0.3, widths = strs.map((s) => measure(g, s, sz));
  let x = E.W / 2 - (widths.reduce((a, b) => a + b, 0) + gap * (strs.length - 1)) / 2;
  strs.forEach((s, k) => {
    const now = first + k === i, pop = now ? 1 + 0.08 * ease.out(prog(t, group[k].start, group[k].start + 0.12)) : 1;
    g.save(); g.translate(x + widths[k] / 2, y); g.scale(pop, pop); text(g, s, 0, 0, { size: sz, color: now ? hi : base, stroke: sz * 0.16, strokeColor: 'rgba(0,0,0,.85)' }); g.restore();
    x += widths[k] + gap;
  });
}

const BARS = { none: 0, wide: 60, scope: 138, thin: 30 };
const barOf = (s) => { const b = s?.bars ?? E.cfg.bars ?? 'none'; return typeof b === 'number' ? b : (E.vertical ? 0 : BARS[b] ?? 0); };
const shotAt = (t) => { const S_ = E.shots; for (let i = 0; i < S_.length; i++) if (t < S_[i].end) return i; return S_.length - 1; };

window.renderFrame = function (f) {
  const t = f / E.fps, i = shotAt(t), shot = E.shots[i], lt = t - shot.start, W = main.width, H = main.height;
  drawShot(bufA, shot, lt);
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalAlpha = 1; mg.globalCompositeOperation = 'source-over'; mg.filter = 'none';
  const tr = shot.in || { type: 'cut' }, td = tr.dur ?? (tr.type === 'whip' ? 0.35 : 0.5);
  if (tr.type !== 'cut' && i > 0 && lt < td) {
    const prev = E.shots[i - 1], k = ease.inOut(lt / td); drawShot(bufB, prev, t - prev.start);
    switch (tr.type) {
      case 'fade': mg.drawImage(bufB, 0, 0); mg.globalAlpha = k; mg.drawImage(bufA, 0, 0); break;
      case 'dip': case 'dipWhite': mg.drawImage(k < 0.5 ? bufB : bufA, 0, 0); mg.globalAlpha = k < 0.5 ? 2 * k : 2 - 2 * k; mg.fillStyle = tr.type === 'dip' ? '#000' : '#fff'; mg.fillRect(0, 0, W, H); break;
      case 'flash': mg.drawImage(bufA, 0, 0); mg.globalAlpha = (1 - lt / td) ** 2; mg.fillStyle = '#fff'; mg.fillRect(0, 0, W, H); break;
      case 'whip': { const d = tr.dir || 1; mg.drawImage(bufB, -d * k * W, 0); mg.drawImage(bufA, d * (1 - k) * W, 0); break; }
      case 'zoom': { mg.drawImage(bufB, 0, 0); const s = 1.15 - 0.15 * k; mg.globalAlpha = k; mg.translate(W / 2, H / 2); mg.scale(s, s); mg.drawImage(bufA, -W / 2, -H / 2); break; }
      default: mg.drawImage(bufA, 0, 0);
    }
  } else mg.drawImage(bufA, 0, 0);
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalAlpha = 1;
  const gr = E.style.grade || {};
  if (shot.vignette !== false && gr.vignette > 0) { const v = mg.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${gr.vignette})`); mg.fillStyle = v; mg.fillRect(0, 0, W, H); }
  if (gr.grain > 0) { mg.save(); mg.globalAlpha = gr.grain; mg.globalCompositeOperation = 'overlay'; mg.drawImage(grain[f % grain.length], 0, 0, W, H); mg.restore(); }
  mg.setTransform(E.PX, 0, 0, E.PX, 0, 0);
  if (E.cfg.captions && shot.captions !== false) captions(mg, t, E.cfg.captionStyle || {});
  const prevBar = i > 0 ? barOf(E.shots[i - 1]) : barOf(shot), bar = prevBar + (barOf(shot) - prevBar) * ease.inOut(prog(lt, 0, 0.6));
  if (bar > 0) { mg.fillStyle = '#000'; mg.fillRect(0, 0, E.W, bar); mg.fillRect(0, E.H - bar, E.W, bar); }
  const fi = E.cfg.fadeIn ?? 0.5, fo = E.cfg.fadeOut ?? 0.8, fade = Math.max(fi > 0 ? 1 - t / fi : 0, fo > 0 ? 1 - (window.DURATION - t) / fo : 0);
  if (fade > 0) { mg.fillStyle = `rgba(0,0,0,${clamp(fade)})`; mg.fillRect(0, 0, E.W, E.H); }
  if (q.has('debug')) { mg.fillStyle = 'rgba(0,0,0,.6)'; mg.fillRect(0, E.H - 54, E.W, 54); text(mg, `${shot.id}  ${t.toFixed(2)}s  ${(shot.line || '').slice(0, 70)}`, 20, E.H - 27, { size: 26, font: FONTS.ui, weight: 800, align: 'left' }); }
  mg.setTransform(1, 0, 0, 1, 0, 0);
};
boot().catch((e) => { window.BOOT_ERROR = `${e.message}\n${e.stack}`; console.log('BOOT ERROR', e.message); });
