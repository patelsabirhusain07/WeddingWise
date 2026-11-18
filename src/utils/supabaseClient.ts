import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project configuration provided by user
const DEFAULT_SUPABASE_URL = 'https://kpnsolwccmflklrtglnk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_KS0eDs1PbM4Nqr3iOqJbOw_3koobeUo';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSavedSupabaseConfig(): SupabaseConfig {
  return {
    url: DEFAULT_SUPABASE_URL,
    anonKey: DEFAULT_SUPABASE_ANON_KEY,
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
    }
  }
  return supabaseInstance!;
}
