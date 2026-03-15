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
    const { data } = await oroscopoSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data as Profile | null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const { data: { user: u } } = await oroscopoSupabase.auth.getUser()
    if (u) await fetchProfile(u.id)
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await oroscopoSupabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  useEffect(() => {
    let mounted = true

    // Carica sessione iniziale rapidamente
    oroscopoSupabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        await fetchProfile(u.id)
      }
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = oroscopoSupabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        const u = session?.user ?? null
        setUser(u)
        if (u && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchProfile(u.id)
        } else if (!u) {
          setProfile(null)
        }
        if (mounted) setLoading(false)
      }
    )

    return () => { mounted = false; subscription.unsubscribe() }
  }, [fetchProfile])

  const value = useMemo(() => ({
    user, profile, loading, signOut, refreshProfile,
  }), [user, profile, loading, signOut, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
