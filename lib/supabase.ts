import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kvuzwgvsjwyhaeaabfbp.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dXp3Z3Zzand5aGFlYWFiZmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NDM4MDgsImV4cCI6MjEwOTAxOTgwOH0.zeeyiq9OqKGQ3v9NX_w5W5TIgvQlslGef3Ouy4e824w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
