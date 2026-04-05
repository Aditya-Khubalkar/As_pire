/**
 * ═══════════════════════════════════════════════════════════
 *  theme.js  —  AS-pire Design System
 *  Edit this file to change the entire look.
 * ═══════════════════════════════════════════════════════════
 */

window.ASPIRE_THEME = {

  // ── COLORS ──────────────────────────────────────────────
  colors: {
    bg:       '#1a2e1c',
    bgGrad1:  '#0f1f10',
    bgGrad2:  '#1a2e1c',
    meshCol1: 'rgba(80,160,80,0.13)',
    meshCol2: 'rgba(40,100,50,0.18)',
    meshCol3: 'rgba(128,184,135,0.07)',

    s1:      '#162018',
    s2:      '#1e2d1f',
    s3:      '#243826',

    border:  '#2a3d2c',
    border2: '#3a5a3c',

    // Accents
    gold:  '#d4a853',
    gold2: '#f5d07a',
    gold3: '#ffe9a0',
    red:   '#cc2222',
    red2:  '#ff4040',
    rose:  '#e06b6b',
    sage:  '#72c9a0',
    lav:   '#a48de0',
    cream: '#f2ead8',

    // Text
    text:   '#e8f5e9',
    muted:  '#2a4a2c',
    muted2: '#5a8a5c',
  },

  // ── TYPOGRAPHY ──────────────────────────────────────────
  fonts: {
    display: "'Playfair Display', serif",
    body:    "'Outfit', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },

  // ── LOGO ────────────────────────────────────────────────
  logo: {
    as:   'AS',
    dash: '-',
    pire: 'pire',
  },

  // ── TAGLINE ─────────────────────────────────────────────
  tagline: 'accountability & ambition · together',

  // ── ANIMATIONS ──────────────────────────────────────────
  animations: {
    rocketEnabled:  true,
    rocketEmoji:    '🚀',
    rocketDuration: 2000,
    contentDelay:   400,

    dailyCompleteStyle:  'flowers',
    weeklyCompleteStyle: 'fireworks',

    starsEnabled:        true,
    starCount:           160,
    particlesEnabled:    true,
    cursorSparksEnabled: true,
  },

  // ── SOUNDS — disabled ───────────────────────────────────
  sounds: {
    enabled: false,
  },
};

// ── AUTO-APPLY ──────────────────────────────────────────────
(function applyTheme() {
  const C = window.ASPIRE_THEME.colors;
  const r = document.documentElement;
  const vars = {
    '--bg': C.bg, '--bg-grad1': C.bgGrad1, '--bg-grad2': C.bgGrad2,
    '--mesh1': C.meshCol1, '--mesh2': C.meshCol2, '--mesh3': C.meshCol3,
    '--s1': C.s1, '--s2': C.s2, '--s3': C.s3,
    '--border': C.border, '--border2': C.border2,
    '--gold': C.gold, '--gold2': C.gold2, '--gold3': C.gold3,
    '--red': C.red, '--red2': C.red2,
    '--cream': C.cream, '--rose': C.rose, '--sage': C.sage, '--lav': C.lav,
    '--text': C.text, '--muted': C.muted, '--muted2': C.muted2,
  };
  Object.entries(vars).forEach(([k, v]) => r.style.setProperty(k, v));
  document.body.style.background =
    `radial-gradient(ellipse at 50% 0%, ${C.bgGrad1} 0%, ${C.bg} 65%, ${C.bgGrad2} 100%)`;
})();
