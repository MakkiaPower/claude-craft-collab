import { useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { Sun, User, Star, Sparkles } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glowPulse{0%,100%{opacity:.02}50%{opacity:.05}}
@keyframes cardHover{from{border-color:rgba(246,246,244,.06)}to{border-color:rgba(246,246,244,.1)}}
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

  const displayName = profile?.display_name
  const greeting = displayName ? `Ciao, ${displayName}.` : 'Ciao, bastardo.'

  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:92,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      {/* Atmospheric background */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 20%,rgba(244,196,48,.03) 0%,transparent 55%)",animation:"glowPulse 8s ease-in-out infinite"}}/>

      <div style={{maxWidth:460,margin:"0 auto",padding:"min(12vw,56px) 20px 0",position:"relative",zIndex:1}}>

        {/* Header */}
        <div style={{marginBottom:"min(10vw,48px)",animation:`fadeUp .6s ${S} both`}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"rgba(244,196,48,.4)",textTransform:"uppercase",margin:"0 0 14px"}}>ASTRO<span style={{color:"rgba(244,196,48,.6)"}}>BASTARDO</span></p>
          <h1 style={{fontSize:"min(9vw,36px)",fontWeight:900,margin:0,letterSpacing:"-0.03em",lineHeight:1.1}}>{greeting}</h1>
          <p style={{fontSize:15,color:"rgba(246,246,244,.2)",margin:"14px 0 0",lineHeight:1.5}}>La tua area personale.</p>
        </div>

        {/* Card: Tema Natale */}
        <div style={{animation:`fadeUp .6s ${S} .1s both`,marginBottom:16}}>
          <div style={{background:"rgba(246,246,244,.025)",border:"1px solid rgba(246,246,244,.06)",borderRadius:20,padding:"28px 26px 24px",opacity:.6,transition:`opacity .3s ${S}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.06)",borderRadius:12,border:"1px solid rgba(244,196,48,.08)"}}>
                  <Star size={18} style={{color:"#F4C430"}} strokeWidth={1.5}/>
                </div>
                <div>
                  <div style={{fontSize:"min(4.2vw,17px)",fontWeight:800,letterSpacing:.3}}>TEMA NATALE</div>
                </div>
              </div>
              <div style={{background:"rgba(244,196,48,.08)",border:"1px solid rgba(244,196,48,.15)",borderRadius:8,padding:"5px 12px",fontSize:9,fontWeight:700,color:"#F4C430",letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:15,color:"rgba(246,246,244,.35)",lineHeight:1.7,margin:"0 0 16px"}}>
              Un'analisi completa della tua mappa natale, scritta da chi ci capisce davvero.
            </p>
            <p style={{fontSize:12,color:"rgba(246,246,244,.15)",margin:0,letterSpacing:.3}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>

        {/* Card: Oroscopo Giornaliero */}
        <div style={{animation:`fadeUp .6s ${S} .18s both`}}>
          <div style={{background:"rgba(246,246,244,.025)",border:"1px solid rgba(246,246,244,.06)",borderRadius:20,padding:"28px 26px 24px",opacity:.6,transition:`opacity .3s ${S}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.06)",borderRadius:12,border:"1px solid rgba(244,196,48,.08)"}}>
                  <Sparkles size={18} style={{color:"#F4C430"}} strokeWidth={1.5}/>
                </div>
                <div>
                  <div style={{fontSize:"min(4.2vw,17px)",fontWeight:800,letterSpacing:.3}}>OROSCOPO GIORNALIERO</div>
                </div>
              </div>
              <div style={{background:"rgba(244,196,48,.08)",border:"1px solid rgba(244,196,48,.15)",borderRadius:8,padding:"5px 12px",fontSize:9,fontWeight:700,color:"#F4C430",letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:15,color:"rgba(246,246,244,.35)",lineHeight:1.7,margin:"0 0 16px"}}>
              Ogni mattina, un oroscopo scritto sul tuo cielo. Non sul tuo segno.
            </p>
            <p style={{fontSize:12,color:"rgba(246,246,244,.15)",margin:0,letterSpacing:.3}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} active="dashboard"/>
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
      <div style={{maxWidth:460,margin:"0 auto",padding:"min(12vw,56px) 20px 0"}}>
        <div style={{marginBottom:48}}>{bar("35%", 12)}<div style={{marginTop:14}}>{bar("65%", 30)}</div></div>
        {[0,1].map(i => (
          <div key={i} style={{background:"rgba(246,246,244,.025)",border:"1px solid rgba(246,246,244,.04)",borderRadius:20,padding:28,marginBottom:16}}>
            <div style={{display:"flex",gap:12,marginBottom:18}}><div style={{width:40,height:40,borderRadius:12,background:"rgba(246,246,244,.04)"}}/>{bar("45%", 16)}</div>
            {bar("90%")}<div style={{marginTop:10}}>{bar("70%")}</div>
          </div>
        ))}
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
