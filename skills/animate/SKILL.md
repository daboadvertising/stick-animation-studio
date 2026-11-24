---
name: animate
description: Hand-design stick-figure animation shots for an aligned voiceover project (scenes/shots/all.js), add new props/sets, preview contact sheets and fix QC issues. Use when designing or fixing scenes, adding props, or when a render shows overlaps, off-screen text or shot errors.
---
# Designing shots

ENGINE = `<this skill's base>/../../engine`, EXAMPLES = `<base>/../../examples`.
Read `ENGINE/ENGINE_REFERENCE.md` (the shot API) and `ENGINE/PROP_INDEX.md` (sets, overlay types, library exports) first. Then read `EXAMPLES/otzi_shots.js`, the reference for quality.

## Shot recipe
- `shot(id, { set, cam, figs, fx })`. Overlays are `{t:'title'|'pill'|'stamp'|'name'|'counter'|'fn', …, at:'w:word'}`. Times can be seconds or `'w:word'`, which resolves to that word's start in the shot.
- Use `fn((g,t,info)=>…)` for any custom drawing, and `T(info,'w:word',fallback)` for word times inside it.
- Every line gets one literal, specific visual. Change the composition every 2–4 s (a camera push, a new prop, a counter). Never just put the caption text up as a title.
- Use a header pill for context (place or date), a name card for a new person, a counter for numbers, a stamp for verdicts, a locked "?" card for open loops, and the same prop again when a loop pays off.
- Theories and approximate dates get an on-screen "THEORY" or "c." label.

## New props
Create `kit/lib/<topic>.js` in the workspace (`~/stick-studio`) and export draw functions `(g, x, y, s, t, opts)`.
Use thick INK outlines and the `ACC` accent. Fill shapes pale only if they must stay pale in noir.
Register any new set in `engine.js` `SETS`, then copy the lib into the project with `cp -r kit/lib projects/<slug>/scenes/lib`.

## QC loop
1. `ss.py preview <slug>` makes contact sheets. Look at every sheet.
2. Fix:
   - overlapping text
   - anything off-screen
   - text that sits on the caption band (16:9 bottom ~140 px; 9:16 y > 1580)
   - props drawn unreadably small
   - `shot error` lines (usually a bad variable or a name shadowing a helper, e.g. a local named `P`)
3. Repeat until it's clean, then run `ss.py render <slug>`.
