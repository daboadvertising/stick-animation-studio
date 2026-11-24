---
name: scriptforge
description: Topic ideation and short-script writing for a faceless stick-figure YouTube channel. Use when the user asks for the ScriptForge menu, niche ideas, video ideas, or "what should my next video be", or picks a niche number like "5.2".
---
# ScriptForge

Follow `ENGINE/prompts/01_scriptforge_ideas.md` (ENGINE is `<this skill's base>/../../engine`). That file holds the full niche menu (45 sub-niches) and the exact output format.

**Flow:**
1. Show the full niche menu, marking topics the user has already done with ✓ and the video name.
2. The user picks a sub-niche. Give 10 ideas, each with a one-line hook and the open loop it would use, plus a recommendation.
   Every idea must be a real, documented story or an accurate explainer.
3. The user picks an idea. Write the 450–600-word script with these sections:
   - HOOK
   - SETUP
   - BODY
   - PAYOFF
   - OUTRO

   Each section has [NARRATION] and [VISUAL] parts. Then add:
   - 3 alternative titles
   - thumbnail text in the StoryScene formula
   - 5 tags
   - the word count
   - a short loop map
   - accuracy notes

   End with: "Want edits, a different tone, a Shorts version (60s), or a new topic?"
