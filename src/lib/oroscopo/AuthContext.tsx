import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { oroscopoSupabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from './types'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null, profile: null, loading: true,
  signOut: async () => {}, refreshProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await oroscopoSupabase
        .from('profiles').select('*').eq('id', userId).maybeSingle()
      setProfile(data as Profile | null)
    } catch (e) {
      console.error('[Auth] fetchProfile error:', e)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { user: u } } = await oroscopoSupabase.auth.getUser()
      if (u) await fetchProfile(u.id)
    } catch (e) {
      console.error('[Auth] refreshProfile error:', e)
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await oroscopoSupabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  useEffect(() => {
    let mounted = true
    let initDone = false

    // onAuthStateChange gestisce sia l'init che gli aggiornamenti
    const { data: { subscription } } = oroscopoSupabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        const u = session?.user ?? null
        setUser(u)

        if (u) {
          // Fetch profilo solo se non l'abbiamo già per questo utente
          await fetchProfile(u.id)
        } else {
          setProfile(null)
        }

        if (!initDone) {
          initDone = true
          if (mounted) setLoading(false)
        }
      }
    )

    // Safety: se dopo 3s non è arrivato nessun evento, forza loading=false
    const safety = setTimeout(() => {
      if (mounted && !initDone) {
        initDone = true
        setLoading(false)
      }
    }, 3000)

    return () => { mounted = false; clearTimeout(safety); subscription.unsubscribe() }
  }, [fetchProfile])

  const value = useMemo(() => ({
    user, profile, loading, signOut, refreshProfile,
  }), [user, profile, loading, signOut, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
