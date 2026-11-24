---
description: Install or check the stick animation engine (renderer, fonts, speech aligner, ffmpeg).
argument-hint: "[workspace folder]"
---
Set up the Stick Animation Studio for this user.
1. Run `bash <plugin root>/setup/setup.sh` (the plugin root holds `engine/` and `setup/`). Read its output.
2. If anything is marked ✖, explain the fix in plain language (for example how to install ffmpeg or Node on their OS) and offer to run the command.
3. Projects go in `~/stick-studio` unless the user wants another folder: then tell them to set `STICK_WORKSPACE`. Arguments: $ARGUMENTS
4. Finish by telling them what's ready, then suggest `/stick-animation-studio:channel` and `/stick-animation-studio:scriptforge`.
