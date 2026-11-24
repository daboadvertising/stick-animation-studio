#!/usr/bin/env python3
"""Stick Animation Studio: one command per step, from voiceover to finished YouTube video (MIT).

Self-contained: the renderer lives in runtime/ (headless Chromium + ffmpeg), the soundtrack builder in audio.py.
Projects live in the workspace: $STICK_WORKSPACE, or ~/stick-studio by default.

  python3 ss.py install                                   # one-time: renderer deps + copy prop libraries + channel profile
  python3 ss.py new  my-topic --voice vo.mp3 --script script.txt [--aspect 16:9|9:16] [--title "..."]
  python3 ss.py preview my-topic [--at 12,40.5]           # contact sheet (every shot) or stills at given seconds
  python3 ss.py render  my-topic                          # final frames + music + SFX + loudness -> deliveries/
  python3 ss.py short   my-topic --lines short_lines.txt  # 60 s 9:16 teaser cut from the same voiceover
  python3 ss.py thumbs  my-topic --spec thumbs.json       # 3 thumbnail concepts + phone-size feed preview
  python3 ss.py status  my-topic                          # what's done, what's next

`new` does transcription + alignment + shot timing + an AUTO-DRAFT of every scene, so `render` works immediately.
Then improve scenes/shots/all.js by hand (or with Claude) and re-run `preview` / `render`.
"""
import argparse, json, os, re, shutil, subprocess, sys, difflib

KIT = os.path.dirname(os.path.abspath(__file__))
RUNTIME = os.path.join(KIT, 'runtime')
STUDIO = os.path.abspath(os.path.expanduser(os.environ.get('STICK_WORKSPACE') or '~/stick-studio'))   # projects/ + kit/lib
DELIVER = os.environ.get('SS_DELIVER') or os.path.join(STUDIO, 'deliveries')

def channel():
    for p in [os.environ.get('SS_CHANNEL'), os.path.join(os.getcwd(), 'channel.json'), os.path.join(KIT, 'channel.json')]:
        if p and os.path.exists(p): return load(p)
    return {'name_left': 'STICK', 'name_right': 'SENSE', 'tagline': 'Big ideas. Simple sticks.', 'accent': '#e8141e'}
def channel_js(c): return ("// channel.js — generated from channel.json by `ss.py install` (edit channel.json, not this file)\nexport const CHANNEL = "
                           + json.dumps({'left': c.get('name_left', 'STICK'), 'right': c.get('name_right', 'SENSE'), 'tagline': c.get('tagline', ''), 'accent': c.get('accent', '#e8141e')}) + ';\n')
def die(m): print('✖ ' + m); sys.exit(1)
def run(cmd, **kw):
    print('  $ ' + ' '.join(map(str, cmd))[:160]); r = subprocess.run(cmd, cwd=STUDIO, **kw)
    if r.returncode: die(f'command failed ({r.returncode})')
    return r
def P(slug, *a): return os.path.join(STUDIO, 'projects', slug, *a)
def load(p): return json.load(open(p))
def save(p, d): json.dump(d, open(p, 'w'), indent=1)
def need_studio():
    os.makedirs(os.path.join(STUDIO, 'projects'), exist_ok=True)
    if subprocess.run(['node', '-e', "require('playwright')"], cwd=RUNTIME, capture_output=True).returncode:
        print('… installing the renderer (one time)'); r = subprocess.run(['npm', 'install', '--silent', '--no-fund', '--no-audit'], cwd=RUNTIME)
        if r.returncode: die('npm install failed in ' + RUNTIME)
def node(*a): return ['node', os.path.join(RUNTIME, 'render.mjs'), *map(str, a)]

# ---------------------------------------------------------------- install
def cmd_install(a):
    need_studio(); dst = os.path.join(STUDIO, 'kit', 'lib'); os.makedirs(dst, exist_ok=True)
    for f in os.listdir(os.path.join(KIT, 'kit', 'lib')): shutil.copy2(os.path.join(KIT, 'kit', 'lib', f), dst)
    for m in ['pocketsphinx', 'scipy']:
        try: __import__(m)
        except ImportError: run([sys.executable, '-m', 'pip', 'install', '-q', m])
    open(os.path.join(dst, 'channel.js'), 'w').write(channel_js(channel())); print('✔ channel profile:', channel().get('name_left', '') + channel().get('name_right', ''))
    print('✔ prop libraries installed in', os.path.join(STUDIO, 'kit', 'lib'))

# ---------------------------------------------------------------- transcription + alignment
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'zero ten twenty thirty forty fifty sixty seventy eighty ninety'.split()
def n2w(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ('' if n % 10 == 0 else ' ' + ONES[n % 10])
    if n < 1000: return ONES[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' ' + n2w(n % 100))
    if 1100 <= n <= 1999 or 2010 <= n <= 2099:  # years
        return n2w(n // 100) + ' ' + ('hundred' if n % 100 == 0 else ('oh ' + ONES[n % 100] if n % 100 < 10 else n2w(n % 100)))
    if n < 1_000_000: return n2w(n // 1000) + ' thousand' + ('' if n % 1000 == 0 else ' ' + n2w(n % 1000))
    return n2w(n // 1_000_000) + ' million' + ('' if n % 1_000_000 == 0 else ' ' + n2w(n % 1_000_000))
ORD = {'one': 'first', 'two': 'second', 'three': 'third', 'five': 'fifth', 'eight': 'eighth', 'nine': 'ninth', 'twelve': 'twelfth'}
def norm(w): return re.sub(r"[^a-z']", '', w.lower().replace('’', "'"))
def spoken(disp):
    core = re.sub(r"[^\w'’%-]", '', disp); m = re.fullmatch(r'(\d[\d,]*)(st|nd|rd|th|s|%)?', core)
    if m:
        ws = n2w(int(m.group(1).replace(',', ''))).split()
        if m.group(2) in ('st', 'nd', 'rd', 'th'): ws[-1] = ORD.get(ws[-1], ws[-1].rstrip('y') + ('ieth' if ws[-1].endswith('y') else 'th'))
        if m.group(2) == '%': ws.append('percent')
        return ws
    return [norm(p) for p in re.split(r'[-–]', core) if norm(p)]
def align(script, asr):
    disp = script.split(); toks = [(s, i) for i, d in enumerate(disp) for s in spoken(d)]
    A = [re.sub(r'\(\d+\)', '', w['w']) for w in asr]; B = [t[0] for t in toks]
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False); tt = [None] * len(B)
    for x, y, n in sm.get_matching_blocks():
        for k in range(n): tt[y + k] = (asr[x + k]['s'], asr[x + k]['e'])
    for op, a1, a2, b1, b2 in sm.get_opcodes():
        if op == 'replace' and a2 > a1:
            s0, e0 = asr[a1]['s'], asr[a2 - 1]['e']
            for k in range(b1, b2): tt[k] = (s0 + (e0 - s0) * (k - b1) / (b2 - b1), s0 + (e0 - s0) * (k - b1 + 1) / (b2 - b1))
    for k in range(len(tt)):
        if tt[k] is None:
            prv = next((tt[j] for j in range(k - 1, -1, -1) if tt[j]), (0, 0)); nxt = next((tt[j] for j in range(k + 1, len(tt)) if tt[j]), (prv[1] + .3, prv[1] + .3))
            tt[k] = (prv[1], max(prv[1] + .05, min(nxt[0], prv[1] + .3)))
    out = []
    for i, d in enumerate(disp):
        ks = [k for k, t in enumerate(toks) if t[1] == i]
        if ks: out.append({'word': d, 'start': round(tt[ks[0]][0], 3), 'end': round(tt[ks[-1]][1], 3)})
    return out, sm.ratio()
def transcribe(voice, script_txt, work):
    raw = os.path.join(work, 'vo16k.raw')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', voice, '-ac', '1', '-ar', '16000', '-f', 's16le', raw], check=True)
    asr_json = os.path.join(work, 'asr.json')
    if not os.path.exists(asr_json):
        print('… transcribing with PocketSphinx (offline; ~1 min per minute of audio)')
        subprocess.run([sys.executable, os.path.join(KIT, 'kit', 'asr_pocketsphinx.py'), raw, asr_json], check=True, stdout=subprocess.DEVNULL)
    words, ratio = align(script_txt, load(asr_json))
    print(f'✔ aligned {len(words)} words to the voiceover (match {ratio:.0%}; above ~85% is good)')
    return words

# ---------------------------------------------------------------- project builder
def probe(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout.strip())
def sentences(words):
    out, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r'[.!?…]["”’)]*$', w['word']): out.append(cur); cur = []
    if cur: out.append(cur)
    return [{'start': c[0]['start'], 'end': c[-1]['end'], 'text': ' '.join(w['word'] for w in c), 'words': c} for c in out]
def beats(words, target=5.0, mx=7.5, mn=2.2):
    """Sentence-based shot cuts: long sentences split at commas / pauses near the target, short ones merged."""
    groups = []
    for sn in sentences(words):
        ws = sn['words']
        while ws and ws[-1]['end'] - ws[0]['start'] > mx:
            best, score = None, 1e9
            for i in range(1, len(ws)):
                d = ws[i - 1]['end'] - ws[0]['start']
                if d < mn: continue
                if ws[-1]['end'] - ws[i]['start'] < mn: break
                sc = abs(d - target) - (1.5 if re.search(r'[,;:—–-]$', ws[i - 1]['word']) else 0) - 4 * max(0, ws[i]['start'] - ws[i - 1]['end'])
                if sc < score: best, score = i, sc
            if best is None: break
            groups.append(ws[:best]); ws = ws[best:]
        if ws: groups.append(ws)
    merged = []
    for g in groups:
        if merged and (g[-1]['end'] - g[0]['start'] < mn or merged[-1][-1]['end'] - merged[-1][0]['start'] < mn) and g[-1]['end'] - merged[-1][0]['start'] <= mx: merged[-1] = merged[-1] + g
        else: merged.append(g)
    return merged
def make_project(slug, voice, words, aspect, style, title, captions):
    root = P(slug)
    for d in ['input', 'timeline', 'story', 'scenes/shots', 'build', 'out']: os.makedirs(os.path.join(root, d), exist_ok=True)
    ext = os.path.splitext(voice)[1].lower() or '.mp3'; shutil.copy2(voice, os.path.join(root, 'input', 'voiceover' + ext))
    vdur = probe(voice); total = round(max(vdur + 0.6, words[-1]['end'] + 1.5 if words else vdur), 3)
    save(os.path.join(root, 'config.json'), {'title': title, 'aspect': aspect, 'resolution': '1080p', 'fps': 24, 'style': style, 'voiceover': 'input/voiceover' + ext,
         'duration': total, 'captions': captions, 'bars': 'none', 'fadeIn': 0.5, 'fadeOut': 0.8, 'music': {'enabled': True, 'gainDb': -17}, 'sfx': {'enabled': True, 'gainDb': -6}, 'loudness': -14})
    save(os.path.join(root, 'timeline', 'words.json'), {'words': words})
    save(os.path.join(root, 'timeline', 'sentences.json'), [{k: v for k, v in s.items() if k != 'words'} for s in sentences(words)])
    gs = beats(words); shots = []
    for i, g in enumerate(gs):
        st = 0.0 if i == 0 else round(g[0]['start'] - 0.08, 2); en = total if i == len(gs) - 1 else round(gs[i + 1][0]['start'] - 0.08, 2)
        shots.append({'id': f's{i + 1:03d}', 'start': st, 'end': en, 'line': ' '.join(w['word'] for w in g), 'scene': 'TODO', 'set': None, 'bars': None, 'in': {'type': 'cut'}, 'sfx': [], 'notes': ''})
    save(os.path.join(root, 'story', 'shots.json'), {'title': title, 'duration': total, 'shots': shots})

# ---------------------------------------------------------------- shot timing
MARK = re.compile(r'\b(sign|step|number|lesson|rule|reason|habit|chapter|part|mistake|secret|tip|law)\s+(number\s+)?(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b', re.I)
def split_markers(slug):
    d = load(P(slug, 'story', 'shots.json')); W = load(P(slug, 'timeline', 'words.json')); W = W['words'] if isinstance(W, dict) else W
    out = []
    for s in d['shots']:
        ws = [w for w in W if s['start'] - .05 <= w['start'] < s['end'] - .05]; cut = None
        for i in range(1, len(ws)):
            txt = ' '.join(w['word'] for w in ws[i:i + 3])
            if MARK.match(txt) and txt[0].isupper(): cut = ws[i]['start'] - .12; k = i; break
        if cut and cut - s['start'] > 1.2:
            a = dict(s, end=round(cut, 2), line=' '.join(w['word'] for w in ws[:k])); b = dict(s, start=round(cut, 2), line=' '.join(w['word'] for w in ws[k:]))
            out += [a, b]
        else: out.append(s)
    merged = []  # glue very short marker-only shots to the next one so the title card covers the whole announcement
    for s in out:
        if merged and len(merged[-1]['line']) < 22 and MARK.search(merged[-1]['line']): merged[-1]['end'] = s['end']; merged[-1]['line'] += ' ' + s['line']
        else: merged.append(s)
    for i, s in enumerate(merged): s['id'] = f's{i + 1:03d}'
    d['shots'] = merged; save(P(slug, 'story', 'shots.json'), d); return d

# ---------------------------------------------------------------- auto-draft scenes
ICONS = [('clock', r'time|hour|minute|day|week|month|year|late|wait|deadline|morning'), ('coins', r'money|rich|pay|cost|price|dollar|cash|wealth|salary|debt|buy'),
 ('phone', r'phone|social|online|app|scroll|instagram|tiktok|notification|like'), ('brain', r'brain|mind|psycholog|memory|think|thought|neuro|focus'),
 ('heart', r'love|heart|care|kind|relationship|friend|trust|emotion|feel'), ('book', r'book|read|learn|study|research|science|scientist|university|professor'),
 ('briefcase', r'work|job|career|office|boss|business|task|project|meeting'), ('bulb', r'idea|realiz|insight|understand|discover|secret|truth'),
 ('house', r'home|family|house|parent|kid|child|dinner'), ('bed', r'sleep|bed|tired|rest|night|dream'), ('blocks', r'habit|build|brick|routine|system|step|practice'),
 ('plant', r'grow|growth|better|improv|progress|seed'), ('people', r'people|everyone|others|crowd|group|society|audience|community'),
 ('battery', r'energy|exhaust|drain|burnout'), ('mountain', r'goal|climb|challenge|hard|difficult|struggle'), ('gavel', r'law|court|judge|justice|rule'),
 ('ballot', r'vote|election|politic'), ('school', r'school|student|class|teacher'), ('newspaper', r'news|headline|media|report'), ('key', r'key|unlock|answer|solution'),
 ('chain', r'trap|stuck|addict|control|manipulat'), ('mail', r'message|email|text|letter|comment'), ('question', r'\?|why|how come|what if')]
SETS = [('meeting', r'meeting|office|work|boss|colleague|team|presentation|job'), ('dinner', r'dinner|family|eat|food|table|meal|restaurant'),
 ('cafe', r'coffee|friend|conversation|talk|chat|date|disagree|ask'), ('stage', r'stage|spotlight|audience|perform|watch|attention|famous|public'),
 ('park', r'walk|outside|nature|calm|peace|breathe|relax|quiet'), ('street', r'street|city|stranger|crowd|everywhere|world'),
 ('bedroom', r'sleep|bed|morning|wake|alarm|night|room'), ('lab', r'study|research|experiment|scientist|data|test|lab'), ('party', r'party|social|loud|room|people')]
POS = [('cheer', r'win|success|finally|great|amazing|yes|celebrat'), ('sad', r'sad|fail|lose|lost|hurt|wrong|alone|regret'), ('think', r'think|wonder|consider|imagine|picture|remember'),
       ('crossArms', r'\bno\b|refuse|boundar|limit|stop|never'), ('shrug', r"don't know|not sure|maybe|unsure"), ('point', r'you|look|notice|watch'), ('explain', r'because|reason|here|so ')]
EXP = [('joy', r'happy|joy|love|great|win|amazing'), ('sad', r'sad|lonely|hurt|lose|fail'), ('worried', r'fear|afraid|anxious|nervous|worry|danger|panic'),
       ('angry', r'angry|attack|fight|argue|defensive'), ('thinking', r'think|wonder|consider|imagine|question'), ('determined', r'decide|commit|must|discipline|build')]
STOP = set('a an the and or but so to of in on at for with is are was were be been it its it’s this that these those you your you’re we they them their i my me he she his her as if just very really can could would will do does did not no then than there here what when who how which because about into from up out more most some any one also even'.split())
def pick(table, text, default=None):
    for k, rx in table:
        if re.search(rx, text, re.I): return k
    return default
def phrase(line, maxw=5):
    parts = [p.strip() for p in re.split(r'[,:;.!?—–]|\band\b|\bbut\b|\bbecause\b', line) if p.strip()]
    best = max(parts or [line], key=lambda p: sum(1 for w in p.split() if norm(w) not in STOP) - max(0, len(p.split()) - maxw) * 0.6)
    ws = best.split()
    if len(ws) > maxw:  # keep the densest window
        sc = [sum(1 for w in ws[i:i + maxw] if norm(w) not in STOP) for i in range(len(ws) - maxw + 1)]; i = sc.index(max(sc)); ws = ws[i:i + maxw]
    return re.sub(r'[^\w\s\'’%#-]', '', ' '.join(ws)).upper().replace('’', "'").strip()
def jss(s): return json.dumps(s, ensure_ascii=False)
def first_word_key(text):
    for w in text.split():
        n = re.sub(r'[^\w]', '', w.lower())
        if len(n) > 3 and n not in STOP: return 'w:' + n
    return None
def draft_shot(i, s, n, vertical, hero_side):
    line = s['line']; lo = line.lower(); W, H = (1080, 1920) if vertical else (1920, 1080); cx = W // 2; ty = 380 if vertical else 150
    m = MARK.search(line)
    if m and line.strip().lower().startswith(m.group(0).lower()[:4]):
        num = m.group(3); num = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10}.get(num.lower(), num)
        rest = line[m.end():].lstrip(' :,.-'); sub = phrase(rest, 7) if rest else ''
        return {'set': 'board', 'fx': [f"{{ t: 'sign', n: {jss(str(num))}, s: {jss(sub)}, at: 0.05, y: {700 if vertical else 400}, size: {60 if vertical else 70} }}"], 'kind': 'marker', 'sfx': 'marker'}
    if re.search(r'subscrib', lo):
        return {'set': 'board', 'figs': [f"{{ who: 'QUIET', x: {cx - (300 if vertical else 520)}, s: 1.8, p: [[0, 'wave'], ['w:subscribe', 'point']], e: 'happy' }}"],
                'fx': [f"{{ t: 'subscribe', x: {cx + (120 if vertical else 200)}, y: {1100 if vertical else 420}, at: 'w:subscribe', s: {0.8 if vertical else 1} }}", f"{{ t: 'logo', x: {cx + (120 if vertical else 200)}, y: {1320 if vertical else 640}, at: 'w:subscrib', s: 1 }}"], 'kind': 'sub', 'sfx': 'pop'}
    fx = []; figs = []
    st = pick(SETS, line)
    vsets = ['board', 'park', 'stage', 'street', 'bedroom', 'party']
    if vertical and st not in vsets: st = None
    if st is None or i % 3 == 2: st = 'board'
    gy = 1536 if vertical else 864; sat = st in ('dinner', 'cafe') and not vertical
    pose = pick(POS, line, 'talk' if i % 2 else 'relaxed'); exp = pick(EXP, line, 'smile' if i % 2 else 'neutral')
    hx = (cx - 260 if hero_side < 0 else cx + 260) if vertical else (560 if hero_side < 0 else 1360)
    if sat: hx = 1160 if hero_side > 0 else 760
    fig = {'who': 'QUIET', 'x': hx, 's': 2.0 if vertical else 1.7, 'f': -hero_side if not vertical else 1, 'e': exp}
    if sat: fig.update(p='sit', y=gy - 90)
    else: fig['p'] = pose
    figs.append(fig)
    if re.search(r'\b(they|people|someone|others|somebody|everyone|friend|boss)\b', lo) and not vertical:
        other = {'who': 'LOUD' if re.search(r'loud|insecure|argue|attack|bluff|defensive', lo) else 'FRIEND', 'x': 1160 if fig['x'] < 960 else 760, 's': 1.7, 'f': hero_side, 'e': 'neutral'}
        if sat: other.update(p='sit', y=gy - 90)
        figs.append(other)
    q = re.search(r'[“"]([^”"]{3,60})[”"]', line)
    if q:
        bx = fig['x'] + (0 if vertical else 60); fx.append(f"{{ t: 'bubble', s: {jss(q.group(1).upper())}, at: {jss(first_word_key(q.group(1)) or 0.3)}, x: {bx}, y: {gy - (760 if vertical else 520)}, size: {38 if vertical else 40}, serif: 1 }}")
    num = re.search(r'\b(\d{4}|\d+%|\d[\d,]{2,})\b', line)
    if num and not q:
        if re.fullmatch(r'1[5-9]\d\d|20\d\d', num.group(1)): fx.append(f"{{ t: 'date', s: {jss(num.group(1))}, x: {cx}, y: {ty + 260}, at: 'w:{norm(num.group(1)) or 0}' }}")
        else: fx.append(f"{{ t: 'pill', s: {jss(num.group(1))}, x: {cx}, y: {ty + 220}, at: 0.4, bg: ACC, size: 70 }}")
    ttl = phrase(line, 4 if vertical else 5)
    fx.insert(0, f"{{ t: 'title', s: {jss(ttl)}, at: 0.25, x: {cx}, y: {ty}, size: {78 if vertical else 84}, maxW: {W * 0.88:.0f}, col: {"'#f4efe4'" if st == 'stage' else ('ACC' if i % 4 == 1 else 'INK')} }}")
    ic = pick(ICONS, line)
    if ic and not q:
        hitw = next((w for w in line.split() if re.search(dict(ICONS)[ic], w, re.I) and norm(w)), None); key = ('w:' + norm(hitw)) if hitw else None
        ixx = cx + 220 if vertical else (1360 if fig['x'] < 960 else 560)
        if len(figs) == 1: fx.append(f"{{ t: 'icon', card: 1, k: '{ic}', lab: {jss(re.sub(r"[^A-Z'%]", '', (hitw or ic).upper()))}, at: {jss(key or 0.6)}, x: {ixx}, y: {gy - (700 if vertical else 420)}, s: {1.0 if vertical else 1.15}, bob: 1 }}")
    return {'set': st, 'spotx': fig['x'], 'figs': [json.dumps(f) for f in figs], 'fx': fx, 'kind': 'normal', 'sfx': 'pop' if ic else None}
def write_draft(slug, vertical, prefix='s'):
    d = load(P(slug, 'story', 'shots.json')); S = d['shots']; specs = []
    for i, s in enumerate(S): specs.append(draft_shot(i, s, len(S), vertical, -1 if (i // 2) % 2 else 1))
    L = ["// all.js — AUTO-DRAFT made by ss.py. Every shot renders; improve the ones that matter (hook, key ideas, ending).",
         "// Reference: lib/engine.js (sets, overlays), lib/modern.js (everyday sets), examples/*.js (hand-designed videos).",
         "import { shot } from '../lib/engine.js';", "const ACC = '#f07a1a', INK = '#141414';", "const S = ["]
    for i, (s, sp) in enumerate(zip(S, specs)):
        so = "so: { spot: %d }, " % sp['spotx'] if sp['set'] == 'stage' else ''
        figs = ('figs: [' + ', '.join(sp.get('figs', [])) + '], ') if sp.get('figs') else ''
        L.append(f"/*{i:03d}*/ {{ set: '{sp['set']}', {so}{figs}fx: [{', '.join(sp['fx'])}] }},  // {s['line'][:90].replace('*/', '')}")
    L += ['];', f"S.forEach((sp, i) => shot('{prefix}' + String(i + 1).padStart(3, '0'), sp));", '']
    lib = os.path.relpath(os.path.join(STUDIO, 'kit', 'lib'), P(slug, 'scenes'))
    os.makedirs(P(slug, 'scenes', 'shots'), exist_ok=True); open(P(slug, 'scenes', 'shots', 'all.js'), 'w').write('\n'.join(L))
    # sound design + music
    AMB = {'party': ('murmur', -30), 'dinner': ('roomtone', -30), 'meeting': ('roomtone', -30), 'cafe': ('murmur', -32), 'stage': ('murmur', -34), 'park': ('wind', -34), 'street': ('city', -32)}
    marks = [i for i, sp in enumerate(specs) if sp['kind'] == 'marker']
    for i, (s, sp) in enumerate(zip(S, specs)):
        s['set'] = sp['set']; s['sfx'] = []; s.pop('amb', None); s['in'] = {'type': 'cut'}
        if sp['set'] in AMB: s['amb'] = {'name': AMB[sp['set']][0], 'gain': AMB[sp['set']][1]}
        if sp['sfx'] == 'marker': s['in'] = {'type': 'dipWhite', 'dur': 0.4}; s['sfx'] += [{'at': 0, 'name': 'whoosh', 'gain': -14}, {'at': .25, 'name': 'impact', 'gain': -12}]
        elif sp['sfx'] == 'pop': s['sfx'].append({'at': .6, 'name': 'pop', 'gain': -16})
    dur = d['duration']; t = lambda i: S[i]['start']
    edges = [0] + [t(m) for m in marks] + [dur]; moods = ['mystery', 'calm', 'playful', 'calm', 'hopeful', 'playful', 'calm', 'hopeful']
    if len(edges) == 2: edges = [0, dur * .15, dur * .5, dur * .88, dur]; moods = ['mystery', 'calm', 'hopeful', 'triumph']
    d['music'] = [{'start': round(edges[k], 2), 'end': round(edges[k + 1], 2), 'mood': moods[k % len(moods)] if k < len(edges) - 2 else 'triumph', 'intensity': 0.4} for k in range(len(edges) - 1)]
    save(P(slug, 'story', 'shots.json'), d)
    print(f'✔ auto-drafted {len(S)} shots ({len(marks)} title cards) -> projects/{slug}/scenes/shots/all.js')

def link_lib(slug):
    dst = P(slug, 'scenes', 'lib')
    if os.path.islink(dst) or os.path.exists(dst): shutil.rmtree(dst) if not os.path.islink(dst) else os.remove(dst)
    shutil.copytree(os.path.join(STUDIO, 'kit', 'lib'), dst)   # a copy, so each video can be customised without touching others

# ---------------------------------------------------------------- commands
def cmd_new(a):
    need_studio()
    if not os.path.exists(os.path.join(STUDIO, 'kit', 'lib')): cmd_install(a)
    if os.path.exists(P(a.slug)) and not a.force: die(f'projects/{a.slug} exists (use --force to rebuild)')
    voice, script = os.path.abspath(a.voice), open(a.script).read().strip()
    work = os.path.join(STUDIO, 'projects', '_work', a.slug); os.makedirs(work, exist_ok=True)
    words = transcribe(voice, script, work); wj = os.path.join(work, 'words.json'); save(wj, {'words': words})
    vertical = a.aspect == '9:16'
    if os.path.exists(P(a.slug)): shutil.rmtree(P(a.slug))
    make_project(a.slug, voice, words, a.aspect, 'noir' if a.theme == 'noir' else 'pictogram', a.title or a.slug.replace('-', ' ').title(), vertical)
    split_markers(a.slug)
    c = load(P(a.slug, 'config.json'))
    if vertical: c['captionStyle'] = {'y': 1660, 'size': 70}
    save(P(a.slug, 'config.json'), c); link_lib(a.slug); write_draft(a.slug, vertical)
    open(P(a.slug, 'input', 'script.txt'), 'w').write(script)
    print(f'\nNEXT:  python3 ss.py preview {a.slug}     (look at the contact sheet)\n       python3 ss.py render  {a.slug}     (finished MP4)')
def cmd_redraft(a):
    need_studio(); vertical = load(P(a.slug, 'config.json'))['aspect'] == '9:16'; write_draft(a.slug, vertical)
def cmd_preview(a):
    need_studio(); args = node('--project', P(a.slug), '--scale', '0.3')
    args += ['--stills', a.at] if a.at else ['--sheet']; run(args)
    out = P(a.slug, 'build', 'stills' if a.at else 'sheets'); print('✔ preview images in', out)
def cmd_render(a):
    need_studio(); run(node('--project', P(a.slug), '--format', 'jpeg', '--workers', a.workers))
    run([sys.executable, os.path.join(KIT, 'audio.py'), P(a.slug)])
    os.makedirs(DELIVER, exist_ok=True); src = next(f for f in os.listdir(P(a.slug, 'out')) if f.endswith('.mp4'))
    asp = load(P(a.slug, 'config.json'))['aspect'].replace(':', 'x'); dst = os.path.join(DELIVER, f"{re.sub(r'[^a-z0-9]+', '', (channel().get('channel_name') or 'video').lower())}_{a.slug}_{asp}.mp4")
    shutil.copy2(P(a.slug, 'out', src), dst); print('✔ FINISHED VIDEO:', dst)
def cmd_short(a):
    """Cut the listed sentences out of the long voiceover, build a 9:16 project with header + end card, auto-draft it."""
    need_studio(); src = a.slug; slug = a.name or src + '-short'
    W = load(P(src, 'timeline', 'words.json')); W = W['words'] if isinstance(W, dict) else W; toks = [norm(w['word']) for w in W]
    lines = [l.strip() for l in open(a.lines) if l.strip()]; GAP = 0.35; t = 0.25; parts = []; words = []; starts = []
    for ln in lines:
        p = [norm(x) for x in ln.split() if norm(x)]; hit = next((i for i in range(len(W)) if toks[i:i + len(p)] == p), None)
        if hit is None:  # fuzzy fallback: best window by similarity
            best = max(range(len(W) - len(p)), key=lambda i: difflib.SequenceMatcher(None, toks[i:i + len(p)], p).ratio()); hit = best
        a0, b0 = hit, hit + len(p) - 1; s0 = max(0, W[a0]['start'] - .08); e0 = W[b0]['end'] + .15; starts.append(round(t, 2))
        for w in W[a0:b0 + 1]: words.append({'word': w['word'], 'start': round(w['start'] - s0 + t, 3), 'end': round(w['end'] - s0 + t, 3)})
        parts.append((s0, e0)); t += (e0 - s0) + GAP
    speech = t; DUR = round(max(speech + 3.6, min(60.0, speech + 4.5)), 2)
    if speech > 56: print(f'! speech is {speech:.1f}s — Shorts must stay ≤60 s; drop a line')
    work = os.path.join(STUDIO, 'projects', '_work', slug); os.makedirs(work, exist_ok=True)
    f = [f"[0:a]atrim={x:.3f}:{y:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={y - x - .05:.3f}:d=0.05,apad=pad_dur={GAP}[p{i}]" for i, (x, y) in enumerate(parts)]
    f.append(''.join(f'[p{i}]' for i in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1,adelay=250|250[o]")
    vo_src = P(src, load(P(src, 'config.json'))['voiceover']); wav = os.path.join(work, 'vo.wav'); vo = os.path.join(work, 'vo.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vo_src, '-filter_complex', ';'.join(f), '-map', '[o]', '-ar', '44100', wav], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-b:a', '192k', vo], check=True)
    wj = os.path.join(work, 'words.json'); save(wj, {'words': words})
    if os.path.exists(P(slug)): shutil.rmtree(P(slug))
    title = load(P(src, 'config.json'))['title']
    make_project(slug, vo, words, '9:16', load(P(src, 'config.json')).get('style', 'noir'), title + ' Short', True)
    c = load(P(slug, 'config.json')); c.update(bars='none', captionStyle={'y': 1660, 'size': 70}, fadeOut=0.6, duration=DUR); save(P(slug, 'config.json'), c)
    cuts = [0] + [round(s - .1, 2) for s in starts[1:]] + [round(speech - .1, 2)]
    shots = [{'id': f's{i + 1:03d}', 'start': cuts[i], 'end': cuts[i + 1] if i + 1 < len(cuts) else DUR, 'line': lines[i] if i < len(lines) else '', 'scene': '', 'bars': None, 'in': {'type': 'cut'}, 'sfx': []} for i in range(len(cuts))]
    shots[-1].update(captions=False, line='END CARD', **{'in': {'type': 'fade', 'dur': .35}}); shots[-1]['sfx'] = [{'at': .2, 'name': 'impact', 'gain': -10}]
    save(P(slug, 'story', 'shots.json'), {'title': title + ' Short', 'duration': DUR, 'shots': shots})
    link_lib(slug)
    d = load(P(slug, 'story', 'shots.json')); last = d['shots'].pop(); save(P(slug, 'story', 'shots.json'), d | {'shots': d['shots']})
    write_draft(slug, True); d = load(P(slug, 'story', 'shots.json')); d['shots'].append(last | {'id': f's{len(d["shots"]) + 1:03d}'}); save(P(slug, 'story', 'shots.json'), d)
    head = a.header or title.upper()
    js = open(P(slug, 'scenes', 'shots', 'all.js')).read()
    js = js.replace("fx: [", f"fx: [{{ t: 'pill', s: {jss(head[:34])}, x: 540, y: 140, at: 0, bg: INK, size: 38 }}, ")
    end = (f"/*end*/ {{ set: 'dark', fx: [{{ t: 'title', s: {jss(a.tease or 'WANT THE REST?')}, x: 540, y: 560, at: 0.05, col: '#ffffff', size: 100, maxW: 960 }}, "
           f"{{ t: 'pill', s: '▶  WATCH THE FULL VIDEO', x: 540, y: 900, at: 0.6, bg: ACC, size: 56 }}, {{ t: 'logo', x: 540, y: 1150, at: 0.9, s: 2.2 }}] }},\n];")
    js = js.replace('\n];', '\n' + end, 1); open(P(slug, 'scenes', 'shots', 'all.js'), 'w').write(js)
    print(f'✔ Short project projects/{slug}  ({DUR:.1f}s)\nNEXT:  python3 ss.py preview {slug}   then   python3 ss.py render {slug}')
def cmd_thumbs(a):
    need_studio(); spec = load(a.spec); out = os.path.join(DELIVER, f'{a.slug}_thumbs'); os.makedirs(out, exist_ok=True)
    html = open(os.path.join(KIT, 'kit', 'thumbs', 'thumbs.html')).read().replace('/*SPEC*/null', json.dumps(spec)).replace('/*CHANNEL*/null', json.dumps({'left': channel().get('name_left', 'STICK'), 'right': channel().get('name_right', 'SENSE'), 'accent': channel().get('accent', '#e8141e')}))
    page = os.path.join(KIT, 'kit', 'thumbs', '_render.html'); open(page, 'w').write(html)
    js = os.path.join(KIT, 'kit', 'thumbs', 'shoot.js')
    subprocess.run(['node', js, page, out], check=True, cwd=RUNTIME)
    print('✔ thumbnails in', out)
def cmd_status(a):
    need_studio(); p = P(a.slug)
    steps = [('project created', os.path.exists(P(a.slug, 'config.json'))), ('words aligned', os.path.exists(P(a.slug, 'timeline', 'words.json'))),
             ('scenes drafted', os.path.exists(P(a.slug, 'scenes', 'shots', 'all.js'))), ('preview sheet', os.path.exists(P(a.slug, 'build', 'sheets'))),
             ('final video', os.path.exists(P(a.slug, 'out')) and any(f.endswith('.mp4') for f in os.listdir(P(a.slug, 'out'))))]
    for n, ok in steps: print(('✔ ' if ok else '· ') + n)

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); sp = ap.add_subparsers(dest='cmd', required=True)
sp.add_parser('install')
x = sp.add_parser('new'); x.add_argument('slug'); x.add_argument('--voice', required=True); x.add_argument('--script', required=True); x.add_argument('--aspect', default='16:9', choices=['16:9', '9:16']); x.add_argument('--title'); x.add_argument('--force', action='store_true'); x.add_argument('--theme', default='noir', choices=['noir', 'classic'], help='noir = black bg, white figures, red accents (default); classic = off-white + orange')
x = sp.add_parser('redraft'); x.add_argument('slug')
x = sp.add_parser('preview'); x.add_argument('slug'); x.add_argument('--at')
x = sp.add_parser('render'); x.add_argument('slug'); x.add_argument('--workers', type=int, default=max(1, min(6, (os.cpu_count() or 2) // 2)))
x = sp.add_parser('short'); x.add_argument('slug'); x.add_argument('--lines', required=True); x.add_argument('--name'); x.add_argument('--header'); x.add_argument('--tease')
x = sp.add_parser('thumbs'); x.add_argument('slug'); x.add_argument('--spec', required=True)
x = sp.add_parser('status'); x.add_argument('slug')
a = ap.parse_args(); globals()['cmd_' + a.cmd](a)
