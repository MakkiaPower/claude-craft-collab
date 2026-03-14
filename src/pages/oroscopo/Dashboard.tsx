import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { ZODIAC_SIGNS, type Horoscope } from '@/lib/oroscopo/types'
import { getLocalToday } from '@/lib/oroscopo/utils'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Sun, CalendarDays, User } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
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

  if (authLoading || loading) return <Loading/>

  const sunSign = profile?.sun_sign
  const zodiacIcon = sunSign ? ZODIAC_SIGNS[sunSign.toLowerCase()] : null
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: it })

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:84}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{maxWidth:640,margin:"0 auto",padding:"min(8vw,36px) 16px 0"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"min(8vw,36px)",animation:`fadeUp .6s ${S} both`}}>
          <div>
            <p style={{fontSize:11,color:"rgba(246,246,244,.3)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:500,margin:"0 0 6px"}}>{formattedDate}</p>
            <h1 style={{fontSize:"min(7vw,28px)",fontWeight:900,margin:0,letterSpacing:-.5}}>Il tuo oroscopo</h1>
          </div>
          {sunSign && (
            <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,padding:"10px 16px"}}>
              {zodiacIcon && <span style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.08)",borderRadius:10,fontSize:18}}>{zodiacIcon}</span>}
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:14,fontWeight:800,margin:0,letterSpacing:-.2}}>{sunSign}</p>
                <p style={{fontSize:10,color:"rgba(246,246,244,.25)",margin:0}}>
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
            <div style={{animation:`fadeUp .6s ${S} .05s both`}}>
              <Card>
                <Dot color="#F4C430"/><Label color="#F4C430">Panoramica</Label>
                <p style={{fontSize:17,lineHeight:1.8,margin:"14px 0 0",color:"rgba(246,246,244,.9)"}}>{horoscope.overview}</p>
              </Card>
            </div>

            {(horoscope.love || horoscope.work) && (
              <div style={{display:"grid",gridTemplateColumns:horoscope.love && horoscope.work && window.innerWidth>=400 ? "1fr 1fr" : "1fr",gap:12,animation:`fadeUp .6s ${S} .1s both`}}>
                {horoscope.love && <Card><Dot color="#CC3333"/><Label color="#CC3333">Amore</Label><p style={{fontSize:15,lineHeight:1.75,margin:"10px 0 0",color:"rgba(246,246,244,.85)"}}>{horoscope.love}</p></Card>}
                {horoscope.work && <Card><Dot color="#D4A843"/><Label color="#D4A843">Lavoro</Label><p style={{fontSize:15,lineHeight:1.75,margin:"10px 0 0",color:"rgba(246,246,244,.85)"}}>{horoscope.work}</p></Card>}
              </div>
            )}

            {horoscope.advice && (
              <div style={{background:"rgba(244,196,48,.04)",border:"1px solid rgba(244,196,48,.15)",borderRadius:16,padding:"20px 22px",animation:`fadeUp .6s ${S} .15s both`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4C430" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <Label color="#F4C430">Consiglio del giorno</Label>
                </div>
                <p style={{fontSize:17,lineHeight:1.8,margin:0,color:"rgba(246,246,244,.9)"}}>{horoscope.advice}</p>
              </div>
            )}

            {horoscope.transits && horoscope.transits.length > 0 && (
              <details style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,animation:`fadeUp .6s ${S} .2s both`}}>
                <summary style={{padding:"16px 22px",cursor:"pointer",fontSize:13,color:"rgba(246,246,244,.35)",fontWeight:500,letterSpacing:.3}}>Transiti attivi sul tuo tema natale</summary>
                <div style={{padding:"0 22px 22px",display:"grid",gridTemplateColumns:window.innerWidth>=400?"1fr 1fr":"1fr",gap:10}}>
                  {horoscope.transits.map((t, i) => (
                    <div key={i} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.05)",borderRadius:12,padding:14}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#F4C430",margin:"0 0 4px"}}>{t.name}</p>
                      <p style={{fontSize:12,color:"rgba(246,246,244,.35)",margin:0,lineHeight:1.5}}>{t.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ) : (
          <div style={{animation:`fadeUp .6s ${S} .05s both`}}>
            <Card>
              <p style={{fontSize:17,lineHeight:1.8,color:"rgba(246,246,244,.35)",fontStyle:"italic",margin:0}}>
                Il tuo oroscopo di oggi arriva tra poco. Le stelle stanno ancora litigando.
              </p>
            </Card>
          </div>
        )}
      </div>

      <BottomNav navigate={navigate} active="dashboard"/>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,padding:"20px 22px"}}>{children}</div>
}
function Dot({ color }: { color: string }) {
  return <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:color,marginRight:8,verticalAlign:"middle"}}/>
}
function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{fontSize:10,color,letterSpacing:2,textTransform:"uppercase",fontWeight:700,verticalAlign:"middle"}}>{children}</span>
}
function Loading() {
  return <div style={{minHeight:"100dvh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:"rgba(246,246,244,.25)",fontFamily:"'Helvetica Neue',sans-serif",fontSize:13}}>Caricamento...</p></div>
}

export function BottomNav({ navigate, active }: { navigate: (p: string) => void; active: string }) {
  const items = [
    { key: 'dashboard', icon: Sun, label: 'Oroscopo', path: '/oroscopo/dashboard' },
    { key: 'archive', icon: CalendarDays, label: 'Archivio', path: '/oroscopo/archive' },
    { key: 'settings', icon: User, label: 'Profilo', path: '/oroscopo/settings' },
  ]
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.92)",borderTop:"1px solid rgba(246,246,244,.05)",display:"flex",justifyContent:"space-around",alignItems:"center",height:68,zIndex:50,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",paddingBottom:"env(safe-area-inset-bottom,0)"}}>
      {items.map(n => (
        <div key={n.key} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"10px 24px",minHeight:44,justifyContent:"center",color:active===n.key?"#F4C430":"rgba(246,246,244,.2)",transition:`color .2s`}}>
          <n.icon size={22} strokeWidth={active===n.key?2.5:1.5}/>
          <span style={{fontSize:10,fontWeight:active===n.key?700:400,letterSpacing:.3}}>{n.label}</span>
        </div>
      ))}
    </nav>
  )
}
