import { useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/oroscopo/AuthContext'
import { Sun, CalendarDays, User, Star, Sparkles } from 'lucide-react'

const S = `cubic-bezier(.22,1,.36,1)`
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
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
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#F6F6F4",paddingBottom:88}}>
      <style>{CSS}</style>
      <div style={{maxWidth:480,margin:"0 auto",padding:"min(10vw,48px) 16px 0"}}>

        {/* Header */}
        <div style={{marginBottom:"min(8vw,40px)",animation:`fadeUp .5s ${S} both`}}>
          <h1 style={{fontSize:"min(8vw,32px)",fontWeight:900,margin:0,letterSpacing:-.5}}>{greeting}</h1>
          <p style={{fontSize:14,color:"rgba(246,246,244,.3)",margin:"10px 0 0",lineHeight:1.5}}>La tua area personale.</p>
        </div>

        {/* Card: Tema Natale */}
        <div style={{animation:`fadeUp .5s ${S} .08s both`,marginBottom:14}}>
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18,padding:"24px 24px 22px",opacity:.55}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.06)",borderRadius:10}}>
                  <Star size={18} style={{color:"#F4C430"}}/>
                </div>
                <div style={{fontSize:"min(4.5vw,18px)",fontWeight:800,letterSpacing:.2}}>TEMA NATALE</div>
              </div>
              <div style={{background:"rgba(244,196,48,.1)",border:"1px solid rgba(244,196,48,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:14,color:"rgba(246,246,244,.4)",lineHeight:1.6,margin:"0 0 14px"}}>
              Un'analisi completa della tua mappa natale, scritta da chi ci capisce davvero.
            </p>
            <p style={{fontSize:12,color:"rgba(246,246,244,.2)",margin:0}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>

        {/* Card: Oroscopo Giornaliero */}
        <div style={{animation:`fadeUp .5s ${S} .14s both`}}>
          <div style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.06)",borderRadius:18,padding:"24px 24px 22px",opacity:.55}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,196,48,.06)",borderRadius:10}}>
                  <Sparkles size={18} style={{color:"#F4C430"}}/>
                </div>
                <div style={{fontSize:"min(4.5vw,18px)",fontWeight:800,letterSpacing:.2}}>OROSCOPO GIORNALIERO</div>
              </div>
              <div style={{background:"rgba(244,196,48,.1)",border:"1px solid rgba(244,196,48,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#F4C430",letterSpacing:1.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>IN ARRIVO</div>
            </div>
            <p style={{fontSize:14,color:"rgba(246,246,244,.4)",lineHeight:1.6,margin:"0 0 14px"}}>
              Ogni mattina, un oroscopo scritto sul tuo cielo. Non sul tuo segno.
            </p>
            <p style={{fontSize:12,color:"rgba(246,246,244,.2)",margin:0}}>Ti avviseremo quando sarà pronto.</p>
          </div>
        </div>

      </div>

      <BottomNav navigate={navigate} active="dashboard"/>
    </div>
  )
}

function Skeleton() {
  const bar = (w: string, h = 14) => (
    <div style={{width:w,height:h,borderRadius:8,background:"linear-gradient(90deg,rgba(246,246,244,.04) 0%,rgba(246,246,244,.08) 50%,rgba(246,246,244,.04) 100%)",backgroundSize:"200% 100%",animation:"shimmer 1.8s ease infinite"}}/>
  )
  return (
    <div style={{minHeight:"100dvh",background:"#0a0a0a",fontFamily:"'Helvetica Neue',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:480,margin:"0 auto",padding:"min(10vw,48px) 16px 0"}}>
        <div style={{marginBottom:40}}>{bar("60%", 28)}</div>
        {[0,1].map(i => (
          <div key={i} style={{background:"rgba(246,246,244,.03)",border:"1px solid rgba(246,246,244,.04)",borderRadius:18,padding:24,marginBottom:14}}>
            {bar("50%", 16)}
            <div style={{marginTop:16}}>{bar("90%")}</div>
            <div style={{marginTop:8}}>{bar("60%")}</div>
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
