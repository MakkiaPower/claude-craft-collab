import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_OROSCOPO_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_OROSCOPO_SUPABASE_ANON_KEY

export const oroscopoSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'oroscopo-auth',
  },
})
