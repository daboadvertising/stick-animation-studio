# Prompt 3 — Upgrade the auto-draft into a hand-designed animation (for Claude Code)

`ss.py new` already makes a complete, renderable video. Use this prompt to make it *great*.

---
Project: `projects/<slug>` in the workspace (~/stick-studio). Read `story/shots.json` (one shot per beat, with its spoken line),
`scenes/shots/all.js` (the auto-draft), `ENGINE_REFERENCE.md`, and the examples in `examples/`
(`quiet-confidence_shots.js` is the gold standard for 16:9; `quiet-confidence_short.js` is the one for 9:16).

Rewrite `scenes/shots/all.js` so every shot **shows** what the line says:
- **Hook (first 30 s):** contrast, a recurring hero (`QUIET`, the orange scarf) against an antagonist (`LOUD`), and a teaser for the best item.
- **Title cards:** keep the auto-generated `sign` cards. Add a running section pill
  (`{ t: 'pill', s: '#3 · …', x: 250, y: 1020, size: 28, bg: ACC }`) during each section.
- **Studies or numbers:** use `date` + `name` cards, `bars2` for comparisons, `counter` for big numbers. Use rounded wording ("≈ half"), never false precision.
- **Metaphors:** `seesaw`, `bricks`, `spot`, `meter`, `notifs`, `crack`, `shout`, or a custom `fn` drawing.
- **Dialogue:** `bubble` with `serif: 1` for quoted speech. Time each reveal with `at: 'w:<word>'`.
  Words are normalised, so for "don't" write `w:dont`.
- **Subscribe call-outs:** `subscribe` (with `press:`) + `logo`.
- Keep text out of the bottom 15% in 9:16 (captions sit at y 1660), and keep 16:9 titles in the top 340 px.

Then run `python3 ss.py preview <slug>`, look at every frame of the contact sheet, fix overlaps,
and run `python3 ss.py render <slug>`. Also update music moods and SFX in `story/shots.json` if the story arc needs it.
---
