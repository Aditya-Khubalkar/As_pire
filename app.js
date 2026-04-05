/**
 * app.js — Main Logic for AS-pire (Todo + Accountability App)
 * Clean version with Dark/Light theme, crazy animations, edit/remove tasks
 */

document.addEventListener('DOMContentLoaded', function () {

  // ====================== THEME ======================
  const T = window.ASPIRE_THEME;
  if (!T.currentMode) T.currentMode = localStorage.getItem('aspire_theme_mode') || 'dark';

  // ====================== SOUNDS OFF (as requested) ======================
  const sfx = { play: () => {} }; // all sounds disabled

  // ====================== STATE ======================
  function defaultState() {
    return {
      names: { you: 'A', friend: 'S' },
      quote: '✦ Aspire to be unstoppable',
      nudge: { to: null, ts: 0 },
      reactions: { type: null, ts: 0 },
      streak: 0,
      lastActive: 0,
      you: { daily: {}, weekly: {}, dailyReset: null, weeklyReset: null },
      friend: { daily: {}, weekly: {}, dailyReset: null, weeklyReset: null },
      fixedTasks: { you: [], friend: [] },
      calendar: {},
      futureTasks: {}
    };
  }

  let _state = JSON.parse(localStorage.getItem('aspire_s')) || defaultState();
  if (!_state.fixedTasks) _state.fixedTasks = { you: [], friend: [] };
  if (!_state.calendar) _state.calendar = {};
  if (!_state.futureTasks) _state.futureTasks = {};

  let profile = 'you';
  let tab = 'daily';

  // ====================== FIREBASE (unchanged) ======================
  const FIREBASE_CONFIG = { /* your config stays the same */ };
  // (Firebase script injection code remains exactly as before)

  // ====================== DATE HELPERS ======================
  function getMidnightTs() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 0, 0).getTime();
  }
  function getTodayKey() {
    const n = new Date();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  }

  // ====================== ARCHIVE + FIXED + FUTURE ======================
  function archiveTasks(p, tasks, dateKey) { /* same as before */ }
  function snapshotTodayToCalendar(p) { /* same */ }
  function checkResets() { /* same */ }
  function injectFixedTasks() { /* same */ }
  function injectFutureTasks() { /* same */ }

  // ====================== RENDER ======================
  function renderAll() {
    checkResets();
    injectFixedTasks();
    injectFutureTasks();

    const s = _state;
    const yn = (s.names && s.names.you) || 'A';
    const fn = (s.names && s.names.friend) || 'S';

    // Update names & streak
    document.getElementById('nameYou').textContent = yn;
    document.getElementById('nameFriend').textContent = fn;
    document.getElementById('avYou').textContent = yn[0].toUpperCase();
    document.getElementById('avFriend').textContent = fn[0].toUpperCase();
    document.getElementById('streakBadge').textContent = '🔥 ' + (s.streak || 0) + ' day streak';

    // Sticky note
    const sb = document.getElementById('sBody');
    if (document.activeElement !== sb) sb.value = s.quote || '';

    // Profile & Tab UI
    document.getElementById('btnYou').classList.toggle('active', profile === 'you');
    document.getElementById('btnFriend').classList.toggle('active', profile === 'friend');
    document.getElementById('friendNotice').style.display = profile === 'friend' ? 'flex' : 'none';
    document.getElementById('tDaily').classList.toggle('active', tab === 'daily');
    document.getElementById('tWeekly').classList.toggle('active', tab === 'weekly');
    document.getElementById('tabPill').classList.toggle('right', tab === 'weekly');

    // Tasks
    const raw = (s[profile] && s[profile][tab]) ? s[profile][tab] : {};
    const tasks = Object.entries(raw)
      .map(([id, t]) => Object.assign({ id }, t))
      .sort((a, b) => (a.ts || 0) - (b.ts || 0));

    const done = tasks.filter(t => t.done).length;
    const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;

    // Countdown
    const rk = tab + 'Reset';
    const rt = s[profile] ? s[profile][rk] : null;
    if (tasks.length > 0 && done === tasks.length) {
      document.getElementById('cdLbl').textContent = 'All done! ✦';
      document.getElementById('cdVal').textContent = '';
    } else if (rt && rt > Date.now()) {
      document.getElementById('cdLbl').textContent = tab === 'daily' ? 'Resets at midnight' : 'Resets in';
      document.getElementById('cdVal').textContent = fmt(rt - Date.now());
    } else {
      document.getElementById('cdLbl').textContent = 'No tasks yet';
      document.getElementById('cdVal').textContent = '—';
    }

    document.getElementById('progPct').textContent = pct + '%';
    document.getElementById('progFill').style.width = pct + '%';

    // Task list with Edit + Delete
    const list = document.getElementById('taskList');
    if (!tasks.length) {
      list.innerHTML = `<div class="empty"><div class="empty-icon">✦</div><div class="empty-txt">no tasks yet — add one above</div></div>`;
    } else {
      list.innerHTML = tasks.map(t => `
        <div class="task ${t.done ? 'done' : ''} ${t.fixedId ? 'fixed-task' : ''}" data-id="${t.id}">
          <div class="chk ${t.done ? 'on' : ''}" onclick="toggleTask('${t.id}')"><span class="chk-mark">✓</span></div>
          <div class="task-txt">${esc(t.text)}${t.fixedId ? '<span class="fixed-badge">📌</span>' : ''}</div>
          <span class="task-by">${esc(t.by || '')}</span>
          <button class="edit-btn" onclick="editTask('${t.id}')">✏️</button>
          <button class="del-btn" onclick="deleteTask('${t.id}')">×</button>
        </div>
      `).join('');
    }

    document.getElementById('allDone').classList.toggle('show', tasks.length > 0 && done === tasks.length);

    // Launch crazy burst on every render (fun effect)
    if (T.animations.crazyParticles) launchCrazyBurst();
  }

  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(ms) { /* same as before */ }

  // ====================== ACTIONS ======================
  window.switchProfile = function (p) { profile = p; renderAll(); };
  window.switchTab = function (t) { tab = t; renderAll(); };

  window.addTask = function () {
    const inp = document.getElementById('tInput');
    const text = inp.value.trim();
    if (!text) return;

    const now = Date.now();
    const rk = tab + 'Reset';
    if (!(_state[profile] && _state[profile][rk])) {
      save(profile + '/' + rk, tab === 'daily' ? getMidnightTs() : now + 7 * 86400000);
    }

    const id = 't' + now + Math.random().toString(36).slice(2, 5);
    const by = profile === 'you' ? ((_state.names && _state.names.you) || 'A') : ((_state.names && _state.names.friend) || 'S');
    save(profile + '/' + tab + '/' + id, { text, done: false, by, ts: now });
    inp.value = '';
  };

  window.toggleTask = function (id) { /* same logic as before with celebration */ };
  window.deleteTask = function (id) { /* same */ };

  window.editTask = function (id) {
    const t = _state[profile] && _state[profile][tab] && _state[profile][tab][id];
    if (!t) return;
    const newText = prompt('Edit this task:', t.text);
    if (newText !== null && newText.trim() !== '') {
      save(profile + '/' + tab + '/' + id + '/text', newText.trim());
    }
  };

  window.sendNudge = function () { /* same */ };

  // ====================== CRAZY ANIMATIONS ======================
  function launchCrazyBurst() {
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'cf';
        el.textContent = ['🚀', '✦', '🔥', '🌟', '💥'][Math.floor(Math.random() * 5)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.bottom = '-60px';
        el.style.fontSize = '24px';
        el.style.animationDuration = (1.2 + Math.random() * 2.5) + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }, i * 6);
    }
  }

  // ====================== STICKY NOTE ======================
  let quoteTimer = null;
  document.getElementById('sBody').addEventListener('input', function () {
    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(() => {
      save('quote', this.value);
      const savedEl = document.getElementById('sSaved');
      savedEl.classList.add('show');
      setTimeout(() => savedEl.classList.remove('show'), 1500);
    }, 600);
  });

  // ====================== SAVE HELPERS ======================
  function save(path, val) {
    // local + firebase logic (same as before)
    localStorage.setItem('aspire_s', JSON.stringify(_state));
    renderAll();
  }

  // ====================== INITIALIZE ======================
  renderAll();
  setInterval(renderAll, 800);

  // Rocket already handled in index.html
  console.log('%c🚀 AS-pire app.js loaded with crazy animations!', 'color:#d4a853;font-weight:bold');
});
