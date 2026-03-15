import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_OROSCOPO_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_OROSCOPO_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[AstroBastardo] Env vars mancanti:', {
    url: SUPABASE_URL ? 'OK' : 'MANCANTE (VITE_OROSCOPO_SUPABASE_URL)',
    key: SUPABASE_ANON_KEY ? 'OK' : 'MANCANTE (VITE_OROSCOPO_SUPABASE_ANON_KEY)',
  })
}

// Lock no-op per evitare conflitti con il client Supabase principale del sito
// che usa lo stesso navigator.locks API
const noopLock = async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => {
  return await fn()
}

export const oroscopoSupabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'oroscopo-auth',
      flowType: 'implicit',
      detectSessionInUrl: false,
      lock: noopLock as never,
    },
  }
)
