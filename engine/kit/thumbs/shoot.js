// node shoot.js page.html outDir — screenshots each concept canvas + builds a phone-size feed preview
const path = require('path'); const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), __dirname] }));
(async () => { const [page, out] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 3000 } });
  p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + path.resolve(page)); await p.waitForFunction('window.DONE===true');
  const spec = JSON.parse(fs.readFileSync(page, 'utf8').match(/const SPEC=(\{.*?\});\n/s)[1]); const names = [];
  for (let i = 0; i < spec.concepts.length; i++) { const f = path.join(out, `${'ABCDEF'[i]}_${spec.concepts[i].layout}.png`); await p.locator('#t' + (i + 1)).screenshot({ path: f }); names.push(f); console.log(f); }
  // feed preview at phone size with a duration badge
  const imgs = names.map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64'));
  await p.setContent(`<body style="margin:0;background:#0f0f0f;font:600 13px Arial;color:#fff"><div id=f style="display:flex;gap:14px;padding:14px;width:max-content">${imgs.map((s, i) => `<div style="width:336px"><div style="position:relative"><img src="${s}" style="width:336px;height:189px;border-radius:10px;display:block"><span style="position:absolute;right:6px;bottom:6px;background:#000;padding:1px 4px;border-radius:3px">${spec.duration || '10:00'}</span></div><div style="margin-top:8px">${'ABCDEF'[i]} — ${spec.title || ''}</div></div>`).join('')}</div></body>`);
  await p.locator('#f').screenshot({ path: path.join(out, 'feed_preview_phone-size.png') }); await b.close(); })();
