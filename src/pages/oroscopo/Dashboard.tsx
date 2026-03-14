import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { ZODIAC_SIGNS, type Horoscope } from '@/lib/oroscopo/types'
import { getLocalToday } from '@/lib/oroscopo/utils'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Sun, CalendarDays, User } from 'lucide-react'

export default function Dashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login'); return }
    if (!profile?.birth_date) { navigate('/oroscopo/onboarding'); return }
    if (profile.subscription_status !== 'active') { navigate('/oroscopo/pricing'); return }

    const today = getLocalToday()
    oroscopoSupabase.from('horoscopes').select('*').eq('user_id', user.id).eq('date', today).single()
      .then(({ data }) => { setHoroscope(data as Horoscope | null); setLoading(false) })
  }, [user, profile, authLoading, navigate])

  if (authLoading || loading) return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#F6F6F4",fontFamily:"'Helvetica Neue',sans-serif"}}><p style={{color:"rgba(246,246,244,.4)"}}>Caricamento...</p></div>

  const sunSign = profile?.sun_sign
  const zodiacIcon = sunSign ? ZODIAC_SIGNS[sunSign.toLowerCase()] : null
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: it })

  const nav = [
    { icon: Sun, label: 'Oroscopo', path: '/oroscopo/dashboard', active: true },
    { icon: CalendarDays, label: 'Archivio', path: '/oroscopo/archive', active: false },
    { icon: User, label: 'Profilo', path: '/oroscopo/settings', active: false },
  ]

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:80}}>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px min(6vw,24px) 0"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
          <div>
            <p style={{fontSize:10,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase",margin:"0 0 4px"}}>{formattedDate}</p>
            <h1 style={{fontSize:24,fontWeight:900,margin:0}}>Il tuo oroscopo</h1>
          </div>
          {sunSign && (
            <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:"8px 14px"}}>
              {zodiacIcon && <span style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.08)",borderRadius:8,fontSize:16}}>{zodiacIcon}</span>}
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:13,fontWeight:700,margin:0}}>{sunSign}</p>
                <p style={{fontSize:10,color:"rgba(246,246,244,.3)",margin:0}}>
                  {profile?.rising_sign && `Asc. ${profile.rising_sign}`}
                  {profile?.rising_sign && profile?.moon_sign && ' \u00B7 '}
                  {profile?.moon_sign && `Luna ${profile.moon_sign}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {horoscope ? (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Panoramica */}
            <Card>
              <Dot color="#F4C430"/><Label color="#F4C430">Panoramica</Label>
              <p style={{fontSize:17,lineHeight:1.75,margin:"12px 0 0",color:"#F6F6F4"}}>{horoscope.overview}</p>
            </Card>

            {(horoscope.love || horoscope.work) && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {horoscope.love && <Card><Dot color="#CC3333"/><Label color="#CC3333">Amore</Label><p style={{fontSize:15,lineHeight:1.75,margin:"10px 0 0",color:"#F6F6F4"}}>{horoscope.love}</p></Card>}
                {horoscope.work && <Card><Dot color="#D4A843"/><Label color="#D4A843">Lavoro</Label><p style={{fontSize:15,lineHeight:1.75,margin:"10px 0 0",color:"#F6F6F4"}}>{horoscope.work}</p></Card>}
              </div>
            )}

            {horoscope.advice && (
              <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(244,196,48,.2)",borderRadius:14,padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4C430" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <Label color="#F4C430">Consiglio del giorno</Label>
                </div>
                <p style={{fontSize:17,lineHeight:1.75,margin:0,color:"#F6F6F4"}}>{horoscope.advice}</p>
              </div>
            )}

            {horoscope.transits && horoscope.transits.length > 0 && (
              <details style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14}}>
                <summary style={{padding:"14px 20px",cursor:"pointer",fontSize:13,color:"rgba(246,246,244,.4)"}}>Transiti attivi sul tuo tema natale</summary>
                <div style={{padding:"0 20px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {horoscope.transits.map((t, i) => (
                    <div key={i} style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.06)",borderRadius:10,padding:12}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#F4C430",margin:"0 0 4px"}}>{t.name}</p>
                      <p style={{fontSize:12,color:"rgba(246,246,244,.4)",margin:0}}>{t.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ) : (
          <Card>
            <p style={{fontSize:17,lineHeight:1.75,color:"rgba(246,246,244,.4)",fontStyle:"italic",margin:0}}>
              Il tuo oroscopo di oggi arriva tra poco. Le stelle stanno ancora litigando.
            </p>
          </Card>
        )}
      </div>

      {/* Bottom nav */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.95)",borderTop:"1px solid rgba(246,246,244,.06)",display:"flex",justifyContent:"space-around",alignItems:"center",height:64,zIndex:50,backdropFilter:"blur(10px)"}}>
        {nav.map(n => (
          <div key={n.path} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"8px 16px",color:n.active?"#F4C430":"rgba(246,246,244,.25)"}}>
            <n.icon size={20}/>
            <span style={{fontSize:10}}>{n.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.08)",borderRadius:14,padding:20}}>{children}</div>
}
function Dot({ color }: { color: string }) {
  return <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:color,marginRight:6,verticalAlign:"middle"}}/>
}
function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{fontSize:10,color,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,verticalAlign:"middle"}}>{children}</span>
}
