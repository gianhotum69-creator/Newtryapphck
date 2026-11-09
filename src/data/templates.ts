import { TemplateApp } from '../types/appConfig';

export const TEMPLATES: TemplateApp[] = [
  {
    id: 'habit-tracker',
    name: 'Habit & Daily Task Pro',
    nameHindi: 'टास्क और आदत ट्रैकर मोबाइल ऐप',
    category: 'Productivity',
    description: 'Complete offline mobile app with local storage, touch gestures, sound effects, stats, and native haptics.',
    icon: 'CheckCircle2',
    config: {
      appName: 'DailyTask Pro',
      packageName: 'com.taskpro.app',
      themeColor: '#0ea5e9',
      backgroundColor: '#0f172a',
      orientation: 'portrait',
      permissions: {
        internet: true,
        networkState: true,
        camera: false,
        location: false,
        storage: true,
        vibration: true,
        notifications: true,
        audioRecording: false
      }
    },
    files: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>DailyTask Pro</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Mobile Status Bar Offset -->
  <div class="safe-area-top"></div>

  <!-- App Header -->
  <header class="app-header">
    <div class="header-content">
      <div>
        <span class="date-chip" id="currentDate">Today</span>
        <h1 class="app-title">My Day</h1>
      </div>
      <div class="streak-badge">
        <span class="streak-flame">🔥</span>
        <span class="streak-count" id="streakCount">5 days</span>
      </div>
    </div>
  </header>

  <!-- Main Scrollable Content -->
  <main class="app-main">
    <!-- Progress Card -->
    <div class="progress-card">
      <div class="progress-info">
        <span class="progress-label">Daily Completion</span>
        <span class="progress-percentage" id="progressText">0%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" id="progressBar"></div>
      </div>
      <p class="progress-subtitle" id="progressSub">0 of 0 tasks completed</p>
    </div>

    <!-- Quick Add Input -->
    <div class="add-task-box">
      <input type="text" id="taskInput" placeholder="Add a new task or habit..." maxlength="60" />
      <button id="addBtn" class="add-btn" aria-label="Add task">+</button>
    </div>

    <!-- Category Filter Tabs -->
    <div class="filter-tabs">
      <button class="tab-btn active" data-filter="all">All</button>
      <button class="tab-btn" data-filter="pending">Pending</button>
      <button class="tab-btn" data-filter="completed">Done</button>
    </div>

    <!-- Tasks List -->
    <ul class="task-list" id="taskList">
      <!-- Injected by JavaScript -->
    </ul>

    <!-- Empty State -->
    <div class="empty-state" id="emptyState" style="display: none;">
      <div class="empty-icon">✨</div>
      <h3>All caught up!</h3>
      <p>Add your first habit or task above to get started.</p>
    </div>
  </main>

  <!-- Bottom Navigation Bar (Android Native Style) -->
  <nav class="bottom-nav">
    <button class="nav-item active" data-nav="tasks">
      <span class="nav-icon">📋</span>
      <span class="nav-label">Tasks</span>
    </button>
    <button class="nav-item" data-nav="habits">
      <span class="nav-icon">⭐</span>
      <span class="nav-label">Habits</span>
    </button>
    <button class="nav-item" data-nav="stats">
      <span class="nav-icon">📊</span>
      <span class="nav-label">Stats</span>
    </button>
  </nav>

  <script src="app.js"></script>
</body>
</html>`,
      css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

:root {
  --primary: #0ea5e9;
  --primary-dark: #0284c7;
  --bg: #090d16;
  --surface: #131b2e;
  --surface-hover: #1c2742;
  --border: #223050;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --success: #10b981;
}

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.safe-area-top {
  height: env(safe-area-inset-top, 8px);
  background: var(--bg);
}

.app-header {
  padding: 16px 20px 12px;
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.date-chip {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
  font-weight: 600;
}

.app-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
}

.streak-flame {
  font-size: 16px;
}

.streak-count {
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
}

.app-main {
  flex: 1;
  padding: 12px 20px 84px;
  overflow-y: auto;
}

.progress-card {
  background: linear-gradient(135deg, #131b2e 0%, #1e2947 100%);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.progress-percentage {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary);
}

.progress-bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8);
  border-radius: 999px;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.add-task-box {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.add-task-box input {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.add-task-box input:focus {
  border-color: var(--primary);
}

.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  width: 48px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.2s;
}

.add-btn:active {
  transform: scale(0.94);
  background: var(--primary-dark);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--surface);
  color: #fff;
  border: 1px solid var(--border);
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.15s, opacity 0.2s, background-color 0.2s;
  cursor: pointer;
}

.task-item:active {
  transform: scale(0.98);
}

.task-item.completed {
  opacity: 0.65;
  background: rgba(19, 27, 46, 0.6);
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.task-item.completed .task-check {
  background: var(--success);
  border-color: var(--success);
}

.task-check-icon {
  display: none;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.task-item.completed .task-check-icon {
  display: block;
}

.task-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
}

.task-delete {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
}

.task-delete:hover {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.empty-state h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 6px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
  z-index: 30;
}

.nav-item {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  font-size: 20px;
}`,
      js: `// DailyTask Pro - Mobile Application Logic
(function() {
  const STORAGE_KEY = 'dailytask_pro_data_v1';
  let currentFilter = 'all';

  // Default tasks for first-time launch
  let tasks = [
    { id: '1', text: 'Morning workout & stretching (20 mins)', done: true },
    { id: '2', text: 'Review team updates & project roadmap', done: false },
    { id: '3', text: 'Drink 2.5L water throughout the day', done: false },
    { id: '4', text: 'Read 15 pages of system architecture', done: false }
  ];

  // Try loading from localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tasks = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Storage not available, using memory state:', e);
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  function playHaptic() {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  }

  // Audio chirp feedback using Web Audio API
  function playChirp(isDone) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isDone ? 587.33 : 440, ctx.currentTime);
      if (isDone) {
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  }

  // DOM Elements
  const taskListEl = document.getElementById('taskList');
  const taskInputEl = document.getElementById('taskInput');
  const addBtnEl = document.getElementById('addBtn');
  const progressTextEl = document.getElementById('progressText');
  const progressBarEl = document.getElementById('progressBar');
  const progressSubEl = document.getElementById('progressSub');
  const emptyStateEl = document.getElementById('emptyState');
  const filterBtns = document.querySelectorAll('.tab-btn');
  const currentDateEl = document.getElementById('currentDate');

  if (currentDateEl) {
    const now = new Date();
    currentDateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function render() {
    const filtered = tasks.filter(t => {
      if (currentFilter === 'pending') return !t.done;
      if (currentFilter === 'completed') return t.done;
      return true;
    });

    taskListEl.innerHTML = '';

    if (filtered.length === 0) {
      emptyStateEl.style.display = 'block';
    } else {
      emptyStateEl.style.display = 'none';
      filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' completed' : '');
        li.innerHTML = \`
          <div class="task-check">
            <span class="task-check-icon">✓</span>
          </div>
          <span class="task-text">\${escapeHtml(task.text)}</span>
          <button class="task-delete" aria-label="Delete task">✕</button>
        \`;

        // Toggle task
        li.addEventListener('click', (e) => {
          if (e.target.classList.contains('task-delete')) return;
          task.done = !task.done;
          playHaptic();
          playChirp(task.done);
          saveTasks();
          render();
        });

        // Delete task
        const delBtn = li.querySelector('.task-delete');
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          tasks = tasks.filter(t => t.id !== task.id);
          playHaptic();
          saveTasks();
          render();
        });

        taskListEl.appendChild(li);
      });
    }

    // Update Progress
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBarEl.style.width = pct + '%';
    progressTextEl.textContent = pct + '%';
    progressSubEl.textContent = \`\${completed} of \${total} tasks completed\`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function addTask() {
    const text = taskInputEl.value.trim();
    if (!text) return;
    tasks.unshift({
      id: Date.now().toString(),
      text: text,
      done: false
    });
    taskInputEl.value = '';
    playHaptic();
    saveTasks();
    render();
  }

  addBtnEl.addEventListener('click', addTask);
  taskInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Bottom Nav items click
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      playHaptic();
    });
  });

  render();
})();`
    }
  },
  {
    id: 'arcade-game',
    name: 'Space Cadet 2D Arcade',
    nameHindi: '2D मोबाइल स्पेस आर्केड गेम',
    category: 'Game',
    description: 'High-performance mobile 2D canvas shooter with dual on-screen touch controls, particle physics, and sound synthesis.',
    icon: 'Gamepad2',
    config: {
      appName: 'Space Cadet',
      packageName: 'com.arcade.spacecadet',
      themeColor: '#7c3aed',
      backgroundColor: '#030712',
      orientation: 'portrait',
      permissions: {
        internet: true,
        networkState: false,
        camera: false,
        location: false,
        storage: false,
        vibration: true,
        notifications: false,
        audioRecording: false
      }
    },
    files: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Space Cadet 2D</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-wrapper">
    <!-- Top HUD -->
    <div class="hud">
      <div class="score-box">SCORE: <span id="scoreVal">0</span></div>
      <div class="lives-box">SHIPS: <span id="livesVal">❤️❤️❤️</span></div>
    </div>

    <!-- Canvas -->
    <canvas id="gameCanvas"></canvas>

    <!-- Overlay Screen (Start / Game Over) -->
    <div id="overlay" class="overlay">
      <div class="overlay-card">
        <h1 id="overlayTitle">SPACE CADET</h1>
        <p id="overlaySubtitle">Tap anywhere to launch mission</p>
        <button id="startBtn" class="play-btn">START FLIGHT</button>
      </div>
    </div>

    <!-- Mobile Virtual Controls -->
    <div class="touch-controls">
      <button id="leftBtn" class="ctrl-btn">◀</button>
      <button id="fireBtn" class="ctrl-btn fire-btn">🔥 FIRE</button>
      <button id="rightBtn" class="ctrl-btn">▶</button>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>`,
      css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

body {
  background: #030712;
  color: #fff;
  font-family: monospace;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
}

.hud {
  position: absolute;
  top: 10px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  z-index: 10;
  pointer-events: none;
  text-shadow: 0 0 8px rgba(124, 58, 237, 0.8);
}

canvas {
  width: 100%;
  flex: 1;
  background: radial-gradient(circle at center, #0f172a 0%, #030712 100%);
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.overlay-card {
  text-align: center;
  padding: 24px;
}

.overlay-card h1 {
  font-size: 32px;
  margin-bottom: 8px;
  color: #a855f7;
  text-shadow: 0 0 16px rgba(168, 85, 247, 0.8);
}

.overlay-card p {
  color: #94a3b8;
  margin-bottom: 24px;
  font-size: 13px;
}

.play-btn {
  background: #a855f7;
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

.touch-controls {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  z-index: 15;
}

.ctrl-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 20px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ctrl-btn:active {
  background: rgba(168, 85, 247, 0.5);
  transform: scale(0.92);
}

.fire-btn {
  width: 110px;
  border-radius: 35px;
  font-size: 15px;
  font-weight: bold;
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.fire-btn:active {
  background: rgba(239, 68, 68, 0.7);
}`,
      js: `// Space Cadet - 2D Canvas Engine
(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreValEl = document.getElementById('scoreVal');
  const livesValEl = document.getElementById('livesVal');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlaySubtitle = document.getElementById('overlaySubtitle');
  const startBtn = document.getElementById('startBtn');

  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const fireBtn = document.getElementById('fireBtn');

  let width = 0;
  let height = 0;
  let isRunning = false;
  let score = 0;
  let lives = 3;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Audio effects
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let actx = null;
  function soundBeep(freq, type, duration) {
    if (!actx) try { actx = new AudioCtx(); } catch(e) { return; }
    try {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(0.05, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + duration);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch(e) {}
  }

  // Player state
  const player = {
    x: width / 2,
    y: height - 110,
    size: 26,
    speed: 6,
    movingLeft: false,
    movingRight: false
  };

  let bullets = [];
  let enemies = [];
  let stars = [];
  let particles = [];

  // Generate starfield
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * (width || 360),
      y: Math.random() * (height || 640),
      speed: 0.5 + Math.random() * 1.5,
      radius: Math.random() * 1.5
    });
  }

  function spawnEnemy() {
    if (!isRunning) return;
    enemies.push({
      x: 30 + Math.random() * (width - 60),
      y: -20,
      size: 20 + Math.random() * 8,
      speed: 1.5 + Math.random() * 2
    });
    setTimeout(spawnEnemy, 900 + Math.random() * 1100);
  }

  function shoot() {
    if (!isRunning) return;
    bullets.push({
      x: player.x,
      y: player.y - player.size,
      speed: 10
    });
    soundBeep(880, 'square', 0.1);
    if ('vibrate' in navigator) navigator.vibrate(15);
  }

  function addExplosion(x, y) {
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 25,
        color: ['#a855f7', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 3)]
      });
    }
  }

  function startGame() {
    resize();
    player.x = width / 2;
    player.y = height - 110;
    bullets = [];
    enemies = [];
    particles = [];
    score = 0;
    lives = 3;
    scoreValEl.textContent = '0';
    livesValEl.textContent = '❤️❤️❤️';
    isRunning = true;
    overlay.style.display = 'none';
    spawnEnemy();
  }

  function gameOver() {
    isRunning = false;
    overlayTitle.textContent = 'MISSION FAILED';
    overlaySubtitle.textContent = 'Final Score: ' + score;
    startBtn.textContent = 'TRY AGAIN';
    overlay.style.display = 'flex';
    soundBeep(180, 'sawtooth', 0.4);
    if ('vibrate' in navigator) navigator.vibrate([80, 50, 80]);
  }

  // Touch controls
  leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.movingLeft = true; });
  leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); player.movingLeft = false; });
  leftBtn.addEventListener('mousedown', () => { player.movingLeft = true; });
  window.addEventListener('mouseup', () => { player.movingLeft = false; player.movingRight = false; });

  rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.movingRight = true; });
  rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); player.movingRight = false; });
  rightBtn.addEventListener('mousedown', () => { player.movingRight = true; });

  fireBtn.addEventListener('touchstart', (e) => { e.preventDefault(); shoot(); });
  fireBtn.addEventListener('mousedown', () => { shoot(); });

  startBtn.addEventListener('click', startGame);

  // Keyboard support for desktop testing
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') player.movingLeft = true;
    if (e.key === 'ArrowRight' || e.key === 'd') player.movingRight = true;
    if (e.key === ' ' || e.key === 'ArrowUp') shoot();
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') player.movingLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd') player.movingRight = false;
  });

  // Game Loop
  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Render & update stars
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      s.y += s.speed;
      if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
      ctx.fillRect(s.x, s.y, s.radius, s.radius);
    });

    if (isRunning) {
      // Movement
      if (player.movingLeft && player.x > player.size) player.x -= player.speed;
      if (player.movingRight && player.x < width - player.size) player.x += player.speed;

      // Draw Player Ship
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(0, -player.size);
      ctx.lineTo(-player.size * 0.7, player.size * 0.7);
      ctx.lineTo(0, player.size * 0.4);
      ctx.lineTo(player.size * 0.7, player.size * 0.7);
      ctx.closePath();
      ctx.fill();
      // Cockpit glow
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= b.speed;
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
        if (b.y < -10) bullets.splice(i, 1);
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        en.y += en.speed;

        // Draw alien
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(en.x, en.y, en.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const dist = Math.hypot(b.x - en.x, b.y - en.y);
          if (dist < en.size) {
            addExplosion(en.x, en.y);
            soundBeep(340, 'triangle', 0.15);
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            score += 100;
            scoreValEl.textContent = score;
            break;
          }
        }

        // Check collision with player
        if (enemies[i]) {
          const distToPlayer = Math.hypot(en.x - player.x, en.y - player.y);
          if (distToPlayer < en.size + player.size * 0.6) {
            addExplosion(player.x, player.y);
            enemies.splice(i, 1);
            lives--;
            livesValEl.textContent = '❤️'.repeat(Math.max(0, lives));
            if (lives <= 0) {
              gameOver();
            }
          } else if (en.y > height + 20) {
            enemies.splice(i, 1);
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();`
    }
  },
  {
    id: 'ecommerce-shop',
    name: 'SwiftShop Mobile App',
    nameHindi: 'ई-कॉमर्स स्टोर मोबाइल ऐप',
    category: 'E-Commerce',
    description: 'Modern shopping app with bottom drawer cart, category pills, product grid, search, and checkout modal.',
    icon: 'ShoppingBag',
    config: {
      appName: 'SwiftShop',
      packageName: 'com.store.swiftshop',
      themeColor: '#10b981',
      backgroundColor: '#0a0f1d',
      orientation: 'portrait',
      permissions: {
        internet: true,
        networkState: true,
        camera: false,
        location: false,
        storage: false,
        vibration: true,
        notifications: true,
        audioRecording: false
      }
    },
    files: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>SwiftShop</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="store-header">
    <div class="top-row">
      <h1 class="brand">Swift<span>Shop</span></h1>
      <button class="cart-btn" id="openCartBtn" aria-label="Open cart">
        🛒 <span class="badge" id="cartCount">0</span>
      </button>
    </div>
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="Search gadgets, apparel, audio..." />
    </div>
  </header>

  <main class="store-body">
    <div class="category-scroll">
      <button class="cat-chip active" data-cat="all">All Items</button>
      <button class="cat-chip" data-cat="audio">Audio</button>
      <button class="cat-chip" data-cat="wearables">Wearables</button>
      <button class="cat-chip" data-cat="tech">Tech Gear</button>
    </div>

    <div class="products-grid" id="productsGrid">
      <!-- Injected by JS -->
    </div>
  </main>

  <!-- Cart Drawer -->
  <div class="cart-backdrop" id="cartBackdrop">
    <div class="cart-drawer">
      <div class="drawer-header">
        <h2>Your Shopping Bag</h2>
        <button id="closeCartBtn" class="close-btn">✕</button>
      </div>
      <div class="cart-items" id="cartItemsList">
        <p class="empty-cart-msg">Your cart is empty.</p>
      </div>
      <div class="drawer-footer">
        <div class="total-row">
          <span>Total:</span>
          <span class="total-amount" id="totalAmount">₹0.00</span>
        </div>
        <button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
      </div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>`,
      css: `* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #090d16;
  color: #f8fafc;
  min-height: 100vh;
}
.store-header {
  padding: 16px 16px 12px;
  background: #0f172a;
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #1e293b;
}
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.brand { font-size: 20px; font-weight: 700; }
.brand span { color: #10b981; }
.cart-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #fff;
  border-radius: 20px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.badge {
  background: #10b981;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}
.search-bar input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #fff;
  outline: none;
}
.store-body { padding: 14px 16px 30px; }
.category-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
}
.cat-chip {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 20px;
  white-space: nowrap;
  font-size: 13px;
  cursor: pointer;
}
.cat-chip.active { background: #10b981; color: white; border-color: #10b981; }
.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}
.prod-card {
  background: #131b2e;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}
.prod-emoji { font-size: 40px; text-align: center; margin-bottom: 8px; }
.prod-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
.prod-price { font-size: 15px; font-weight: 700; color: #10b981; margin-bottom: 8px; }
.buy-btn {
  margin-top: auto;
  background: #10b981;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.buy-btn:active { transform: scale(0.96); }

.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 50;
  display: none;
  align-items: flex-end;
}
.cart-drawer {
  background: #0f172a;
  width: 100%;
  max-height: 80vh;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.drawer-header h2 { font-size: 18px; }
.close-btn { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }
.cart-items { flex: 1; overflow-y: auto; max-height: 250px; }
.drawer-footer { border-top: 1px solid #1e293b; padding-top: 14px; margin-top: 14px; }
.total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.total-amount { color: #10b981; }
.checkout-btn {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}`,
      js: `(function() {
  const products = [
    { id: '1', name: 'Aero ANC Headphones', price: 2499, cat: 'audio', emoji: '🎧' },
    { id: '2', name: 'Titan Sport Smartwatch', price: 3999, cat: 'wearables', emoji: '⌚' },
    { id: '3', name: 'Pulse Bass Pods Pro', price: 1499, cat: 'audio', emoji: '🎵' },
    { id: '4', name: 'MagGrip Fast Wireless Pad', price: 999, cat: 'tech', emoji: '⚡' },
    { id: '5', name: 'UltraFit Fitness Band', price: 1899, cat: 'wearables', emoji: '🏃' },
    { id: '6', name: '65W GaN Travel Charger', price: 1299, cat: 'tech', emoji: '🔌' }
  ];

  let cart = [];
  let filter = 'all';

  const grid = document.getElementById('productsGrid');
  const cartCount = document.getElementById('cartCount');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const totalAmount = document.getElementById('totalAmount');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function renderProducts() {
    grid.innerHTML = '';
    const filtered = products.filter(p => filter === 'all' || p.cat === filter);
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prod-card';
      card.innerHTML = \`
        <div class="prod-emoji">\${p.emoji}</div>
        <div class="prod-title">\${p.name}</div>
        <div class="prod-price">₹\${p.price.toLocaleString()}</div>
        <button class="buy-btn" data-id="\${p.id}">Add to Bag</button>
      \`;
      card.querySelector('.buy-btn').addEventListener('click', () => {
        addToCart(p);
      });
      grid.appendChild(card);
    });
  }

  function addToCart(p) {
    cart.push(p);
    updateCartUI();
    if ('vibrate' in navigator) navigator.vibrate(30);
  }

  function updateCartUI() {
    cartCount.textContent = cart.length;
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    totalAmount.textContent = '₹' + total.toLocaleString();

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    } else {
      cartItemsList.innerHTML = '';
      cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #1e293b;';
        row.innerHTML = \`
          <span>\${item.emoji} \${item.name}</span>
          <span style="color:#10b981; font-weight:600;">₹\${item.price.toLocaleString()}</span>
        \`;
        cartItemsList.appendChild(row);
      });
    }
  }

  openCartBtn.addEventListener('click', () => { cartBackdrop.style.display = 'flex'; });
  closeCartBtn.addEventListener('click', () => { cartBackdrop.style.display = 'none'; });
  cartBackdrop.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) cartBackdrop.style.display = 'none';
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    alert('Thank you! Order placed successfully for ₹' + totalAmount.textContent);
    cart = [];
    updateCartUI();
    cartBackdrop.style.display = 'none';
  });

  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filter = chip.dataset.cat;
      renderProducts();
    });
  });

  renderProducts();
})();`
    }
  }
];
