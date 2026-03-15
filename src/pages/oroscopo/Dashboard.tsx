import { useEffect, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { oroscopoSupabase } from '@/lib/oroscopo/supabase'
import { ZODIAC_SIGNS, type Horoscope } from '@/lib/oroscopo/types'
import { getLocalToday } from '@/lib/oroscopo/utils'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Sun, CalendarDays, User } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:.04}50%{opacity:.08}}
`

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login', { replace: true }); return }
    if (!profile?.birth_date) { navigate('/oroscopo/onboarding', { replace: true }); return }

    const today = getLocalToday()
    oroscopoSupabase.from('horoscopes').select('*').eq('user_id', user.id).eq('date', today).maybeSingle()
      .then(({ data }) => { setHoroscope(data as Horoscope | null); setLoading(false) })
  }, [user, profile, authLoading, navigate])

  if (authLoading || loading) return <Skeleton/>

  const sunSign = profile?.sun_sign
  const zodiacIcon = sunSign ? ZODIAC_SIGNS[sunSign.toLowerCase()] : null
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: it })
  const isWide = typeof window !== 'undefined' && window.innerWidth >= 400

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:88}}>
      <style>{CSS}</style>
      <div style={{maxWidth:640,margin:"0 auto",padding:"min(8vw,36px) 16px 0"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"min(7vw,32px)",animation:`fadeUp .5s ${S} both`}}>
          <div>
            <p style={{fontSize:11,color:"rgba(246,246,244,.25)",letterSpacing:3,textTransform:"uppercase",fontWeight:600,margin:"0 0 8px"}}>{formattedDate}</p>
            <h1 style={{fontSize:"min(7vw,28px)",fontWeight:900,margin:0,letterSpacing:-.5}}>Il tuo oroscopo</h1>
          </div>
          {sunSign && (
            <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.06)",borderRadius:16,padding:"10px 16px"}}>
              {zodiacIcon && <span style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.08)",borderRadius:10,fontSize:18}}>{zodiacIcon}</span>}
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:14,fontWeight:800,margin:0,letterSpacing:-.2}}>{sunSign}</p>
                <p style={{fontSize:10,color:"rgba(246,246,244,.2)",margin:0}}>
                  {profile?.rising_sign && `Asc. ${profile.rising_sign}`}
                  {profile?.rising_sign && profile?.moon_sign && ' \u00B7 '}
                  {profile?.moon_sign && `Luna ${profile.moon_sign}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {horoscope ? (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Panoramica */}
            <A d={.06}><Card>
              <Dot color="#F4C430"/><Label color="#F4C430">Panoramica</Label>
              <p style={{fontSize:17,lineHeight:1.85,margin:"16px 0 0",color:"rgba(246,246,244,.9)"}}>{horoscope.overview}</p>
            </Card></A>

            {/* In Coppia + Da Single */}
            {(horoscope.in_couple || horoscope.single) && (
              <div style={{display:"grid",gridTemplateColumns:horoscope.in_couple && horoscope.single && isWide ? "1fr 1fr" : "1fr",gap:14}}>
                {horoscope.in_couple && <A d={.12}><Card>
                  <Dot color="#CC3333"/><Label color="#CC3333">In coppia</Label>
                  <p style={{fontSize:15,lineHeight:1.8,margin:"12px 0 0",color:"rgba(246,246,244,.85)"}}>{horoscope.in_couple}</p>
                </Card></A>}
                {horoscope.single && <A d={.15}><Card>
                  <Dot color="#B44ACE"/><Label color="#B44ACE">Da single</Label>
                  <p style={{fontSize:15,lineHeight:1.8,margin:"12px 0 0",color:"rgba(246,246,244,.85)"}}>{horoscope.single}</p>
                </Card></A>}
              </div>
            )}

            {/* Lavoro & Soldi */}
            {horoscope.work && (
              <A d={.18}><Card>
                <Dot color="#D4A843"/><Label color="#D4A843">Lavoro & Soldi</Label>
                <p style={{fontSize:15,lineHeight:1.8,margin:"12px 0 0",color:"rgba(246,246,244,.85)"}}>{horoscope.work}</p>
              </Card></A>
            )}

            {/* Consiglio del Giorno */}
            {horoscope.advice && (
              <A d={.22}><div style={{background:"rgba(244,196,48,.04)",border:"1px solid rgba(244,196,48,.15)",borderRadius:18,padding:"22px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4C430" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <Label color="#F4C430">Consiglio del giorno</Label>
                </div>
                <p style={{fontSize:17,lineHeight:1.85,margin:0,color:"rgba(246,246,244,.9)"}}>{horoscope.advice}</p>
              </div></A>
            )}

            {/* Transiti */}
            {horoscope.transits && horoscope.transits.length > 0 && (
              <A d={.26}><details style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18}}>
                <summary style={{padding:"18px 24px",cursor:"pointer",fontSize:13,color:"rgba(246,246,244,.3)",fontWeight:500,letterSpacing:.3}}>Transiti attivi sul tuo tema natale</summary>
                <div style={{padding:"0 24px 24px",display:"grid",gridTemplateColumns:isWide?"1fr 1fr":"1fr",gap:10}}>
                  {horoscope.transits.map((t, i) => (
                    <div key={i} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.05)",borderRadius:14,padding:16}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#F4C430",margin:"0 0 4px"}}>{t.name}</p>
                      <p style={{fontSize:12,color:"rgba(246,246,244,.3)",margin:0,lineHeight:1.5}}>{t.description}</p>
                    </div>
                  ))}
                </div>
              </details></A>
            )}
          </div>
        ) : (
          <A d={.06}><Card>
            <p style={{fontSize:17,lineHeight:1.85,color:"rgba(246,246,244,.3)",fontStyle:"italic",margin:0}}>
              Il tuo oroscopo di oggi arriva tra poco. Le stelle stanno ancora litigando.
            </p>
          </Card></A>
        )}

        {/* Banner abbonamento */}
        {profile?.subscription_status !== 'active' && (
          <A d={.3}><div onClick={()=>navigate('/oroscopo/pricing')} style={{background:"rgba(244,196,48,.06)",border:"1px solid rgba(244,196,48,.18)",borderRadius:18,padding:"20px 24px",marginTop:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:`transform .15s ${S}`}} onMouseDown={e=>(e.currentTarget.style.transform="scale(0.98)")} onMouseUp={e=>(e.currentTarget.style.transform="scale(1)")} onTouchStart={e=>(e.currentTarget.style.transform="scale(0.98)")} onTouchEnd={e=>(e.currentTarget.style.transform="scale(1)")}>
            <div>
              <p style={{fontSize:15,fontWeight:700,color:"#F4C430",margin:"0 0 4px"}}>Abbonati all'oroscopo su misura</p>
              <p style={{fontSize:12,color:"rgba(246,246,244,.3)",margin:0}}>Ricevi il tuo oroscopo personalizzato ogni giorno.</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4C430" strokeWidth="2" strokeLinecap="round" style={{width:18,height:18,flexShrink:0,marginLeft:14,opacity:.4}}><path d="M9 18l6-6-6-6"/></svg>
          </div></A>
        )}
      </div>

      <BottomNav navigate={navigate} active="dashboard"/>
    </div>
  )
}

// Animation wrapper — stagger delay
function A({ d, children }: { d: number; children: React.ReactNode }) {
  return <div style={{animation:`fadeUp .5s ${S} ${d}s both`}}>{children}</div>
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18,padding:"22px 24px"}}>{children}</div>
}
function Dot({ color }: { color: string }) {
  return <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:color,marginRight:8,verticalAlign:"middle"}}/>
}
function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{fontSize:11,color,letterSpacing:2,textTransform:"uppercase",fontWeight:700,verticalAlign:"middle"}}>{children}</span>
}

// Skeleton loading — elegante, non una pagina bianca
function Skeleton() {
  const bar = (w: string, h = 14) => (
    <div style={{width:w,height:h,borderRadius:8,background:"linear-gradient(90deg,rgba(246,246,244,.04) 0%,rgba(246,246,244,.08) 50%,rgba(246,246,244,.04) 100%)",backgroundSize:"200% 100%",animation:"shimmer 1.8s ease infinite"}}/>
  )
  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',sans-serif",paddingBottom:88}}>
      <style>{CSS}</style>
      <div style={{maxWidth:640,margin:"0 auto",padding:"min(8vw,36px) 16px 0"}}>
        <div style={{marginBottom:32}}>
          {bar("40%", 10)}
          <div style={{marginTop:12}}>{bar("55%", 24)}</div>
        </div>
        <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.04)",borderRadius:18,padding:24,marginBottom:14}}>
          {bar("30%", 10)}
          <div style={{marginTop:16}}>{bar("100%")}</div>
          <div style={{marginTop:10}}>{bar("90%")}</div>
          <div style={{marginTop:10}}>{bar("70%")}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[0,1].map(i => (
            <div key={i} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.04)",borderRadius:18,padding:24}}>
              {bar("40%", 10)}
              <div style={{marginTop:14}}>{bar("80%")}</div>
              <div style={{marginTop:8}}>{bar("60%")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const BottomNav = memo(function BottomNav({ navigate, active }: { navigate: (p: string) => void; active: string }) {
  const items = [
    { key: 'dashboard', icon: Sun, label: 'Oroscopo', path: '/oroscopo/dashboard' },
    { key: 'archive', icon: CalendarDays, label: 'Archivio', path: '/oroscopo/archive' },
    { key: 'settings', icon: User, label: 'Profilo', path: '/oroscopo/settings' },
  ]
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.92)",borderTop:"1px solid rgba(246,246,244,.05)",display:"flex",justifyContent:"space-around",alignItems:"center",height:72,zIndex:50,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",paddingBottom:"env(safe-area-inset-bottom,0)"}}>
      {items.map(n => (
        <div key={n.key} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"10px 28px",minHeight:48,justifyContent:"center",color:active===n.key?"#F4C430":"rgba(246,246,244,.18)",transition:`color .2s ${S}`}}>
          <n.icon size={22} strokeWidth={active===n.key?2.5:1.5}/>
          <span style={{fontSize:10,fontWeight:active===n.key?700:400,letterSpacing:.5}}>{n.label}</span>
        </div>
      ))}
    </nav>
  )
})
