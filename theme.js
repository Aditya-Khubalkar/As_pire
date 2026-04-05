/**
 * ═══════════════════════════════════════════════════════════
 *  theme.js  —  AS-pire Design System
 *  Now with Dark / Light mode + crazy animations
 * ═══════════════════════════════════════════════════════════
 */

window.ASPIRE_THEME = {

  currentMode: localStorage.getItem('aspire_theme_mode') || 'dark',

  dark: {
    colors: {
      bg:       '#80B887',
      bgGrad1:  '#4d8a62',
      bgGrad2:  '#2e5a44',
      meshCol1: 'rgba(180,20,20,0.14)',
      meshCol2: 'rgba(100,0,0,0.2)',
      meshCol3: 'rgba(200,40,40,0.06)',
      s1:       '#130303',
      s2:       '#1c0606',
      s3:       '#240909',
      border:   '#311010',
      border2:  '#451818',
      gold:     '#d4a853',
      gold2:    '#f5d07a',
      gold3:    '#ffe9a0',
      red:      '#cc2222',
      red2:     '#ff4040',
      rose:     '#e06b6b',
      sage:     '#72c9a0',
      lav:      '#a48de0',
      cream:    '#f2ead8',
      text:     '#f5ebe8',
      muted:    '#5a2f2f',
      muted2:   '#8a4f4f',
    }
  },

  light: {
    colors: {
      bg:       '#e8f5e9',
      bgGrad1:  '#c1e4c8',
      bgGrad2:  '#a8d9b3',
      meshCol1: 'rgba(80,140,90,0.12)',
      meshCol2: 'rgba(60,110,70,0.15)',
      meshCol3: 'rgba(100,170,110,0.08)',
      s1:       '#f8fff8',
      s2:       '#f0f9f0',
      s3:       '#e8f5e8',
      border:   '#b3d1b8',
      border2:  '#9ec3a6',
      gold:     '#d4a853',
      gold2:    '#f5d07a',
      gold3:    '#ffe9a0',
      red:      '#cc2222',
      red2:     '#ff4040',
      rose:     '#e06b6b',
      sage:     '#72c9a0',
      lav:      '#a48de0',
      cream:    '#1a2f22',
      text:     '#1a2f22',
      muted:    '#4a6b55',
      muted2:   '#6a8a75',
    }
  },

  // ── TYPOGRAPHY ──────────────────────────────────────────
  fonts: {
    display: "'Playfair Display', serif",
    body:    "'Outfit', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },

  // ── LOGO & TAGLINE ──────────────────────────────────────
  logo: { as: 'AS', dash: '-', pire: 'pire' },
  tagline: 'accountability & ambition · together',

  // ── ANIMATIONS (crazy mode enabled) ─────────────────────
  animations: {
    rocketEnabled: true,
    rocketEmoji: '🚀',
    rocketDuration: 2000,
    contentDelay: 400,

    dailyCompleteStyle: 'flowers',
    weeklyCompleteStyle: 'fireworks',

    starsEnabled: true,
    starCount: 220,                    // more stars
    particlesEnabled: true,
    cursorSparksEnabled: true,
    crazyParticles: true,              // NEW crazy mode
    taskGlowEnabled: true              // glowing tasks
  },

  // ── SOUNDS (completely disabled as requested) ───────────
  sounds: {
    enabled: false
  }
};

// ── SWITCH MODE FUNCTION ───────────────────────────────────
window.ASPIRE_THEME.switchMode = function(mode) {
  if (mode !== 'dark' && mode !== 'light') return;
  window.ASPIRE_THEME.currentMode = mode;
  localStorage.setItem('aspire_theme_mode', mode);
  applyTheme();
};

// ── APPLY THEME ─────────────────────────────────────────────
function applyTheme() {
  const mode = window.ASPIRE_THEME.currentMode;
  const colors = window.ASPIRE_THEME[mode].colors;
  const r = document.documentElement;

  const vars = {
    '--bg': colors.bg,
    '--bg-grad1': colors.bgGrad1,
    '--bg-grad2': colors.bgGrad2,
    '--mesh1': colors.meshCol1,
    '--mesh2': colors.meshCol2,
    '--mesh3': colors.meshCol3,
    '--s1': colors.s1,
    '--s2': colors.s2,
    '--s3': colors.s3,
    '--border': colors.border,
    '--border2': colors.border2,
    '--gold': colors.gold,
    '--gold2': colors.gold2,
    '--gold3': colors.gold3,
    '--red': colors.red,
    '--red2': colors.red2,
    '--cream': colors.cream,
    '--rose': colors.rose,
    '--sage': colors.sage,
    '--lav': colors.lav,
    '--text': colors.text,
    '--muted': colors.muted,
    '--muted2': colors.muted2,
  };

  Object.entries(vars).forEach(([k, v]) => r.style.setProperty(k, v));

  document.body.style.background = 
    `radial-gradient(ellipse at 50% 0%, ${colors.bgGrad1} 0%, ${colors.bg} 65%, ${colors.bgGrad2} 100%)`;

  // Force re-render on all pages
  if (typeof renderAll === 'function') renderAll();
}

applyTheme();
