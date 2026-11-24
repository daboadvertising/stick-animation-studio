// Stick Animation Studio runtime: styles.js (MIT)
// A style supplies figure colours, UI tokens and a light post grade. The kit reads S().ink, S().feature and S().ui.accent.
const UI = { card: '#ffffff', cardLine: '#d9d3c7', text: '#2a2a2a', sub: '#8a8478', cream: '#1c1c1c', blueprint: '#2b2b2b', bpBg: '#f6f3ee', good: '#f07a1a' };
const base = (name, accent, grade) => ({ name, ink: '#141414', inkFar: '#3a3a3a', feature: '#ffffff', rimWidth: 0, ui: { ...UI, accent, gold: accent }, grade: { vignette: 0, grain: 0, ...grade }, mood: {} });
export const STYLES = {
  // noir: the kit remaps each finished shot to black / white / channel accent
  noir: base('Noir', '#e8141e', { vignette: 0.12 }),
  // pictogram (a.k.a. classic): off-white backgrounds, black figures, orange accent
  pictogram: base('Pictogram', '#f07a1a', { vignette: 0.08, grain: 0.012 }),
};
STYLES.classic = STYLES.pictogram;
export const STYLE_IDS = Object.keys(STYLES);
