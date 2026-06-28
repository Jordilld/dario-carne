/* ══════════════════════════════════════════════════════════════════════════
   ORTOGRAFÍA × CARNÉ v2 — app.js (alumno, Supabase)
══════════════════════════════════════════════════════════════════════════ */

const MESES = [
  { tema: 'Ortografía normativa',      hito: 'Compromiso firmado',      pct: '0%',   emoji: '🚶' },
  { tema: 'Puntuación y sintaxis',     hito: 'Primera aportación',      pct: '10%',  emoji: '🚗' },
  { tema: 'Vocabulario y léxico',      hito: 'Segunda aportación',      pct: '30%',  emoji: '🏎️' },
  { tema: 'Tipología textual',         hito: 'Mitad del camino',        pct: '50%',  emoji: '🎓' },
  { tema: 'Escritura intensiva',       hito: 'Recta final',             pct: '75%',  emoji: '🏁' },
  { tema: 'Consolidación Batxillerat', hito: '¡Carné pagado!',          pct: '100%', emoji: '🏆' },
];

// ─── Estado de sesión ─────────────────────────────────────────────────────────

let estado          = null;
let ejercicios      = [];
let respondidos     = [];
let ejercicioIndex  = 0;
let ejercicioActual = null;
let respSeleccionada = null;
let feedbackVisible  = false;
let kmGanadosHoy     = 0;
let lastApiResult    = null;

// ─── Helper ───────────────────────────────────────────────────────────────────

function hoyISO() {
  return new Date().toISOString().split('T')[0];
}

// ─── Supabase: lógica de sesión ───────────────────────────────────────────────

async function iniciarSesion() {
  const hoy = hoyISO();

  if (estado.ultima_sesion === hoy) {
    return { ya_iniciado: true, mensaje_penalizacion: null };
  }

  const diffDias = estado.ultima_sesion
    ? Math.floor((new Date(hoy) - new Date(estado.ultima_sesion)) / 86400000)
    : 1;

  const diasPerdidos  = Math.max(0, diffDias - 1);
  const multiplicador = Math.min(diasPerdidos + 1, 4);
  const ejerciciosHoy = 5 * multiplicador;
  const nuevaRacha    = diffDias > 1 ? 0 : estado.racha_actual;

  await sb.from('estado').update({
    ultima_sesion:              hoy,
    ejercicios_hoy_completados: 0,
    ejercicios_hoy_requeridos:  ejerciciosHoy,
    dias_perdidos_consecutivos: diasPerdidos,
    racha_actual:               nuevaRacha,
  }).eq('id', 1);

  // Crear sesión del día si no existe
  await sb.from('sesiones').upsert(
    { fecha: hoy, mes: estado.mes_actual, dia: estado.dia_actual, ejercicios_requeridos: ejerciciosHoy },
    { onConflict: 'fecha', ignoreDuplicates: true }
  );

  const mensajes = {
    5:  null,
    10: 'Ayer no practicaste. Hoy toca ponerse al día: 10 ejercicios. ¡Puedes!',
    15: 'Dos días sin practicar. 15 ejercicios hoy para recuperar el ritmo.',
    20: 'Llevas varios días parado. 20 ejercicios hoy para volver a la carretera. El carné sigue ahí.',
  };

  return {
    ejercicios_requeridos: ejerciciosHoy,
    dias_perdidos:         diasPerdidos,
    mensaje_penalizacion:  mensajes[ejerciciosHoy] ?? null,
  };
}

async function cargarEjercicios() {
  const mes    = estado.mes_actual;
  const dia    = estado.dia_actual;
  const allEjs = EJERCICIOS[`mes${mes}`]?.[`dia${dia}`] ?? [];
  const needed = estado.ejercicios_hoy_requeridos;

  const { data } = await sb.from('respuestas')
    .select('ejercicio_id')
    .eq('fecha', hoyISO())
    .eq('mes', mes)
    .eq('dia', dia);

  return {
    ejercicios:       allEjs.slice(0, needed),
    respondidos:      (data || []).map(r => r.ejercicio_id),
    total_requeridos: needed,
  };
}

// ─── Vistas ───────────────────────────────────────────────────────────────────

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + id);
  if (el) el.classList.add('active');
}

function showError(msg) {
  document.getElementById('error-msg').textContent = msg;
  showView('error');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  try {
    // 1. Estado actual
    const { data: estadoData, error: estadoErr } = await sb.from('estado').select('*').eq('id', 1).single();
    if (estadoErr) throw estadoErr;
    estado = estadoData;

    // 2. Iniciar sesión del día (lógica client-side)
    const sesionResult = await iniciarSesion();

    // Refrescar estado (racha/ejercicios pueden haber cambiado)
    const { data: estadoData2 } = await sb.from('estado').select('*').eq('id', 1).single();
    estado = estadoData2;

    // 3. Cargar ejercicios del día
    const ejData    = await cargarEjercicios();
    ejercicios      = ejData.ejercicios  || [];
    respondidos     = ejData.respondidos || [];

    const primerPendiente = ejercicios.findIndex(e => !respondidos.includes(e.id));
    ejercicioIndex = primerPendiente >= 0 ? primerPendiente : ejercicios.length;
    kmGanadosHoy   = 0;

    // 4. Banner de penalización
    if (sesionResult.mensaje_penalizacion) {
      document.getElementById('penalty-banner').style.display = 'flex';
      document.getElementById('penalty-msg').textContent = sesionResult.mensaje_penalizacion;
    }

    // 5. Dashboard
    renderDashboard();
    showView('dashboard');

  } catch (err) {
    console.error(err);
    showError('Error al conectar con la base de datos.');
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function renderDashboard() {
  const mes     = Math.min(estado.mes_actual, 6);
  const mesData = MESES[mes - 1];

  document.getElementById('nav-km').textContent    = estado.km_totales + ' km';
  document.getElementById('nav-racha').textContent = estado.racha_actual;

  document.getElementById('level-emoji').textContent = mesData.emoji;
  document.getElementById('level-name').textContent  = `Mes ${mes} — ${mesData.tema}`;
  document.getElementById('level-sub').textContent   = mesData.hito;
  document.getElementById('level-pct').textContent   = mesData.pct;

  const diasHechos = Math.max(0, estado.dia_actual - 1);
  const pct        = Math.min(100, Math.round((diasHechos / 20) * 100));
  document.getElementById('level-progress-fill').style.width = pct + '%';
  document.getElementById('level-progress-label').textContent = `${diasHechos} / 20 días del mes ${mes}`;

  document.getElementById('stat-km').textContent           = estado.km_totales;
  document.getElementById('stat-racha').textContent        = estado.racha_actual;
  document.getElementById('stat-infracciones').textContent = estado.infracciones;
  document.getElementById('days-done-label').textContent   = `${diasHechos} / 20`;
  document.getElementById('month-title').textContent       = `Mes ${mes} — Días`;

  renderDayGrid(diasHechos, estado.dia_actual);
  renderCTA();
  renderMilestones();
}

function renderDayGrid(diasHechos, diaActual) {
  const grid = document.getElementById('day-grid');
  grid.innerHTML = '';

  for (let d = 1; d <= 20; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const numEl = document.createElement('div');
    numEl.className   = 'day-num';
    numEl.textContent = d;

    const icoEl = document.createElement('div');
    icoEl.className = 'day-ico';

    if (d < diaActual) {
      cell.classList.add('completed');
      icoEl.textContent = '✓';
    } else if (d === diaActual) {
      cell.classList.add('current');
      icoEl.textContent = '▶';
      cell.addEventListener('click', startExercise);
    } else {
      cell.classList.add('pending');
    }

    cell.appendChild(numEl);
    cell.appendChild(icoEl);
    grid.appendChild(cell);
  }
}

function renderCTA() {
  const btn  = document.getElementById('btn-start');
  const hint = document.getElementById('cta-hint');

  if (estado.mes_actual > 6) {
    btn.textContent = '🏆 ¡Has completado los 6 meses!';
    btn.disabled    = true;
    hint.textContent = '¡Enhorabuena! El carné es tuyo.';
    return;
  }

  if (ejercicios.length === 0) {
    btn.textContent  = 'Ejercicios próximamente';
    btn.disabled     = true;
    hint.textContent = `Día ${estado.dia_actual} — contenido en preparación`;
    return;
  }

  if (ejercicioIndex >= ejercicios.length) {
    btn.textContent  = '✅ Día completado';
    btn.disabled     = true;
    hint.textContent = 'Vuelve mañana para continuar';
    return;
  }

  const pendientes   = ejercicios.length - ejercicioIndex;
  const kmPendientes = ejercicios.slice(ejercicioIndex).reduce((s, e) => s + e.km, 0);
  btn.textContent  = `Empezar Día ${estado.dia_actual}`;
  btn.disabled     = false;
  hint.textContent = `${pendientes} ejercicio${pendientes !== 1 ? 's' : ''} · hasta ${kmPendientes} km en juego`;
}

function renderMilestones() {
  const container = document.getElementById('milestones');
  container.innerHTML = '';

  const mesActual = Math.min(estado.mes_actual, 6);

  MESES.forEach((m, i) => {
    const numMes  = i + 1;
    const done    = numMes < mesActual;
    const current = numMes === mesActual;

    const row = document.createElement('div');
    row.className = 'milestone-row' + (done ? ' done' : current ? ' current' : '');
    row.innerHTML = `
      <div class="ms-dot">${done ? '✓' : m.emoji}</div>
      <div class="ms-info">
        <div class="ms-mes">Mes ${numMes}</div>
        <div class="ms-tema">${m.tema}</div>
        <div class="ms-hito">${m.hito}</div>
      </div>
      <div class="ms-pct">${m.pct}</div>
    `;
    container.appendChild(row);
  });
}

// ─── Ejercicio ────────────────────────────────────────────────────────────────

function startExercise() {
  if (ejercicios.length === 0) return;
  showView('exercise');
  window.scrollTo({ top: 0 });
  mostrarEjercicio(ejercicios[ejercicioIndex]);
}

function mostrarEjercicio(ej) {
  ejercicioActual  = ej;
  respSeleccionada = null;
  feedbackVisible  = false;

  document.getElementById('feedback-wrap').style.display = 'none';
  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.style.display = 'block';
  btnSubmit.disabled      = true;

  document.getElementById('exercise-progress').textContent =
    `Ejercicio ${ejercicioIndex + 1} de ${ejercicios.length}`;

  document.getElementById('ex-tipo').textContent = ej.tipo;
  document.getElementById('ex-diff').textContent = ej.dificultad;
  document.getElementById('ex-km').textContent   = `+${ej.km} km`;

  const fuenteEl = document.getElementById('ex-fuente');
  if (ej.fuente) {
    fuenteEl.textContent   = ej.fuente;
    fuenteEl.style.display = 'inline';
  } else {
    fuenteEl.style.display = 'none';
  }

  const ctxEl = document.getElementById('ex-context');
  if (ej.contexto) {
    ctxEl.textContent   = ej.contexto;
    ctxEl.style.display = 'block';
  } else {
    ctxEl.style.display = 'none';
  }

  document.getElementById('ex-question').textContent = ej.pregunta;

  const list    = document.getElementById('options-list');
  const letters = ['A', 'B', 'C', 'D'];
  list.innerHTML = '';

  ej.opciones.forEach((texto, i) => {
    const btn = document.createElement('button');
    btn.className   = 'option-btn';
    btn.dataset.idx = i;
    btn.innerHTML   = `<span class="option-letter">${letters[i]}</span><span>${texto}</span>`;
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

async function submitRespuesta() {
  if (respSeleccionada === null || feedbackVisible) return;
  feedbackVisible = true;

  const ej      = ejercicioActual;
  const correcto = respSeleccionada === ej.correcta;

  // Colorear opciones inmediatamente (sin esperar a Supabase)
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === ej.correcta)                       btn.classList.add('correct');
    else if (i === respSeleccionada && !correcto) btn.classList.add('wrong');
  });

  // Guardar en Supabase
  try {
    const hoy = hoyISO();

    await sb.from('respuestas').insert({
      fecha:           hoy,
      mes:             estado.mes_actual,
      dia:             estado.dia_actual,
      ejercicio_id:    ej.id,
      tipo:            ej.tipo,
      opcion_elegida:  respSeleccionada,
      correcta:        correcto,
      km_ganados:      correcto ? ej.km : 0,
    });

    const nuevosKm             = correcto ? estado.km_totales + ej.km : estado.km_totales;
    const nuevasInfracciones   = correcto ? estado.infracciones : estado.infracciones + 1;
    const ejerciciosCompletados = estado.ejercicios_hoy_completados + 1;

    await sb.from('estado').update({
      km_totales:                nuevosKm,
      infracciones:              nuevasInfracciones,
      ejercicios_hoy_completados: ejerciciosCompletados,
    }).eq('id', 1);

    estado.km_totales              = nuevosKm;
    estado.infracciones            = nuevasInfracciones;
    estado.ejercicios_hoy_completados = ejerciciosCompletados;

    document.getElementById('nav-km').textContent = estado.km_totales + ' km';
    if (correcto) { kmGanadosHoy += ej.km; showKmToast(ej.km); }

    const diaCompletado = ejerciciosCompletados >= estado.ejercicios_hoy_requeridos;
    let mesCompletado   = false;

    if (diaCompletado) {
      const nuevaRacha = estado.racha_actual + 1;
      const mejorRacha = Math.max(nuevaRacha, estado.mejor_racha);
      let nuevoDia     = estado.dia_actual + 1;
      let nuevoMes     = estado.mes_actual;

      if (nuevoDia > 20) {
        nuevoDia      = 1;
        nuevoMes      = Math.min(estado.mes_actual + 1, 7);
        mesCompletado = true;

        await sb.from('hitos').update({ desbloqueado: true, fecha_desbloqueo: hoy })
          .eq('mes', estado.mes_actual);
      }

      await sb.from('estado').update({
        racha_actual: nuevaRacha,
        mejor_racha:  mejorRacha,
        dia_actual:   nuevoDia,
        mes_actual:   nuevoMes,
      }).eq('id', 1);

      // Totales de la sesión de hoy para actualizar la tabla sesiones
      const { data: kmData } = await sb.from('respuestas').select('km_ganados').eq('fecha', hoy);
      const kmSesion = (kmData || []).reduce((s, r) => s + (r.km_ganados || 0), 0);

      const { count: infCount } = await sb.from('respuestas')
        .select('id', { count: 'exact', head: true })
        .eq('fecha', hoy).eq('correcta', false);

      await sb.from('sesiones').update({
        completada:             true,
        ejercicios_completados: ejerciciosCompletados,
        km_ganados:             kmSesion,
        infracciones:           infCount || 0,
      }).eq('fecha', hoy);

      estado.racha_actual = nuevaRacha;
      estado.mejor_racha  = mejorRacha;
      estado.dia_actual   = nuevoDia;
      estado.mes_actual   = nuevoMes;
    }

    lastApiResult = {
      correcto,
      km_acumulados:          nuevosKm,
      ejercicios_completados: ejerciciosCompletados,
      ejercicios_requeridos:  estado.ejercicios_hoy_requeridos,
      dia_completado:         diaCompletado,
      mes_completado:         mesCompletado,
      nuevo_mes:              mesCompletado ? Math.min(estado.mes_actual, 6) : null,
    };

  } catch (err) {
    console.error('Error guardando respuesta:', err);
    lastApiResult = null;
  }

  // ─── Feedback ─────────────────────────────────────────────────────────────

  const header  = document.getElementById('feedback-header');
  const multaEl = document.getElementById('feedback-multa');
  const kmEl    = document.getElementById('feedback-km');
  const card    = document.getElementById('feedback-card');

  if (correcto) {
    header.textContent    = `✅ ¡Correcto! +${ej.km} km`;
    header.className      = 'feedback-header correct';
    card.className        = 'feedback-card correct';
    multaEl.style.display = 'none';
    kmEl.textContent      = `+${ej.km} km ganados · Total: ${estado.km_totales} km`;
    kmEl.style.display    = 'block';
  } else {
    header.textContent    = '❌ Incorrecto — Infracción';
    header.className      = 'feedback-header wrong';
    card.className        = 'feedback-card wrong';
    multaEl.textContent   = `🚨 ${ej.multa}`;
    multaEl.style.display = 'block';
    kmEl.style.display    = 'none';
  }

  document.getElementById('feedback-explanation').textContent = ej.explicacion;

  const isLast = ejercicioIndex >= ejercicios.length - 1;
  document.getElementById('btn-next').textContent = isLast ? 'Finalizar día ✓' : 'Siguiente ejercicio →';

  document.getElementById('btn-submit').style.display  = 'none';
  document.getElementById('feedback-wrap').style.display = 'block';
  document.getElementById('feedback-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Ejercicio: siguiente ─────────────────────────────────────────────────────

function nextEjercicioOFin() {
  ejercicioIndex++;

  if (ejercicioIndex < ejercicios.length) {
    mostrarEjercicio(ejercicios[ejercicioIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  showDayComplete(lastApiResult?.mes_completado);
}

function showDayComplete(mesCompletado) {
  const dia = estado.dia_actual;
  const mes = Math.min(estado.mes_actual, 6);

  if (mesCompletado) {
    const mesData = MESES[mes - 1];
    document.getElementById('complete-emoji').textContent = '🎉';
    document.getElementById('complete-title').textContent = `¡Mes ${mes} completado!`;
    document.getElementById('complete-desc').textContent  = mesData.hito;
    document.getElementById('complete-km').textContent    = `${mesData.pct} del carné desbloqueado`;
    dispararConfeti();
  } else {
    document.getElementById('complete-emoji').textContent = '✅';
    document.getElementById('complete-title').textContent = `¡Día ${dia} completado!`;
    document.getElementById('complete-desc').textContent  = `Mes ${mes} · ${Math.max(0, dia - 1)} / 20 días hechos`;
    document.getElementById('complete-km').textContent    = `+${kmGanadosHoy} km ganados hoy`;
  }

  showView('day-complete');
  window.scrollTo({ top: 0 });
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

function showKmToast(km) {
  const toast = document.getElementById('km-toast');
  toast.textContent = `+${km} km 🚀`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function dispararConfeti() {
  if (typeof confetti === 'undefined') return;
  confetti({
    particleCount: 160,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#2E7BCF', '#1A5C2A', '#C45000', '#7EFFD4', '#FFD700'],
  });
}

function confirmBack() {
  if (!feedbackVisible && respSeleccionada !== null) {
    if (!confirm('¿Salir del ejercicio? El progreso de esta pregunta no se guardará.')) return;
  }
  showView('dashboard');
  renderDashboard();
}

// ─── Event listeners ──────────────────────────────────────────────────────────

document.getElementById('btn-start').addEventListener('click', startExercise);
document.getElementById('btn-back').addEventListener('click', confirmBack);
document.getElementById('btn-submit').addEventListener('click', submitRespuesta);
document.getElementById('btn-next').addEventListener('click', nextEjercicioOFin);
document.getElementById('btn-go-dashboard').addEventListener('click', () => {
  showView('dashboard');
  renderDashboard();
});
document.getElementById('btn-close-modal').addEventListener('click', () => {
  document.getElementById('level-modal').style.display = 'none';
});

// ─── Arranque ─────────────────────────────────────────────────────────────────

init();
