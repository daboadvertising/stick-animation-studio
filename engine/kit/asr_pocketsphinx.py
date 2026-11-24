import json, sys
from pocketsphinx import Decoder
d = Decoder(samprate=16000)
data = open(sys.argv[1], 'rb').read()
d.start_utt(); d.process_raw(data, full_utt=True); d.end_utt()
fr = 100.0
words = [{"w": s.word, "s": s.start_frame / fr, "e": s.end_frame / fr} for s in d.seg() if s.word not in ('<s>', '</s>', '<sil>', '[NOISE]') and not s.word.startswith('++')]
json.dump(words, open(sys.argv[2], 'w')); print(len(words)); print(' '.join(w['w'] for w in words)[:1500])
