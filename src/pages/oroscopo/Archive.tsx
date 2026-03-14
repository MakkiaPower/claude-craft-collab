import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Sun, CalendarDays, User } from 'lucide-react'
import type { Horoscope } from '@/lib/oroscopo/types'

export default function Archive() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login'); return }
    if (profile && profile.subscription_status !== 'active') { navigate('/oroscopo/pricing'); return }
    oroscopoSupabase.from('horoscopes').select('*').eq('user_id', user.id).order('date', { ascending: false })
      .then(({ data }) => { setHoroscopes((data || []) as Horoscope[]); setLoading(false) })
  }, [user, authLoading, navigate])

  if (authLoading || loading) return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#F6F6F4",fontFamily:"'Helvetica Neue',sans-serif"}}><p style={{color:"rgba(246,246,244,.4)"}}>Caricamento...</p></div>

  const nav = [
    { icon: Sun, label: 'Oroscopo', path: '/oroscopo/dashboard', active: false },
    { icon: CalendarDays, label: 'Archivio', path: '/oroscopo/archive', active: true },
    { icon: User, label: 'Profilo', path: '/oroscopo/settings', active: false },
  ]

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:80}}>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px min(6vw,24px) 0"}}>
        <h1 style={{fontSize:24,fontWeight:900,marginBottom:24}}>Archivio</h1>

        {horoscopes.length > 0 ? (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {horoscopes.map(h => {
              const isOpen = expandedId === h.id
              const dateLabel = format(new Date(h.date + 'T00:00:00'), "EEEE d MMMM yyyy", { locale: it })
              const preview = h.overview.length > 100 ? h.overview.slice(0, 100) + '...' : h.overview
              return (
                <div key={h.id} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedId(isOpen?null:h.id)} style={{padding:"14px 20px",cursor:"pointer"}}>
                    <p style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase",margin:"0 0 4px"}}>{dateLabel}</p>
                    {!isOpen && <p style={{fontSize:14,color:"rgba(246,246,244,.6)",margin:0}}>{preview}</p>}
                  </div>
                  {isOpen && (
                    <div style={{padding:"0 20px 20px",display:"flex",flexDirection:"column",gap:12}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          <span style={{width:6,height:6,borderRadius:"50%",background:"#F4C430"}}/>
                          <span style={{fontSize:10,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Panoramica</span>
                        </div>
                        <p style={{fontSize:15,lineHeight:1.75,margin:0}}>{h.overview}</p>
                      </div>
                      {h.love && <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"#CC3333"}}/><span style={{fontSize:10,color:"#CC3333",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Amore</span></div>
                        <p style={{fontSize:15,lineHeight:1.75,margin:0}}>{h.love}</p>
                      </div>}
                      {h.work && <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"#D4A843"}}/><span style={{fontSize:10,color:"#D4A843",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Lavoro</span></div>
                        <p style={{fontSize:15,lineHeight:1.75,margin:0}}>{h.work}</p>
                      </div>}
                      {h.advice && <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4C430" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span style={{fontSize:10,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>Consiglio</span></div>
                        <p style={{fontSize:15,lineHeight:1.75,margin:0}}>{h.advice}</p>
                      </div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20}}>
            <p style={{fontSize:15,color:"rgba(246,246,244,.4)",fontStyle:"italic",margin:0}}>Ancora nessun oroscopo nel tuo archivio. Il primo arriva domani.</p>
          </div>
        )}
      </div>

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.95)",borderTop:"1px solid rgba(246,246,244,.06)",display:"flex",justifyContent:"space-around",alignItems:"center",height:64,zIndex:50,backdropFilter:"blur(10px)"}}>
        {nav.map(n => (<div key={n.path} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"8px 16px",color:n.active?"#F4C430":"rgba(246,246,244,.25)"}}><n.icon size={20}/><span style={{fontSize:10}}>{n.label}</span></div>))}
      </nav>
    </div>
  )
}
