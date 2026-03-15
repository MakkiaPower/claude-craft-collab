import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'

export default function OroscopoLanding() {
  const navigate = useNavigate()

  useEffect(() => {
    oroscopoSupabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session?.user ? '/oroscopo/dashboard' : '/oroscopo/signup', { replace: true })
    }).catch(() => {
      navigate('/oroscopo/signup', { replace: true })
    })
  }, [navigate])

  return <div style={{minHeight:"100dvh",background:"#0a0a0a"}}/>
}
