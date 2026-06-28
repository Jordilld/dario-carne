-- ═══════════════════════════════════════════════════════════════════════════
-- ORTOGRAFÍA × CARNÉ v2 — Schema Supabase
-- Ejecutar en: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Tablas ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS estado (
  id                         INTEGER PRIMARY KEY CHECK (id = 1),
  mes_actual                 INTEGER  DEFAULT 1,
  dia_actual                 INTEGER  DEFAULT 1,
  km_totales                 INTEGER  DEFAULT 0,
  infracciones               INTEGER  DEFAULT 0,
  racha_actual               INTEGER  DEFAULT 0,
  mejor_racha                INTEGER  DEFAULT 0,
  dias_perdidos_consecutivos INTEGER  DEFAULT 0,
  ejercicios_hoy_completados INTEGER  DEFAULT 0,
  ejercicios_hoy_requeridos  INTEGER  DEFAULT 5,
  ultima_sesion              DATE,
  created_at                 TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO estado (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS sesiones (
  id                     BIGSERIAL PRIMARY KEY,
  fecha                  DATE    NOT NULL UNIQUE,
  mes                    INTEGER NOT NULL,
  dia                    INTEGER NOT NULL,
  ejercicios_completados INTEGER DEFAULT 0,
  ejercicios_requeridos  INTEGER DEFAULT 5,
  km_ganados             INTEGER DEFAULT 0,
  infracciones           INTEGER DEFAULT 0,
  completada             BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS respuestas (
  id              BIGSERIAL PRIMARY KEY,
  fecha           DATE    NOT NULL,
  mes             INTEGER NOT NULL,
  dia             INTEGER NOT NULL,
  ejercicio_id    TEXT    NOT NULL,
  tipo            TEXT    NOT NULL,
  opcion_elegida  INTEGER NOT NULL,
  correcta        BOOLEAN NOT NULL,
  km_ganados      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hitos (
  id               BIGSERIAL PRIMARY KEY,
  mes              INTEGER NOT NULL UNIQUE,
  desbloqueado     BOOLEAN DEFAULT FALSE,
  fecha_desbloqueo DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hitos (mes) VALUES (1),(2),(3),(4),(5),(6) ON CONFLICT DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE estado    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE hitos     ENABLE ROW LEVEL SECURITY;

-- App de Dario (anon): puede leer y escribir, pero NO borrar

CREATE POLICY "anon_select_estado"   ON estado    FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_estado"   ON estado    FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_select_sesiones" ON sesiones  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_sesiones" ON sesiones  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_sesiones" ON sesiones  FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_select_respuestas" ON respuestas FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_respuestas" ON respuestas FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_hitos"    ON hitos     FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_hitos"    ON hitos     FOR UPDATE TO anon USING (true);

-- Panel de padres (authenticated): acceso completo incluyendo DELETE (para reiniciar)

CREATE POLICY "auth_all_estado"     ON estado     FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_sesiones"   ON sesiones   FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_respuestas" ON respuestas FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_hitos"      ON hitos      FOR ALL TO authenticated USING (true);
