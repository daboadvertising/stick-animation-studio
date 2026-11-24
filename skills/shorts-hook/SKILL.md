---
name: shorts-hook
description: Write a standalone 45–55 s YouTube Shorts hook script that sells the full video (never a clip of it), plus title and caption; and after the user records it, build the 9:16 animation. Use for "Shorts version", "short script", "hook short", or when a Short voiceover MP3 is uploaded.
---
# Shorts hook

**Script (110–140 words):**
1. Start with a pattern-break hook (0–3 s).
2. Give a fast setup (3–15 s).
3. Build with 2–3 escalating beats, each a quick mini-loop that opens and closes (15–35 s).
4. Open the full video's **biggest** loop and leave it unanswered (35–50 s).
5. Finish with: "The full story is on the channel now."

Rules:
- It must make sense to someone new to the topic, and it must never give away the long video's ending.
- Use the same natural voice and accuracy rules as the long video.
- Deliver a beat table (time, line, on-screen visual), a title with #shorts, and a caption.

**Animation (after the user uploads the Short's MP3):**
1. Run `ss.py new <slug>-hook --voice … --script … --aspect 9:16`.
2. Rebuild `story/shots.json` with one shot per sentence (use the transcript times) plus a 3.6 s END CARD shot (`captions: false`). Set the config's duration to match.
3. Hand-design the scenes in portrait (1080×1920):
   - Keep text between y 250 and y 1500, because captions sit near y 1660.
   - Add a header pill at y 140.
   - Show the open loop as a locked card.
   - End card: a question, "▶ WATCH THE FULL VIDEO", and `{ t: 'logo' }`.
4. Remind the user to set **Related video** to the full upload.
