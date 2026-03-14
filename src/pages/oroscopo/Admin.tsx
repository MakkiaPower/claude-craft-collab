import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { format } from 'date-fns'
import { getLocalToday } from '@/lib/oroscopo/utils'
import { it } from 'date-fns/locale'

interface Subscriber {
  id: string; email: string; display_name: string | null; sun_sign: string | null
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [writtenIds, setWrittenIds] = useState<Set<string>>(new Set())
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login'); return }

    async function load() {
      const { data: admin } = await oroscopoSupabase.from('admin_users').select('user_id').eq('user_id', user!.id).single()
      if (!admin) { navigate('/oroscopo/dashboard'); return }
      setIsAdmin(true)

      const today = getLocalToday()
      const [{ data: subs }, { data: horoscopes }] = await Promise.all([
        oroscopoSupabase.from('profiles').select('id, email, display_name, sun_sign').eq('subscription_status', 'active'),
        oroscopoSupabase.from('horoscopes').select('user_id').eq('date', today),
      ])
      setSubscribers((subs || []) as Subscriber[])
      setWrittenIds(new Set((horoscopes || []).map(h => h.user_id)))
      setLoading(false)
    }
    load()
  }, [user, authLoading, navigate])

  if (authLoading || loading || !isAdmin) return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#F6F6F4",fontFamily:"'Helvetica Neue',sans-serif"}}><p style={{color:"rgba(246,246,244,.4)"}}>Caricamento...</p></div>

  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: it })
  const writtenCount = writtenIds.size
  const missingCount = subscribers.length - writtenCount

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4"}}>
      <div style={{borderBottom:"1px solid rgba(246,246,244,.06)",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><span style={{fontWeight:900,fontSize:16}}>ASTRO<span style={{color:"#F4C430"}}>BASTARDO</span></span><span style={{color:"rgba(246,246,244,.3)",fontSize:12,marginLeft:8}}>Admin</span></div>
        <Link to="/oroscopo/dashboard" style={{color:"rgba(246,246,244,.4)",fontSize:13,textDecoration:"none"}}>Torna alla dashboard</Link>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px"}}>
        <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Oroscopi di oggi</h1>
        <p style={{fontSize:13,color:"rgba(246,246,244,.35)",marginBottom:32}}>{formattedDate}</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:32}}>
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:"14px 8px",textAlign:"center"}}>
            <p style={{fontSize:22,fontWeight:900,margin:"0 0 4px"}}>{subscribers.length}</p>
            <p style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:1.5,textTransform:"uppercase",margin:0}}>Abbonati</p>
          </div>
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:"14px 8px",textAlign:"center"}}>
            <p style={{fontSize:22,fontWeight:900,margin:"0 0 4px",color:"#2D8A4E"}}>{writtenCount}</p>
            <p style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:1.5,textTransform:"uppercase",margin:0}}>Scritti</p>
          </div>
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:"14px 8px",textAlign:"center"}}>
            <p style={{fontSize:22,fontWeight:900,margin:"0 0 4px",color:"#CC3333"}}>{missingCount}</p>
            <p style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:1.5,textTransform:"uppercase",margin:0}}>Mancanti</p>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {subscribers.length > 0 ? subscribers.map(s => {
            const has = writtenIds.has(s.id)
            return (
              <Link key={s.id} to={`/oroscopo/admin/write/${s.id}`} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",textDecoration:"none",color:"inherit",transition:"background .15s"}} onMouseEnter={e=>(e.currentTarget.style.background="rgba(246,246,244,.06)")} onMouseLeave={e=>(e.currentTarget.style.background="rgba(246,246,244,.03)")}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:has?"#2D8A4E":"#CC3333"}}/>
                  <div>
                    <p style={{fontSize:14,fontWeight:600,margin:0}}>{s.display_name || s.email}</p>
                    <p style={{fontSize:11,color:"rgba(246,246,244,.3)",margin:0}}>{s.email}</p>
                  </div>
                </div>
                {s.sun_sign && <span style={{fontSize:13,color:"rgba(246,246,244,.4)"}}>{s.sun_sign}</span>}
              </Link>
            )
          }) : (
            <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20,textAlign:"center"}}>
              <p style={{color:"rgba(246,246,244,.4)",margin:0}}>Nessun abbonato attivo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
