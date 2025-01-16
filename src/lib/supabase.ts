import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chektkdrwycfenlabpqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZWt0a2Ryd3ljZmVubGFicHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTM1MzcsImV4cCI6MjA1MjM2OTUzN30.TkOBfK1Ke_pEN9uP6Vtf_PqhEQUMyt3CAmJdiveP38A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);