import { createClient } from '@supabase/supabase-js';

// environment variables from Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if either var is missing we fall back to null and the rest of the app can
// detect it to use a local/offline implementation instead.
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export function hasSupabase() {
  return !!supabase;
}
