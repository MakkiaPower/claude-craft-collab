import { useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { ZODIAC_SIGNS } from '@/lib/oroscopo/types'
import { Sun, User, Star, Sparkles, Settings } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glowPulse{0%,100%{opacity:.03}50%{opacity:.07}}
@keyframes orbGlow{0%,100%{box-shadow:0 0 0 rgba(244,196,48,0)}50%{box-shadow:0 0 40px rgba(244,196,48,.12)}}
`

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/oroscopo/login', { replace: true }); return }
    if (!profile?.birth_date) { navigate('/oroscopo/onboarding', { replace: true }); return }
  }, [user, profile, authLoading, navigate])

  if (authLoading || !user || !profile?.birth_date) return <Skeleton/>

  const displayName = profile?.display_name || 'Bastardo'
  const sunSign = profile?.sun_sign
  const zodiacIcon = sunSign ? ZODIAC_SIGNS[sunSign.toLowerCase()] : '\u2728'
  const birthDate = profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' }) : ''
  const birthCity = profile?.birth_city || ''

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:92,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 25%,rgba(244,196,48,.04) 0%,transparent 50%)",animation:"glowPulse 8s ease-in-out infinite"}}/>

      {/* Header bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"max(env(safe-area-inset-top,16px),16px) 20px 0",maxWidth:460,margin:"0 auto",position:"relative",zIndex:1,animation:`fadeUp .5s ${S} both`}}>
        <p style={{fontSize:13,fontWeight:700,letterSpacing:2,color:"rgba(244,196,48,.4)",textTransform:"uppercase",margin:0}}>ASTRO<span style={{color:"rgba(244,196,48,.6)"}}>BASTARDO</span></p>
        <div onClick={()=>navigate('/oroscopo/settings')} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:"50%",transition:`background .2s ${S}`,WebkitTapHighlightColor:"transparent"}} onMouseEnter={e=>(e.currentTarget.style.background="rgba(246,246,244,.06)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
          <Settings size={18} strokeWidth={1.5} style={{color:"rgba(246,246,244,.25)"}}/>
        </div>
      </div>

      <div style={{maxWidth:460,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:1}}>

        {/* Zodiac identity */}
        <div style={{textAlign:"center",padding:"min(8vw,40px) 0 min(6vw,32px)",animation:`fadeUp .6s ${S} .06s both`}}>
          <div style={{width:88,height:88,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto min(4vw,20px)",background:"radial-gradient(circle at 40% 35%,rgba(244,196,48,.1),rgba(244,196,48,.02))",border:"1px solid rgba(244,196,48,.2)",fontSize:40,animation:"orbGlow 4s ease-in-out infinite"}}>
            {zodiacIcon}
          </div>
          <h1 style={{fontSize:"min(7.5vw,28px)",fontWeight:900,letterSpacing:"-0.03em",margin:"0 0 8px"}}>{displayName}</h1>
          <p style={{fontSize:13,color:"rgba(246,246,244,.3)",margin:"0 0 4px",fontWeight:500}}>
            {sunSign || 'Segno da definire'}{birthDate ? ` \u00B7 ${birthDate}` : ''}
          </p>
          {birthCity && <p style={{fontSize:11,color:"rgba(244,196,48,.3)",margin:0,letterSpacing:.5}}>{birthCity}</p>}
        </div>

        {/* Card: Oroscopo Giornaliero — prominente */}
        <div style={{animation:`fadeUp .5s ${S} .14s both`,marginBottom:14}}>
          <div style={{background:"rgba(244,196,48,.03)",border:"1px solid rgba(244,196,48,.12)",borderRadius:20,padding:"26px 24px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.08)",borderRadius:12,border:"1px solid rgba(244,196,48,.1)"}}>
                  <Sparkles size={18} style={{color:"#F4C430"}} strokeWidth={1.5}/>
                </div>
                <div style={{fontSize:10,fontWeight:700,color:"#F4C430",letterSpacing:2,textTransform:"uppercase"}}>OROSCOPO GIORNALIERO</div>
              </div>
              <div style={{background:"rgba(244,196,48,.08)",border:"1px solid rgba(244,196,48,.15)",borderRadius:8,padding:"4px 10px",fontSize:8,fontWeight:700,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:16,fontWeight:700,margin:"0 0 8px",letterSpacing:-.2}}>Il tuo oroscopo su misura</p>
            <p style={{fontSize:14,color:"rgba(246,246,244,.3)",lineHeight:1.7,margin:"0 0 14px"}}>Ogni mattina, un oroscopo scritto sul tuo cielo. Non sul tuo segno.</p>
            <p style={{fontSize:11,color:"rgba(246,246,244,.15)",margin:0,letterSpacing:.3}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>

        {/* Card: Tema Natale — secondaria */}
        <div style={{animation:`fadeUp .5s ${S} .2s both`,marginBottom:20}}>
          <div style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.06)",borderRadius:20,padding:"26px 24px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(246,246,244,.04)",borderRadius:12,border:"1px solid rgba(246,246,244,.06)"}}>
                  <Star size={18} style={{color:"rgba(246,246,244,.35)"}} strokeWidth={1.5}/>
                </div>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(246,246,244,.35)",letterSpacing:2,textTransform:"uppercase"}}>TEMA NATALE</div>
              </div>
              <div style={{background:"rgba(246,246,244,.04)",border:"1px solid rgba(246,246,244,.08)",borderRadius:8,padding:"4px 10px",fontSize:8,fontWeight:700,color:"rgba(246,246,244,.3)",letterSpacing:1.5,textTransform:"uppercase"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:16,fontWeight:700,margin:"0 0 8px",letterSpacing:-.2,color:"rgba(246,246,244,.7)"}}>Chiedi agli esperti</p>
            <p style={{fontSize:14,color:"rgba(246,246,244,.25)",lineHeight:1.7,margin:"0 0 14px"}}>Un'analisi completa della tua mappa natale, scritta da chi ci capisce davvero.</p>
            <p style={{fontSize:11,color:"rgba(246,246,244,.12)",margin:0,letterSpacing:.3}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>

        {/* I tuoi dati */}
        <div style={{animation:`fadeUp .5s ${S} .26s both`}}>
          <p style={{fontSize:10,fontWeight:700,color:"rgba(246,246,244,.15)",letterSpacing:3,textTransform:"uppercase",margin:"0 0 12px"}}>I TUOI DATI</p>
          <div style={{background:"rgba(246,246,244,.02)",border:"1px solid rgba(246,246,244,.05)",borderRadius:16,padding:"6px 0"}}>
            <DataRow label="Segno" value={sunSign || '\u2014'}/>
            <DataRow label="Data" value={birthDate || '\u2014'}/>
            <DataRow label="Ora" value={profile?.birth_time || 'Non indicata'}/>
            <DataRow label="Luogo" value={birthCity || '\u2014'} last/>
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} active="dashboard"/>
    </div>
  )
}

function DataRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 20px",borderBottom:last?"none":"1px solid rgba(246,246,244,.04)"}}>
      <span style={{fontSize:13,color:"rgba(246,246,244,.25)",fontWeight:500}}>{label}</span>
      <span style={{fontSize:13,fontWeight:600,color:"rgba(246,246,244,.6)"}}>{value}</span>
    </div>
  )
}

function Skeleton() {
  const bar = (w: string, h = 14) => (
    <div style={{width:w,height:h,borderRadius:10,background:"linear-gradient(90deg,rgba(246,246,244,.03) 0%,rgba(246,246,244,.06) 50%,rgba(246,246,244,.03) 100%)",backgroundSize:"200% 100%",animation:"shimmer 2s ease infinite"}}/>
  )
  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:460,margin:"0 auto",padding:"56px 20px 0",textAlign:"center"}}>
        <div style={{width:88,height:88,borderRadius:"50%",background:"rgba(246,246,244,.04)",margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>{bar("40%", 24)}</div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:40}}>{bar("55%", 12)}</div>
        {[0,1].map(i => <div key={i} style={{background:"rgba(246,246,244,.02)",borderRadius:20,padding:26,marginBottom:14}}>{bar("30%",10)}<div style={{marginTop:14}}>{bar("80%")}</div><div style={{marginTop:8}}>{bar("60%")}</div></div>)}
      </div>
    </div>
  )
}

export const BottomNav = memo(function BottomNav({ navigate, active }: { navigate: (p: string) => void; active: string }) {
  const items = [
    { key: 'dashboard', icon: Sun, label: 'Home', path: '/oroscopo/dashboard' },
    { key: 'settings', icon: User, label: 'Profilo', path: '/oroscopo/settings' },
  ]
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,10,.94)",borderTop:"1px solid rgba(246,246,244,.04)",display:"flex",justifyContent:"space-around",alignItems:"center",height:72,zIndex:50,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",paddingBottom:"env(safe-area-inset-bottom,0)"}}>
      {items.map(n => (
        <div key={n.key} onClick={()=>navigate(n.path)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",padding:"10px 32px",minHeight:48,justifyContent:"center",color:active===n.key?"#F4C430":"rgba(246,246,244,.15)",transition:`color .25s ${S}`,WebkitTapHighlightColor:"transparent"}}>
          <n.icon size={21} strokeWidth={active===n.key?2.5:1.5}/>
          <span style={{fontSize:10,fontWeight:active===n.key?700:500,letterSpacing:.8}}>{n.label}</span>
        </div>
      ))}
    </nav>
  )
})
