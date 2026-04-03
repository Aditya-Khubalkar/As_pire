/* ============================================================
   APP.JS — As_pire App
   ============================================================ */

const SUPABASE_URL = 'https://cfclrbijmpjqkstcgmnn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_secret_WCfgiBc163hOywTaWy2p8g_0Vz3Tyly';

let supabase = null;

async function initSupabase() {
  const { createClient } = window.supabase;
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { params: { eventsPerSecond: 10 } }
  });
  return supabase;
}

const AppState = { currentUser: null, theme: 'light', stickyNote: '', tasks: {} };

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  AppState.theme = theme;
  localStorage.setItem('aspire_theme', theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.checked = (theme === 'dark');
}

function loadTheme() { applyTheme(localStorage.getItem('aspire_theme') || 'light'); }
function toggleTheme() { applyTheme(AppState.theme === 'dark' ? 'light' : 'dark'); }

async function login(username, password) {
  if (!supabase) await initSupabase();
  const email = `${username.toLowerCase()}@aspire.local`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const user = { id: data.user.id, username, email };
  AppState.currentUser = user;
  sessionStorage.setItem('aspire_user', JSON.stringify(user));
  return user;
}

async function register(username, password) {
  if (!supabase) await initSupabase();
  const email = `${username.toLowerCase()}@aspire.local`;
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
  if (error) throw error;
  return data;
}

async function logout() {
  if (supabase) await supabase.auth.signOut();
  sessionStorage.removeItem('aspire_user');
  AppState.currentUser = null;
  window.location.replace('auth.html');
}

function getSessionUser() {
  try {
    const saved = sessionStorage.getItem('aspire_user');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

// Strictly checks login and kicks user to auth screen if needed
function requireAuth() {
  const user = getSessionUser();
  if (!user) { window.location.replace('auth.html'); return null; }
  AppState.currentUser = user;
  return user;
}

function todayStr() { return new Date().toISOString().split('T')[0]; }
function weekKey() {
  const d = new Date(); const day = d.getDay() || 7;
  d.setHours(0,0,0,0); d.setDate(d.getDate() + 1 - day);
  return d.toISOString().split('T')[0];
}

async function fetchTasksForUser(username) {
  if (!supabase) await initSupabase();
  const { data, error } = await supabase.from('tasks').select('*').eq('username', username).order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function addTask({ username, text, type, date_key, week_key, is_fixed = false }) {
  if (!supabase) await initSupabase();
  const { data, error } = await supabase.from('tasks').insert([{ username, text, type, date_key, week_key, is_fixed, completed: false, completed_dates: [] }]).select().single();
  if (error) throw error;
  return data;
}

async function updateTask(id, updates) {
  if (!supabase) await initSupabase();
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteTask(id) {
  if (!supabase) await initSupabase();
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

async function toggleTaskCompletedOnDate(taskId, dateStr, isCompleted) {
  if (!supabase) await initSupabase();
  const { data: task } = await supabase.from('tasks').select('completed_dates, completed').eq('id', taskId).single();
  let dates = task.completed_dates || [];
  const isToday = (dateStr === todayStr());
  if (isCompleted) { if (!dates.includes(dateStr)) dates.push(dateStr); } else dates = dates.filter(d => d !== dateStr);
  const updates = { completed_dates: dates };
  if (isToday) updates.completed = isCompleted;
  return updateTask(taskId, updates);
}

async function fetchStickyNote() {
  if (!supabase) await initSupabase();
  const { data } = await supabase.from('settings').select('value').eq('key', 'sticky_note').single();
  return data?.value || '';
}

async function saveStickyNote(text) {
  if (!supabase) await initSupabase();
  await supabase.from('settings').upsert({ key: 'sticky_note', value: text }, { onConflict: 'key' });
}

function subscribeToTasks(onUpdate) { if (!supabase) return; return supabase.channel('tasks-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, onUpdate).subscribe(); }
function subscribeToSettings(onUpdate) { if (!supabase) return; return supabase.channel('settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, onUpdate).subscribe(); }
function getFixedTasksAsDaily(allTasks, username, dateStr) { return allTasks.filter(t => t.username === username && t.is_fixed && t.type === 'daily'); }
function getDailyTasks(allTasks, username, dateStr) { return allTasks.filter(t => t.username === username && t.type === 'daily' && !t.is_fixed && t.date_key === dateStr); }
function getWeeklyTasks(allTasks, username, wk) { return allTasks.filter(t => t.username === username && t.type === 'weekly' && t.week_key === wk); }

async function clearUserData(username, scope) {
  if (!supabase) await initSupabase();
  let query = supabase.from('tasks').delete().eq('username', username).eq('is_fixed', false);
  const today = new Date();
  if (scope === 'today') query = query.eq('date_key', todayStr());
  else if (scope === 'week') query = query.eq('week_key', weekKey());
  else if (scope === 'month') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(today.getFullYear(), today.getMonth()+1, 0).toISOString().split('T')[0];
    query = query.gte('date_key', monthStart).lte('date_key', monthEnd);
  }
  const { error } = await query;
  if (error) throw error;
}

function isWeeklyExpired(weekKeyStr) {
  if (!weekKeyStr) return false;
  const diff = (new Date() - new Date(weekKeyStr)) / (1000 * 60 * 60 * 24);
  return diff >= 7;
}

function scheduleMidnightReset(callback) {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => { callback(); setInterval(callback, 24 * 60 * 60 * 1000); }, midnight - now);
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'toast-container'; document.body.appendChild(container); }
  const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function escapeHtml(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  if (typeof window.supabase !== 'undefined') initSupabase().catch(console.error);
});

// ── DRAGGABLE STICKY NOTE (Highly optimized tracking) ──
const wrapper = document.getElementById('stickyWrapper');
let isDragging = false, offsetX, offsetY;

if (wrapper) {
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    isDragging = true;
    const rect = wrapper.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    wrapper.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    wrapper.style.left = (e.clientX - offsetX) + 'px';
    wrapper.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if(isDragging) {
      isDragging = false;
      wrapper.style.cursor = 'default';
    }
  });
}
