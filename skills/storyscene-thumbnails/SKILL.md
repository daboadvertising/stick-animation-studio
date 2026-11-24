---
name: storyscene-thumbnails
description: Design YouTube thumbnails and Shorts covers for a stick-figure channel using the StoryScene formula (a key story moment in stick style, a red arrow + circle on the clue, a 2–4-word question), plus classic A/B variants and a phone-size feed preview. Use when the user asks for thumbnails, a Shorts cover, or thumbnail feedback.
---
# StoryScene thumbnails

ENGINE is `<this skill's base>/../../engine`. The renderer is `ENGINE/kit/thumbs/thumbs.html` (one canvas function per layout), run with `ss.py thumbs <slug> --spec spec.json`.

## The formula (Thumbnail A, every video)
1. **Scene:** one key moment from the video, drawn in the same stick style: the setting, the main figure and the key object. Use bold, thick white shapes on black, with few thin details.
2. **Red arrow and circle:** on the **clue or hook**. Never point at the final payoff: if the payoff is the axe, point at the wound.
3. **Text:** 2–4 huge words, ideally a question ("WHO SHOT HIM?"), white plus accent, top-left. It must complement the title and never repeat it. Add a small white tag strip for context ("5,300 YEARS AGO").
4. **Palette:** strictly the channel palette (noir: black, white, accent). No greys.
5. **Readability:** keep the bottom-right corner clear for the duration badge, and check `feed_preview_phone-size.png`.

## Building it
1. Write a new layout function `L_brw_<topic>(g,o)` in thumbs.html (1280×720 canvas). Copy `L_brw_iceman` as the template and register it in the `L` map.
2. **Spec:** `{ "title": …, "duration": "10:08", "concepts": [ {"layout":"brw_<topic>","line1":"WHO SHOT","line2":"HIM?","small":"5,300 YEARS AGO"}, {"layout":"brw_headline",…,"face":"shock"}, {"layout":"brw_badge","badge":"5,300","top":"YEAR-OLD","bottom":"MURDER"} ] }`
3. **Shorts cover (1080×1920):** the same scene, adapted to portrait. Build a page from thumbs.html's head with a custom draw, and shoot it with Playwright (`kit/thumbs/shoot.js` is the pattern).
4. **Deliver:**
   - A, B and C
   - the feed preview
   - the cover
   - 3 titles per thumbnail
   - which pair to put in Test & Compare (usually the scene against a classic variant)

## Honesty
Nobody can guarantee click-through. Explain why each design should work (focal point, curiosity gap, contrast at phone size) and recommend testing.
