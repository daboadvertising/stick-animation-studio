# Prompt 6 — the Short: a standalone HOOK for the main story (not a clip)

**Never cut sentences out of the long voiceover.** Viewers complained that clipped Shorts feel chopped and unfinished.
A Short is a separate, purpose-written trailer that makes people want to watch the full video.

---
Write a **separate Shorts script** for "<VIDEO TITLE>" of **110–140 words** (about 45–55 seconds spoken), in this shape:
1. **Pattern-break hook (0–3 s):** one line that challenges what the viewer thinks they know, or drops them into the most dramatic moment.
2. **Fast setup (3–15 s):** who, where and what's at stake, in 2–3 short sentences.
3. **Escalation (15–35 s):** 2–3 vivid beats, each raising the stakes. Use real, checkable details only.
4. **Cliffhanger (35–50 s):** stop at the biggest unanswered question, then point to the full video ("…the full story is on the channel").
Rules: every fact is accurate; never reveal the ending of the long video; short spoken sentences; it should make sense to someone who has never heard of the topic; the last line should loop well back into the first.
Also give: on-screen text for each beat, a Short title with #shorts, a one-line caption, and a reminder to set "Related video" to the full upload.

Then, after the user records the Short voiceover:
`python3 ss.py new <slug>-short --voice short.mp3 --script short.txt --aspect 9:16 --title "<title> (Short)"`
Hand-design the vertical scenes (keep text between y 250 and y 1500, because captions sit near y 1660), end on an end card ("▶ WATCH THE FULL VIDEO" plus the logo), then preview and render.
---

## Open loops (always)
Apply the `open-loops` skill (skills/open-loops/SKILL.md). Plan the loops before writing, follow its placement map, and attach a LOOP MAP plus checklist after the script.
