/**
 * ═══════════════════════════════════════════════════════════
 *  theme.js  —  AS-pire Design System
 *
 *  This is the ONE file you edit to change the entire look.
 *  Colors, fonts, animations, logo text — all here.
 *  No need to touch index.html, styles.css, or any other file.
 * ═══════════════════════════════════════════════════════════
 */

window.ASPIRE_THEME = {

  // ── COLORS ──────────────────────────────────────────────
  colors: {
    bg:       '#080000',     // page background (deep black-red)
    bgGrad1:  '#1c0404',     // top gradient (dark crimson)
    bgGrad2:  '#080000',     // bottom gradient
    meshCol1: 'rgba(180,20,20,0.14)',   // background mesh blob 1
    meshCol2: 'rgba(100,0,0,0.2)',      // background mesh blob 2
    meshCol3: 'rgba(200,40,40,0.06)',   // background mesh blob 3

    s1:      '#130303',   // card backgrounds
    s2:      '#1c0606',   // input / hover surfaces
    s3:      '#240909',   // subtle backgrounds

    border:  '#311010',   // default border
    border2: '#451818',   // stronger border

    // Accents
    gold:  '#d4a853',
    gold2: '#f5d07a',
    gold3: '#ffe9a0',
    red:   '#cc2222',     // primary red accent
    red2:  '#ff4040',     // brighter red
    rose:  '#e06b6b',
    sage:  '#72c9a0',
    lav:   '#a48de0',
    cream: '#f2ead8',

    // Text
    text:   '#f5ebe8',
    muted:  '#5a2f2f',
    muted2: '#8a4f4f',
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
    // Rocket intro on page load
    rocketEnabled:  true,
    rocketEmoji:    '🚀',
    rocketDuration: 2000,   // ms for rocket to fly
    contentDelay:   400,    // ms pause before content fades in

    // Completion celebrations
    dailyCompleteStyle:  'flowers',    // 'flowers' | 'confetti' | 'glitter'
    weeklyCompleteStyle: 'fireworks',  // 'fireworks' | 'stars' | 'glitter'

    // Background effects
    starsEnabled:        true,
    starCount:           160,
    particlesEnabled:    true,
    cursorSparksEnabled: true,
  },

  // ── SOUNDS ──────────────────────────────────────────────
  sounds: {
    enabled: true,
    click:   'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    done:    'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    del:     'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    nudge:   'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  },
};

// ── AUTO-APPLY: Injects CSS variables into :root from theme above ──
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
  // Apply body background
  document.body.style.background =
    `radial-gradient(ellipse at 50% 0%, ${C.bgGrad1} 0%, ${C.bg} 65%, ${C.bgGrad2} 100%)`;
})();
