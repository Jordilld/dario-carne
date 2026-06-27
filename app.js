/* ════════════════════════════════════════════════════════════════════════════
   ORTOGRAFÍA × CARNÉ — app.js
════════════════════════════════════════════════════════════════════════════ */

// ─── Constantes ───────────────────────────────────────────────────────────────

const NIVELES = [
  {
    emoji: "🚶",
    nombre: "Conductor novato",
    prize: "Los padres empiezan a valorarlo",
    financing: "0%",
    minDias: 0,
    nextAt: 8,
  },
  {
    emoji: "🚗",
    nombre: "Conductor en prácticas",
    prize: "Los padres pagan el 30% del carné",
    financing: "30%",
    minDias: 8,
    nextAt: 15,
  },
  {
    emoji: "🏎️",
    nombre: "Conductor avanzado",
    prize: "Los padres pagan el 70% del carné",
    financing: "70%",
    minDias: 15,
    nextAt: 20,
  },
  {
    emoji: "🏁",
    nombre: "Conductor experto",
    prize: "¡Los padres pagan el carné entero!",
    financing: "100%",
    minDias: 20,
    nextAt: 20,
  },
];

// ─── Estado ───────────────────────────────────────────────────────────────────

function estadoInicial() {
  return {
    km: 0,
    racha: 0,
    mejorRacha: 0,
    aciertos: 0,
    multas: 0,
    nivel: 0,
    diasCompletados: [],
    ejerciciosRespondidos: [],
    ultimaSesion: null,
  };
}

function cargarEstado() {
  try {
    const raw = localStorage.getItem('carnet-lengua');
    if (!raw) return estadoInicial();
    return Object.assign(estadoInicial(), JSON.parse(raw));
  } catch {
    return estadoInicial();
  }
}

function guardarEstado() {
  localStorage.setItem('carnet-lengua', JSON.stringify(estado));
}

let estado = cargarEstado();

// ─── Vars de sesión ───────────────────────────────────────────────────────────

let ejercicioActual  = null;
let ejerciciosDelDia = [];
let ejercicioIndex   = 0;
let diaActual        = null;
let respSeleccionada = null;
let feedbackVisible  = false;

// ─── Helpers de días ──────────────────────────────────────────────────────────

function isDiaCompletado(d) {
  return estado.diasCompletados.includes(d);
}

function getDiaEjercicios(d) {
  return EJERCICIOS.filter(e => e.dia === d);
}

function getNextDia() {
  for (let d = 1; d <= 20; d++) {
    if (!isDiaCompletado(d)) return d;
  }
  return null;
}

// Auto-completa días de descanso que ya deberían estar completados
function autoCompletarDescansos() {
  let changed = true;
  while (changed) {
    changed = false;
    for (const d of REST_DAYS) {
      if (!isDiaCompletado(d)) {
        const prevOk = d === 1 || isDiaCompletado(d - 1);
        if (prevOk) {
          estado.diasCompletados.push(d);
          estado.diasCompletados.sort((a, b) => a - b);
          changed = true;
        }
      }
    }
  }
}

// ─── Racha ────────────────────────────────────────────────────────────────────

function verificarRachaRota() {
  if (!estado.ultimaSesion) return;
  const hoy  = hoyISO();
  const diff = diasEntre(estado.ultimaSesion, hoy);
  if (diff > 1) {
    estado.racha = 0;
    guardarEstado();
  }
}

function hoyISO() {
  return new Date().toISOString().split('T')[0];
}

function diasEntre(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

// ─── Nivel ────────────────────────────────────────────────────────────────────

function calcNivel(diasCount) {
  if (diasCount >= 20) return 3;
  if (diasCount >= 15) return 2;
  if (diasCount >= 8)  return 1;
  return 0;
}

// ─── Views ────────────────────────────────────────────────────────────────────

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === id);
  });
  const view = document.getElementById('view-' + id);
  if (view) view.classList.add('active');

  if (id === 'dashboard') renderDashboard();
  if (id === 'topics')    renderTopics();
  if (id === 'exercise')  window.scrollTo({ top: 0 });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function renderDashboard() {
  const dias    = estado.diasCompletados.length;
  const nivelIdx = estado.nivel;
  const nivel   = NIVELES[nivelIdx];
  const nextNivel = NIVELES[Math.min(nivelIdx + 1, 3)];

  // Navbar
  document.getElementById('nav-km').textContent    = estado.km + ' km';
  document.getElementById('nav-racha').textContent = estado.racha;

  // Level card
  document.getElementById('level-emoji').textContent    = nivel.emoji;
  document.getElementById('level-name').textContent     = nivel.nombre;
  document.getElementById('level-prize').textContent    = nivel.prize;
  document.getElementById('level-financing').textContent = nivel.financing;

  // Progress bar
  let pct = 0, label = '';
  if (nivelIdx < 3) {
    const start = nivel.minDias;
    const end   = nivel.nextAt;
    pct   = Math.min(100, Math.round(((dias - start) / (end - start)) * 100));
    label = `${dias} / ${end} días para ${nextNivel.nombre}`;
  } else {
    pct   = 100;
    label = '¡Objetivo conseguido! 🏆';
  }
  document.getElementById('level-progress-fill').style.width  = pct + '%';
  document.getElementById('level-progress-label').textContent = label;

  // Stats
  document.getElementById('stat-km').textContent       = estado.km;
  document.getElementById('stat-racha').textContent    = estado.racha;
  document.getElementById('stat-aciertos').textContent = estado.aciertos;
  document.getElementById('stat-multas').textContent   = estado.multas;

  // Days label
  document.getElementById('days-done-label').textContent =
    `${dias} / 20 días`;

  // Grid
  renderDayGrid();

  // CTA button
  const nextDia  = getNextDia();
  const btnStart = document.getElementById('btn-start');
  const ctaHint  = document.getElementById('cta-hint');

  if (nextDia === null) {
    btnStart.textContent = '🏁 ¡Has completado el mes!';
    btnStart.disabled    = true;
    ctaHint.textContent  = 'Has completado los 20 días. ¡Enhorabuena, Dario!';
    return;
  }

  if (REST_DAYS.includes(nextDia)) {
    btnStart.textContent = `Pasar al Día ${nextDia + 1}`;
    btnStart.disabled    = false;
    ctaHint.textContent  = `Día ${nextDia} es de descanso.`;
    return;
  }

  const ejsDia = getDiaEjercicios(nextDia);
  const kmDia  = ejsDia.reduce((s, e) => s + e.km, 0);
  btnStart.textContent = `Empezar Día ${nextDia}`;
  btnStart.disabled    = false;
  ctaHint.textContent  = `${ejsDia.length} ejercicio${ejsDia.length !== 1 ? 's' : ''} · hasta ${kmDia} km en juego`;
}

function renderDayGrid() {
  const grid    = document.getElementById('day-grid');
  const nextDia = getNextDia();
  grid.innerHTML = '';

  for (let d = 1; d <= 20; d++) {
    const cell  = document.createElement('div');
    cell.className = 'day-cell';

    const isRest      = REST_DAYS.includes(d);
    const isDone      = isDiaCompletado(d);
    const isCurrent   = d === nextDia && !isRest;
    const isPending   = !isDone && !isCurrent;

    let ico = '';
    if (isDone)      { cell.classList.add('completed'); ico = '✓'; }
    else if (isCurrent) { cell.classList.add('current', 'clickable'); ico = '▶'; }
    else if (isRest) { cell.classList.add('rest'); ico = '😴'; }
    else             { cell.classList.add('pending'); }

    cell.innerHTML = `<div class="day-num">${d}</div><div class="day-ico">${ico}</div>`;

    if (isCurrent) {
      cell.addEventListener('click', () => startExerciseDay(d));
    }

    grid.appendChild(cell);
  }
}

// ─── Ejercicio: arranque ──────────────────────────────────────────────────────

function startNextExercise() {
  const nextDia = getNextDia();
  if (nextDia === null) return;

  if (REST_DAYS.includes(nextDia)) {
    markDiaCompleto(nextDia);
    autoCompletarDescansos();
    renderDashboard();
    return;
  }

  startExerciseDay(nextDia);
}

function startExerciseDay(dia) {
  ejerciciosDelDia = getDiaEjercicios(dia);
  if (!ejerciciosDelDia.length) return;

  diaActual      = dia;
  ejercicioIndex = 0;
  showView('exercise');
  mostrarEjercicio(ejerciciosDelDia[0]);
}

// ─── Ejercicio: render ────────────────────────────────────────────────────────

function mostrarEjercicio(ej) {
  ejercicioActual  = ej;
  respSeleccionada = null;
  feedbackVisible  = false;

  // Ocultar feedback
  document.getElementById('feedback-wrap').style.display = 'none';
  document.getElementById('btn-submit').style.display    = 'block';
  document.getElementById('btn-submit').disabled         = true;

  // Progreso
  document.getElementById('exercise-progress').textContent =
    `Ejercicio ${ejercicioIndex + 1} de ${ejerciciosDelDia.length}`;

  // Tags
  document.getElementById('ex-tipo').textContent = ej.tipo;
  document.getElementById('ex-diff').textContent = ej.dificultad;
  document.getElementById('ex-km').textContent   = `+${ej.km} km`;

  // Contexto
  const ctxEl = document.getElementById('ex-context');
  if (ej.contexto) {
    ctxEl.textContent    = ej.contexto;
    ctxEl.style.display  = 'block';
  } else {
    ctxEl.style.display  = 'none';
  }

  // Pregunta
  document.getElementById('ex-question').textContent = ej.pregunta;

  // Opciones
  const list    = document.getElementById('options-list');
  const letters = ['A', 'B', 'C', 'D'];
  list.innerHTML = '';

  ej.opciones.forEach((texto, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.idx = i;
    btn.innerHTML = `
      <span class="option-letter">${letters[i]}</span>
      <span>${texto}</span>
    `;
    btn.addEventListener('click', () => selectOpcion(i));
    list.appendChild(btn);
  });
}

function selectOpcion(idx) {
  if (feedbackVisible) return;
  respSeleccionada = idx;

  document.querySelectorAll('.option-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === idx);
  });

  document.getElementById('btn-submit').disabled = false;
}

// ─── Ejercicio: comprobar ─────────────────────────────────────────────────────

function submitRespuesta() {
  if (respSeleccionada === null || feedbackVisible) return;
  feedbackVisible = true;

  const correcto     = respSeleccionada === ejercicioActual.correcta;
  const yaRespondido = estado.ejerciciosRespondidos.includes(ejercicioActual.id);

  if (!yaRespondido) {
    estado.ejerciciosRespondidos.push(ejercicioActual.id);
    if (correcto) {
      estado.km += ejercicioActual.km;
      estado.aciertos++;
      showKmToast(ejercicioActual.km);
    } else {
      estado.multas++;
    }
    guardarEstado();
  }

  // Colorear opciones
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === ejercicioActual.correcta) btn.classList.add('correct');
    else if (i === respSeleccionada && !correcto) btn.classList.add('wrong');
  });

  // Feedback
  const header = document.getElementById('feedback-header');
  const multa  = document.getElementById('feedback-multa');
  const kmEl   = document.getElementById('feedback-km');

  if (correcto) {
    header.textContent  = `✅ ¡Correcto! +${ejercicioActual.km} km`;
    header.className    = 'feedback-header correct';
    multa.style.display = 'none';
    if (!yaRespondido) {
      kmEl.textContent    = `🏎️ +${ejercicioActual.km} km ganados · Total: ${estado.km} km`;
      kmEl.style.display  = 'block';
    } else {
      kmEl.style.display  = 'none';
    }
  } else {
    header.textContent  = '❌ Incorrecto — Infracción';
    header.className    = 'feedback-header wrong';
    multa.textContent   = `🚨 ${ejercicioActual.multa}`;
    multa.style.display = 'block';
    kmEl.style.display  = 'none';
  }

  document.getElementById('feedback-explanation').textContent = ejercicioActual.explicacion;

  // Botón siguiente
  const isLast = ejercicioIndex >= ejerciciosDelDia.length - 1;
  document.getElementById('btn-next').textContent = isLast
    ? 'Finalizar día ✓'
    : 'Siguiente ejercicio →';

  document.getElementById('btn-submit').style.display = 'none';
  document.getElementById('feedback-wrap').style.display = 'block';

  document.getElementById('feedback-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Ejercicio: siguiente ─────────────────────────────────────────────────────

function nextEjercicioOFin() {
  ejercicioIndex++;

  if (ejercicioIndex < ejerciciosDelDia.length) {
    mostrarEjercicio(ejerciciosDelDia[ejercicioIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Día terminado
  const prevNivel = estado.nivel;
  markDiaCompleto(diaActual);
  autoCompletarDescansos();

  const newNivel = calcNivel(estado.diasCompletados.length);

  if (newNivel > prevNivel) {
    estado.nivel = newNivel;
    guardarEstado();
    showView('dashboard');
    setTimeout(() => {
      dispararConfeti();
      showLevelModal(newNivel);
    }, 400);
  } else {
    showDayModal(diaActual);
  }
}

function confirmBack() {
  if (!feedbackVisible && respSeleccionada !== null) {
    if (!confirm('¿Salir del ejercicio? El progreso de esta pregunta no se guardará.')) return;
  }
  showView('dashboard');
}

// ─── Marcar día completo ──────────────────────────────────────────────────────

function markDiaCompleto(dia) {
  if (!isDiaCompletado(dia)) {
    estado.diasCompletados.push(dia);
    estado.diasCompletados.sort((a, b) => a - b);
  }

  const hoy = hoyISO();
  if (estado.ultimaSesion !== hoy) {
    estado.racha++;
    if (estado.racha > estado.mejorRacha) estado.mejorRacha = estado.racha;
    estado.ultimaSesion = hoy;
  }

  guardarEstado();
}

// ─── Topics ───────────────────────────────────────────────────────────────────

function renderTopics() {
  // Actualizar navbar
  document.getElementById('nav-km').textContent    = estado.km + ' km';
  document.getElementById('nav-racha').textContent = estado.racha;

  // Temas
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';

  TEMAS.forEach(t => {
    const unlocked = estado.km >= t.km;
    const div = document.createElement('div');
    div.className = 'topic-card ' + (unlocked ? 'unlocked' : 'locked');
    div.innerHTML = `
      <div class="topic-emoji">${t.emoji}</div>
      <div class="topic-name">${t.nombre}</div>
      <div class="topic-status">${unlocked ? '✓ Desbloqueado' : '🔒 ' + t.km + ' km'}</div>
    `;
    grid.appendChild(div);
  });

  // Niveles/acuerdo padres
  const container = document.getElementById('parent-levels');
  container.innerHTML = '';

  NIVELES.forEach((n, i) => {
    const achieved = estado.nivel > i;
    const isCurrent = estado.nivel === i;
    const div = document.createElement('div');
    div.className = 'parent-level' +
      (achieved ? ' achieved' : '') +
      (isCurrent ? ' current-lvl' : '');

    div.innerHTML = `
      <div class="pl-emoji">${n.emoji}</div>
      <div class="pl-info">
        <div class="pl-name">${n.nombre}</div>
        <div class="pl-req">${i < 3 ? n.minDias + '–' + n.nextAt + ' días' : '20 días completados'}</div>
      </div>
      <div class="pl-financing">${n.financing}</div>
    `;
    container.appendChild(div);
  });
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

function showKmToast(km) {
  const toast = document.getElementById('km-toast');
  toast.textContent = '+' + km + ' km 🚀';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function showLevelModal(idx) {
  const n = NIVELES[idx];
  document.getElementById('modal-emoji').textContent = n.emoji;
  document.getElementById('modal-title').textContent = '¡' + n.nombre + '!';
  document.getElementById('modal-desc').textContent  = '¡Nuevo nivel conseguido!';
  document.getElementById('modal-prize').textContent = n.prize;
  document.getElementById('level-modal').style.display = 'flex';
}

function closeLevelModal() {
  document.getElementById('level-modal').style.display = 'none';
}

function showDayModal(dia) {
  const kmGanados = ejerciciosDelDia
    .filter(e => estado.ejerciciosRespondidos.includes(e.id))
    .reduce((s, e) => s + e.km, 0);

  document.getElementById('day-modal-title').textContent =
    '¡Día ' + dia + ' completado!';
  document.getElementById('day-modal-desc').textContent =
    'Has ganado ' + kmGanados + ' km. Total: ' + estado.km + ' km acumulados.';
  document.getElementById('day-modal').style.display = 'flex';
}

function closeDayModal() {
  document.getElementById('day-modal').style.display = 'none';
  showView('dashboard');
}

function dispararConfeti() {
  if (typeof confetti === 'undefined') return;
  confetti({
    particleCount: 140,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#2E7BCF', '#1A5C2A', '#C45000', '#7EFFD4', '#FFD700'],
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  verificarRachaRota();
  autoCompletarDescansos();

  // Recalcular nivel por si el estado fue importado o modificado
  const nivelCorrecto = calcNivel(estado.diasCompletados.length);
  if (nivelCorrecto > estado.nivel) {
    estado.nivel = nivelCorrecto;
    guardarEstado();
  }

  renderDashboard();
}

init();
