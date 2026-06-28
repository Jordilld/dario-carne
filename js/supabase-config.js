// ─── Supabase config ──────────────────────────────────────────────────────────
// Rellena estos valores con los de tu proyecto Supabase:
//   Settings → API → Project URL  y  anon public key

const SUPABASE_URL      = 'https://rgbvwifygbvhshbibfiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnZ3aWZ5Z2J2aHNoYmliZml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTc0NzUsImV4cCI6MjA5ODIzMzQ3NX0.JKxKfDSKUhwvHeO2ZGrNreFXaIL-ma213N97mmz_81I';
const PANEL_EMAIL       = 'jordi.llorente@gmail.com';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
