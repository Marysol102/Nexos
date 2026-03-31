// ═══════════════════════════════════════════════════════════════
//  NEXOS – LÓGICA DEL JUEGO
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
//  FIREBASE
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDWST4NKU_roqoGsMAAevs4zd-c4IqAOEU",
  authDomain:        "digitcode-d991e.firebaseapp.com",
  databaseURL:       "https://digitcode-d991e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "digitcode-d991e",
  storageBucket:     "digitcode-d991e.firebasestorage.app",
  messagingSenderId: "958984288633",
  appId:             "1:958984288633:web:c88980de5de0a5422597a8"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
} catch (e) {
  console.warn('Firebase no disponible:', e);
}

// Lee los overrides de un día desde Firebase
async function fetchOverrides(dayIdx) {
  if (!db) return {};
  try {
    const snap = await db.ref(`nexos/overrides/${dayIdx}`).get();
    return snap.exists() ? snap.val() : {};
  } catch {
    return {};
  }
}

// Guarda overrides completos de un día
async function saveOverrides(dayIdx, overrides) {
  if (!db) throw new Error('Firebase no disponible');
  await db.ref(`nexos/overrides/${dayIdx}`).set(overrides);
}

// Borra overrides de un día
async function clearOverridesFirebase(dayIdx) {
  if (!db) return;
  await db.ref(`nexos/overrides/${dayIdx}`).remove();
}

// Guarda una sugerencia nueva en Firebase
async function saveSuggestion(cat, words) {
  if (!db) throw new Error('Firebase no disponible');
  const key  = db.ref('nexos/suggestions').push().key;
  const data = { cat, words, ts: Date.now(), read: false };
  await db.ref(`nexos/suggestions/${key}`).set(data);
}

// Lee todas las sugerencias no leídas
async function fetchSuggestions() {
  if (!db) return [];
  try {
    const snap = await db.ref('nexos/suggestions').get();
    if (!snap.exists()) return [];
    const all = [];
    snap.forEach(child => all.push({ id: child.key, ...child.val() }));
    return all.filter(s => !s.read).sort((a, b) => b.ts - a.ts);
  } catch { return []; }
}

// Marca una sugerencia como leída
async function dismissSuggestion(id) {
  if (!db) return;
  await db.ref(`nexos/suggestions/${id}/read`).set(true);
}

// Marca todas como leídas
async function dismissAllSuggestions() {
  const suggestions = await fetchSuggestions();
  await Promise.all(suggestions.map(s => dismissSuggestion(s.id)));
}


// ─────────────────────────────────────────────────────────────
const EMO             = { yellow: '🟨', green: '🟩', blue: '🟦', purple: '🟪' };
const MAX_ERRORS      = 4;
const WORDS_PER_GROUP = 4;
const COLORS          = ['yellow', 'green', 'blue', 'purple'];

// ─────────────────────────────────────────────────────────────
//  DÍAS
// ─────────────────────────────────────────────────────────────
function getTodayIdx() {
  const origin = new Date(2025, 0, 1);
  const today  = new Date(); today.setHours(0, 0, 0, 0);
  return Math.floor((today - origin) / 86400000);
}

function dayIdxToDate(idx) {
  const d = new Date(2025, 0, 1);
  d.setDate(d.getDate() + idx);
  return d;
}

function formatDate(idx, opts) {
  return dayIdxToDate(idx).toLocaleDateString('es-ES', opts);
}

// ─────────────────────────────────────────────────────────────
//  GENERACIÓN DEL PUZZLE
// ─────────────────────────────────────────────────────────────
function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickN(arr, n, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// Devuelve la categoría base (sin override) para un color y día
function baseCatForDay(color, dayIdx) {
  const pool   = CATEGORIAS[color];
  const catIdx = dayIdx % pool.length;
  return pool[catIdx];
}

// Construye el puzzle completo, respetando overrides
// overrides = { yellow: "nombre de cat", green: ..., ... }
function buildPuzzleForDay(dayIdx, overrides = {}) {
  const grupos = [];

  COLORS.forEach((color, ci) => {
    // Buscar la categoría: override primero, luego base
    let cat;
    if (overrides[color]) {
      // Buscar en TODOS los pools por nombre
      cat = findCatByName(overrides[color]);
    }
    if (!cat) cat = baseCatForDay(color, dayIdx);

    const catIdx = CATEGORIAS[color].indexOf(cat);
    const rng    = seededRng(dayIdx * 100 + ci * 1000 + Math.max(catIdx, 0) * 7);
    const words  = pickN(cat.words, WORDS_PER_GROUP, rng);
    grupos.push({ color, cat: cat.cat, words });
  });

  return { grupos };
}

// Busca una categoría por su campo `cat` (nombre) en todos los pools
function findCatByName(name) {
  for (const color of COLORS) {
    const found = CATEGORIAS[color].find(c => c.cat === name);
    if (found) return found;
  }
  return null;
}

// Lista plana de todas las categorías de todos los pools
function allCategories() {
  const list = [];
  COLORS.forEach(color => {
    CATEGORIAS[color].forEach(c => list.push({ color, cat: c.cat }));
  });
  return list;
}

// ─────────────────────────────────────────────────────────────
//  ESTADO DEL JUEGO
// ─────────────────────────────────────────────────────────────
let puzzle, selected, solved, mistakes, history, gameOver, order;
let isReto  = false;
let retoIdx = null;
let viewDay = getTodayIdx();

function resetState() {
  selected = [];
  solved   = [];
  mistakes = 0;
  history  = [];
  gameOver = false;
  order    = shuffle(puzzle.grupos.flatMap(g => g.words));
}

// ─────────────────────────────────────────────────────────────
//  PERSISTENCIA LOCAL
// ─────────────────────────────────────────────────────────────
function saveKey(day)  { return `nexos_day_${day}`; }
function retoSaveKey() { return `nexos_reto_${retoIdx}`; }

function loadSave(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

function save() {
  try {
    const data = { solved, mistakes, history, gameOver, order };
    localStorage.setItem(
      isReto ? retoSaveKey() : saveKey(viewDay),
      JSON.stringify(isReto ? { retoIdx, ...data } : data)
    );
  } catch {}
}

// ─────────────────────────────────────────────────────────────
//  INICIO
// ─────────────────────────────────────────────────────────────
async function init() {
  const params  = new URLSearchParams(window.location.search);
  const retoB64 = params.get('reto');

  if (retoB64) {
    try {
      const data = JSON.parse(atob(retoB64));
      puzzle  = data.puzzle;
      retoIdx = data.idx;
      isReto  = true;
      document.getElementById('reto-banner').classList.remove('hidden');
      hideNavigation();

      const sv = loadSave(retoSaveKey());
      if (sv && sv.retoIdx === retoIdx) {
        ({ solved, mistakes, history, gameOver, order } = sv);
      } else {
        resetState();
      }
    } catch {
      await loadDay(getTodayIdx());
    }
  } else {
    viewDay = getTodayIdx();
    await loadDay(viewDay);
    setupNavigation();
  }

  setupGodMode();
  setupSuggestModal();
  updateDateLabel();
  render();
  if (gameOver) setTimeout(showModal, 400);
}

async function loadDay(dayIdx) {
  viewDay = dayIdx;
  isReto  = false;

  // Obtener overrides de Firebase
  const overrides = await fetchOverrides(dayIdx);
  puzzle = buildPuzzleForDay(dayIdx, overrides);

  const sv = loadSave(saveKey(dayIdx));
  if (sv) {
    ({ solved, mistakes, history, gameOver, order } = sv);
    if (!order || order.length === 0) {
      const solvedW = sv.solved.flatMap(g => g.words);
      order = shuffle(puzzle.grupos.flatMap(g => g.words).filter(w => !solvedW.includes(w)));
    }
  } else {
    resetState();
  }

  selected = [];
  updateDateLabel();
  updateNavigationBtns();
  render();
  clearHint();
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────
//  NAVEGACIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────
function setupNavigation() {
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (viewDay > 0) loadDay(viewDay - 1);
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    if (viewDay < getTodayIdx()) loadDay(viewDay + 1);
  });
  document.getElementById('btn-today').addEventListener('click', () => {
    loadDay(getTodayIdx());
  });
}

function hideNavigation() {
  ['btn-prev','btn-next','btn-today'].forEach(id =>
    document.getElementById(id).style.display = 'none'
  );
}

function updateNavigationBtns() {
  const today  = getTodayIdx();
  const isPast = viewDay < today;
  document.getElementById('btn-prev').disabled = viewDay <= 0;
  document.getElementById('btn-next').disabled = viewDay >= today;
  document.getElementById('btn-today').classList.toggle('visible', isPast);
  document.getElementById('past-badge').classList.toggle('visible', isPast);
}

function updateDateLabel() {
  const today = getTodayIdx();
  const opts  = { weekday: 'long', day: 'numeric', month: 'long' };
  let label   = formatDate(viewDay, opts);
  if (isReto)                   label = `Reto · ${formatDate(viewDay, { day: 'numeric', month: 'long' })}`;
  else if (viewDay === today-1) label = `Ayer · ${formatDate(viewDay, { day: 'numeric', month: 'long' })}`;
  document.getElementById('date-label').textContent = label;
}

// ─────────────────────────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────────────────────────
function solvedWords() { return solved.flatMap(g => g.words); }
function remaining()   { return order.filter(w => !solvedWords().includes(w)); }

function render() {
  renderSolved();
  renderGrid();
  renderDots();
  updateBtns();
}

function renderSolved() {
  const c = document.getElementById('solved-container');
  c.innerHTML = '';
  solved.forEach(g => c.appendChild(makeBanner(g, false)));
}

function makeBanner(g, missed = false) {
  const d = document.createElement('div');
  d.className = `solved-group ${missed ? 'missed' : g.color}`;
  d.innerHTML = missed
    ? `<div class="missed-label">Sin resolver</div>
       <div class="solved-cat">${g.cat}</div>
       <div class="solved-words">${g.words.join(' · ')}</div>`
    : `<div class="solved-cat">${g.cat}</div>
       <div class="solved-words">${g.words.join(' · ')}</div>`;
  return d;
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  order = remaining();
  order.forEach(word => {
    const t = document.createElement('div');
    t.className = 'tile' + (selected.includes(word) ? ' selected' : '');
    t.textContent = word;
    t.dataset.word = word;
    t.style.fontSize = tileFont(word);
    t.addEventListener('click', () => clickTile(word));
    grid.appendChild(t);
  });
}

function tileFont(w) {
  const n = w.length;
  if (n <= 5)  return '0.92rem';
  if (n <= 8)  return '0.8rem';
  if (n <= 12) return '0.68rem';
  return '0.56rem';
}

function renderDots() {
  const c = document.getElementById('dots');
  c.innerHTML = '';
  for (let i = 0; i < MAX_ERRORS; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i < mistakes ? ' gone' : '');
    c.appendChild(d);
  }
}

function updateBtns() {
  document.getElementById('btn-clear').disabled   = selected.length === 0 || gameOver;
  document.getElementById('btn-submit').disabled  = selected.length !== 4 || gameOver;
  document.getElementById('btn-shuffle').disabled = gameOver;
}

// ─────────────────────────────────────────────────────────────
//  TILES
// ─────────────────────────────────────────────────────────────
function clickTile(word) {
  if (gameOver) return;
  const i = selected.indexOf(word);
  if (i >= 0) { selected.splice(i, 1); }
  else {
    if (selected.length >= 4) return;
    selected.push(word);
    animateTile(word, 'pop');
  }
  refreshTiles(); clearHint(); updateBtns();
}

function refreshTiles() {
  document.querySelectorAll('.tile').forEach(t =>
    t.classList.toggle('selected', selected.includes(t.dataset.word))
  );
}

function animateTile(word, cls) {
  const t = document.querySelector(`.tile[data-word="${CSS.escape(word)}"]`);
  if (!t) return;
  t.classList.add(cls);
  t.addEventListener('animationend', () => t.classList.remove(cls), { once: true });
}

function clearHint() { document.getElementById('one-away').textContent = ''; }

// ─────────────────────────────────────────────────────────────
//  ENVIAR RESPUESTA
// ─────────────────────────────────────────────────────────────
function submitGuess() {
  if (selected.length !== 4 || gameOver) return;

  const match = puzzle.grupos.find(g =>
    g.words.every(w => selected.includes(w)) && !solved.find(s => s.cat === g.cat)
  );

  if (match) {
    history.push({ words: [...selected], color: match.color, ok: true });
    selected.forEach((w, i) => setTimeout(() => animateTile(w, 'pop'), i * 70));
    setTimeout(() => {
      solved.push(match); selected = [];
      save(); render(); clearHint();
      if (solved.length === puzzle.grupos.length) {
        gameOver = true; save(); setTimeout(showModal, 500);
      }
    }, selected.length * 70 + 200);

  } else {
    history.push({ words: [...selected], color: null, ok: false });
    mistakes++;
    selected.forEach(w => animateTile(w, 'shake'));
    const near = puzzle.grupos.find(g =>
      g.words.filter(w => selected.includes(w)).length === 3
    );
    setTimeout(() => {
      if (near) document.getElementById('one-away').textContent = '¡Casi! Te falta una 🤏';
      save(); renderDots(); updateBtns();
      if (mistakes >= MAX_ERRORS) {
        gameOver = true; selected = []; save(); render(); setTimeout(showModal, 500);
      }
    }, 450);
  }
}

// ─────────────────────────────────────────────────────────────
//  MODAL FINAL
// ─────────────────────────────────────────────────────────────
function buildEmojiGrid() {
  return history.map(h => {
    if (h.ok) return EMO[h.color].repeat(4);
    return h.words.map(w => {
      const g = puzzle.grupos.find(g => g.words.includes(w));
      return g ? EMO[g.color] : '⬜';
    }).join('');
  }).join('\n');
}

function showModal() {
  const won    = solved.length === puzzle.grupos.length;
  const today  = getTodayIdx();
  const isPast = viewDay < today;
  const tag    = isReto
    ? `Reto #${retoIdx + 1}`
    : isPast
      ? `#${viewDay + 1} (${formatDate(viewDay, { day: 'numeric', month: 'long' })})`
      : `#${viewDay + 1}`;

  document.getElementById('m-emoji').textContent = won ? '🎉' : '😔';
  document.getElementById('m-title').textContent = won ? '¡Enhorabuena!' : 'Hasta la próxima…';
  document.getElementById('m-sub').textContent   = won
    ? `Resolviste NEXOS ${tag}${mistakes === 0 ? ' sin errores 🏆' : ` con ${mistakes} error${mistakes !== 1 ? 'es' : ''}`}`
    : `NEXOS ${tag} · Solución:`;

  const sol = document.getElementById('m-solution');
  sol.innerHTML = '';
  COLORS.forEach(color => {
    const grupo     = puzzle.grupos.find(g => g.color === color);
    if (!grupo) return;
    const wasSolved = solved.find(s => s.cat === grupo.cat);
    sol.appendChild(makeBanner(grupo, !wasSolved));
  });

  document.getElementById('m-grid').textContent = buildEmojiGrid();

  const retoBtn = document.getElementById('btn-reto');
  if (isReto || isPast) { retoBtn.classList.add('hidden'); }
  else { retoBtn.classList.remove('hidden'); retoBtn.onclick = shareReto; }

  document.getElementById('modal-overlay').classList.remove('hidden');
}

document.getElementById('btn-close-modal').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('hidden');
});
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').classList.add('hidden');
});

// ─────────────────────────────────────────────────────────────
//  COMPARTIR
// ─────────────────────────────────────────────────────────────
function shareResult() {
  const today  = getTodayIdx();
  const isPast = viewDay < today;
  const tag    = isReto
    ? `Reto #${retoIdx + 1}`
    : isPast
      ? `#${viewDay + 1} (${formatDate(viewDay, { day: 'numeric', month: 'long' })})`
      : `#${viewDay + 1}`;
  doShare(`NEXOS ${tag}\n${document.getElementById('m-grid').textContent}\n\nhttps://marydeveloper.github.io/nexos/`);
}

function shareReto() {
  const b64 = btoa(JSON.stringify({ puzzle, idx: viewDay }));
  const url = `${location.origin}${location.pathname}?reto=${b64}`;
  doShare(`¡Te reto a este NEXOS!\n🔗 ${url}`);
}

function doShare(txt) {
  if (navigator.share) navigator.share({ text: txt }).catch(() => copyToClipboard(txt));
  else copyToClipboard(txt);
}

function copyToClipboard(txt) {
  navigator.clipboard.writeText(txt).then(() => {
    const b = document.getElementById('btn-share');
    const orig = b.textContent;
    b.textContent = '✅ ¡Copiado!';
    setTimeout(() => { b.textContent = orig; }, 2500);
  });
}

// ─────────────────────────────────────────────────────────────
//  MODAL SUGERENCIA
// ─────────────────────────────────────────────────────────────
function setupSuggestModal() {
  const overlay  = document.getElementById('suggest-overlay');
  const closeBtn = document.getElementById('btn-close-suggest');
  const sendBtn  = document.getElementById('btn-send-suggest');
  const catInput = document.getElementById('suggest-cat');
  const wordsInput = document.getElementById('suggest-words');
  const status   = document.getElementById('suggest-status');

  // Abrir desde reglas
  document.getElementById('btn-open-suggest').addEventListener('click', () => {
    document.getElementById('rules-overlay').classList.add('hidden');
    catInput.value   = '';
    wordsInput.value = '';
    status.textContent = '';
    overlay.classList.remove('hidden');
    setTimeout(() => catInput.focus(), 100);
  });

  closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  sendBtn.addEventListener('click', async () => {
    const cat   = catInput.value.trim();
    const words = wordsInput.value.trim();

    if (!cat) { catInput.focus(); return; }

    sendBtn.disabled = true;
    try {
      await saveSuggestion(cat, words);
      status.style.color = '#7bc67e';
      status.textContent = '✅ ¡Sugerencia enviada!';
      catInput.value     = '';
      wordsInput.value   = '';
      setTimeout(() => overlay.classList.add('hidden'), 1500);
    } catch {
      status.style.color = '#c97b6e';
      status.textContent = '❌ Error al enviar. Inténtalo de nuevo.';
    } finally {
      sendBtn.disabled = false;
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  🔱 MODO DIOS
// ─────────────────────────────────────────────────────────────
let godDay        = getTodayIdx() + 1;   // mañana por defecto
let godOverrides  = {};                  // overrides cargados del día activo en el panel

function setupGodMode() {
  // Konami: ↑↑↓↓←→←→BA
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let kIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) { kIdx = 0; openGodPanel(); }
    } else {
      kIdx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  document.getElementById('god-close').addEventListener('click', closeGodPanel);
  document.getElementById('god-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('god-overlay')) closeGodPanel();
  });

  // Navegación días
  document.getElementById('god-prev').addEventListener('click', () => {
    if (godDay > 0) { godDay--; loadGodDay(); }
  });
  document.getElementById('god-next').addEventListener('click', () => {
    godDay++; loadGodDay();
  });

  // Botones puzzle
  document.getElementById('god-save').addEventListener('click', godSave);
  document.getElementById('god-clear').addEventListener('click', godClearDay);

  // Tabs
  document.querySelectorAll('.god-tab').forEach(tab => {
    tab.addEventListener('click', () => switchGodTab(tab.dataset.tab));
  });

  // Botón "marcar todas leídas"
  document.getElementById('god-dismiss-all').addEventListener('click', async () => {
    await dismissAllSuggestions();
    await loadGodSuggestions();
    showGodStatus('✅ Todas marcadas como leídas', '#7bc67e');
  });
}

function switchGodTab(tabName) {
  document.querySelectorAll('.god-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tabName)
  );
  document.querySelectorAll('.god-tab-content').forEach(c =>
    c.classList.toggle('active', c.id === `god-content-${tabName}`)
  );
  if (tabName === 'suggest') loadGodSuggestions();
}

async function openGodPanel() {
  godDay = getTodayIdx() + 1;
  // Siempre abrir en tab puzzle
  switchGodTab('puzzle');
  document.getElementById('god-overlay').classList.remove('hidden');
  await loadGodDay();
  // Cargar badge de sugerencias
  await updateSuggestBadge();
}

async function updateSuggestBadge() {
  const suggestions = await fetchSuggestions();
  const badge = document.getElementById('suggest-badge');
  if (suggestions.length > 0) {
    badge.textContent = suggestions.length;
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }
}

async function loadGodSuggestions() {
  const list = document.getElementById('god-suggest-list');
  list.innerHTML = '<div class="suggest-empty">Cargando…</div>';

  const suggestions = await fetchSuggestions();
  await updateSuggestBadge();

  if (suggestions.length === 0) {
    list.innerHTML = '<div class="suggest-empty">No hay sugerencias pendientes 🎉</div>';
    return;
  }

  list.innerHTML = '';
  suggestions.forEach(s => {
    const card = document.createElement('div');
    card.className = 'suggest-card';

    const date = new Date(s.ts).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    card.innerHTML = `
      <button class="suggest-card-dismiss" title="Marcar como leída" data-id="${s.id}">✕</button>
      <div class="suggest-card-cat">${s.cat}</div>
      <div class="suggest-card-words">${s.words || '<em style="color:#555">Sin palabras</em>'}</div>
      <div class="suggest-card-date">${date}</div>
    `;

    card.querySelector('.suggest-card-dismiss').addEventListener('click', async function() {
      await dismissSuggestion(this.dataset.id);
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.2s';
      setTimeout(() => { card.remove(); updateSuggestBadge(); }, 200);
    });

    list.appendChild(card);
  });
}


function closeGodPanel() {
  document.getElementById('god-overlay').classList.add('hidden');
  document.getElementById('god-status').textContent = '';
}

async function loadGodDay() {
  const today = getTodayIdx();
  document.getElementById('god-prev').disabled = godDay <= 0;
  document.getElementById('god-next').disabled = false;

  // Label del día
  const opts  = { weekday: 'long', day: 'numeric', month: 'long' };
  let label   = formatDate(godDay, opts);
  if      (godDay === today)   label = `Hoy · ${formatDate(godDay, { day: 'numeric', month: 'long' })}`;
  else if (godDay === today+1) label = `Mañana · ${formatDate(godDay, { day: 'numeric', month: 'long' })}`;
  else if (godDay < today)     label = `${formatDate(godDay, { day: 'numeric', month: 'long' })} (pasado)`;
  document.getElementById('god-date').textContent = label;

  // Cargar overrides de Firebase para este día
  godOverrides = await fetchOverrides(godDay);

  renderGodRows();
  document.getElementById('god-status').textContent = '';
}

function renderGodRows() {
  const container = document.getElementById('god-rows');
  container.innerHTML = '';

  // Construir opciones: todas las cats de todos los pools, agrupadas
  const allCats = allCategories();

  COLORS.forEach(color => {
    // Categoría base para este día
    const baseCat    = baseCatForDay(color, godDay);
    // Categoría activa (con override si existe)
    const activeName = godOverrides[color] || baseCat.cat;
    const isOverride = !!godOverrides[color];

    // Fila
    const row = document.createElement('div');
    row.className = 'god-row';

    // Punto de color
    const dot = document.createElement('div');
    dot.className = `god-color-dot ${color}`;

    // Select
    const sel = document.createElement('select');
    sel.className = 'god-select' + (isOverride ? ' overridden' : '');
    sel.dataset.color = color;

    // Opgroup por color pool
    COLORS.forEach(poolColor => {
      const grp = document.createElement('optgroup');
      grp.label = { yellow:'🟨 Fácil', green:'🟩 Medio', blue:'🟦 Difícil', purple:'🟪 Trampa' }[poolColor];
      CATEGORIAS[poolColor].forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.cat;
        opt.textContent = c.cat;
        if (c.cat === activeName) opt.selected = true;
        // Marcar la base con asterisco si hay override
        if (c.cat === baseCat.cat && isOverride) opt.textContent += ' (base)';
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });

    sel.addEventListener('change', () => {
      const isChg = sel.value !== baseCat.cat;
      sel.classList.toggle('overridden', isChg);
      badge.classList.toggle('visible', isChg);
    });

    // Badge "editado"
    const badge = document.createElement('span');
    badge.className = 'god-override-badge' + (isOverride ? ' visible' : '');
    badge.textContent = '✎';
    badge.title = isOverride ? `Override activo (base: ${baseCat.cat})` : '';

    row.appendChild(dot);
    row.appendChild(sel);
    row.appendChild(badge);
    container.appendChild(row);
  });
}

async function godSave() {
  const btn = document.getElementById('god-save');
  btn.disabled = true;

  const newOverrides = {};
  let hasAny = false;

  document.querySelectorAll('.god-select').forEach(sel => {
    const color    = sel.dataset.color;
    const baseName = baseCatForDay(color, godDay).cat;
    if (sel.value !== baseName) {
      newOverrides[color] = sel.value;
      hasAny = true;
    }
  });

  try {
    if (hasAny) {
      await saveOverrides(godDay, newOverrides);
    } else {
      await clearOverridesFirebase(godDay);
    }
    godOverrides = newOverrides;
    renderGodRows();
    showGodStatus('✅ Guardado en Firebase', '#7bc67e');

    // Si el día editado es el que está viendo el jugador, recargar el puzzle
    if (godDay === viewDay) await loadDay(viewDay);

  } catch (e) {
    showGodStatus('❌ Error al guardar', '#c97b6e');
  } finally {
    btn.disabled = false;
  }
}

async function godClearDay() {
  try {
    await clearOverridesFirebase(godDay);
    godOverrides = {};
    renderGodRows();
    showGodStatus('🗑 Overrides eliminados', '#aaa');
    if (godDay === viewDay) await loadDay(viewDay);
  } catch {
    showGodStatus('❌ Error al limpiar', '#c97b6e');
  }
}

function showGodStatus(msg, color = '#7bc67e') {
  const el = document.getElementById('god-status');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

// ─────────────────────────────────────────────────────────────
//  BOTONES DE JUEGO
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-info').addEventListener('click', () => {
  document.getElementById('rules-overlay').classList.remove('hidden');
});
document.getElementById('btn-close-rules').addEventListener('click', () => {
  document.getElementById('rules-overlay').classList.add('hidden');
});
document.getElementById('rules-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('rules-overlay'))
    document.getElementById('rules-overlay').classList.add('hidden');
});

document.getElementById('btn-shuffle').addEventListener('click', () => {
  if (gameOver) return;
  order = shuffle(remaining()); selected = []; clearHint(); render();
});
document.getElementById('btn-clear').addEventListener('click', () => {
  selected = []; refreshTiles(); updateBtns(); clearHint();
});
document.getElementById('btn-submit').addEventListener('click', submitGuess);
document.getElementById('btn-share').addEventListener('click', shareResult);

// ─────────────────────────────────────────────────────────────
//  UTILIDADES
// ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── ARRANQUE ─────────────────────────────────────────────────
init();
