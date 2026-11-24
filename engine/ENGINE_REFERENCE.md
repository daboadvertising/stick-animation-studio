# Engine reference: everything a shot can use

A shot is one object in `scenes/shots/all.js`:
```js
{ set: 'cafe', so: { table: false }, cam: { z: [1.0, 1.2], x: [0, 120], y: [0, -40] },
  figs: [ { who: 'QUIET', x: 760, s: 1.6, f: -1, p: [[0, 'sit'], ['w:stand', 'stand']], e: 'smile', y: 774 } ],
  fx:   [ { t: 'title', s: 'ONE LINE.', at: 'w:one', y: 160, col: ACC, size: 110 } ] }
```
**Timing:** `at` takes seconds into the shot (`1.2`) or the moment a word is spoken (`'w:word'`, lower case, no punctuation; for "don't" write `'w:dont'`).
**Canvas:** 1920×1080 (16:9) or 1080×1920 (9:16). The ground line is at 80% of the height (y 864 or y 1536).

## Sets (`set:`)
| Set | Look | Options (`so:`) |
|---|---|---|
| `board` | off-white grid (explainer) | none |
| `party` | living room, string lights, sofa | `dim` |
| `dinner` | dining room with a table in the foreground (sit figures at `y: 774`) | `food:false` |
| `meeting` | office whiteboard + window, table in the foreground | `table:false`, `chart:false` |
| `cafe` | café window, round table in the foreground | `table:false`, `tx` |
| `stage` | dark stage, curtains, spotlight | `spot:x`, `spotA`, `crowd:1` |
| `park` | trees, bench, sky | `bench:false` |
| `street`, `bedroom`, `lab` | flat everyday scenes | `night` |
| `split` | two-tone split screen (left/right comparisons) | none |
| `dark` | near-black (twists, end cards) | none |
| History sets | `theatre box corridor dcstreet room bar whitehouse capitol congress train coast town field` (1865) · `forum study island palace port garden map parch` (Rome) | |

## Cast (`who:`)
`QUIET` (hero, orange scarf) · `LOUD` (spiky hair + tie) · `FRIEND` (bun) · `BOSS` (tie + glasses) · `PLAIN` · `GLASSES` · `WOMAN` · `OLD`
History cast: `LINCOLN MARY BOOTH SOLDIER SENECA NERO ROMAN`. Extra `items:` you can add: `hair bun tie glasses scarf tophat kepi dress ponytail toga laurel`.

**Figure fields:** `x, y, s` (scale ~1.5–2.0), `f` (1 = facing right, −1 = facing left), `p` (pose or keyframes), `e` (expression or keyframes),
`walk: [x0, x1, tStart, tEnd]`, `prop` (`phone paper pen glass coin wallet clipboard candle torch bottle cane scroll hourglass`), `sweat:1`, `a` (opacity), `fadeAt`.
**Poses:** stand relaxed talk explain point pointUp wave cheer handsOnHead crossArms think shrug holdFront phone reach sad facepalm ready crouch sit sitBack kneel lie jump fall
**Expressions:** neutral happy joy smile surprised shocked scared worried nervous angry determined sad cry smirk sleepy thinking confused awe

## Overlays (`fx:` entries, `t:` = type)
| Type | Use | Key fields |
|---|---|---|
| `title` | big headline | `s, at, x, y, size, col, maxW` |
| `label` | small caps line | `s, at, y, col, size` |
| `serif` | elegant italic line | `s, at, y, size` |
| `pill` | tag or chip | `s, at, x, y, bg, size` |
| `bubble` | speech | `s, at, x, y, tail (±1), serif` |
| `stamp` | rubber-stamp word | `s, at, x, y, rot, size, col` |
| `sign` | countdown title card | `n, s, at, subAt, y` |
| `countdown` | row of #5…#1 cards | `hi, q, items[{n,at,lab}]` |
| `icon` | icon (or `card:1` with `lab`) | `k, at, x, y, s, bob` |
| `panels` | 2–3 icon cards in a row | `items[{k,lab,at,mark,markAt}]` |
| `name` | lower-third name tag | `n, r, at, x, y` |
| `date` | parchment date card | `s, sub, at, x, y` |
| `quote` | unrolling parchment quote | `lines[], at, dur, hi[]` |
| `bars2` | comparison bars | `items[{v,val,lab,at,col}], x, gap, h` |
| `counter` | animated number | `from, to, at, dur, pre, post` |
| `meter` | gauge 0–1 | `v0, v1, at, dur, lab, wobble` |
| `pie`, `lifegrid`, `week`, `hourglass` | data / time visuals | see `lib/engine.js` |
| `seesaw` | fragile vs steady | `x, gy, labels, speed, amp` |
| `bricks` | building a habit | `steps[at...], base, cols, bw, bh, total` |
| `spot` | spotlight cone | `x, gy, at, out, a` |
| `notifs` | hearts / ✕ bubbling out | `x, y, at, out, n, bad` |
| `shout` | sound waves | `x, y, at, out, dir` |
| `crack`, `cross`, `strike`, `check` | marks | `x, y, at …` |
| `subscribe` | animated button | `at, press, x, y` |
| `logo` | STICKSENSE wordmark (light backgrounds) | `at, x, y, s` |
| `veil` | colour wash / flash | `col, a, at, dur` |
| `fn` | anything custom | `f: (g, t, info) => { … }` |

**Icons (`k:`):** clock coins phone brain heart book briefcase bulb house bed blocks plant people battery mountain gavel ballot school newspaper key chain mail question check cross tv sun lamp gear wallet bus bell flag crown scroll hourglass

## Sound and music (`story/shots.json`)
Per shot: `"in": {"type": "cut"|"dip"|"dipWhite"|"fade"|"flash", "dur": 0.4}`, `"sfx": [{"at": 0.3, "name": "pop", "gain": -14}]`, `"amb": {"name": "murmur", "gain": -30}`.
**SFX:** whoosh swish impact hit riser slowmo freeze tick clock heartbeat pop blip counter ding shimmer stinger footstep kick whistle carpass phonebuzz phonering cheer applause murmur rain thunder wind roomtone city hum powerup glitch flash buzz
**Music** (top-level `"music"`: `[{start, end, mood, intensity}]`): mystery tension action wonder hopeful sad triumph playful calm dark epic
