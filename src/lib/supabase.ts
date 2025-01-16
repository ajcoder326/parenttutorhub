import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chektkdrwycfenlabpqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZWt0a2Ryd3ljZmVubGFicHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUzNzg1NjAsImV4cCI6MjAyMDk1NDU2MH0.ZpgqZFqVqXXfXV4Qm0eQQxZwXtGLMXFGBxZJwXxrEQY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);