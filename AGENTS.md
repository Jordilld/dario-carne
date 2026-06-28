# AGENTS.md — Ortografía × Carné v2

> App web gamificada de ortografía para Dario. 6 meses de práctica con vocabulario de tests DGT.
> El progreso se vincula a la financiación progresiva del carné de conducir por parte de los padres.
>
> Lee solo las secciones relevantes para tu tarea. Si una sección está vacía o no aplica, ignórala.

---

## Antes de empezar

1. Lee este archivo entero — son ~5 minutos.
2. Es Node.js + Express + SQLite. Necesitas `npm install` antes de arrancar.
3. El estado persiste en `carnet.db` (SQLite, se crea automáticamente al arrancar).

---

## Stack y comandos

- **Backend**: Node.js + Express (`server.js`)
- **Base de datos**: SQLite via `better-sqlite3` (`carnet.db`)
- **Frontend**: Vanilla JS, HTML5, CSS3 (sin framework, sin build)
- **Auth panel**: bcrypt + cookie httpOnly

### Comandos

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Configurar contraseña del panel de padres (solo la primera vez)
npm run setup-password

# Arrancar en modo desarrollo (reinicia al guardar)
npm run dev

# → Alumno:  http://localhost:3000
# → Panel:   http://localhost:3000/panel.html
# → Login:   http://localhost:3000/login.html
```

### Limpiar base de datos de prueba

```bash
rm carnet.db
# El servidor la recrea automáticamente al arrancar
```

---

## Mapa del repositorio

| Archivo / Carpeta | Qué contiene | Cuándo leerlo |
|-------------------|--------------|---------------|
| `server.js` | Express + todas las rutas API | Siempre que toques lógica de negocio |
| `database.js` | Inicialización SQLite + esquema | Si cambias el esquema de BD |
| `public/index.html` | App del alumno (HTML) | Si tocas el DOM del alumno |
| `public/css/style.css` | Todos los estilos (variables CSS) | Si tocas la UI |
| `public/js/app.js` | Lógica del alumno (fetch API) | Si tocas la UX del alumno |
| `public/js/data/ejercicios.js` | Banco de ejercicios (export ES module) | Si añades/editas ejercicios |
| `public/panel.html` | Panel del padre (HTML) | Si tocas el panel |
| `public/js/panel.js` | Lógica del panel (fetch API) | Si tocas el panel |
| `public/login.html` | Login del panel | Raramente |
| `scripts/set-password.js` | Script de configuración de contraseña | Solo al configurar |
| `.env` | PANEL_PASSWORD_HASH, PORT | Solo al configurar |
| `carnet.db` | Base de datos (gitignored) | No editar manualmente |

> Los ficheros en la raíz (`index.html`, `app.js`, `style.css`, `data/`) son la **v1 obsoleta** — no los toques.

---

## Lógica de negocio clave

### Estado en BD (`estado` table, siempre fila id=1)

```
mes_actual               1-6 (o 7 cuando todo está completado)
dia_actual               1-20 dentro del mes actual
km_totales               km acumulados totales
infracciones             total de respuestas incorrectas
racha_actual             días consecutivos con sesión
mejor_racha
dias_perdidos_consecutivos
ejercicios_hoy_completados
ejercicios_hoy_requeridos   5, 10, 15 o 20 (según penalización)
ultima_sesion            'YYYY-MM-DD'
```

### Progresión de 6 meses — hitos del carné

| Mes | Tema | Hito | % financiado |
|-----|------|------|-------------|
| 1 | Ortografía normativa | Compromiso firmado | 0% |
| 2 | Puntuación y sintaxis | Primera aportación | 10% |
| 3 | Vocabulario y léxico | Segunda aportación | 30% |
| 4 | Tipología textual | Mitad del camino | 50% |
| 5 | Escritura intensiva | Recta final | 75% |
| 6 | Consolidación Batxillerat | ¡Carné pagado! | 100% |

### Penalización por días perdidos

```
diffDias entre ultima_sesion y hoy:
  1 día  → 5 ejercicios (normal)
  2 días → 10 ejercicios (perdió 1)
  3 días → 15 ejercicios (perdió 2)
  4+ días → 20 ejercicios (tope)
```

### Flujo de ejercicio (frontend → API)

1. `init()` → GET /api/estado + POST /api/sesion/iniciar + GET /api/ejercicios/:mes/:dia
2. `startExercise()` → showView('exercise') + mostrarEjercicio()
3. `selectOpcion(idx)` → habilita btn-submit
4. `submitRespuesta()` → POST /api/respuesta → muestra feedback
5. `nextEjercicioOFin()` → siguiente o showDayComplete()

### Mes completado

`dia_actual` avanza con cada día completado. Cuando `dia_actual > 20`, el mes se completa
y `mes_actual` incrementa. La tabla `hitos` registra la fecha de desbloqueo de cada mes.

---

## Estructura de un ejercicio

```js
{
  id: 'm1d1_ej001',         // único, formato 'm{MES}d{DIA}_ej{NUM}'
  tipo: 'Acentuación — esdrújulas',
  dificultad: 'fácil',      // 'fácil' | 'media' | 'difícil'
  km: 15,                   // km ganados si acierta
  fuente: 'Test DGT nº 277', // fuente verificada (opcional)
  pregunta: '¿...?',
  contexto: '...',           // frase de contexto (opcional)
  opciones: ['A', 'B', 'C', 'D'],
  correcta: 1,               // índice de la opción correcta (0-3)
  explicacion: '...',
  multa: 'Multa: ...',       // texto de sanción si falla
}
```

**8 por día**: los 5 primeros son base; los 3 últimos son reserva (para penalizaciones).
Solo mes 1 días 1-2 están implementados; el resto están como arrays vacíos pendientes.

---

## API REST

### Alumno
```
GET  /api/estado
POST /api/sesion/iniciar          → calcula ejercicios según penalización
GET  /api/ejercicios/:mes/:dia    → devuelve ejercicios + respondidos hoy
POST /api/respuesta               → registra respuesta, devuelve dia_completado
GET  /api/progreso/mes/:mes       → resumen del mes
```

### Panel (requiere cookie panel_token)
```
GET  /api/panel/check             → verifica autenticación
POST /api/panel/login             → body: { password }
POST /api/panel/logout
GET  /api/panel/resumen           → stats globales + hitos + errores por tipo
GET  /api/panel/historial         → todas las sesiones
GET  /api/panel/errores-frecuentes
POST /api/panel/reiniciar         → body: { modo: 'total'|'mes'|'desde_dia', mes?, dia? }
```

---

## Reglas de trabajo

- **No introducir npm adicional** — el stack es mínimo intencionadamente.
- **No cambiar el esquema de BD** sin actualizar `database.js` y este archivo.
- Los estilos usan variables CSS en `:root` — úsalas, no pongas colores hardcoded.
- Si añades ejercicios, mantén el formato `id: 'm{MES}d{DIA}_ej{NUM}'` y asegúrate de incluir 8 por día (5 base + 3 reserva).
- `public/js/data/ejercicios.js` usa `export const EJERCICIOS` (ES module) — el servidor lo importa directamente.
