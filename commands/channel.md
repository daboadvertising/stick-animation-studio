---
description: Create or edit your channel profile: name, logo colours, tagline, accent, voice and house rules.
argument-hint: "[details]"
---
Help the user create `channel.json` in their working folder, using `<plugin root>/engine/channel.json` as the template.
Ask only for: channel name (and how to split it into a white part and an accent part for the logo), tagline, accent colour (hex), theme (noir or classic), language/spelling, and any house rules.
Then run `python3 <engine>/ss.py install` in the studio folder so the logo and accent update. Show the result on one rendered still if a project exists. Arguments: $ARGUMENTS
