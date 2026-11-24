"""audio.py: Stick Animation Studio soundtrack builder (MIT).

    python3 audio.py <project dir>

Builds voice + a generated ambient music bed + sound effects, ducks the music under the narrator,
loudness-normalises (config.loudness, default -14 LUFS) and muxes with build/video_silent.mp4 -> out/<title>.mp4.

Shot fields read from story/shots.json:
  "sfx": [{"at": 0.2, "name": "pop|whoosh|impact|tick|ding|riser", "gain": -12}]  (at = seconds from the shot start;
         name can also be a path to your own .wav/.mp3, relative to the project)
  "amb": {"name": "murmur|roomtone|wind|city|rain", "gain": -30}
config.json: "music": {"enabled": true, "gainDb": -17, "file": "optional/own_track.mp3", "seed": 1}, "sfx": {"enabled": true, "gainDb": -6}
"""
import json, os, re, subprocess, sys
import numpy as np

SR = 44100
def secs(t): return int(round(t * SR))
def db(x): return 10 ** (np.asarray(x) / 20)

def read_audio(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], check=True, stdout=subprocess.PIPE).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def write_wav(path, x):
    x = np.clip(x, -1, 1); pcm = (x * 32767).astype('<i2').tobytes()
    p = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', path], input=pcm, check=True)
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def onepole(x, cutoff):
    """simple one-pole low-pass along axis 0 (vectorised via scipy if present)."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    try:
        from scipy.signal import lfilter
        return lfilter([1 - a], [1, -a], x, axis=0).astype(np.float32)
    except ImportError:
        y = np.empty_like(x); v = np.zeros(x.shape[1:], np.float32)
        for i in range(len(x)): v = (1 - a) * x[i] + a * v; y[i] = v
        return y

# ---------------------------------------------------------------- music: slow minor-key pad
def music_bed(total, seed=1):
    r = np.random.default_rng(seed); n = secs(total); out = np.zeros((n, 2), np.float32)
    root = 110.0 * 2 ** (r.integers(0, 5) / 12)                              # A2..C#3
    prog = [[0, 3, 7, 10], [-4, 0, 3, 8], [-2, 2, 5, 9], [-5, -1, 2, 7]]     # i7 - VI - VII - v (minor, unresolved)
    step = 8.0; fade = secs(2.5)
    for k, t0 in enumerate(np.arange(0, total, step)):
        a, b = secs(t0), min(n, secs(t0 + step) + fade)
        if a >= n: break
        t = np.arange(b - a) / SR; seg_ = np.zeros(b - a, np.float32)
        for semi in prog[k % len(prog)]:
            f = root * 2 ** (semi / 12)
            for det, amp in ((0.0, 0.5), (0.7, 0.25), (-0.6, 0.25)):
                seg_ += amp * np.sin(2 * np.pi * (f + det) * t + r.uniform(0, 6.28))
            seg_ += 0.12 * np.sin(2 * np.pi * f * 2 * t)
        env = np.minimum(1, np.minimum(t / 2.5, (t[-1] - t + 1e-3) / 2.5))
        seg_ *= env * (0.8 + 0.2 * np.sin(2 * np.pi * 0.07 * t + k))
        pan = 0.5 + 0.15 * np.sin(k)
        out[a:b, 0] += seg_ * (1 - pan) * 2; out[a:b, 1] += seg_ * pan * 2
    sub = root / 2; t = np.arange(n) / SR
    out += (0.35 * np.sin(2 * np.pi * sub * t) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 16)))[:, None]
    out = onepole(out, 1800)
    k = secs(3); out[-k:] *= np.linspace(1, 0, k)[:, None]; out[:k] *= np.linspace(0, 1, k)[:, None]
    return out / (np.abs(out).max() + 1e-9) * 0.5

# ---------------------------------------------------------------- sound effects
def sfx(name, seed=0):
    r = np.random.default_rng(seed or 7)
    def env(n, att, dec): t = np.arange(n) / SR; return np.minimum(1, t / max(att, 1e-4)) * np.exp(-t / dec)
    def st(x): return np.stack([x, x], 1).astype(np.float32)
    if name == 'pop':
        n = secs(0.18); t = np.arange(n) / SR; f = 900 * np.exp(-t * 30) + 300
        return st(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.04))
    if name == 'tick':
        n = secs(0.06); return st(onepole(r.standard_normal((n, 1)).astype(np.float32), 6000)[:, 0] * env(n, 0.0005, 0.01) * 3)
    if name == 'ding':
        n = secs(1.2); t = np.arange(n) / SR; return st((np.sin(2 * np.pi * 1320 * t) + 0.4 * np.sin(2 * np.pi * 2640 * t)) * env(n, 0.003, 0.35) * 0.6)
    if name == 'whoosh':
        n = secs(0.7); t = np.arange(n) / SR; x = r.standard_normal(n).astype(np.float32)
        sweep = np.sin(np.pi * t / t[-1]) ** 2; lo = onepole(x[:, None], 2500)[:, 0]
        return st(lo * sweep * 1.6)
    if name == 'impact':
        n = secs(1.4); t = np.arange(n) / SR; boom = np.sin(2 * np.pi * np.cumsum(55 + 60 * np.exp(-t * 18)) / SR) * env(n, 0.002, 0.45)
        crack = onepole(r.standard_normal((n, 1)).astype(np.float32), 3000)[:, 0] * env(n, 0.001, 0.05)
        return st(boom * 0.9 + crack * 0.8)
    if name == 'riser':
        n = secs(1.5); t = np.arange(n) / SR; x = r.standard_normal(n).astype(np.float32)
        return st(onepole(x[:, None], 4000)[:, 0] * (t / t[-1]) ** 2 * 0.9 + 0.3 * np.sin(2 * np.pi * np.cumsum(200 + 600 * t / t[-1]) / SR) * (t / t[-1]))
    # ambience beds (6 s loops)
    n = secs(6); x = r.standard_normal((n, 2)).astype(np.float32)
    cut = {'murmur': 700, 'roomtone': 250, 'wind': 400, 'city': 900, 'rain': 5000}.get(name, 500)
    y = onepole(x, cut); t = np.arange(n) / SR
    if name in ('wind', 'murmur'): y *= (0.6 + 0.4 * np.sin(2 * np.pi * t / 3 + r.uniform(0, 6)))[:, None]
    return y / (np.abs(y).max() + 1e-9) * 0.5

def place(buf, snd, at, gain):
    a = max(0, at); b = min(len(buf), a + len(snd))
    if b > a: buf[a:b] += snd[: b - a] * gain

def envelope(x):
    """0..1 voice activity (fast attack, slow release) used for ducking."""
    hop = secs(0.01); m = np.abs(x).mean(1); n = len(m) // hop * hop
    fr = np.sqrt((m[:n].reshape(-1, hop) ** 2).mean(1)); lv = np.clip((20 * np.log10(fr + 1e-9) + 50) / 30, 0, 1)
    out = np.zeros_like(lv); v = 0.0; up, down = np.exp(-0.01 / 0.03), np.exp(-0.01 / 0.45)
    for i, s in enumerate(lv): c = up if s > v else down; v = c * v + (1 - c) * s; out[i] = v
    e = np.repeat(out, hop); return np.concatenate([e, np.full(len(x) - len(e), e[-1] if len(e) else 0)])

def main(P):
    cfg = json.load(open(os.path.join(P, 'config.json'))); story = json.load(open(os.path.join(P, 'story', 'shots.json')))
    total = story.get('duration') or story['shots'][-1]['end']; n = secs(total)
    voice = read_audio(os.path.join(P, cfg['voiceover'])); voice = np.concatenate([voice, np.zeros((max(0, n - len(voice)), 2), np.float32)])[:n]
    loud = np.abs(voice).mean(1) > db(-40); v_rms = rms_db(voice[loud]) if loud.any() else -20.0
    env = envelope(voice); mix = voice.copy()
    m = cfg.get('music') or {}
    if m.get('enabled', True):
        if m.get('file'):
            mus = read_audio(os.path.join(P, m['file'])); mus = np.concatenate([mus] * int(np.ceil(n / len(mus))))[:n]
        else:
            print('… generating the music bed'); mus = music_bed(total, m.get('seed', 1))
        mus = mus * db(v_rms + m.get('gainDb', -17) - rms_db(mus)) * db(-9 * env)[:, None]; mix += mus
    s = cfg.get('sfx') or {}
    if s.get('enabled', True):
        hits = np.zeros((n, 2), np.float32); bed = np.zeros((n, 2), np.float32); cache = {}; cues = 0
        for sh in story['shots']:
            for c in sh.get('sfx') or []:
                nm = c['name']; snd = read_audio(os.path.join(P, nm)) if re.search(r'\.(wav|mp3|ogg|flac|m4a)$', nm, re.I) else cache.setdefault((nm, c.get('seed', 0)), sfx(nm, c.get('seed', 0)))
                place(hits, snd, secs(sh['start'] + float(c.get('at', 0))), db(c.get('gain', -8))); cues += 1
            if sh.get('amb'):
                am = sh['amb']; base = cache.setdefault((am['name'], 'amb'), sfx(am['name'])); ln = secs(sh['end'] - sh['start'])
                loop = np.concatenate([base] * (ln // len(base) + 2))[:ln]; f = min(secs(0.4), ln // 2)
                if f: loop[:f] *= np.linspace(0, 1, f)[:, None]; loop[-f:] *= np.linspace(1, 0, f)[:, None]
                place(bed, loop, secs(sh['start']), db(am.get('gain', -20)))
        bed *= db(-5 * env)[:, None]; mix += (hits + bed) * db(s.get('gainDb', -6) + v_rms + 18)
        print(f'… {cues} sound effect(s)')
    mix -= onepole(mix, 25)                                              # remove sub-rumble
    pk = np.abs(mix).max()
    if pk > 0.95: mix = np.tanh(mix / pk * 1.2) / np.tanh(1.2) * 0.95
    os.makedirs(os.path.join(P, 'build'), exist_ok=True); raw = os.path.join(P, 'build', 'mix_raw.wav'); write_wav(raw, mix)
    wav = os.path.join(P, 'build', 'mix.wav'); lufs = cfg.get('loudness', -14)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'loudnorm=I={lufs}:TP=-1.5:LRA=11', '-ar', str(SR), wav], check=True)
    video = os.path.join(P, 'build', 'video_silent.mp4')
    if not os.path.exists(video): print('✔ soundtrack at', wav, '(render the video, then run this again to combine)'); return None
    name = re.sub(r'[^\w\- ]+', '', cfg.get('title') or 'video').strip().replace(' ', '_') or 'video'
    out = os.path.join(P, 'out', name + '.mp4'); os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', video, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print('✔ final video:', out); return out

if __name__ == '__main__': main(sys.argv[1])
