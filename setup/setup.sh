#!/usr/bin/env bash
# Stick Animation Studio: environment check & install (safe to re-run). MIT licence.
set -u
HERE="$(cd "$(dirname "$0")/.." && pwd)"; ENGINE="$HERE/engine"; RUNTIME="$ENGINE/runtime"; MISSING=0
ok(){ echo "✔ $*"; }; miss(){ echo "✖ $*"; MISSING=1; }
command -v python3 >/dev/null && ok "python3 $(python3 -V 2>&1 | cut -d' ' -f2)" || miss "python3 (3.9+): install Python from python.org"
command -v node >/dev/null && ok "node $(node -v)" || miss "node (18+): install Node.js from nodejs.org"
command -v ffmpeg >/dev/null && ok "ffmpeg" || miss "ffmpeg: 'brew install ffmpeg' (Mac), 'sudo apt-get install -y ffmpeg' (Linux) or 'winget install ffmpeg' (Windows)"
if python3 -c "import numpy, scipy, pocketsphinx" 2>/dev/null; then ok "python packages (numpy, scipy, pocketsphinx)"
else echo "… installing numpy scipy pocketsphinx"; python3 -m pip install -q numpy scipy pocketsphinx && ok "python packages installed" || miss "python3 -m pip install numpy scipy pocketsphinx"; fi
if command -v node >/dev/null; then
  if (cd "$RUNTIME" && node -e "require('playwright')" 2>/dev/null); then ok "renderer (playwright)"
  else echo "… installing the renderer"; (cd "$RUNTIME" && npm install --silent --no-fund --no-audit) && ok "renderer installed" || miss "cd \"$RUNTIME\" && npm install"; fi
  if (cd "$RUNTIME" && node -e "const {chromium}=require('playwright');chromium.launch().then(b=>b.close()).catch(()=>process.exit(1))" 2>/dev/null); then ok "headless Chromium"
  else echo "… downloading headless Chromium (one time)"; (cd "$RUNTIME" && npx --yes playwright install chromium) && ok "headless Chromium" || miss "cd \"$RUNTIME\" && npx playwright install chromium"; fi
fi
[ "$MISSING" = 0 ] && python3 "$ENGINE/ss.py" install && ok "workspace: ${STICK_WORKSPACE:-$HOME/stick-studio}"
[ "$MISSING" = 0 ] && { echo; ok "All set. Try /stick-animation-studio:scriptforge"; } || { echo; echo "Fix the ✖ items above, then re-run this script."; exit 1; }
