// Stick Animation Studio runtime: render.mjs (MIT)
// Renders a project's frames in headless Chromium and encodes them with ffmpeg.
//   node render.mjs --project <dir>                  full video  -> <project>/build/video_silent.mp4
//   node render.mjs --project <dir> --from 30 --to 45 --scale 0.5   preview a range -> build/preview.mp4
//   node render.mjs --project <dir> --sheet          one still per shot + contact sheets -> build/sheets/
//   node render.mjs --project <dir> --stills 3.5,12  stills at given times -> build/stills/
// Options: --workers N  --scale K  --style ID  --debug  --format png|jpeg  --crf 18  --preset medium  --out FILE
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = await loadPlaywright();
async function loadPlaywright() {
  for (const p of [process.env.PLAYWRIGHT_MODULE, 'playwright'].filter(Boolean)) { try { return require(p); } catch {} }
  try { return await import('playwright'); } catch {}
  console.error('Playwright is not installed. Run: cd "' + HERE + '" && npm install'); process.exit(1);
}

const args = {};
for (let a = process.argv.slice(2), i = 0; i < a.length; i++) if (a[i].startsWith('--')) { const k = a[i].slice(2), v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true; args[k] = v; }
if (!args.project) { console.error('usage: node render.mjs --project <project dir> [options]'); process.exit(1); }
const PROJECT = path.resolve(args.project), BUILD = path.join(PROJECT, 'build'); fs.mkdirSync(BUILD, { recursive: true });
const CFG = JSON.parse(fs.readFileSync(path.join(PROJECT, 'config.json'), 'utf8')), FPS = CFG.fps || 24;
const FORMAT = args.format === 'jpeg' ? 'jpeg' : 'png';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

// ---- tiny static server: /engine, /fonts and /player.html from the runtime; /project/* from the project
function scenes(dir, url) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).sort().flatMap((f) => { const p = path.join(dir, f); return fs.statSync(p).isDirectory() ? (f === 'lib' ? [] : scenes(p, `${url}/${f}`)) : f.endsWith('.js') && !f.startsWith('_') ? [`${url}/${f}`] : []; });
}
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/__scenes') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(scenes(path.join(PROJECT, 'scenes'), '/project/scenes'))); }
  const [root, rel] = url.startsWith('/project/') ? [PROJECT, url.slice(9)] : [HERE, url.slice(1)];
  const file = path.resolve(root, rel);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(file).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const LAUNCH = { args: ['--disable-dev-shm-usage', '--font-render-hinting=none'], ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) };

async function openPlayer(browser) {
  const qs = new URLSearchParams(); if (args.scale) qs.set('scale', args.scale); if (args.style) qs.set('style', args.style); if (args.debug) qs.set('debug', '1');
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  page.on('console', (m) => { if (/ERROR|missing/i.test(m.text())) console.log('[page]', m.text()); });
  await page.goto(`${BASE}/player.html?${qs}`);
  await page.waitForFunction('window.READY === true || !!window.BOOT_ERROR', null, { timeout: 120000 });
  const err = await page.evaluate('window.BOOT_ERROR'); if (err) throw new Error('player failed to start: ' + err);
  const [w, h] = await page.evaluate('window.OUT'); await page.setViewportSize({ width: w, height: h });
  return page;
}
const frame = (page, f) => page.evaluate((i) => window.renderFrame(i), f).then(() => page.screenshot({ type: FORMAT, ...(FORMAT === 'jpeg' ? { quality: 94 } : {}) }));
const clock = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;
const ffmpeg = (a, stdin = 'ignore') => spawn('ffmpeg', ['-y', '-v', 'error', ...a], { stdio: [stdin, 'inherit', 'inherit'] });
const done = (p) => new Promise((res, rej) => p.on('close', (c) => (c ? rej(new Error('ffmpeg exited ' + c)) : res())));

async function renderVideo() {
  const b0 = await chromium.launch(LAUNCH), p0 = await openPlayer(b0);
  const total = await p0.evaluate('window.TOTAL_FRAMES'), missing = (await p0.evaluate('window.SHOT_LIST')).filter((s) => !s.ok);
  if (missing.length) console.log(`WARNING: ${missing.length} shot(s) have no scene: ${missing.slice(0, 12).map((s) => s.id).join(', ')}`);
  await b0.close();
  const f0 = Math.max(0, Math.round((+args.from || 0) * FPS)), f1 = Math.min(total, args.to ? Math.round(+args.to * FPS) : total), n = f1 - f0;
  const workers = Math.max(1, Math.min(+(args.workers || Math.max(1, Math.min(8, Math.floor(os.cpus().length / 2)))), Math.ceil(n / 24)));
  const parts = path.join(BUILD, 'parts'); fs.rmSync(parts, { recursive: true, force: true }); fs.mkdirSync(parts, { recursive: true });
  const per = Math.ceil(n / workers), t0 = Date.now(), errs = new Set(); let count = 0;
  console.log(`Rendering ${n} frames (${(n / FPS).toFixed(1)} s) with ${workers} worker(s)…`);
  const work = async (k) => {
    const a = f0 + k * per, b = Math.min(f1, a + per); if (a >= b) return null;
    const browser = await chromium.launch(LAUNCH), page = await openPlayer(browser), out = path.join(parts, `part_${String(k).padStart(3, '0')}.mp4`);
    const enc = ffmpeg(['-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', args.preset || 'medium', '-crf', String(args.crf || 18), '-pix_fmt', 'yuv420p', '-r', String(FPS), out], 'pipe');
    for (let f = a; f < b; f++) {
      const img = await frame(page, f); if (!enc.stdin.write(img)) await new Promise((r) => enc.stdin.once('drain', r));
      if (++count % 48 === 0) { const el = (Date.now() - t0) / 1000; console.log(`  ${count}/${n} frames  ${(count / el).toFixed(2)} fps  elapsed ${clock(el)}  eta ${clock((el / count) * (n - count))}`); }
    }
    (await page.evaluate('window.ERRORS')).forEach((e) => errs.add(e));
    enc.stdin.end(); await done(enc); await browser.close(); return out;
  };
  const files = (await Promise.all([...Array(workers)].map((_, k) => work(k)))).filter(Boolean);
  const list = path.join(parts, 'list.txt'); fs.writeFileSync(list, files.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'));
  const out = path.resolve(args.out || path.join(BUILD, args.from || args.to ? 'preview.mp4' : 'video_silent.mp4'));
  await done(ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]));
  if (errs.size) { console.log(`\n${errs.size} shot error(s):`); [...errs].slice(0, 40).forEach((e) => console.log('  ' + e)); }
  console.log(`\nDone: ${out}  (${clock((Date.now() - t0) / 1000)})`);
}

async function sheet(browser, items, file, cols = 4, cellW = 440) {
  const page = await browser.newPage({ viewport: { width: cols * (cellW + 12) + 12, height: 400 } });
  const cells = items.map((it) => `<div><img src="data:image/${FORMAT};base64,${it.img.toString('base64')}" style="width:${cellW}px;display:block;border-radius:4px"><div style="padding:5px 2px">${it.label.replace(/</g, '&lt;')}</div></div>`).join('');
  await page.setContent(`<body style="margin:0;background:#111;font:600 15px sans-serif;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:12px;padding:12px">${cells}</div></body>`);
  await page.screenshot({ path: file, fullPage: true }); await page.close();
}
async function renderStills() {
  const browser = await chromium.launch(LAUNCH), page = await openPlayer(browser);
  const dir = path.join(BUILD, args.sheet ? 'sheets' : 'stills'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const targets = args.sheet
    ? (await page.evaluate('window.SHOT_LIST')).map((s) => ({ t: s.start + (s.end - s.start) * 0.45, label: `${s.id}  ${s.start.toFixed(1)}s${s.ok ? '' : '  (NO SCENE)'}` }))
    : String(args.stills || '1').split(',').map(Number).map((t) => ({ t, label: `${t}s` }));
  const all = [];
  for (const tg of targets) { const img = await frame(page, Math.round(tg.t * FPS)); fs.writeFileSync(path.join(dir, `${tg.label.split(' ')[0].replace(/[^\w.]/g, '')}_${tg.t.toFixed(2)}.${FORMAT}`), img); all.push({ img, label: tg.label }); }
  (await page.evaluate('window.ERRORS')).forEach((e) => console.log('  shot error:', e));
  for (let i = 0; i < all.length; i += 24) await sheet(browser, all.slice(i, i + 24), path.join(dir, `sheet_${String(i / 24 + 1).padStart(2, '0')}.png`));
  await browser.close(); console.log(`Wrote ${all.length} stills + contact sheet(s) to ${dir}`);
}
try { await (args.sheet || args.stills ? renderStills() : renderVideo()); }
catch (e) { console.error('RENDER FAILED:', e.message); process.exitCode = 1; }
finally { server.close(); }
