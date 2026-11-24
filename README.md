# Stick Animation Studio (Claude Code plugin)

This plugin turns Claude into a faceless YouTube studio. You record the voiceover, and Claude does the rest:

**topic ideas → retention-first script (open loops, natural voice) → aligned, hand-designed stick-figure animation (16:9 or 9:16) → StoryScene thumbnails → titles, description and tags → a hook Short.**

## 5-minute quickstart
1. **Install the plugin.** In Claude Code, run:
   ```
   /plugin marketplace add <this repo or folder>
   /plugin install stick-animation-studio@stick-animation-studio
   ```
2. **Set up the engine:** run `/stick-animation-studio:setup`. It checks Python, Node and ffmpeg, then installs the speech aligner and the built-in renderer (headless Chromium). Everything is included: there's nothing else to download by hand.
   Projects go in `~/stick-studio` (change it with `STICK_WORKSPACE`); finished videos land in `~/stick-studio/deliveries/`.
3. **Brand it:** run `/stick-animation-studio:channel` to set your name, logo split, accent colour, tagline and house rules (saved to `channel.json`).
4. **Make a video:**
   - `/stick-animation-studio:scriptforge` picks a niche, gives 10 ideas and writes a short script.
   - `/stick-animation-studio:script` writes the ~1,750-word extended script and the Shorts hook.
   - Record the voiceover, then run `/stick-animation-studio:animate` with your MP3 and the script.
   - `/stick-animation-studio:thumbnails` and `/stick-animation-studio:package` produce the thumbnails, titles, description and tags.
   - Record the hook, then run `/stick-animation-studio:short`.

## What's inside
| Folder | Contents |
|---|---|
| `skills/` | stick-animation-studio (pipeline), scriptforge, extended-script, open-loops, shorts-hook, animate, storyscene-thumbnails |
| `commands/` | the slash commands above |
| `engine/` | `ss.py` CLI, `runtime/` (our own renderer: canvas engine, stick-figure rig, frame player, Chromium→ffmpeg encoder), `audio.py` (generated music bed, sound effects, ducking, −14 LUFS master), the kit (scene engine and prop libraries: ancient, Bronze Age, Greece, Rome, India, Alps, tech, modern…), the thumbnail renderer, prompts, ENGINE_REFERENCE and PROP_INDEX |
| `examples/` | finished shot files and specs to learn from |
| `setup/setup.sh` | environment check and installer |

## Requirements
- Python 3.9+, Node 18+ and ffmpeg
- About 1 GB of disk
- Rendering takes about 3–4 minutes per minute of video on a laptop CPU

## Honest notes
- Scripts use real, documented accounts only. Theories are flagged. Always check the sources before you publish.
- Nobody can guarantee views or click-through. The plugin builds variants for YouTube Test & Compare.

## Licence
Free and open source under the **MIT licence** (see `LICENSE`). Use it, change it, share it, make money with the videos you create.
Bundled fonts (Fredoka, Nunito, Playfair Display) are under the SIL Open Font License; see `engine/runtime/fonts/`.
