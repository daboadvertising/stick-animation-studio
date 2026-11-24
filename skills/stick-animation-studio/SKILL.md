---
name: stick-animation-studio
description: End-to-end faceless stick-figure YouTube production. Use when the user wants to make a stick-figure / pictogram animated video from a voiceover or script, render or fix an animation, build thumbnails, titles, descriptions or a Short for such a video, or asks about the stick animation pipeline. Triggers include "animate this voiceover", "make a stick figure video", "stick animation", "make the thumbnails", "make the short".
---
# Stick Animation Studio: the full pipeline

The engine is in the plugin's `engine/` folder: two levels up from this skill's base directory (`<base>/../../engine`). Call it ENGINE below.
Run every command as `python3 "$ENGINE/ss.py" <command>`. Projects live in the workspace (`$STICK_WORKSPACE`, default `~/stick-studio/projects/<slug>`), finished videos land in `~/stick-studio/deliveries/`. The renderer is built in (`ENGINE/runtime`); if it has never been set up, run `/stick-animation-studio:setup` first.

## 0. The channel profile
Read `channel.json` in the user's working folder. If it isn't there, read `ENGINE/channel.json`, which holds the defaults.
It sets the channel name (logo = `name_left` in white + `name_right` in the accent), the tagline, the accent colour, the theme, the voice and the house rules.
If the user hasn't set one up, offer `/stick-animation-studio:channel` once, then carry on with the defaults.
After changing `channel.json`, run `python3 "$ENGINE/ss.py" install` again.

## 1. The pipeline (one video)
1. **Ideas → script:** use the `scriptforge` skill (niche menu → 10 ideas → short script), then the `extended-script` skill (about 1,750 words in natural voice, with open loops and a loop map), and write the `shorts-hook` script at the same time.
2. **Voiceover:** the user records the script and uploads the MP3. Save the exact script they recorded as a .txt file.
3. **Build:** `python3 "$ENGINE/ss.py" new <slug> --voice <mp3> --script <txt> --aspect 16:9 --title "<title>"` (add `--theme noir` or `--theme classic`; the default comes from the profile).
   This transcribes with PocketSphinx and aligns every word, giving `timeline/words.json`, shot timing in `story/shots.json`, and an auto-draft in `scenes/shots/all.js`.
   An alignment match of 85% or more is good. If it's lower, tell the user which part differs from the recording.
4. **Split long shots** at sentence ends (no shot over about 6.5 s), then **hand-design every shot**. This is the step that makes the video good. See `ENGINE/ENGINE_REFERENCE.md`, `ENGINE/PROP_INDEX.md` and the examples in `<base>/../../examples/` (`otzi_shots.js` is the gold standard).
   - Keep one `S` array entry per shot, in order, with timings driven by words (`'w:word'`, normalised and without apostrophes).
   - If the story needs props that don't exist yet, write a new library in the workspace's `kit/lib/` (for example `mytopic.js`), register its sets in `engine.js` → `SETS`, and copy the lib into the project with `cp -r kit/lib projects/<slug>/scenes/lib`.
   - Make the visual for each line literal and specific: a counter for numbers, a map pin for places, a name card for people, a stamp for a verdict, a locked card for an open loop.
5. **QC:** run `python3 "$ENGINE/ss.py" preview <slug>`, then open every contact sheet and fix overlaps, off-screen text, unreadable props, text that repeats the caption, and render errors (`shot error` lines).
6. **Render:** run `python3 "$ENGINE/ss.py" render <slug>` in the background (about 3–4 minutes per minute of video). Check the duration with ffprobe and look at a sample frame before you deliver.
7. **Package:** use the `storyscene-thumbnails` skill, then titles and description (`ENGINE/prompts/05_titles_description.md`, with chapters taken from shot start times), tags, and the **Shorts hook script only**.
8. **Short:** once the user sends the Short's voiceover, run `python3 "$ENGINE/ss.py" new <slug>-hook --voice <mp3> --script <hook.txt> --aspect 9:16`. Cut it into beats, add an end card ("▶ WATCH THE FULL VIDEO" plus `{ t: 'logo' }`), then hand-design, preview and render it.

## 2. Non-negotiable house rules
- **Accuracy:** real, documented accounts only. No invented quotes, statistics, studies, names or scenes. Label theories and approximate dates in the narration and on screen. Every script comes with sources.
- **No chapter cards.** Tell the story as one continuous flow.
- **Natural storyteller voice** (see `extended-script`).
- **Open loops** in every script (see `open-loops`).
- **Shorts are hooks, not clips:** a separate script, recorded separately, that never gives away the ending.
- **Be honest:** retention and click-through targets aren't guaranteed. Recommend A/B testing with YouTube Test & Compare.

## 3. Noir theme notes
The noir theme remaps every finished frame: light becomes black, dark ink becomes white, and warm saturated colours become the accent.
So design with INK outlines and `ACC` accents. Pale pastels on light sets turn into dark grey. `dark`, `stage` and `cinema` sets aren't inverted.
