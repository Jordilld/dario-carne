/* ══════════════════════════════════════════════════════════════════════════
   ORTOGRAFÍA × CARNÉ v2 — panel.js (padre, Supabase Auth)
══════════════════════════════════════════════════════════════════════════ */

const MESES_INFO = [
  { tema: 'Ortografía normativa',      pct: '0%'   },
  { tema: 'Puntuación y sintaxis',     pct: '10%'  },
  { tema: 'Vocabulario y léxico',      pct: '30%'  },
  { tema: 'Tipología textual',         pct: '50%'  },
  { tema: 'Escritura intensiva',       pct: '75%'  },
  { tema: 'Consolidación Batxillerat', pct: '100%' },
];

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

document.getElementById('btn-logout').addEventListener('click', async () => {
  await sb.auth.signOut();
  window.location.href = '/login.html';
});

// ─── Load data ────────────────────────────────────────────────────────────────

async function loadPanel() {
  try {
    const [estadoRes, hitosRes, respuestasRes, sesionesRes] = await Promise.all([
      sb.from('estado').select('*').eq('id', 1).single(),
      sb.from('hitos').select('*').order('mes'),
      sb.from('respuestas').select('id, correcta, tipo'),
      sb.from('sesiones').select('*').order('fecha', { ascending: false }),
    ]);

    const estado     = estadoRes.data;
    const hitos      = hitosRes.data  || [];
    const respuestas = respuestasRes.data || [];
    const sesiones   = sesionesRes.data   || [];

    const totalRespuestas = respuestas.length;
    const aciertos        = respuestas.filter(r => r.correcta).length;

    // Agrupar errores por tipo (client-side)
    const byTipo = {};
    respuestas.forEach(r => {
      if (!byTipo[r.tipo]) byTipo[r.tipo] = { tipo: r.tipo, total_intentos: 0, errores: 0 };
      byTipo[r.tipo].total_intentos++;
      if (!r.correcta) byTipo[r.tipo].errores++;
    });
    const erroresPorTipo = Object.values(byTipo)
      .map(t => ({
        ...t,
        pct_error: t.total_intentos > 0
          ? Math.round(t.errores / t.total_intentos * 1000) / 10
          : 0,
      }))
      .sort((a, b) => b.pct_error - a.pct_error);

    renderResumen({ estado, hitos, totalRespuestas, aciertos });
    renderHeatmap(estado, sesiones);
    renderErrores(erroresPorTipo);

    document.getElementById('summary-date').textContent =
      'Actualizado: ' + new Date().toLocaleString('es-ES', { timeStyle: 'short', dateStyle: 'short' });

    document.getElementById('panel-loading').style.display = 'none';
    document.getElementById('panel-content').style.display = 'block';

  } catch (err) {
    console.error(err);
    document.getElementById('panel-loading').innerHTML =
      '<div class="error-screen"><p>Error al cargar datos. <a href="/login.html">Iniciar sesión</a></p></div>';
  }
}

// ─── Resumen ──────────────────────────────────────────────────────────────────

function renderResumen({ estado, hitos, totalRespuestas, aciertos }) {
  document.getElementById('s-mes').textContent          = Math.min(estado.mes_actual, 6);
  document.getElementById('s-dia').textContent          = estado.dia_actual;
  document.getElementById('s-km').textContent           = estado.km_totales;
  document.getElementById('s-racha').textContent        = estado.racha_actual;
  document.getElementById('s-mejor-racha').textContent  = estado.mejor_racha;
  document.getElementById('s-infracciones').textContent = estado.infracciones;
  document.getElementById('s-aciertos').textContent     = aciertos;

  const pctOk = totalRespuestas > 0
    ? Math.round((aciertos / totalRespuestas) * 100) + '%'
    : '—';
  document.getElementById('s-pct-ok').textContent = pctOk;

  renderHitosBar(hitos, estado.mes_actual);
}

function renderHitosBar(hitos, mesActual) {
  const bar = document.getElementById('hitos-bar');
  bar.innerHTML = '';

  hitos.forEach((h, i) => {
    const info    = MESES_INFO[i];
    const done    = h.desbloqueado;
    const current = (i + 1) === Math.min(mesActual, 6);

    const seg = document.createElement('div');
    seg.className = 'hito-segment' + (done ? ' done' : current ? ' current' : '');
    seg.innerHTML = `
      <div class="h-mes">Mes ${i + 1}</div>
      <div class="h-pct">${info.pct}</div>
      ${done ? '<div style="font-size:14px">✓</div>' : ''}
    `;
    seg.title = info.tema + (h.fecha_desbloqueo ? ` — desbloqueado ${h.fecha_desbloqueo}` : '');
    bar.appendChild(seg);
  });
}

// ─── Heat map ─────────────────────────────────────────────────────────────────

function renderHeatmap(estado, sesiones) {
  const heatmap = document.getElementById('heatmap');
  heatmap.innerHTML = '';

  const idx = {};
  sesiones.forEach(s => { idx[`${s.mes}-${s.dia}`] = s; });

  // Header row
  const emptyHeader = document.createElement('div');
  emptyHeader.className = 'hm-label';
  heatmap.appendChild(emptyHeader);

  for (let d = 1; d <= 20; d++) {
    const h = document.createElement('div');
    h.className   = 'hm-header';
    h.textContent = d;
    heatmap.appendChild(h);
  }

  // Rows (6 meses × 20 días)
  for (let m = 1; m <= 6; m++) {
    const label = document.createElement('div');
    label.className   = 'hm-label';
    label.textContent = `Mes ${m}`;
    heatmap.appendChild(label);

    for (let d = 1; d <= 20; d++) {
      const cell      = document.createElement('div');
      cell.className  = 'hm-cell';

      const sesion    = idx[`${m}-${d}`];
      const isCurrent = m === estado.mes_actual && d === estado.dia_actual;
      const isPast    = m < estado.mes_actual || (m === estado.mes_actual && d < estado.dia_actual);

      if (sesion?.completada) {
        cell.classList.add('done');
        cell.title = `Mes ${m}, Día ${d} — ${sesion.km_ganados} km · ${sesion.infracciones} infracciones`;
      } else if (sesion && !sesion.completada && isPast) {
        cell.classList.add('missed');
        cell.title = `Mes ${m}, Día ${d} — incompleto`;
      } else if (isCurrent) {
        cell.classList.add('current');
        cell.title = `Mes ${m}, Día ${d} — hoy`;
      } else {
        cell.title = `Mes ${m}, Día ${d}`;
      }

      heatmap.appendChild(cell);
    }
  }
}

// ─── Errores frecuentes ───────────────────────────────────────────────────────

function renderErrores(errores) {
  const tbody = document.getElementById('errors-tbody');

  if (!errores.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--muted)">Sin datos todavía</td></tr>';
    return;
  }

  tbody.innerHTML = errores.map(e => `
    <tr>
      <td style="font-weight:600">${e.tipo}</td>
      <td>${e.total_intentos}</td>
      <td>${e.errores}</td>
      <td>
        <span class="pct-bar" style="width:${Math.round(e.pct_error)}px"></span>
        ${e.pct_error}%
      </td>
    </tr>
  `).join('');
}

// ─── Reinicio ─────────────────────────────────────────────────────────────────

let pendingReset = null;

function openConfirm(title, desc, action) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-desc').textContent  = desc;
  document.getElementById('confirm-modal').style.display = 'flex';
  pendingReset = action;
}

document.getElementById('btn-cancel-reset').addEventListener('click', () => {
  document.getElementById('confirm-modal').style.display = 'none';
  pendingReset = null;
});

document.getElementById('btn-confirm-reset').addEventListener('click', async () => {
  document.getElementById('confirm-modal').style.display = 'none';
  if (!pendingReset) return;

  try {
    await pendingReset();
    alert('Reinicio completado. Recargando…');
    location.reload();
  } catch (err) {
    console.error(err);
    alert('Error al reiniciar. Inténtalo de nuevo.');
  }
  pendingReset = null;
});

document.getElementById('btn-reset-total').addEventListener('click', () => {
  openConfirm(
    '¿Reiniciar todo?',
    'Se borrarán TODOS los datos: km, sesiones, respuestas e infracciones. Esta acción no se puede deshacer.',
    async () => {
      await sb.from('respuestas').delete().gte('id', 1);
      await sb.from('sesiones').delete().gte('id', 1);
      await sb.from('hitos').update({ desbloqueado: false, fecha_desbloqueo: null }).gte('mes', 1);
      await sb.from('estado').update({
        mes_actual: 1, dia_actual: 1, km_totales: 0, infracciones: 0,
        racha_actual: 0, mejor_racha: 0, dias_perdidos_consecutivos: 0,
        ejercicios_hoy_completados: 0, ejercicios_hoy_requeridos: 5, ultima_sesion: null,
      }).eq('id', 1);
    }
  );
});

document.getElementById('btn-reset-mes').addEventListener('click', () => {
  const mes = parseInt(document.getElementById('sel-mes').value);
  openConfirm(
    `¿Reiniciar desde el mes ${mes}?`,
    `Se borrarán los datos del mes ${mes} en adelante.`,
    async () => {
      await sb.from('respuestas').delete().gte('mes', mes);
      await sb.from('sesiones').delete().gte('mes', mes);
      await sb.from('hitos').update({ desbloqueado: false, fecha_desbloqueo: null }).gte('mes', mes);
      await sb.from('estado').update({
        mes_actual: mes, dia_actual: 1, km_totales: 0, infracciones: 0,
        racha_actual: 0, ejercicios_hoy_completados: 0,
        ejercicios_hoy_requeridos: 5, ultima_sesion: null,
      }).eq('id', 1);
    }
  );
});

document.getElementById('btn-reset-dia').addEventListener('click', () => {
  const mes = parseInt(document.getElementById('sel-dia-mes').value);
  const dia = parseInt(document.getElementById('sel-dia').value);
  openConfirm(
    `¿Reiniciar desde mes ${mes}, día ${dia}?`,
    `Se borrarán los datos del mes ${mes} día ${dia} en adelante.`,
    async () => {
      await sb.from('respuestas').delete().eq('mes', mes).gte('dia', dia);
      await sb.from('sesiones').delete().eq('mes', mes).gte('dia', dia);
      await sb.from('estado').update({
        dia_actual: dia, mes_actual: mes,
        ejercicios_hoy_completados: 0,
        ejercicios_hoy_requeridos:  5,
        ultima_sesion:              null,
      }).eq('id', 1);
    }
  );
});

// ─── Init ─────────────────────────────────────────────────────────────────────

checkAuth().then(ok => { if (ok) loadPanel(); });
